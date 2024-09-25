import {
  ComponentType,
  forwardRef,
  PropsWithRef,
} from "react";
import { usePlatformApi, useMergeElement } from "./hooks";
import type { DefaultApi } from "./type";

export interface CustomPluginProps<T = DefaultApi> {
  merge: ReturnType<typeof useMergeElement>;
  platformApi: Partial<T>;
}

const withDefineCustom = <T,>(
  id: string,
  WrappedComponent: ComponentType<T & CustomPluginProps>
): ComponentType<PropsWithRef<T>> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return forwardRef((props, ref) => {
    const merge = useMergeElement(id);
    const platformApi = usePlatformApi(id);
    return (
      <WrappedComponent
        {...(props as T)}
        merge={merge}
        platformApi={platformApi}
        ref={ref}
      />
    );
  });
};

export default withDefineCustom;
