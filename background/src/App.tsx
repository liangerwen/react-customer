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

const App2 = withCustom("App", ({ wrap }) => {
  return wrap(<button>App2</button>);
});

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
        {count > 10 && <App2 />}
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    );
  }
);

export default App;
