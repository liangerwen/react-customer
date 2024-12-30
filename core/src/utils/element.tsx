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

type OperateElement = (
  originElement: ReactElementWithChildren,
  targetNode: ReactNode
) => ReactNode;

type OperateProps = <P extends Partial<Record<string, any>> = {}>(
  originElement: ReactElementWithChildren,
  resetProps: P
) => ReactNode;

const appendBefore: OperateElement = (originElement, targetNode) => (
  <>
    {targetNode}
    {originElement}
  </>
);

const appendAfter: OperateElement = (originElement, targetNode) => (
  <>
    {originElement}
    {targetNode}
  </>
);

const replace: OperateElement = (_originElement, targetNode) => targetNode;

const replaceChildren: OperateElement = (originElement, targetNode) =>
  cloneElement(originElement, undefined, targetNode);

const replaceProps: OperateProps = (originElement, resetProps) => {
  const { "data-id": dataId, ...rest } = resetProps ?? {};
  return cloneElement(originElement, rest);
};

const remove: OperateElement = () => null;

const insertBefore: OperateElement = (originElement, targetNode) =>
  cloneElement(
    originElement,
    undefined,
    targetNode,
    originElement.props.children
  );

const insertAfter: OperateElement = (originElement, targetNode) =>
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
  replaceProps,
};

type MergeElement = (opt: {
  originNode: ReactNode;
  targetId: string;
  targetValue: any;
  operateType: keyof typeof operateMap;
}) => ReactNode;

type MergeUtils = Omit<
  {
    [P in keyof typeof operateMap]: (
      targetId: string,
      targetValue: Parameters<(typeof operateMap)[P]>[1]
    ) => void;
  },
  "replaceProps"
> & {
  replaceProps: <P extends Partial<Record<string, any>> = {}>(
    targetId: string,
    targetValue: P
  ) => void;
};

const mergeElement: MergeElement = ({
  originNode,
  targetId,
  targetValue,
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
        return operate(node, targetValue);
      }
      if (hasFindTarget) return node;
      return cloneElement(
        node,
        undefined,
        mergeElement({
          originNode: node.props.children,
          targetId,
          targetValue,
          operateType,
        })
      );
    }
    return node;
  });
};

const createElementWithUtils = ($element: MutableRefObject<ReactNode>) => {
  const utils = Object.keys(operateMap).reduce((acc, key) => {
    const operateType = key as keyof MergeUtils;
    acc[operateType] = (targetId: string, targetValue: any) => {
      $element.current = mergeElement({
        originNode: $element.current,
        targetId,
        targetValue,
        operateType,
      });
    };
    return acc;
  }, {} as MergeUtils);
  return utils;
};

export default createElementWithUtils;

export type ElementWithUtils = ReturnType<typeof createElementWithUtils>;
