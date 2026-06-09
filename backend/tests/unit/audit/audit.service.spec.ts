import {
  AuditService,
  AuditRecordInput,
} from '../../../src/modules/audit/audit.service';
import { VEHICLE_EVENT_CREATED } from '../../../src/modules/fleet/fleet.constants';
import { MessagingService } from '../../../src/modules/messaging/messaging.service';
import { FeatureToggleService } from '../../../src/shared/features/feature-toggle.service';
import { AuditWriterService } from '../../../src/modules/audit/audit-writer.service';

describe('AuditService', () => {
  let messaging: jest.Mocked<MessagingService>;
  let featureToggles: jest.Mocked<FeatureToggleService>;
  let writer: jest.Mocked<AuditWriterService>;
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
    } as jest.Mocked<MessagingService>;

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
    } as jest.Mocked<FeatureToggleService>;

    writer = {
      persist: jest
        .fn<
          ReturnType<AuditWriterService['persist']>,
          Parameters<AuditWriterService['persist']>
        >()
        .mockResolvedValue(undefined),
    } as jest.Mocked<AuditWriterService>;

    service = new AuditService(messaging, featureToggles, writer);
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

  it('falls back to persistence when queue publishing fails', async () => {
    messaging.publish.mockRejectedValueOnce(new Error('queue down'));

    await service.record(entry);

    const persistCalls = writer.persist.mock.calls as Array<[AuditRecordInput]>;
    const [payload] = persistCalls[0];

    expect(payload.action).toBe(VEHICLE_EVENT_CREATED);
  });
});
