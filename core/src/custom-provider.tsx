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

type Plugin = { name: string; component: ComponentType<CustomPluginProps> };

const CustomProvider = ({
  children,
  plugins,
}: PropsWithChildren<{
  plugins: Plugin[];
}>) => {
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
