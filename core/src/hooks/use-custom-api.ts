import { MutableRefObject, useContext } from "react";
import CustomContext from "../context";
import { createEmptyRef } from "../utils/ref";

const useCustomApi = <T>(id: string) => {
  const ctx = useContext(CustomContext);
  return (ctx.current.customApis[id] ??
    createEmptyRef()) as MutableRefObject<T>;
};

export default useCustomApi;
