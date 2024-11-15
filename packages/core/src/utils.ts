import { URL, URLSearchParams } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os';
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export const wildcardHosts = new Set(['0.0.0.0', '::', '0000:0000:0000:0000:0000:0000:0000:0000'])

export function resolveHostname(optionsHost: string | boolean | undefined): string {
  return typeof optionsHost === 'string' && !wildcardHosts.has(optionsHost) ? optionsHost : 'localhost'
}

export const queryRE = /\?.*$/s
export const hashRE = /#.*$/s

export const cleanUrl = (url: string): string => url.replace(hashRE, '').replace(queryRE, '')

export function parseRequest(id: string): Record<string, string> | null {
  const { search } = new URL(id, 'file:')
  if (!search) {
    return null
  }
  return Object.fromEntries(new URLSearchParams(search))
}

export function getHash(text: Buffer | string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}

export function toRelativePath(filename: string, importer: string): string {
  const relPath = path.posix.relative(path.dirname(importer), filename)
  return relPath.startsWith('.') ? relPath : `./${relPath}`
}

interface PackageData {
  main?: string
  type?: 'module' | 'commonjs'
  dependencies?: Record<string, string>
}

let packageCached: PackageData | null = null

interface OutputOptions{}

export function loadPackageData(root = process.cwd()): PackageData | null {
  if (packageCached) return packageCached
  const pkg = path.join(root, 'package.json')
  if (fs.existsSync(pkg)) {
    const _require = createRequire(import.meta.url)
    const data = _require(pkg)
    packageCached = {
      main: data.main,
      type: data.type,
      dependencies: data.dependencies
    }
    return packageCached
  }
  return null
}

export function isFilePathESM(filePath: string): boolean {
  if (/\.m[jt]s$/.test(filePath) || filePath.endsWith('.ts')) {
    return true
  } else if (/\.c[jt]s$/.test(filePath)) {
    return false
  } else {
    const pkg = loadPackageData()
    return pkg?.type === 'module'
  }
}


export const isWindows = os.platform() === 'win32';


export function slash(p: string): string {
  return p.replace(/\\/g, '/');
}
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

function processEnvDefine(): Record<string, string> {
  return {
    'process.env': `process.env`,
    'global.process.env': `global.process.env`,
    'globalThis.process.env': `globalThis.process.env`,
  };
}


export function resolveBuildOutputs(
  outputs: OutputOptions | OutputOptions[] | undefined,
  libOptions: any
): OutputOptions | OutputOptions[] | undefined {
  if (libOptions && !Array.isArray(outputs)) {
    const libFormats = libOptions.formats || [];
    return libFormats.map((format: any) => ({ ...outputs, format }));
  }
  return outputs;
}


export function findLibEntry(root: string, scope: string): string | undefined {
  for (const name of ['index', scope]) {
    for (const ext of ['js', 'ts', 'mjs', 'cjs']) {
      const entryFile = path.resolve(root, 'src', scope, `${name}.${ext}`);
      if (fs.existsSync(entryFile)) {
        return entryFile;
      }
    }
  }
  return undefined;
}

export function findInput(root: string, scope = 'renderer'): string {
  const rendererDir = path.resolve(root, 'src', scope, 'index.html');
  if (fs.existsSync(rendererDir)) {
    return rendererDir;
  }
  return '';
}


