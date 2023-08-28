import { BuildOptions } from 'esbuild'
import * as path from 'path'
import dotenv from 'dotenv';
dotenv.config(); // This will load variables from the .env file into process.env

const config: BuildOptions = {
  platform: 'node',
  entryPoints: [
    path.resolve('src/main/main.ts'),
    path.resolve('src/main/preload.ts'),
  ],
  define: {
    'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
  },

  bundle: true,
  target: 'node18.15.0', // electron version target
}

export default config
