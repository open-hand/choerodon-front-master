import { useLayoutEffect } from 'react';
import { isSafari } from 'react-device-detect';

/**
 * safari浏览器适配，导入针对safari的less文件
 *
 */
function useSafariAdapter() {
  useLayoutEffect(() => {
    if (isSafari) {
      document.body.setAttribute('data-browser', ('safari'));
      import('@/styles/safari.less');
    }
  }, []);
}

export default useSafariAdapter;
