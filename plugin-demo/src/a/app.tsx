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

export default AppPlugin;
