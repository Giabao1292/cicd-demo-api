# Pipeline UI Architecture

The UI is a learning system, not a deployment console. It models the things a
learner needs to trace: **objects** (source, artifact, image, runtime) and
**actions** (test, build, push, pull, deploy).

## Structure

- `src/pipelineModel.js` is the single source of learning content and graph
  topology. Each flow supplies ordered `nodes`, labelled `edges`, and an
  explanation for each node.
- `src/App.jsx` renders the flow selector, horizontal visualizer, click-to-
  inspect panel, explain-step controller, promotion view, failure lab, and
  abstraction comparison.
- `src/styles.css` deliberately uses diagrams, inspector panels, sequences,
  and comparison columns rather than turning every fact into a card.

## Node model

Every node has `kind: action | object`, a short label, input, output, owner,
equivalent technologies, a why explanation, and a one-sentence memory cue.
This makes the UI answer: what is it, why does it exist, what enters/leaves it,
and who handles it.

To add a technology, first decide its abstraction. For example, add AWS ECR as
an implementation under `Container registry`, not as a brand-new pipeline
concept. Add a new flow only when the package or distribution model differs.

## Current truth versus comparison

`artifact` is the actual project workflow: GitHub Actions builds Vite `dist/`,
uploads an artifact, and the EC2 self-hosted runner downloads it for Nginx.
`docker` is an educational comparison. It shows the equivalent distribution
boundary when the package is an OCI image stored in a registry.

The UI must not imply that this EC2 artifact deployment currently pulls an ECR
image. When implementation changes, update the artifact flow first.
