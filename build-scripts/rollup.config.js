import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify-es";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

var config;

// Only minify browser (iife) version
if (argv.format === "iife") {
  config = {
    input: "src/index.js",
    output: {
      name: "CoolLightBox",
      exports: "named"
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify(),
      commonjs(),
      vue({
        css: true,
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
    output: {
      name: "CoolLightBox",
      exports: "named"
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      commonjs(),
      vue({
        css: true,
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
    output: {
      name: "CoolLightBox",
      exports: "named"
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      commonjs(),
      vue({
        css: true,
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