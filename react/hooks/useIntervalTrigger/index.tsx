/* eslint-disable max-len */
import React, { useEffect, useCallback } from 'react';
import useLatest from '../useLatest';

export type IntervalTriggerOpts = {
  autoStart?: boolean,
  immediate?: boolean,
  afterClearTimer?:(...args:any[])=>any;
}

function useIntervalTrigger(handler: CallableFunction, timer: number, options?: IntervalTriggerOpts) {
  const {
    autoStart = false,
    immediate = false,
    afterClearTimer,
  } = options || {};

  const intervalRef = React.useRef<ReturnType<typeof setInterval>>();

  // 这里能保证handler是最新的，防止闭包的情况出现，因为hanlder倘若从组件中读取某个值，以这个值为基准做后续操作，就会不生效
  const cacheHandlerRef = useLatest(handler);

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    return clearTimer;
  }, []);

  const clearTimer = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
    typeof afterClearTimer === 'function' && afterClearTimer();
  }, []);

  const startTimer = useCallback((...props:any[]) => {
    immediate && cacheHandlerRef.current?.(clearTimer, true);
    clearTimer();
    intervalRef.current = setInterval(() => {
      cacheHandlerRef.current?.(clearTimer, false);
    }, timer);
  }, [clearTimer]);

  return [startTimer, clearTimer] as const;
}

export default useIntervalTrigger;
