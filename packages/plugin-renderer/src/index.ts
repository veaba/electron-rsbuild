import { logger, type RsbuildConfig, RsbuildPlugin } from '@rsbuild/core';
import { resolve } from 'path';

/**
 * plugin-renderer for rsbuild
 * */
export const rendererPlugin = (): RsbuildPlugin => ({
  name: 'electron-rsbuild:renderer',
  setup(api) {
    api.modifyRsbuildConfig((config: RsbuildConfig, { mergeRsbuildConfig }) => {
      const isReactPlugin = api.isPluginExists('react');
      // 如果是react 项目，必须外部自己配react
      if (!isReactPlugin) {
        logger.error('OH~, you should install react plugin: https://rsbuild.dev/zh/plugins/list/plugin-react');
        return;
      }
      return mergeRsbuildConfig(
        {
          ...config?.environments,
        },
        {
          environments: {
            renderer: {
              html: {
                title: 'Electron-Rsbuild App',
              },
              source: {
                entry: {
                  index: './src/renderer/src/main.tsx',
                },
                alias: {
                  '@renderer': resolve('src/renderer/src'),
                },
              },
              output: {
                target: 'web',
                assetPrefix: 'auto',
                distPath: {
                  root: 'out/renderer',
                },
                minify: false,
              },
            },
          },
        },
      );
    });
  },
});
