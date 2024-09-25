import { useContext } from "react";
import CustomContext from "../context";
import { createEmptyRef } from "../utils/ref";

const useCustomApi = <T>(id: string) => {
  const ctx = useContext(CustomContext);
  if (!ctx.current.customApis[id]) {
    ctx.current.customApis[id] = createEmptyRef();
  }
  return ctx.current.customApis[id].current as T;
};

export default useCustomApi;
