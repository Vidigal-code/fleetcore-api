#!/bin/sh
# Executa `npm ci` com varias tentativas. A cache do npm (~/.npm/_cacache)
# persiste entre as tentativas dentro da mesma camada do Docker, entao os
# downloads ja concluidos sao reaproveitados a cada nova tentativa ate o
# install completar. Isso contorna a corrupcao intermitente de TLS
# (ERR_SSL_CIPHER_OPERATION_FAILED) comum em Docker Desktop/WSL2.
set -u

attempts=8
n=0
while [ "$n" -lt "$attempts" ]; do
  if npm ci --no-audit --no-fund "$@"; then
    exit 0
  fi
  n=$((n + 1))
  echo ">> npm ci falhou (tentativa $n/$attempts), repetindo em 5s..."
  sleep 5
done

echo ">> npm ci falhou apos $attempts tentativas"
exit 1
