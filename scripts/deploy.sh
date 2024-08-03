#!/bin/bash
set -e

./scripts/destroy.sh

docker run --rm -d \
  --name csvtod3 \
  -p 80 -v "$PWD"/docs:/usr/share/nginx/html:ro nginx:alpine

docker port csvtod3 80
