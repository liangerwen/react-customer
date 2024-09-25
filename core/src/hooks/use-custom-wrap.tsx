import { useContext, ReactNode, useCallback } from "react";
import CustomContext from "../context";

const useCustomWrap = (id: string) => {
  const ctx = useContext(CustomContext);

  return useCallback(
    (element: ReactNode) => {
      if (!id) {
        return element;
      }
      const Plugin = ctx.current.customComponents[id];

      if (!Plugin) {
        return element;
      }
      ctx.current.elements[id] = element;
      return (
        <Plugin
          ref={(ref: any) => {
            Object.assign(ctx.current.customApis[id].current, ref ?? {});
          }}
        />
      );
    },
    [id, ctx.update]
  );
};

export default useCustomWrap;
