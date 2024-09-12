import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rsbuild/core";
import { readdirSync } from "node:fs";
import servePlugin from "./plugins/rslib-serve-plugin";

const plugins = readdirSync("src");

const entries = plugins.reduce((acc, p) => {
  acc[p] = `./src/${p}/index.ts`;
  return acc;
}, {});

export default defineConfig({
  source: {
    entry: entries,
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  output: {
    filenameHash: false,
    distPath: {
      root: "./dist",
      js: "./",
    },
    filename: {
      js: "[name]/plugin.min.js",
    },
    minify: true,
    externals: {
      react: "React",
      "react-customer": "ReactCustomer",
    },
    legalComments: "none",
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      output: {
        module: false,
        library: {
          type: "umd",
          umdNamedDefine: true,
          name: "__CUSTOMER_PLUGINS__",
          export: "default",
        },
      },
    },
  },
  plugins: [pluginReact(), servePlugin()],
});
