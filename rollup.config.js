import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  // Use multiple entry points if you want separate bundles, or an array for a multi‑entry bundle.
  // Here, we bundle both modules into the output folder.
  input: ['even-group-demo.js', 'z-group-demo.js', 'triangle-group-demo.js'],
  output: {
    // Output files will be placed in the dist folder.
    dir: 'dist',
    format: 'esm', // Use ES module format so you can load them via <script type="module">
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    terser() // Minification (optional)
  ]
};
