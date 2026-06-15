FROM node:20-alpine AS base
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
# build (deps/builder); limpo no stage de runtime para nao afetar o app.
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
# vire "#!/bin/sh\r" e o shell reporte "not found" (exit 127).
COPY scripts/npm-ci-retry.sh /usr/local/bin/npm-ci-retry
RUN sed -i 's/\r$//' /usr/local/bin/npm-ci-retry \
  && chmod +x /usr/local/bin/npm-ci-retry

FROM base AS deps
COPY package*.json ./
RUN npm-ci-retry

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
ENV NODE_OPTIONS=""
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["node", "server.js"]
