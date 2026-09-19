# Deploy a frontend artifact to EC2

This first lab deliberately deploys the Vite `dist/` directory rather than a
Docker image. GitHub Actions builds an immutable artifact for each commit to
`main`; a self-hosted Actions runner on the EC2 instance downloads it and
switches Nginx to the new release. No AWS access key, GitHub OIDC provider,
container registry, or inbound SSH port is required.

```text
push to main
  -> GitHub-hosted runner: test, lint, build dist/, upload artifact
  -> EC2 self-hosted runner: download artifact, create release, update symlink
  -> Nginx: serve the new release
```

## Security model

The EC2 instance makes an outbound connection to GitHub to poll for jobs.
GitHub does not need a route into the instance, so do not open port 22. The
deploy job runs only for `main` pushes and manual runs, never for pull requests:
running unreviewed pull-request code on a self-hosted runner would give that
code access to the server.

The instance still has its SSM role so you can administer it through Session
Manager. Docker and the ECR repository from the later container lesson are not
needed by this workflow.

## 1. Bootstrap Nginx on EC2

On the EC2 instance, clone the `feature/ec2-cicd` branch and run:

```sh
cd ~/cicd-demo-api
sudo bash deploy/ec2/bootstrap-artifact.sh
```

This installs Nginx. On Amazon Linux, it adds the app routes to Nginx's default
port-80 server, which serves the `current` symlink below:

```text
/var/www/cicd-learning-journal/
  releases/COMMIT_SHA/  # immutable release files
  current -> releases/COMMIT_SHA
```

Changing one symlink deploys a release; reverting that symlink rolls it back.

## 2. Register the EC2 instance as a self-hosted GitHub runner

In GitHub, open the repository and select **Settings** > **Actions** >
**Runners** > **New self-hosted runner**. Choose Linux and x64. GitHub shows a
short-lived registration token and the exact download commands for the current
runner version.

Run those commands on EC2 as `ssm-user`, adding the custom label
`cicd-ec2` to the `config.sh` command. For example, after extracting the runner
in `~/actions-runner`:

```sh
./config.sh --url https://github.com/Giabao1292/cicd-demo-api --token TOKEN --labels cicd-ec2
sudo ./svc.sh install ssm-user
sudo ./svc.sh start
```

Do not copy a token from this example: use the temporary token GitHub displays.
Verify it appears as **Idle** in GitHub's Runners page before merging this
branch. The runner service executes as `ssm-user`, which can use `sudo` on this
lab instance for the Nginx deployment commands.

## 3. Deploy

After the runner is idle, create a pull request from `feature/ec2-cicd` into
`main` and merge it. The workflow:

1. Runs lint, unit tests, and the i18n check on a GitHub-hosted runner.
2. Builds `dist/` with the `/` base path used by EC2 Nginx, then retains it
   as a GitHub Actions artifact for 14 days.
3. Downloads exactly that commit's artifact on EC2.
4. Copies it to a SHA-named release directory, updates `current`, then reloads
   Nginx after validating its configuration.

Open `http://EC2_PUBLIC_IP/` to verify the site.

## Roll back

Use **Actions** > **Roll back frontend on EC2** > **Run workflow**. Enter the
SHA of a release already installed on EC2 and tick the confirmation box. The
workflow validates that the release exists and contains `index.html`, then
updates the `current` symlink and reloads Nginx. It does not rebuild or
download the application.

To find a SHA without using the terminal, open a successful deployment run in
GitHub Actions. Its artifact is named `frontend-dist-<SHA>`, and the deployment
log also identifies the commit. Only releases still present under
`/var/www/cicd-learning-journal/releases` can be restored.

For a break-glass emergency, an SSM session can still list releases and change
the symlink manually, but the normal rollback path is the GitHub Actions UI.

## Clean up

The artifact workflow does not use ECR. Delete the empty ECR repository if you
do not need it for the Docker lesson, and stop or terminate the EC2 instance
when the lab is not in use.
