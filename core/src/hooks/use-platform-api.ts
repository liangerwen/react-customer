import { useContext } from "react";
import CustomContext from "../context";
import type { DefaultApi } from "../type";
import { createEmptyRef } from "../utils/ref";

const usePlatformApi = <T = DefaultApi>(id: string) => {
  const ctx = useContext(CustomContext);
  if (!ctx.current.platformApis[id]) {
    ctx.current.platformApis[id] = createEmptyRef();
  }
  return ctx.current.platformApis[id].current as T;
};

export default usePlatformApi;
