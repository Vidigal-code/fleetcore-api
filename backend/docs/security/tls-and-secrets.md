## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver Detalhes</strong></summary>

### Blueprint de Proxy Reverso TLS

- **Nginx**: utilize a configuração de exemplo em `infra/nginx/fleetcore.conf`.
  - Termina a camada TLS com cifragem moderna (`TLSv1.2+`, HTTP/2) e aplica HSTS com preload.
  - Aplica cabeçalhos de segurança (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) antes de encaminhar para o NestJS.
  - Propaga `X-Request-Id`/`X-Correlation-Id` para manter a observabilidade.
  - Redireciona automaticamente HTTP → HTTPS (301).
- **Certificados**: automatize emissão com Let’s Encrypt (`certbot`) ou AWS Certificate Manager; renove via cron/cliente ACME e recarregue o Nginx sem downtime.
- **Implantação**: posicione o proxy próximo ao ponto de entrada (ALB / API Gateway) e resolva o upstream via DNS interno (`api:3000`).

### Estratégia de Gestão de Segredos

1. **Vault Central**
   - *AWS Secrets Manager (produção)*: armazene credenciais (`SQLSERVER_PASSWORD`, `JWT_SECRET`, etc.) com rotação automática.
   - *HashiCorp Vault (self-hosted)*: utilize KV v2 para segredos estáticos e o engine de banco para credenciais dinâmicas.
   - *Mozilla SOPS (GitOps)*: criptografe manifestos de ambiente versionados (KMS/GCP/Azure) para estágios/QA.

2. **Resgate em Tempo Real**
   - Implemente `SecretsProvider` com contrato claro (ex.: `SecretStore`) retornando valores resolvidos.
   - No bootstrap do Nest, diferencie ambiente (`production` vs `local`) e sobreponha `ConfigModule` com segredos buscados antes da criação do app.
   - Faça cache em memória com TTL e auto-refresh; exponha health checks para falhar rápido em caso de indisponibilidade.

3. **Rotação Automatizada**
   - Agende jobs (AWS Lambda/Vault Agent) → atualize o cofre → dispare pipeline CI que:
     1. Gera novo deploy com `CONFIG_VERSION` incrementado (Kubernetes/Compose detecta).
     2. Executa smoke tests garantindo autenticação e integrações.
     3. Revoga o segredo antigo após janela de segurança.

4. **Desenvolvimento Local**
   - Continue usando `.env` (veja `.env.example`).
   - Ofereça provider fake retornando valores do `.env` para simplificar DX.
  - Restrinja acesso a `.env` em CI e prefira YAMLs criptografados (SOPS) para ambientes não produtivos.

5. **Governança Operacional**
   - Conceda privilégios mínimos (aplicação apenas leitura, jobs de rotação com escrita).
   - Ative auditoria de acesso (CloudTrail / Vault audit) e envie para SIEM.
   - Documente runbook “break-glass” para emergências.

#### Pipeline de Rotação (exemplo)

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
      - uses: actions/checkout@v4
      - run: aws secretsmanager get-secret-value --secret-id fleetcore/prod --query SecretString --output text > secrets.json
      - run: node scripts/rotate-secrets.mjs secrets.json
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ecs/task-def.json
      - run: npm run test:smoke --workspace backend
```

### Endurecimento de WAF / API Gateway

- **AWS WAF:** associe ACL ao CloudFront/ALB, habilite rule sets gerenciados (CommonRuleSet, KnownBadInputs, IP reputation) e crie regra de rate limit (ex.: 200 req/5 min/IP).
- **Paths Sensíveis:** proteja `/admin/**`, `/metrics` com allow-list de IP via IP sets.
- **Controles Geo/IP:** bloqueie regiões desnecessárias; atualize listas de ameaça diariamente.
- **Observabilidade:** replique logs do WAF para Kinesis Firehose → S3 → Athena e alerte via SNS sobre picos (≥10 bloqueios/min).
- **Gateway/Proxy:** preserve `X-Forwarded-*`, imponha TLS 1.2+, aplique rate limiting adicional (API Gateway usage plans/Cloudflare) e limite tamanho de payload (`client_max_body_size`, `maxBodySize`).
- **Rate limit na aplicação (defense-in-depth):** além do WAF, a API aplica um `RateLimitGuard` baseado em Redis por usuário/IP/endpoint (`RATE_LIMIT_*`), com orçamento mais estrito para `POST /auth/login` (`RATE_LIMIT_AUTH_*`) e resposta `429 { success, message, retryAfter }`; tentativas bloqueadas são auditadas.
- **Pentest recorrente:** review trimestral das regras + OWASP ZAP baseline atrás do WAF.

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View Details</strong></summary>

### TLS Reverse Proxy Blueprint

- **Nginx**: use the sample config at `infra/nginx/fleetcore.conf`.
  - Terminates TLS with modern ciphers (`TLSv1.2+`, HTTP/2) and enforces HSTS preload.
  - Applies security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) before hitting NestJS.
  - Propagates `X-Request-Id`/`X-Correlation-Id` for observability.
  - Redirects HTTP → HTTPS (301).
- **Certificates**: automate issuance via Let’s Encrypt (`certbot`) or AWS Certificate Manager; renew with cron/ACME and reload Nginx gracefully.
- **Deployment**: place the proxy close to ingress (ALB/API Gateway) and resolve the upstream through internal DNS (`api:3000`).

### Secrets Management Strategy

1. **Central Vault**
   - *AWS Secrets Manager (prod)*: store sensitive values (`SQLSERVER_PASSWORD`, `JWT_SECRET`, etc.) with auto rotation.
   - *HashiCorp Vault (self-hosted)*: KV v2 for static secrets; DB engine for dynamic SQL credentials.
   - *Mozilla SOPS (GitOps)*: keep environment manifests encrypted in Git (KMS/GCP/Azure keys) for staging/QA.

2. **Runtime Fetching**
   - Implement a `SecretsProvider`/`SecretStore` contract returning resolved secrets.
   - During bootstrap, detect environment and override Nest `ConfigModule` before app creation.
   - Cache secrets with TTL and provide health checks to fail fast on outages.

3. **Rotation Workflow**
   - Schedule jobs (Lambda/Vault agent) → refresh vault → trigger CI pipeline to:
     1. Redeploy with `CONFIG_VERSION` bump (Kubernetes/Compose pick it up).
     2. Run smoke tests validating new credentials.
     3. Revoke the old secret after a grace window.

4. **Local Development**
   - Keep using `.env` (see `.env.example`).
   - Supply a mock provider returning `.env` values for developer convenience.
   - Block `.env` usage in CI and rely on SOPS-encrypted manifests for shared lower environments.

5. **Operational Guardrails**
   - Enforce least privilege IAM (application read-only, rotation jobs write).
   - Enable audit logging (CloudTrail / Vault audit devices) and forward to SIEM.
   - Maintain a break-glass manual rotation runbook.

#### Rotation CI Pipeline (Example)

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
      - uses: actions/checkout@v4
      - run: aws secretsmanager get-secret-value --secret-id fleetcore/prod --query SecretString --output text > secrets.json
      - run: node scripts/rotate-secrets.mjs secrets.json
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ecs/task-def.json
      - run: npm run test:smoke --workspace backend
```

### WAF / API Gateway Hardening Checklist

- **AWS WAF:** attach ACL to CloudFront/ALB, enable managed rule sets (CommonRuleSet, KnownBadInputs, IP reputation) and add rate limits (~200 req/5 min/IP).
- **Sensitive Paths:** guard `/admin/**`, `/metrics` via IP allow-lists.
- **Geo/IP Controls:** block unused regions, ingest threat intel feeds daily.
- **Observability:** stream logs to Kinesis Firehose → S3 → Athena; raise SNS alerts on spikes (>=10 blocks/min).
- **Gateway / Reverse Proxy:** maintain `X-Forwarded-*`, enforce TLS 1.2+, add gateway-side throttling (API Gateway usage plans, Cloudflare rules), and cap body sizes (`client_max_body_size`, `maxBodySize`).
- **Application-level rate limit (defense-in-depth):** beyond the WAF, the API enforces a Redis-backed `RateLimitGuard` per user/IP/endpoint (`RATE_LIMIT_*`), with a stricter budget for `POST /auth/login` (`RATE_LIMIT_AUTH_*`) and a `429 { success, message, retryAfter }` response; blocked attempts are audited.
- **Pen Testing Loop:** quarterly rule reviews plus OWASP ZAP baseline exercises behind the WAF.

</details>
