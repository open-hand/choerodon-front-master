import { useCallback } from 'react';
import { useMount } from 'ahooks';
import C7Nimg from '@/assets/images/c7n-fish.jpg';

/**
 * 为组件注入Notification授权的hook
 */
function useC7NNotification() {
  const spawnNotice = useCallback(() => {
    const opts = {
      body: '欢迎使用猪齿鱼效能平台！',
      icon: C7Nimg,
      timestamp: Math.floor(Date.now()),
      dir: 'ltr' as NotificationDirection,
    };
    const notification = new Notification('猪齿鱼效能平台', opts);
    setTimeout(() => {
      notification.close();
    }, 1500);
  }, []);

  const getNotificationPermission = useCallback(() => {
    if (!('Notification' in window)) {
      console.info('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          spawnNotice();
        }
      });
    }
  }, []);

  useMount(() => {
    getNotificationPermission();
  });

  return [];
}

export default useC7NNotification;
