import {
  ComponentType,
  forwardRef,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import { usePlatformApi, useMergeElement } from "./hooks";
import type { DefaultApi } from "./type";

export interface CustomPluginProps<T = DefaultApi> {
  merge: ReturnType<typeof useMergeElement>;
  platformApi: Partial<T>;
}

const withDefineCustom = <T, U = unknown>(
  id: string,
  WrappedComponent: ComponentType<
    PropsWithoutRef<CustomPluginProps<T>> & RefAttributes<U>
  >
) => {
  const Component = forwardRef<U>((_, ref) => {
    const merge = useMergeElement(id);
    const platformApi = usePlatformApi<T>(id);
    return (
      <WrappedComponent merge={merge} platformApi={platformApi} ref={ref} />
    );
  });
  return {
    id,
    Component,
  };
};

export default withDefineCustom;
