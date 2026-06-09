import { AuditService, AuditRecordInput } from '../../../src/modules/audit/audit.service';
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
      publish: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MessagingService>;

    featureToggles = {
      isEnabled: jest.fn().mockReturnValue(true),
      runIfEnabled: jest.fn(),
    } as unknown as jest.Mocked<FeatureToggleService>;

    writer = {
      persist: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuditWriterService>;

    service = new AuditService(messaging, featureToggles, writer);
  });

  it('publishes to queue when async worker enabled', async () => {
    await service.record(entry);

    expect(messaging.publish).toHaveBeenCalledWith(
      'audit.event',
      expect.objectContaining({ action: VEHICLE_EVENT_CREATED, occurredAt: expect.any(String) }),
    );
    expect(writer.persist).not.toHaveBeenCalled();
  });

  it('persists directly when feature toggled off', async () => {
    featureToggles.isEnabled.mockReturnValue(false);

    await service.record(entry);

    expect(writer.persist).toHaveBeenCalledWith(expect.objectContaining({ action: VEHICLE_EVENT_CREATED }));
    expect(messaging.publish).not.toHaveBeenCalled();
  });

  it('falls back to persistence when queue publishing fails', async () => {
    messaging.publish.mockRejectedValueOnce(new Error('queue down'));

    await service.record(entry);

    expect(writer.persist).toHaveBeenCalledWith(expect.objectContaining({ action: VEHICLE_EVENT_CREATED }));
  });
});
