import { useCallback } from 'react';
import { useMount } from 'ahooks';

/**
 * 为组件注入Notification授权的hook
 */
function useC7NNotification() {
  const getNotificationPermission = useCallback(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useMount(() => {
    getNotificationPermission();
  });
}

export default useC7NNotification;
