/**************************************************************************
 * IMPORTS
 ***************************************************************************/

import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify-es";
import minimist from "minimist";
import css from 'rollup-plugin-css-only';

/**************************************************************************
 * ROLLUP CONFIGURATION
 * https://rollupjs.org/guide/en/
 ***************************************************************************/

const argv = minimist(process.argv.slice(2));

var config;

// Only minify browser (iife) version
if (argv.format === "iife") {
  config = {
    input: "src/index.js",
    external: [ 'body-scroll-lock' ],
    output: {
      name: "CoolLightBox",
      exports: "named",
      globals: {
        'body-scroll-lock': 'bodyScrollLock'
      }
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify(),
      commonjs(),
      css({ output: 'dist/vue-cool-lightbox.min.css'}),
      vue({
        css: false,
        compileTemplate: true,
        template: {
          isProduction: true,
        }
      }),
      buble()
    ]
  };
}

if (argv.format === "es") {
  config = {
    input: "src/index.js",
    external: [ 'body-scroll-lock' ],
    output: {
      name: "CoolLightBox",
      exports: "named",
      globals: {
        'body-scroll-lock': 'bodyScrollLock'
      }
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      commonjs(),
      css({ output: 'dist/vue-cool-lightbox.min.css'}),
      vue({
        css: false,
        compileTemplate: true,
        template: {
          isProduction: true,
        }
      }),
      buble()
    ]
  };
}

// Only add SSR to umd version
if (argv.format === "umd") {
  config = {
    input: "src/index.js",
    external: [ 'body-scroll-lock' ],
    output: {
      name: "CoolLightBox",
      exports: "named",
      globals: {
        'body-scroll-lock': 'bodyScrollLock'
      }
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      css({ output: 'dist/vue-cool-lightbox.min.css'}),
      commonjs(),
      vue({
        css: false,
        compileTemplate: true,
        template: {
          optimizeSSR: true,
          isProduction: true
        }
      }),
      buble()
    ]
  };
}

export default config;