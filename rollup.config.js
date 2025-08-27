import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'script.js', // Your main JavaScript file
  output: {
    file: 'bundle.js', // The bundled output file
    format: 'iife',    // Immediately Invoked Function Expression (good for browsers)
    name: 'TaxAdvisorAppBundle' // A global name for your bundle
  },
  plugins: [
    resolve() // Helps Rollup find modules in node_modules
  ]
};