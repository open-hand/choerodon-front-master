import { useState, useLayoutEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

function getTargetElement(
  target,
  defaultElement,
) {
  if (!target) {
    return defaultElement;
  }

  let targetElement;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
function useSize(target) {
  const [state, setState] = useState(() => {
    const el = getTargetElement(target);
    return {
      width: ((el || {})).clientWidth,
      height: ((el || {})).clientHeight,
    };
  });

  useLayoutEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setState({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [target]);

  return state;
}
export default useSize;
