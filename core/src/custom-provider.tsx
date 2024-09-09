import {
  ComponentType,
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomContext from "./context";
import withDefineCustom, { CustomPluginProps } from "./with-define-custom";

export type Plugin = {
  name: string;
  component: ComponentType<CustomPluginProps>;
};

export type CustomProviderProps = PropsWithChildren<{
  plugins: Plugin[];
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
    const components: Record<string, ComponentType> = {};
    plugins.forEach(({ name, component }) => {
      components[name] = withDefineCustom(name, component);
    });
    ref.current.customComponents = components;
    setUpdate({});
  };

  useLayoutEffect(() => {
    initPlugins();
  }, [plugins?.map((p) => p.name)?.join(",")]);

  const ctx = useMemo(() => ({ ...ref, update }), [update]);

  return (
    <CustomContext.Provider value={ctx}>{children}</CustomContext.Provider>
  );
};

export default CustomProvider;
