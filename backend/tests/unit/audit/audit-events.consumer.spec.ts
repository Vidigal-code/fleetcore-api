import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

import { AuditEventsConsumer } from '../../../src/modules/audit/consumers/audit-events.consumer';
import { AuditWriterService } from '../../../src/modules/audit/audit-writer.service';
import { AppConfigService } from '../../../src/shared/config/app-config.service';

const AUDIT_QUEUE = 'fleetcore.audit';
const DLQ = 'fleetcore.dead-letter';

describe('AuditEventsConsumer', () => {
  let writer: jest.Mocked<AuditWriterService>;
  let amqp: jest.Mocked<AmqpConnection>;
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

    amqp = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AmqpConnection>;

    const appConfig = {
      messaging: { auditQueue: AUDIT_QUEUE, deadLetterQueue: DLQ },
    } as unknown as AppConfigService;

    consumer = new AuditEventsConsumer(writer, amqp, appConfig);
  });

  it('persists the event and does not touch the dead-letter queue on success', async () => {
    await consumer.handleAuditEvent(message);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(writer.persist).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(amqp.publish).not.toHaveBeenCalled();
  });

  it('rethrows below the attempt limit so the broker schedules a retry', async () => {
    writer.persist.mockRejectedValueOnce(new Error('mongo down'));

    await expect(
      consumer.handleAuditEvent(message, envelopeWithAttempts(1)),
    ).rejects.toThrow('mongo down');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(amqp.publish).not.toHaveBeenCalled();
  });

  it('parks the event in the dead-letter queue once attempts are exhausted', async () => {
    writer.persist.mockRejectedValueOnce(new Error('mongo down'));

    await expect(
      consumer.handleAuditEvent(message, envelopeWithAttempts(5)),
    ).resolves.toBeUndefined();

    const publishCalls = amqp.publish.mock.calls as Array<
      [string, string, unknown]
    >;
    const [exchange, routingKey] = publishCalls[0];
    expect(exchange).toBe('');
    expect(routingKey).toBe(DLQ);
  });
});
