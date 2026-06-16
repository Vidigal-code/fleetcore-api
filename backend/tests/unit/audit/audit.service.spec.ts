import {
  AuditService,
  AuditRecordInput,
} from '../../../src/modules/audit/audit.service';
import { VEHICLE_EVENT_CREATED } from '../../../src/modules/fleet/fleet.constants';
import { MessagingService } from '../../../src/modules/messaging/messaging.service';
import { FeatureToggleService } from '../../../src/shared/features';
import { AuditWriterService } from '../../../src/modules/audit/audit-writer.service';
import { AuditOutboxService } from '../../../src/modules/audit/audit-outbox.service';

describe('AuditService', () => {
  let messaging: jest.Mocked<MessagingService>;
  let featureToggles: jest.Mocked<FeatureToggleService>;
  let writer: jest.Mocked<AuditWriterService>;
  let outbox: jest.Mocked<AuditOutboxService>;
  let service: AuditService;

  const entry: AuditRecordInput = {
    action: VEHICLE_EVENT_CREATED,
    entity: 'vehicle',
    entityId: 'veh-1',
    actor: 'tester',
  };

  beforeEach(() => {
    messaging = {
      publish: jest
        .fn<
          ReturnType<MessagingService['publish']>,
          Parameters<MessagingService['publish']>
        >()
        .mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MessagingService>;

    featureToggles = {
      isEnabled: jest
        .fn<
          ReturnType<FeatureToggleService['isEnabled']>,
          Parameters<FeatureToggleService['isEnabled']>
        >()
        .mockReturnValue(true),
      runIfEnabled: jest.fn<
        ReturnType<FeatureToggleService['runIfEnabled']>,
        Parameters<FeatureToggleService['runIfEnabled']>
      >(),
    } as unknown as jest.Mocked<FeatureToggleService>;

    writer = {
      persist: jest
        .fn<
          ReturnType<AuditWriterService['persist']>,
          Parameters<AuditWriterService['persist']>
        >()
        .mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuditWriterService>;

    outbox = {
      enqueue: jest
        .fn<
          ReturnType<AuditOutboxService['enqueue']>,
          Parameters<AuditOutboxService['enqueue']>
        >()
        .mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuditOutboxService>;

    service = new AuditService(messaging, featureToggles, writer, outbox);
  });

  it('publishes to queue when async worker enabled', async () => {
    await service.record(entry);

    const publishCalls = messaging.publish.mock.calls as Array<
      [string, Record<string, unknown>]
    >;
    const [routingKey, payload] = publishCalls[0];

    expect(routingKey).toBe('audit.event');
    expect(payload.action).toBe(VEHICLE_EVENT_CREATED);
    expect(typeof payload.occurredAt).toBe('string');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(writer.persist).not.toHaveBeenCalled();
  });

  it('persists directly when feature toggled off', async () => {
    featureToggles.isEnabled.mockReturnValue(false);

    await service.record(entry);

    const persistCalls = writer.persist.mock.calls as Array<[AuditRecordInput]>;
    const [payload] = persistCalls[0];

    expect(payload.action).toBe(VEHICLE_EVENT_CREATED);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(messaging.publish).not.toHaveBeenCalled();
  });

  it('stores in the outbox when queue publishing fails', async () => {
    messaging.publish.mockRejectedValueOnce(new Error('queue down'));

    await service.record(entry);

    const enqueueCalls = outbox.enqueue.mock.calls as Array<
      [string, Record<string, unknown>]
    >;
    const [routingKey, message] = enqueueCalls[0];

    expect(routingKey).toBe('audit.event');
    expect(message.action).toBe(VEHICLE_EVENT_CREATED);
    // The synchronous final write is reserved for a last-resort failure.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(writer.persist).not.toHaveBeenCalled();
  });

  it('persists synchronously when both queue and outbox fail', async () => {
    messaging.publish.mockRejectedValueOnce(new Error('queue down'));
    outbox.enqueue.mockRejectedValueOnce(new Error('outbox down'));

    await service.record(entry);

    const persistCalls = writer.persist.mock.calls as Array<[AuditRecordInput]>;
    const [payload] = persistCalls[0];

    expect(payload.action).toBe(VEHICLE_EVENT_CREATED);
  });
});
