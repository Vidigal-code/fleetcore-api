## TLS Reverse Proxy Blueprint

- **Nginx**: deploy front proxy using the sample config at `infra/nginx/fleetcore.conf`.
  - Terminates TLS with modern ciphers (`TLSv1.2+`, HTTP/2 enabled) and enforces HSTS preload.
  - Sets security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) consistently before forwarding to NestJS.
  - Propagates `X-Request-Id`/`X-Correlation-Id` to keep observability intact.
  - Issues 301 redirects from HTTP → HTTPS.
- **Certificates**: automate issuance with Let’s Encrypt (`certbot`) or AWS Certificate Manager; renew via cron/ACME client and reload Nginx atomically.
- **Deployment**: place proxy close to ingress (ALB / API Gateway) and pin upstream via internal network DNS (`api:3000`).

## Secrets Management Strategy

1. **Central Vault**
   - *AWS Secrets Manager (production)*: store credentials (`SQLSERVER_PASSWORD`, `JWT_SECRET`, etc.) with automatic rotation policies.
   - *HashiCorp Vault (self-hosted)*: use KV v2 for static secrets, database engine for dynamic SQL credentials.
   - *Mozilla SOPS (GitOps)*: encrypt environment manifests committed to Git (KMS/GCP/Azure keys) for staging/QA.

2. **Runtime Fetching**
   - Create a `SecretsProvider` implementing an interface (e.g., `SecretStore`) returning resolved values.
   - During bootstrap, detect environment (`production` vs `local`) and hydrate Nest `ConfigModule` overrides with fetched secrets before creating the application context.
   - Cache secrets in-memory with TTL + auto-refresh, and expose health checks to fail fast when retrieval breaks.

3. **Rotation Workflow**
   - Schedule rotation jobs (AWS Lambda/Vault Agent) → update secret store → trigger CI pipeline that:
     1. Forces new deployment with `CONFIG_VERSION` bump (seen by Kubernetes/Compose).
     2. Runs smoke tests to confirm handshake using new credentials.
     3. Revokes old secret after success window.

4. **Local Development**
   - Continue using `.env` files (see `.env.example`).
   - Provide mock secret provider returning `.env` values to keep developer experience simple.
   - Guard `.env` access in CI to prevent accidental leak; rely on SOPS-encrypted YAML for shared non-production secrets.

5. **Operational Guardrails**
   - Grant least-privilege IAM roles (read-only for application, write for rotation jobs).
   - Enable secret access logging (CloudTrail / Vault audit devices) and forward to SIEM.
   - Document break-glass manual rotation runbook alongside automated process.

### Rotation CI Pipeline (Example)

```yaml
name: rotate-secrets
on:
  workflow_dispatch:
  schedule:
    - cron: '0 3 * * 1'

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Fetch secrets
        run: aws secretsmanager get-secret-value --secret-id fleetcore/prod --query SecretString --output text > secrets.json
      - name: Rotate
        run: node scripts/rotate-secrets.mjs secrets.json
      - name: Deploy
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ecs/task-def.json
      - name: Smoke tests
        run: npm run test:smoke --workspace backend
```

## WAF / API Gateway Hardening Checklist

- **AWS WAF:**
  - Attach web ACL to CloudFront/ALB.
  - Enable managed rule sets (AWSManagedRulesCommonRuleSet, KnownBadInputs, IP reputation lists).
  - Add custom rate-based rule (e.g., 200 req/5 min per IP) forwarded to emergency block list.
- **Allow-list Sensitive Paths:**
  - `/admin/**`, `/metrics` protected behind CIDR allow-list using WAF IP sets.
- **Geo/IP Controls:**
  - Block unused regions; ingest threat intel lists into WAF IP sets nightly.
- **Gateway Observability:**
  - Mirror WAF logs to Kinesis Firehose → S3 → Athena for near real-time dashboards.
  - Trigger SNS alerts on rule match spikes (>= 10 blocks/min on a rule).
- **API Gateway / Reverse Proxy:**
  - Propagate `X-Forwarded-*` headers and enforce TLS 1.2+ (already covered in Nginx template).
  - Configure additional rate limiting at gateway (e.g., AWS API Gateway usage plans, Cloudflare rules) to complement Nest throttler.
  - Ensure request body size limits (e.g., `client_max_body_size 5m` in Nginx, API Gateway `maxBodySize`).
- **Pen Testing Loop:**
  - Schedule quarterly WAF rule review; run OWASP ZAP baseline scans behind WAF to validate no regressions.
