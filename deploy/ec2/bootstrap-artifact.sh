#!/usr/bin/env bash
# Run once as root on Amazon Linux 2023 before registering the GitHub runner.
set -euo pipefail

dnf install -y nginx
install -d -m 0755 /var/www/cicd-learning-journal/releases
# Amazon Linux already has a default port-80 server. Add this application's
# routes inside that server instead of creating a competing server block.
rm -f /etc/nginx/conf.d/cicd-learning-journal.conf
install -m 0644 "$(dirname "$0")/nginx-artifact.conf" \
  /etc/nginx/default.d/cicd-learning-journal.conf
nginx -t
systemctl enable nginx
if systemctl is-active --quiet nginx; then
  systemctl reload nginx
else
  systemctl start nginx
fi

echo "Nginx is ready. Register a self-hosted GitHub Actions runner as ssm-user next."
