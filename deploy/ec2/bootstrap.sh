#!/usr/bin/env bash
# Run once as root on a fresh Amazon Linux 2023 EC2 instance.
set -euo pipefail

dnf install -y docker
systemctl enable --now docker

if ! command -v aws >/dev/null; then
  echo "AWS CLI v2 is required for ECR authentication; install it before deploying." >&2
  exit 1
fi

install -d -m 0755 /opt/cicd-learning-journal
install -m 0755 "$(dirname "$0")/deploy.sh" /opt/cicd-learning-journal/deploy.sh

# Lets Session Manager users inspect Docker without sudo after reconnecting.
usermod -aG docker ssm-user

echo "Bootstrap complete. Attach AmazonSSMManagedInstanceCore and ECR read permissions to this instance role."
