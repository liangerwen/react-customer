import typescript from "@rollup/plugin-typescript";
import swc from "@rollup/plugin-swc";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

const isProduction = process.env.BUILD_ENV === "production";

const typesDirName = "types";

const others = {
  plugins: [
    del({
      targets: "dist",
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        outDir: typesDirName,
      },
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
        sourcemap: isProduction,
      },
      {
        file: "dist/es/index.js",
        format: "es",
        sourcemap: isProduction,
      },
      isProduction && {
        file: "dist/umd/react-customer.min.js",
        format: "umd",
        sourcemap: true,
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
