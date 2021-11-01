import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Tabs } from 'choerodon-ui';
import PageTab from './PageTab';
import './style/PageWrap.less';

const { TabPane } = Tabs;

export const Context = React.createContext({});

const PageWrap = ({
  children, noHeader, className, cache, ...props
}) => {
  const keyShowArr = React.Children.map(children, (child) => ({
    route: child.props.route,
    tabKey: child.props.tabKey,
    alwaysShow: child.props.alwaysShow,
  }));
  const keyArr = React.Children.map(children, (child) => child.props.tabKey);
  const Children = React.Children.map(children, (child) => child);
  const [currentKey, setCurrentKey] = useState(null);

  function loadMenu() {
    const { location } = props;
    const { pathname } = location;
    let activeKey;
    if (new URLSearchParams(window.location.hash.split('?')[1]).get('activeKey')) {
      activeKey = new URLSearchParams(window.location.hash.split('?')[1]).get('activeKey');
    }
    setCurrentKey(activeKey || `${keyArr[0]}`);
    keyShowArr.forEach((menu) => {
      if (menu.route === pathname) {
        setCurrentKey(`${menu.tabKey}`);
      }
    });
  }

  useEffect(() => {
    loadMenu();
  }, [Children.length]);

  const callback = (key) => {
    if (cache) {
      setCurrentKey(key);
    } else {
      const realCode = key;
      const realTabNode = keyShowArr.find((v) => v.tabKey === realCode);
      if (realTabNode && realTabNode.route) {
        props.history.push(`${realTabNode.route}${props.location.search}`);
      }
    }
    if (props.onChange) {
      props.onChange(key);
    }
  };

  return (
    <Context.Provider value={{ isTab: true }}>
      <Tabs
        className={classNames(
          'wrap-tabs',
          {
            hasHeader: !noHeader.includes(currentKey),
          },
          className,
        )}
        animated={false}
        onChange={callback}
        activeKey={currentKey}
      >
        {Children.map((child) => {
          const { type } = child;
          if (type === PageTab) {
            if (
              (keyShowArr && keyShowArr.filter((v) => v.route).find((v) => v.tabKey === child.props.tabKey))
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
            }
            return null;
          }
          return child;
        })}
      </Tabs>
    </Context.Provider>
  );
};

export default withRouter(observer(PageWrap));
