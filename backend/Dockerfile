FROM node:20-slim AS base
WORKDIR /app
# O AES-GCM do OpenSSL 3 falha (ossl_gcm_stream_update -> ERR_SSL_CIPHER_OPERATION_FAILED)
# em CPUs virtualizadas (Docker Desktop/WSL2): a deteccao de AES-NI/AVX retorna
# instrucoes que quebram no hypervisor. Limpamos esses bits de capacidade da CPU
# para que o OpenSSL use o caminho de software (correto) ao baixar pacotes via TLS.
ENV OPENSSL_ia32cap="~0x200000200000000"
# Mascarar OPENSSL_ia32cap sozinho nao basta neste ambiente: o npm ainda quebra
# com ERR_SSL_CIPHER_OPERATION_FAILED (ossl_gcm_stream_update). Forcamos o TLS a
# usar ChaCha20-Poly1305 em vez de AES-GCM (limitando a TLS 1.2), contornando o
# caminho de AES-GCM defeituoso da CPU virtualizada. Herdado pelos stages de
# build; limpo no stage de producao para nao afetar o app em runtime.
ENV NODE_OPTIONS="--tls-max-v1.2 --tls-cipher-list=ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305"
# Resiliencia de rede para o npm (definida uma vez e herdada por todos os stages):
# retries com backoff e socket unico evitam falhas intermitentes de TLS.
RUN npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000 \
  && npm config set fetch-timeout 600000 \
  && npm config set maxsockets 1
# Wrapper reutilizavel de `npm ci` com retries (DRY) usado por todos os stages.
# `sed` remove eventuais CR (CRLF do Windows) para que o shebang #!/bin/sh nao
# vire "#!/bin/sh\r" e o dash reporte "not found" (exit 127).
COPY scripts/npm-ci-retry.sh /usr/local/bin/npm-ci-retry
RUN sed -i 's/\r$//' /usr/local/bin/npm-ci-retry \
  && chmod +x /usr/local/bin/npm-ci-retry

FROM base AS deps
COPY package*.json ./
RUN npm-ci-retry --omit=optional

FROM base AS builder
ENV NODE_ENV=development
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm-ci-retry --omit=dev --omit=optional
ENV NODE_OPTIONS=""
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
CMD ["node", "dist/src/main.js"]
