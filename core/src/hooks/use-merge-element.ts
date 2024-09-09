import { useContext, useCallback } from "react";
import createElementWithUtils, { ElementWithUtils } from "../utils/element";
import ElementContext from "../context";

const useMergeElement = (id: string) => {
  const ctx = useContext(ElementContext);
  return useCallback(
    (cb: (ele: ElementWithUtils) => void) => {
      const element = { current: ctx.current.elements[id] };
      const elementUtils = createElementWithUtils(element);
      cb(elementUtils);
      return element.current;
    },
    [id]
  );
};

export default useMergeElement;
