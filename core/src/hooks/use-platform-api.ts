import { MutableRefObject, useContext } from "react";
import CustomContext from "../context";
import { createEmptyRef } from "../utils/ref";
import type { DefaultApi } from "../type";

const usePlatformApi = <T = DefaultApi>(id: string) => {
  const ctx = useContext(CustomContext);
  return (ctx.current.platformApis[id] ??
    createEmptyRef()) as MutableRefObject<T>;
};

export default usePlatformApi;
