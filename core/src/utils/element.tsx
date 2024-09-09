import {
  Children,
  cloneElement,
  isValidElement,
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

type PropsWithChildrenAndDataId = PropsWithChildren & { "data-id": string };

type ReactElementWithChildren = ReactElement<PropsWithChildrenAndDataId>;

type Operate = (
  originElement: ReactElementWithChildren,
  targetNode: ReactNode
) => ReactNode;

const appendBefore: Operate = (originElement, targetNode) => (
  <>
    {targetNode}
    {originElement}
  </>
);

const appendAfter: Operate = (originElement, targetNode) => (
  <>
    {originElement}
    {targetNode}
  </>
);

const replace: Operate = (_originElement, targetNode) => targetNode;

const replaceChildren: Operate = (originElement, targetNode) =>
  cloneElement(originElement, undefined, targetNode);

const remove: Operate = () => null;

const insertBefore: Operate = (originElement, targetNode) =>
  cloneElement(
    originElement,
    undefined,
    targetNode,
    originElement.props.children
  );

const insertAfter: Operate = (originElement, targetNode) =>
  cloneElement(
    originElement,
    undefined,
    originElement.props.children,
    targetNode
  );

const operateMap = {
  appendBefore,
  appendAfter,
  replace,
  replaceChildren,
  remove,
  insertBefore,
  insertAfter,
};

type MergeElement = (opt: {
  originNode: ReactNode;
  targetId: string;
  targetNode: ReactNode;
  operateType: keyof typeof operateMap;
}) => ReactNode;

const mergeElement: MergeElement = ({
  originNode,
  targetId,
  targetNode,
  operateType,
}) => {
  let hasFindTarget = false;
  return Children.map(originNode, (node) => {
    if (isValidElement<PropsWithChildrenAndDataId>(node)) {
      if (node.props["data-id"] === targetId) {
        hasFindTarget = true;
        const operate = operateMap[operateType];
        if (!operate) {
          console.error("operateType is not valid");
          return node;
        }
        return operate(node, targetNode);
      }
      if (hasFindTarget) return node;
      return cloneElement(
        node,
        undefined,
        mergeElement({
          originNode: node.props.children,
          targetId,
          targetNode,
          operateType,
        })
      );
    }
    return node;
  });
};

const createElementWithUtils = ($element: MutableRefObject<ReactNode>) => {
  const utils = Object.keys(operateMap).reduce((acc, key) => {
    const operateType = key as keyof typeof operateMap;
    acc[operateType] = (targetId, targetNode) => {
      $element.current = mergeElement({
        originNode: $element.current,
        targetId,
        targetNode,
        operateType,
      });
    };
    return acc;
  }, {} as Record<keyof typeof operateMap, (id: string, node: ReactNode) => void>);
  return utils;
};

export default createElementWithUtils;

export type ElementWithUtils = ReturnType<typeof createElementWithUtils>;
