# CI/CD learning journal

The first AWS deployment lab treats the Vite `dist/` directory as a deployable
artifact. A push to `main` tests and builds that artifact on GitHub Actions,
then the self-hosted runner on EC2 installs it behind Nginx.

See [the EC2 artifact deployment guide](docs/ec2-cicd.md) for the setup and
security boundaries.
