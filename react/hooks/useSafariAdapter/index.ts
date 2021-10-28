import { useLayoutEffect } from 'react';
import { isSafari } from 'react-device-detect';

function useSafariAdapter() {
  useLayoutEffect(() => {
    if (isSafari) {
      document.body.setAttribute('data-browser', ('safari'));
      import('@/styles/safari.less');
    }
  }, []);
}

export default useSafariAdapter;
