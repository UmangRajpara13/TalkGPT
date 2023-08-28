import { BuildOptions } from 'esbuild'
import * as path from 'path'


const config: BuildOptions = {
  platform: 'browser',
  entryPoints: [
    path.resolve('src/renderer/index.tsx')  ],
  bundle: true,
  target: 'chrome114', // electron version target
  loader: {
    '.png': 'dataurl',
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
    '.css': 'css',
    '.svg': 'dataurl'
    },
}

export default config
