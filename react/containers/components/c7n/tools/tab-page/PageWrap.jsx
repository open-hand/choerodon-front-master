import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Tabs } from 'choerodon-ui';
import PageTab from './PageTab';
import './style/PageWrap.less';

const { TabPane } = Tabs;

export const Context = React.createContext({});

const PageWrap = ({ children, noHeader, className, cache, ...props }) => {
  const keyShowArr = React.Children.map(children, child => ({
    tabKey: child.props.tabKey,
    alwaysShow: child.props.alwaysShow,
  }));
  const keyArr = React.Children.map(children, child => child.props.tabKey);
  const [currentKey, setCurrentKey] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [parentMenu, setParentMenu] = useState(null);

  function loadMenu() {
    const { location, AppState, MenuStore } = props;
    const { pathname } = location;
    setCurrentKey(`${keyArr[0]}/.0`);
    MenuStore.loadMenuData().then((menus) => {
      MenuStore.treeReduce({ subMenus: menus }, (menu, parents) => {
        if ((menu.route === pathname || pathname.indexOf(`${menu.route}/`) === 0) && menu.type === 'tab') {
          setActiveMenu(menu);
          const parentMenuNode = parents && parents.length ? parents[parents.length - 1] : null;
          setParentMenu(parentMenuNode);
          const realIndex = keyShowArr.findIndex(v => v.tabKey === menu.code);
          setCurrentKey(`${menu.code}/.${realIndex}`);
          return true;
        }
        return false;
      });
    });
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function callback(key) {
    if (cache) {
      setCurrentKey(key);
    } else {
      const realCode = key && key.split('/')[0];
      const realTabNode = parentMenu.subMenus.find(v => v.code === realCode);
      if (realTabNode && realTabNode.route) {
        props.history.push(`${realTabNode.route}${props.location.search}`);
      }
    }
  }

  return (
    <Context.Provider value={{ isTab: true }}>
      <Tabs
        className={classNames('wrap-tabs', { hasHeader: !noHeader.includes(currentKey && currentKey.split('/')[0]) }, className)}
        animated={false}
        onChange={callback}
        activeKey={currentKey}
      >
        {
          React.Children.map(children, (child) => {
            const { type } = child;
            if (type === PageTab) {
              if (
                (parentMenu
                && parentMenu.subMenus
                && parentMenu.subMenus.find(v => v.code === child.props.tabKey))
                || child.props.alwaysShow
              ) {
                return (
                  <TabPane
                    tab={child.props.title}
                    key={child.props.tabKey}
                  >
                    {cache || (currentKey && currentKey.indexOf(child.props.tabKey) > -1) ? React.createElement(child.props.component, props) : null}
                  </TabPane>
                );
              } else {
                return null;
              }
            } else {
              return child;
            }
          })
        }
      </Tabs>
    </Context.Provider>
  );
};

export default withRouter(inject('AppState', 'MenuStore')(observer(PageWrap)));
