## ReactCustomer

## 用于 react 技术栈的 sass 项目平台逻辑与定制逻辑的解耦，提高项目的可维护性、可扩展性、可复用性。

```tsx
// main.tsx
import { CustomProvider } from "react-customer";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import plugins from "./plugins.tsx";

createRoot(document.getElementById("root")!).render(
  <CustomProvider plugins={plugins}>
    <App />
  </CustomProvider>
);

// plugins.tsx
import { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { CustomPluginProps } from "react-customer";

const AppPlugin = forwardRef(
  (
    { merge, platformApi }: CustomPluginProps<{ increase: () => void }>,
    ref
  ) => {
    const [c, setC] = useState(1000);

    useImperativeHandle(ref, () => {
      return {
        increase: () => {
          setC(c + 1);
          console.log(c, "pxl");
        },
        c,
      };
    });

    useEffect(() => {
      return () => console.log("unmount");
    }, []);

    return merge((element) => {
      element.insertAfter(
        "origin",
        <button
          onClick={() => {
            setC(c - 1);
            platformApi.current?.increase?.();
            console.log(platformApi, "pxl");
          }}
        >
          {c}
        </button>
      );
    });
  }
);

export default [
  {
    name: "App",
    component: AppPlugin,
  },
];

// app.tsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { CustomProps, withCustom } from "react-customer";

import "./App.css";

export interface AppExposeApi {
  increase: () => void;
}

export interface AppCustomApi {
  count: number;
  increase: () => void;
}

const App = withCustom(
  "App",
  ({ customApi, exposeApi, wrap }: CustomProps<AppCustomApi, AppExposeApi>) => {
    const [count, setCount] = useState(0);
    exposeApi({
      increase: () => {
        setCount(count - 1);
      },
    });

    return wrap(
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button
            onClick={() => {
              setCount(count + 1);
              customApi.current?.increase?.();
              console.log(customApi.current?.count);
            }}
          >
            count is {count}
          </button>
          <p data-id="origin">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    );
  }
);

export default App;
```
