import {
  ComponentProps,
  ComponentType,
  forwardRef,
  PropsWithRef,
  ReactNode,
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
  wrap: (component: ReactNode) => ReactNode;
}

type ComponentWithCustomProps<
  C extends DefaultApi,
  T extends DefaultApi,
  P extends CustomProps<C, T>
> = ComponentType<PropsWithRef<P & CustomProps<C, T>>>;

const withCustom = (() => {
  const componentMap: Record<string, ComponentType<any>> = {};
  return <
    C extends DefaultApi,
    T extends DefaultApi,
    P extends CustomProps<C, T>
  >(
    id: string,
    WrappedComponent: ComponentWithCustomProps<C, T, P>
  ): ComponentType<Omit<PropsWithRef<P>, keyof P>> => {
    if (!componentMap[id]) {
      componentMap[id] = WrappedComponent;
    }
    if (componentMap[id] && componentMap[id] !== WrappedComponent) {
      console.warn(
        `The component with id {{${id}}} has already been registered with a different component. The new component will override the old one.`
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return forwardRef((props, ref) => {
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
        // @ts-ignore
        <WrappedComponent
          {...(props as ComponentProps<typeof WrappedComponent>)}
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
