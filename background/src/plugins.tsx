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
