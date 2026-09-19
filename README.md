# CI/CD learning journal

The React frontend is packaged as a production Nginx container. For the first
AWS deployment lab, pushes to `main` automatically build the image, publish it
to Amazon ECR, and update one EC2 instance through AWS Systems Manager.

See [the EC2 CI/CD guide](docs/ec2-cicd.md) for the AWS setup and required
GitHub Actions configuration.
