import { useQueryString } from '@choerodon/components';

/**
 * 判断当前的路由是否存在fullPage字段，这里主要用在menu和header的显示上面
 * @return {*}
 */
const useIsFullPage = () => {
  const {
    fullPage,
  } = useQueryString();

  return !!fullPage;
};

export default useIsFullPage;
