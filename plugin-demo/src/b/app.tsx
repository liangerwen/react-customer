import {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
  ReactElement,
} from "react";
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
            platformApi?.increase?.();
          }}
        >
          我是pluginB: {c}
        </button>
      );
    }) as ReactElement;
  }
);

export default AppPlugin;
