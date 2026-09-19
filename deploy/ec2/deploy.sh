#!/usr/bin/env bash
# Invoked remotely by GitHub Actions through AWS Systems Manager Run Command.
set -euo pipefail

image_uri="${1:?Image URI is required}"
aws_region="${2:?AWS Region is required}"
container_name="cicd-learning-journal"
registry="${image_uri%%/*}"

if [[ "$image_uri" != *.dkr.ecr.*.amazonaws.com/*:* ]]; then
  echo "Refusing a non-ECR image URI: $image_uri" >&2
  exit 2
fi

aws ecr get-login-password --region "$aws_region" \
  | docker login --username AWS --password-stdin "$registry"

# Download first: a failed build never replaces the currently running version.
docker pull "$image_uri"
docker rm -f "$container_name" 2>/dev/null || true
docker run -d \
  --name "$container_name" \
  --restart unless-stopped \
  --publish 80:80 \
  --read-only \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=16m \
  --tmpfs /var/run:rw,noexec,nosuid,size=4m \
  "$image_uri"

docker ps --filter "name=^/${container_name}$" --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
