import React, { useRef, useEffect } from 'react';

function useLatest<T extends any>(current:T) {
  const storeValue = useRef(current);

  useEffect(() => {
    storeValue.current = current;
  });

  return storeValue;
}

export default useLatest;
