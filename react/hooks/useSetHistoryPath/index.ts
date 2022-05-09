import { useMount } from 'ahooks';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 初次渲染界面将当前path存入session
 */
function useSetHistoryPath() {
  const location = useLocation();
  const {
    pathname,
    search,
  } = location;
  // 历史路径
  const historyPath = sessionStorage.getItem('historyPath');

  useMount(() => {
    // 如果不存在历史地址则设置当前地址为跳转地址
    if (pathname !== '/dingTalkTransition') { // out 都不该作为historypath ?
      !historyPath && sessionStorage.setItem('historyPath', pathname + search);
    }
  });

  //   // 这块需要加上header那块的判断逻辑
  // useEffect(() => {
  //   if (!pathname.includes('unauthorized')) {
  //     sessionStorage.setItem('historyPath', pathname + search);
  //   }
  // }, [pathname, search]);
}

export default useSetHistoryPath;
