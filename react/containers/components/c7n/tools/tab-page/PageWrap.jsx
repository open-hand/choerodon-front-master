import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Tabs } from 'choerodon-ui';
import PageTab from './PageTab';
import './style/PageWrap.less';

const { TabPane } = Tabs;

export const Context = React.createContext({});

const PageWrap = ({ children, noHeader, className, cache, ...props }) => {
  const keyShowArr = React.Children.map(children, child => ({
    route: child.props.route,
    tabKey: child.props.tabKey,
    alwaysShow: child.props.alwaysShow,
  }));
  const keyArr = React.Children.map(children, child => child.props.tabKey);
  const [currentKey, setCurrentKey] = useState(null);

  function loadMenu() {
    const { location } = props;
    const { pathname } = location;
    setCurrentKey(`${keyArr[0]}/.0`);
    keyShowArr.forEach((menu, index) => {
      if (menu.route === pathname) {
        setCurrentKey(`${menu.tabKey}/.${index}`);
      }
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
      const realTabNode = keyShowArr.find(v => v.tabKey === realCode);
      if (realTabNode && realTabNode.route) {
        props.history.push(`${realTabNode.route}${props.location.search}`);
      }
    }
  }

  return (
    <Context.Provider value={{ isTab: true }}>
      <Tabs
        className={classNames(
          'wrap-tabs',
          {
            hasHeader: !noHeader.includes(
              currentKey && currentKey.split('/')[0],
            ),
          },
          className,
        )}
        animated={false}
        onChange={callback}
        activeKey={currentKey}
      >
        {React.Children.map(children, child => {
          const { type } = child;
          if (type === PageTab) {
            if (
              (keyShowArr && keyShowArr.length > 0)
              || child.props.alwaysShow
            ) {
              return (
                <TabPane tab={child.props.title} key={child.props.tabKey}>
                  {cache
                  || (currentKey && currentKey.indexOf(child.props.tabKey) > -1)
                    ? React.createElement(child.props.component, props)
                    : null}
                </TabPane>
              );
            } else {
              return null;
            }
          } else {
            return child;
          }
        })}
      </Tabs>
    </Context.Provider>
  );
};

export default withRouter(observer(PageWrap));
