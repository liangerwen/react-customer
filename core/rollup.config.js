import typescript from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const isProduction = process.env.NODE_ENV === "production";

const typesDirName = "types";

const others = {
  plugins: [
    del({
      targets: "dist",
    }),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    swc({
      swc: {
        minify: isProduction,
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
        outDir: typesDirName,
      },
    }),
    isProduction && terser(),
  ],
};

export default [
  {
    input: "./src/index.ts",
    external: ["react"],
    output: [
      {
        file: "dist/lib/index.js",
        format: "cjs",
        sourcemap: false,
      },
      {
        file: "dist/es/index.js",
        format: "es",
        sourcemap: false,
      },
      isProduction && {
        file: "dist/umd/react-customer.min.js",
        format: "umd",
        sourcemap: false,
        name: "ReactCustomer",
        globals: {
          react: "React",
        },
      },
    ],
    ...others,
  },
  {
    input: `dist/es/${typesDirName}/index.d.ts`,
    output: {
      file: "dist/types.d.ts",
      format: "es",
    },
    plugins: [
      dts(),
      del({
        targets: `dist/**/${typesDirName}`,
        hook: "buildEnd",
      }),
    ],
  },
];
