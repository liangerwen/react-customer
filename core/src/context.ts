import {
  ComponentType,
  createContext,
  MutableRefObject,
  PropsWithRef,
  ReactNode,
} from "react";
import type { DefaultApi } from "./type";

const CustomContext = createContext<
  MutableRefObject<{
    elements: Record<string, ReactNode>;
    customApis: Record<string, MutableRefObject<DefaultApi>>;
    platformApis: Record<string, MutableRefObject<DefaultApi>>;
    customComponents: Record<string, ComponentType<PropsWithRef<DefaultApi>>>;
  }> & { update: object }
>({
  current: {
    elements: {},
    customApis: {},
    platformApis: {},
    customComponents: {},
  },
  update: {},
});

export default CustomContext;
