# CI/CD Mental Model

Read a pipeline as a transfer of a versioned package:

```text
CODE → BUILD → PACKAGE → STORE → DEPLOY → RUN
```

## CI and CD

**CI** proves a source revision is safe to publish: checkout, dependencies,
lint, test, security checks, and build. A CI failure should stop before a new
package is promoted, so production stays unchanged.

**CD** distributes an already-built package to a runtime. It starts when that
package is uploaded/downloaded or pushed/pulled, not when someone writes code.
The boundary varies by organisation, but this distinction is useful because CI
answers “is it releasable?” while CD answers “how does the released thing run?”

## Artifact flow in this lab

The package is a Vite `dist/` artifact. GitHub-hosted CI builds it once and
stores it in GitHub Actions Artifact Storage. The self-hosted runner on EC2
downloads the exact artifact from the same workflow run. Nginx serves it via a
`current` symlink to a SHA/versioned release directory. EC2 receives files from
the artifact; it does not receive the Git repository source code.

## Docker flow

For a containerised service, the package is a **Docker image**. `docker build`
is an action; the image is the immutable output. A container registry (ECR,
Docker Hub, GHCR, ACR) stores and distributes that image. A Docker host,
Kubernetes node, ECS agent, or cloud runtime pulls the tagged image and creates
a running container. Image is the blueprint; container is its running instance.

## Build once, deploy many

Build an artifact/image once, identify it by commit SHA, version, or digest,
then promote that exact package through Dev, Staging, and Production. Do not
rebuild independently for each environment: doing so makes a “same version”
claim untrustworthy.

## Version and rollback

Tags such as `v1.0.1` are human-friendly release names; commit SHA and image
digest provide precise traceability. The EC2 lab stores releases under
`releases/<SHA-or-version>` and points `current` at the live one. Rollback
changes `current` to a prior release. It is faster and safer than `git pull`
because it restores a package that was already built and deployed.
