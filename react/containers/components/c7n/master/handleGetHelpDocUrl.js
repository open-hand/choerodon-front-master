// 这里是helpDoc的
let activeMenuTimesDoc = 0;

const handleGetHelpDocUrl = (newProps, routeWithNoMenu, setDocUrl) => {
  const params = {};
  const pathname = newProps?.history?.location?.pathname;
  const item = pathname && routeWithNoMenu.find((i) => pathname.includes(i.route));
  // 如果当前路由匹配到了没有菜单的界面
  if (item) {
    params.menuCode = item.code;
    setDocUrl(params);
  } else {
    const { activeMenu } = newProps.MenuStore;
    if (activeMenu && window.location.hash.includes(activeMenu.route)) {
      activeMenuTimesDoc = 0;
      params.menuId = activeMenu.id;
      if (newProps.history.location.search.includes('activeKey')) {
        const paramsUrl = new URLSearchParams(newProps.history.location.search);
        params.tabCode = paramsUrl.get('activeKey');
      }
      setDocUrl(params);
    } else if (activeMenuTimesDoc < 3) {
      activeMenuTimesDoc += 1;
      setTimeout(() => {
        handleGetHelpDocUrl(newProps, routeWithNoMenu, setDocUrl);
      }, 500);
    } else {
      activeMenuTimesDoc = 0;
    }
  }
};

export default handleGetHelpDocUrl;
