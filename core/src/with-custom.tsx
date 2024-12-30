import {
  ComponentType,
  forwardRef,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  useContext,
} from "react";
import { useCustomApi, useCustomWrap } from "./hooks";
import CustomContext from "./context";
import type { DefaultApi } from "./type";
import { createEmptyRef } from "./utils/ref";

export interface CustomProps<
  C extends DefaultApi = DefaultApi,
  T extends DefaultApi = DefaultApi
> {
  customApi: Partial<C>;
  exposeApi: (api: T) => void;
  wrap: (component: ReactElement) => ReactElement;
}

const withCustom = (() => {
  const componentMap: Record<string, ComponentType<any>> = {};
  return <C extends DefaultApi, T extends DefaultApi, K = {}, U = unknown>(
    id: string,
    WrappedComponent: ComponentType<
      PropsWithoutRef<CustomProps<C, T>> & RefAttributes<U> & PropsWithoutRef<K>
    >
  ) => {
    if (!componentMap[id]) {
      componentMap[id] = WrappedComponent;
    }
    if (componentMap[id] && componentMap[id] !== WrappedComponent) {
      console.warn(
        `The component with id {{${id}}} has already been registered with a different component. The new component will override the old one.`
      );
    }
    return forwardRef<U, K>((props, ref) => {
      const customApi = useCustomApi<C>(id);
      const ctx = useContext(CustomContext);

      const exposeApi = (api: T) => {
        if (!ctx.current.platformApis[id]) {
          ctx.current.platformApis[id] = createEmptyRef();
        }
        ctx.current.platformApis[id].current = api;
      };

      const wrap = useCustomWrap(id);

      return (
        <WrappedComponent
          {...props}
          customApi={customApi}
          exposeApi={exposeApi}
          wrap={wrap}
          ref={ref}
        />
      );
    });
  };
})();

export default withCustom;
