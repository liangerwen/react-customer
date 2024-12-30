# ReactCustomer

用于 react 技术栈的 sass 项目平台逻辑与定制逻辑的解耦，提高项目的可维护性、可扩展性、可复用性。

## 本地调试

```
pnpm i
pnpm dev
open http://localhost:5173
```

## 安装

[react-customer npm page](https://www.npmjs.com/package/react-customer)

```sh
# npm
npm i react-customer --save
# yarn
yarn add react-customer -S
# pnpm
pnpm i react-customer -S
```

## 使用方法

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

| 属性      | 描述                            | 类型                                              |
| --------- | ------------------------------- | ------------------------------------------------- |
| customApi | 定制包暴露的 api。              | Object                                            |
| exposeApi | 用于暴露平台 api 给定制包使用。 | (api: Object): void                               |
| wrap      | 包装平台 ReactElement 方法。    | (element: React.ReactElement): React.ReactElement |

## CustomPluginProps

| 属性        | 描述                                   | 类型                                      |
| ----------- | -------------------------------------- | ----------------------------------------- |
| merge       | 合并扩展包 ReactElement 到平台的方法。 | (element: MergeUtils): React.ReactElement |
| platformApi | 平台暴露的 api。                       | Object                                    |

## MergeUtils

| 属性            | 描述                           | 类型                                            |
| --------------- | ------------------------------ | ----------------------------------------------- |
| appendBefore    | 插入元素到目标平台元素之前。   | (id: string, element: React.ReactElement): void |
| appendAfter     | 插入元素到目标平台元素之后。   | (id: string, element: React.ReactElement): void |
| replace         | 替换目标平台元素。             | (id: string, element: React.ReactElement): void |
| replaceChildren | 替换目标平台元素的子元素。     | (id: string, element: React.ReactElement): void |
| replaceProps    | 替换目标元素的 props。         | (id: string, resetProps: object): void          |
| remove          | 移除目标平台元素。             | (id: string): void                              |
| insertBefore    | 向目标平台元素之前插入子元素。 | (id: string, element: React.ReactElement): void |
| insertAfter     | 向目标平台元素之后插入子元素。 | (id: string, element: React.ReactElement): void |

## 开源许可

react-customer 使用 MIT 许可证。
