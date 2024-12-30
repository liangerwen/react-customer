# ReactCustomer

Decoupling the Sass platform logic and custom logic used in the react project technology stack improves the maintainability, scalability, and reusability of the project.

## Development

```
pnpm i
pnpm dev
open http://localhost:5173
```

## Install

[react-customer npm page](https://www.npmjs.com/package/react-customer)

```sh
# npm
npm i react-customer --save
# yarn
yarn add react-customer -S
# pnpm
pnpm i react-customer -S
```

## Usage

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
import { forwardRef, useState, useImperativeHandle } from "react";
import { withDefineCustom } from "react-customer";
import { Button, ButtonProps, Input } from "antd";

const AppPlugin = withDefineCustom<{
  clickButton: () => void;
}>(
  "App",
  forwardRef(({ merge, platformApi }, ref) => {
    const [text, setText] = useState("");

    const setInputText = (txt: string) => setText(txt);

    useImperativeHandle(ref, () => {
      return { setInputText };
    });

    return merge((element) => {
      element.replaceChildren("button-02", "我是Button2【定制按钮-A】");
      element.replaceProps<ButtonProps>("button-02", {
        onClick: () => {
          setText("点击了定制按钮Button2【A】");
        },
      });
      element.appendBefore(
        "button-01",
        <Button
          onClick={() => {
            platformApi?.clickButton?.();
          }}
        >
          我是定制按钮Button3【A】
        </Button>
      );
      element.appendAfter(
        "button-02",
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      );
    });
  })
);

export default [AppPlugin];

// app.tsx
import { withCustom } from "react-customer";
import { Button } from "antd";

export interface AppExposeApi {
  clickButton: () => void;
}

export interface AppCustomApi {
  setInputText: (text: string) => void;
}

const App = withCustom<AppCustomApi, AppExposeApi>(
  "App",
  ({ customApi, exposeApi, wrap }) => {
    const clickButton = () => {
      customApi?.setInputText?.("点击了Button1");
    };

    exposeApi({ clickButton });

    return wrap(
      <>
        <Button type="primary" onClick={clickButton} data-id="button-01">
          我是Button1
        </Button>
        <Button
          data-id="button-02"
          type="dashed"
          onClick={() => {
            customApi?.setInputText?.("点击了Button2");
          }}
        >
          我是Button2
        </Button>
      </>
    );
  }
);

export default App;
```

## withCustom(componentName: string, WrapperComponent: React.Component) => React.Component

| Props     | Description                           | Type                                              |
| --------- | ------------------------------------- | ------------------------------------------------- |
| customApi | Use custom plugin expose api.         | Object                                            |
| exposeApi | Expose platfrom api to custom plugin. | (api: Object): void                               |
| wrap      | Wrap platfrom ReactElement.           | (element: React.ReactElement): React.ReactElement |

## CustomPluginProps

| Props       | Description                                   | Type                                        |
| ----------- | --------------------------------------------- | ------------------------------------------- |
| merge       | Merge custom plugin to platform ReactElement. | (element: ElementUtils): React.ReactElement |
| platformApi | Use platform api.                             | Object                                      |

## ElementUtils

| Property        | Description                                            | Type                                            |
| --------------- | ------------------------------------------------------ | ----------------------------------------------- |
| appendBefore    | Append element before target platform element.         | (id: string, element: React.ReactElement): void |
| appendAfter     | Append element after target platform element.          | (id: string, element: React.ReactElement): void |
| replace         | Replace target platform element with element.          | (id: string, element: React.ReactElement): void |
| replaceChildren | Replace target platform element children with element. | (id: string, element: React.ReactElement): void |
| replaceProps    | Replace target platform element props with element.    | (id: string, resetProps: object): void          |
| remove          | Remove target platform element.                        | (id: string): void                              |
| insertBefore    | Insert element before target platform element.         | (id: string, element: React.ReactElement): void |
| insertAfter     | Insert element after target platform element.          | (id: string, element: React.ReactElement): void |

## License

react-customer is released under the MIT license.
