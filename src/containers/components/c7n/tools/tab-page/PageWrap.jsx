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

const PageWrap = ({ children, noHeader, className, ...props }) => {
  const keyArr = React.Children.map(children, child => child.props.tabKey);
  const [currentKey, setCurrentKey] = useState(keyArr[0]);
  const activeMenu = useRef(null);
  const parentMenu = useRef(null);

  function loadMenu() {
    const { location, AppState, MenuStore } = props;
    const { pathname } = location;
    MenuStore.loadMenuData().then((menus) => {
      MenuStore.treeReduce({ subMenus: menus }, (menu, parents) => {
        if (menu.route === pathname || pathname.indexOf(`${menu.route}/`) === 0) {
          activeMenu.current = menu;
          parentMenu.current = parents;
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
    setCurrentKey(key && key.split('/')[0]);
  }

  return (
    <Context.Provider value={{ isTab: true }}>
      <Tabs
        className={classNames('wrap-tabs', { hasHeader: !noHeader.includes(currentKey) }, className)}
        animated={false}
        onChange={callback}
      >
        {
          React.Children.map(children, (child) => {
            const { type } = child;
            if (type === PageTab) {
              if (
                (activeMenu.current
                && activeMenu.current.subMenus
                && activeMenu.current.subMenus.find(v => v.code === child.props.tabKey))
                || child.props.alawaysShow
              ) {
                return (
                  <TabPane
                    tab={child.props.title}
                    key={child.props.tabKey}
                  >
                    {React.createElement(child.props.component, props)}
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
