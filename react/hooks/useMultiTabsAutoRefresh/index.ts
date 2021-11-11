import { useEventListener, useLocalStorageState } from 'ahooks';

/**
 * 多tab访问猪齿鱼的时候监听localstorage中的relogin字段, 如果存在则刷新旧界面
 *
 * @return {*}
 */
function useMultiTabsAutoRefresh() {
  // relogin的逻辑，多tab之间刷新页面
  const [isRelogin, setReloginValue] = useLocalStorageState('relogin', false);

  /**
   * 其他tab页重新登录，刷新当前页面
   * @param {*} e {StorageEvent}
   */
  function handleStorageChange(e:StorageEvent) {
    if (e.key === 'relogin') {
      window.location.reload();
    }
  }

  useEventListener('storage', handleStorageChange, {
    once: true,
  });

  return [isRelogin, setReloginValue] as const;
}

export default useMultiTabsAutoRefresh;
