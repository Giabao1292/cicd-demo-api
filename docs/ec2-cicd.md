# Deploy automatically to one EC2 instance

This lab deploys the Dockerized React frontend to an x86_64 Amazon Linux 2023
EC2 instance. A push to `main` builds an immutable image, stores it in Amazon
ECR, then uses AWS Systems Manager (SSM) to tell the tagged EC2 instance to
replace its container. No SSH port, SSH key, or permanent AWS access key is
needed.

## 1. Create AWS resources

Choose one AWS Region and set it below where commands use `REGION`. Create an
ECR repository:

```sh
aws ecr create-repository --repository-name cicd-learning-journal --region REGION
```

Launch a small Amazon Linux 2023 x86_64 EC2 instance in a public subnet. Its
security group should allow inbound TCP 80 only from the IP ranges that need to
view the lab. Tag the instance exactly as follows:

```text
cicd-learning-journal = frontend
```

Attach an instance role with these AWS managed policies:

- `AmazonSSMManagedInstanceCore`
- `AmazonEC2ContainerRegistryReadOnly`

Connect with Session Manager, clone this repository, then run once as root:

```sh
sudo ./deploy/ec2/bootstrap.sh
```

The SSM agent is included in the standard Amazon Linux 2023 AMI. Confirm the
instance is managed before continuing:

```sh
aws ssm describe-instance-information --region REGION
```

## 2. Let GitHub Actions access only the required AWS services

Create a GitHub OIDC provider in IAM if your account does not already have one:

```text
https://token.actions.githubusercontent.com
```

Create an IAM role trusted only by this repository's GitHub Actions workflow.
Use [the included trust-policy template](../deploy/aws/github-oidc-trust-policy.json),
replacing `ACCOUNT_ID`. If the GitHub repository uses immutable OIDC subject
claims, replace the `sub` value with the immutable owner/repository-ID format
shown in GitHub's OIDC settings.

Attach [the included deployment policy](../deploy/aws/github-deploy-policy.json)
after replacing `REGION` and `ACCOUNT_ID`. It permits pushing only to this
lab's ECR repository and running `AWS-RunShellScript` only on instances tagged
`cicd-learning-journal=frontend`.

In the GitHub repository settings, add:

| Type | Name | Value |
| --- | --- | --- |
| Actions secret | `AWS_DEPLOY_ROLE_ARN` | ARN of that OIDC IAM role |
| Actions variable | `AWS_REGION` | e.g. `ap-southeast-1` |
| Actions variable | `EC2_INSTANCE_ID` | the target instance ID, e.g. `i-0123456789abcdef0` |

## 3. Deploy and verify

Push a commit to `main` or run **Deploy frontend to EC2** manually from the
Actions tab. The job's final SSM wait succeeds only after the new container is
running. Open `http://EC2_PUBLIC_IP/` to view the frontend.

On the instance, inspect the active image with:

```sh
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
```

## Troubleshooting

- **SSM target is empty:** verify the instance is online in Systems Manager,
  the tag has the exact key and value above, and the instance role has
  `AmazonSSMManagedInstanceCore`.
- **ECR pull is denied:** attach `AmazonEC2ContainerRegistryReadOnly` to the
  instance role and ensure the instance can reach ECR.
- **GitHub OIDC is denied:** compare the role trust-policy `sub` claim with
  the exact GitHub owner/repository and branch.
- **The site is unreachable:** allow TCP 80 in the EC2 security group and
  network ACL; do not open SSH merely for deployment.
