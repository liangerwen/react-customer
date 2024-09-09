import typescript from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import del from "rollup-plugin-delete";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import fs from "fs";

const plugins = fs.readdirSync("src");

export default plugins.map((p) => ({
  input: `src/${p}/index.ts`,
  external: ["react"],
  output: [
    {
      file: `dist/${p}/plugin.min.js`,
      format: "umd",
      sourcemap: true,
      name: "__CUSTOMER_PLUGINS__",
      globals: {
        react: "React",
      },
    },
  ],
  plugins: [
    del({
      targets: `dist/${p}`,
    }),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    swc({
      swc: {
        minify: true,
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        declaration: false,
      },
    }),
    terser(),
    serve({
      contentBase: ["dist"],
      port: 8080,
    }),
  ],
}));
