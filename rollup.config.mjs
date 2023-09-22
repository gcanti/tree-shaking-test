import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";

export default {
  input: 'lib/index.js',
  output: {
    file: "target/rollup.js",
    format: 'cjs'
  },
  plugins: [nodeResolve(), terser({ mangle: false, compress: false })]
};
