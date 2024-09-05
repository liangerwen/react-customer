import { useContext, ReactNode, useRef, useCallback } from "react";
import CustomContext from "../context";

const useCustomWrap = (id: string) => {
  const ctx = useContext(CustomContext);
  const ref = useRef({});
  ctx.current.customApis[id] = ref;

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
      return <Plugin ref={ref} />;
    },
    [id, ctx.update]
  );
};

export default useCustomWrap;
