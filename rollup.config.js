import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "lib/index.js",
  output: {
    file: "target/rollup.js",
    format: "cjs"
  },
  plugins: [resolve(), terser({ mangle: false })]
};
