import { useContext, useCallback } from "react";
import createElementWithUtils, { ElementWithUtils } from "../utils/element";
import ElementContext from "../context";

const useMergeElement = (id: string) => {
  const ctx = useContext(ElementContext);
  return useCallback(
    (cb: (ele: ElementWithUtils) => void) => {
      const elementUtils = createElementWithUtils(ctx.current.elements[id]);
      cb(elementUtils);
      return elementUtils.$element.current;
    },
    [id]
  );
};

export default useMergeElement;
