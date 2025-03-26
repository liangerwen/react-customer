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
