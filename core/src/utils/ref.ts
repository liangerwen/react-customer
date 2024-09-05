export const createEmptyRef = (() => {
  const ref = { current: {} };
  return () => {
    ref.current = {};
    return ref;
  };
})();
