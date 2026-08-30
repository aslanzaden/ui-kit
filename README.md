# @aslanzaden/ui-kit

A React + TypeScript UI component library, developed with Storybook.

## Installation

```bash
npm install @aslanzaden/ui-kit
```

`react` and `react-dom` (^19) are peer dependencies — your project must already have them installed.

### Usage

```tsx
import { Button, Input, DataTable } from '@aslanzaden/ui-kit';
import '@aslanzaden/ui-kit/style.css';

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
```

## Publishing a new version

```bash
npm login                        # once per machine
npm version patch                # or minor / major
npm publish                      # builds automatically via the `prepare` script
git push --follow-tags
```
