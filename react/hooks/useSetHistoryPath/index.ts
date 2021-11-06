import { useMount } from 'ahooks';
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
    !historyPath && sessionStorage.setItem('historyPath', pathname + search);
  });
}

export default useSetHistoryPath;
