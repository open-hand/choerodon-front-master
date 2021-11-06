import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useLocation, useHistory } from 'react-router-dom';
import { Tabs } from 'choerodon-ui';
import filter from 'lodash/filter';
import PageTab from '../PageTab';
import './index.less';
import { PageWrapperProps } from '../../interface';

const { TabPane } = Tabs;

export const Context = React.createContext({});

const prefixCls = 'page-wrap-tabs';

const PageWrap:React.FC<PageWrapperProps> = (props) => {
  const {
    children, noHeader, className, cache, onChange,
  } = props;

  const location = useLocation();

  const {
    pathname,
    search,
  } = location;

  const history = useHistory();

  if (!children) {
    throw new TypeError('PageWrap must accept children');
  }

  const keyShowArr:{
    route: string
    tabKey: string
    alwaysShow: boolean
  }[] = children && React.Children.map(children, (child) => {
    const {
      props: childProps,
    } = child;
    return {
      route: childProps.route,
      tabKey: childProps.tabKey,
      alwaysShow: childProps.alwaysShow,
    };
  });

  const [currentKey, setCurrentKey] = useState<string>('');

  const keyArr:string[] = React.Children.map(children, (child) => child.props.tabKey);

  const Children = React.Children.map(children, (child) => child);

  function loadMenu() {
    const activeKey = new URLSearchParams(search).get('activeKey');
    setCurrentKey(activeKey || `${keyArr[0]}`);
    const reloadCurrentKey = keyShowArr.find((menu) => menu?.route === pathname);
    reloadCurrentKey && setCurrentKey(reloadCurrentKey.tabKey);
  }

  useEffect(() => {
    loadMenu();
  }, [Children.length]);

  const callback = (key:string) => {
    if (cache) {
      setCurrentKey(key);
    } else {
      const realTabNode = keyShowArr.find((v) => v.tabKey === key);
      if (!!realTabNode && realTabNode.route) {
        history.push(`${realTabNode.route}${location.search}`);
      }
    }
    if (typeof onChange === 'function') {
      onChange(key);
    }
  };

  const tabCls = classNames(
    prefixCls,
    {
      [`${prefixCls}-hasHeader`]: !noHeader?.includes(currentKey),
    },
    className,
  );

  const renderTabs = () => Children.map((child:any) => {
    const { type, props: childProps } = child;
    if (type === PageTab) {
      const existRouteKeyArr = keyShowArr && filter(keyShowArr, 'route');
      const isExist = existRouteKeyArr.find((v) => v.tabKey === childProps.tabKey);
      if (isExist || childProps.alwaysShow) {
        return (
          <TabPane tab={childProps.title} key={childProps.tabKey}>
            {cache
              || (currentKey && currentKey.indexOf(childProps.tabKey) > -1)
              ? React.createElement(childProps.component, props)
              : null}
          </TabPane>
        );
      }
      return null;
    }
    return child;
  });

  return (
    <Context.Provider value={{ isTab: true }}>
      <Tabs
        className={tabCls}
        animated={false}
        onChange={callback}
        activeKey={currentKey}
      >
        {renderTabs()}
      </Tabs>
    </Context.Provider>
  );
};

export default PageWrap;
