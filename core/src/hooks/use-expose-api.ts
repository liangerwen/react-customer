import { useContext } from "react";
import CustomContext from "../context";
import type { DefaultApi } from "../type";
import { createEmptyRef } from "../utils/ref";

const useExposeApi = <T extends DefaultApi>(
  id: string,
  apis: T
) => {
  const ctx = useContext(CustomContext);
  if (!ctx.current.platformApis[id]) {
    ctx.current.platformApis[id] = createEmptyRef();
  }
  ctx.current.platformApis[id].current = apis;
};

export default useExposeApi;
