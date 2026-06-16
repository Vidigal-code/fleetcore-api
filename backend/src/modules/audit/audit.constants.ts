export const AUDIT_ROUTING_KEY = 'audit.event';

export const AUDIT_STATUS_PROCESSED = 'processed';

/** sourceQueue value used when an event is persisted synchronously (fallback). */
export const AUDIT_SOURCE_INLINE = 'inline';

// --- Transactional outbox (publish fallback when RabbitMQ is unavailable) ---

/** Entry waiting to be (re)published to RabbitMQ. */
export const AUDIT_OUTBOX_STATUS_PENDING = 'pending';

/** Entry currently being relayed; reset to pending on relay restart. */
export const AUDIT_OUTBOX_STATUS_PROCESSING = 'processing';

/** Entry parked after exhausting all relay attempts; needs manual review. */
export const AUDIT_OUTBOX_STATUS_FAILED = 'failed';

/** How often the relay scans the outbox, in milliseconds. */
export const AUDIT_OUTBOX_RELAY_INTERVAL_MS = 5_000;

/** Maximum entries drained per relay tick. */
export const AUDIT_OUTBOX_BATCH_SIZE = 20;

/** Attempts before an entry is parked as failed. */
export const AUDIT_OUTBOX_MAX_ATTEMPTS = 10;

// --- Consumer dead-letter / retry (MongoDB unavailable while persisting) ---

/**
 * Delivery attempts before an audit message stops being retried and is parked
 * in the dead-letter queue. Overridable via RABBITMQ_AUDIT_MAX_ATTEMPTS.
 */
export const AUDIT_MAX_DELIVERY_ATTEMPTS = 5;
