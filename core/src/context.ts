import {
  ComponentType,
  createContext,
  MutableRefObject,
  PropsWithRef,
  ReactElement,
} from "react";
import type { DefaultApi } from "./type";

const CustomContext = createContext<
  MutableRefObject<{
    elements: Record<string, ReactElement>;
    customApis: Record<string, MutableRefObject<DefaultApi>>;
    platformApis: Record<string, MutableRefObject<DefaultApi>>;
    customComponents: Record<string, ComponentType<PropsWithRef<DefaultApi>>>;
  }> & { flush: object; update: () => void }
>({
  current: {
    elements: {},
    customApis: {},
    platformApis: {},
    customComponents: {},
  },
  flush: {},
  update: () => {},
});

export default CustomContext;
