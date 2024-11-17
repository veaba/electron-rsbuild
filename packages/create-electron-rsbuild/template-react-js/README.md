# electron-rsbuild-js-demo TODO

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

测试 build 构建

```bash
pnpm run builder

# 将 main、preload、renderer 产物输出为 unpacked 的应用
> electron-rsbuild-app@1.0.0 builder F:\Github\veaba\electron-rsbuild\tests\electron-rsbuild-demo
> electron-builder --dir

  • electron-builder  version=24.13.3 os=10.0.22631
  • writing effective config  file=dist\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=31.7.3 appOutDir=dist\win-unpacked
  • default Electron icon is used  reason=application icon is not set


```

<!-- electron-rsbuild -->