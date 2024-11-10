import { resolve } from 'path'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  main: {
    // plugins: [externalizeDepsPlugin()]
  },
  preload: {
    // plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    source: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      },
      // TODO 后期改为默认
      entry: {
        index: './src/renderer/src/main.tsx'
      }
    },
    plugins: [pluginReact()]
  }
})
