import {
  ComponentType,
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomContext from "./context";
import withDefineCustom from "./with-define-custom";

export type CustomProviderProps = PropsWithChildren<{
  plugins: ReturnType<typeof withDefineCustom>[];
}>;

const CustomProvider = ({ children, plugins }: CustomProviderProps) => {
  const [update, setUpdate] = useState({});
  const ref = useRef({
    elements: {},
    customApis: {},
    platformApis: {},
    customComponents: {},
  });

  const initPlugins = () => {
    ref.current.customComponents = plugins.reduce((acc, cur) => {
      const { id, Component } = cur;
      acc[id] = Component;
      return acc;
    }, {} as Record<string, ComponentType>);
    setUpdate({});
  };

  useLayoutEffect(() => {
    initPlugins();
  }, [plugins?.map((p) => p.id)?.join(",")]);

  const ctx = useMemo(
    () => ({ ...ref, flush: update, update: () => setUpdate({}) }),
    [update]
  );

  return (
    <CustomContext.Provider value={ctx}>{children}</CustomContext.Provider>
  );
};

export default CustomProvider;
