import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify-es";
import minimist from "minimist";
import css from 'rollup-plugin-css-only';

const argv = minimist(process.argv.slice(2));

const config = {
  input: "src/index.js",
  output: {
    name: "CoolLightBox",
    exports: "named"
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    commonjs(),
    css(),
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    buble()
  ]
};

// Only minify browser (iife) version
if (argv.format === "iife") {
  config.plugins.push(uglify());
}

export default config;