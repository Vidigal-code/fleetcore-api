import { AuditEventsConsumer } from '../../../src/modules/audit/consumers/audit-events.consumer';
import { AuditWriterService } from '../../../src/modules/audit/audit-writer.service';
import { MessagingService } from '../../../src/modules/messaging/messaging.service';
import { AppConfigService } from '../../../src/shared/config/app-config.service';

const AUDIT_QUEUE = 'fleetcore.audit';
const DLQ = 'fleetcore.dead-letter';

describe('AuditEventsConsumer', () => {
  let writer: jest.Mocked<AuditWriterService>;
  let messaging: jest.Mocked<MessagingService>;
  let consumer: AuditEventsConsumer;

  const message = {
    action: 'vehicle.created',
    entity: 'vehicle',
    entityId: 'veh-1',
    actor: 'tester',
  };

  // Build an AMQP envelope whose x-death count reflects prior delivery attempts.
  const envelopeWithAttempts = (count: number) => ({
    properties: { headers: { 'x-death': [{ count }] } },
  });

  beforeEach(() => {
    writer = {
      persist: jest
        .fn<
          ReturnType<AuditWriterService['persist']>,
          Parameters<AuditWriterService['persist']>
        >()
        .mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuditWriterService>;

    messaging = {
      sendToQueue: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MessagingService>;

    const appConfig = {
      messaging: { auditQueue: AUDIT_QUEUE, deadLetterQueue: DLQ },
    } as unknown as AppConfigService;

    consumer = new AuditEventsConsumer(writer, messaging, appConfig);
  });

  it('persists the event and does not touch the dead-letter queue on success', async () => {
    await consumer.handleAuditEvent(message);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(writer.persist).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(messaging.sendToQueue).not.toHaveBeenCalled();
  });

  it('rethrows below the attempt limit so the broker schedules a retry', async () => {
    writer.persist.mockRejectedValueOnce(new Error('mongo down'));

    await expect(
      consumer.handleAuditEvent(message, envelopeWithAttempts(1)),
    ).rejects.toThrow('mongo down');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(messaging.sendToQueue).not.toHaveBeenCalled();
  });

  it('parks the event in the dead-letter queue once attempts are exhausted', async () => {
    writer.persist.mockRejectedValueOnce(new Error('mongo down'));

    await expect(
      consumer.handleAuditEvent(message, envelopeWithAttempts(5)),
    ).resolves.toBeUndefined();

    const sendCalls = messaging.sendToQueue.mock.calls as Array<
      [string, unknown]
    >;
    const [queue] = sendCalls[0];
    expect(queue).toBe(DLQ);
  });
});
