# ui-kit

A React + TypeScript UI component library, developed with Storybook.

**Live Storybook docs:** https://aslanzaden.github.io/ui-kit

## Installation

This package isn't published to npm — install it straight from GitHub:

```bash
npm install github:aslanzaden/ui-kit
```

or, pinned to a specific branch/tag/commit:

```bash
npm install github:aslanzaden/ui-kit#main
```

`react` and `react-dom` (^19) are peer dependencies — your project must already have them installed.

### Usage

```tsx
import { Button, Input, DataTable } from 'ui-kit';
import 'ui-kit/style.css';

function App() {
  return <Button mode="main">Click me</Button>;
}
```

## Local development

```bash
git clone https://github.com/aslanzaden/ui-kit.git
cd ui-kit
npm install

npm run storybook       # start Storybook dev server at localhost:6006
npm run build            # build the library to dist/
npm run build-storybook  # build the static Storybook site to storybook-static/
```

## Deployment

Pushing to `main` triggers [.github/workflows/deploy-storybook.yml](.github/workflows/deploy-storybook.yml), which builds Storybook and publishes it to GitHub Pages. In the repo settings, **Settings → Pages → Source** must be set to **GitHub Actions** for this to take effect.
