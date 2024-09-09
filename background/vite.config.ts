import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import cdn from "vite-plugin-cdn-import";

const externalModules = [
  {
    name: "react",
    var: "React",
    path: "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
  },
  {
    name: "react-dom",
    var: "ReactDOM",
    path: "https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js",
  },
  {
    name: "react-customer",
    var: "ReactCustomer",
    path: "https://unpkg.luckincdn.com/react-customer@1.0.2/dist/umd/react-customer.min.js",
  },
];

// https://vitejs.dev/config/
export default defineConfig(() => ({
  define: {
    "window.__CUSTOMER_CODE__": JSON.stringify("b"),
  },
  plugins: [
    react(),
    cdn({
      modules: externalModules,
    }),
  ],
  build: {
    rollupOptions: {
      external: externalModules.map((i) => i.name),
    },
  },
}));
