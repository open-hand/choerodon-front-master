import { useEventListener, useSessionStorageState } from 'ahooks';
import { useCallback, useMemo } from 'react';
import moment from 'moment';

function useAutoRefresh(handleErrorCallback?:CallableFunction) {
  const [expireDate, setExpireDate] = useSessionStorageState('refresh.latest.time', '');

  const isExpired = useMemo(() => {
    const expireMoment = moment(expireDate, 'YYYY-MM-DD HH:mm:ss');
    return !expireDate || !expireMoment.isValid() || expireMoment.add('1', 'minute').diff(moment()) < 0;
  }, [expireDate]);

  const isJSError = useCallback((e:any) => String(e.target?.nodeName).toLocaleLowerCase() === 'script' && /.*?chunk.js/.test(e.target?.src), []);

  const isCSSError = useCallback((e:any) => String(e.target?.nodeName).toLocaleLowerCase() === 'link' && e.target?.type === 'text/css' && /.*?.css/.test(e.target?.href), []);

  const handleWindowErrorRefresh = (e:ErrorEvent) => {
    const sourceError = isJSError(e) || isCSSError(e);
    if (sourceError && isExpired) {
      setExpireDate(moment().format('YYYY-MM-DD HH:mm:ss'));
      window.location.reload();
      typeof handleErrorCallback === 'function' && handleErrorCallback();
    }
  };

  useEventListener('error', handleWindowErrorRefresh);
}

export default useAutoRefresh;
