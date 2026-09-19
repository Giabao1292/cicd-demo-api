#!/usr/bin/env bash
# Run once as root on Amazon Linux 2023 before registering the GitHub runner.
set -euo pipefail

dnf install -y nginx
install -d -m 0755 /var/www/cicd-learning-journal/releases
install -m 0644 "$(dirname "$0")/nginx-artifact.conf" \
  /etc/nginx/conf.d/cicd-learning-journal.conf
nginx -t
systemctl enable --now nginx

echo "Nginx is ready. Register a self-hosted GitHub Actions runner as ssm-user next."
