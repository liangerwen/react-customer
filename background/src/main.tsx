import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { useState, useLayoutEffect } from "react";
import { CustomProvider, type Plugin } from "react-customer";
import "./dev.ts";

import "./index.css";

const pluginsJson: Record<string, string> = {
  a: "http://localhost:8080/a/plugin.min.js",
  b: "http://localhost:8080/b/plugin.min.js",
};

const Main = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  const loadPlugins = () => {
    const href = pluginsJson[window.__CUSTOMER_CODE__];
    console.log(href, window.__CUSTOMER_CODE__);
    if (!href) return;
    const p = document.createElement("script");
    p.src = href;
    p.onload = () => {
      setPlugins(window.__CUSTOMER_PLUGINS__ ?? []);
    };
    document.body.appendChild(p);
  };

  useLayoutEffect(() => {
    loadPlugins();
  }, []);

  return (
    <CustomProvider plugins={plugins}>
      <App />
    </CustomProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
