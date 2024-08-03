#!/bin/bash
set -e

docker kill csvtod3 2>/dev/null || true
docker rm csvtod3 2>/dev/null || true
