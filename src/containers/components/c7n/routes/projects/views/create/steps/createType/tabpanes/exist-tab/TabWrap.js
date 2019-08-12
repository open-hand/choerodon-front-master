import React, { useContext, useEffect } from 'react';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { Icon, Button } from 'choerodon-ui';
import { Modal, Stores, Table, Select, TextField } from 'choerodon-ui/pro';
import Store from './stores';
import TabView from './TabView';
// import './style/index.less';

const { Option } = Select;

const iconStyle = {
  fontSize: '16px',
  marginLeft: '.11rem',
};

const ListView = observer((props) => {
  const {
    dataSet, AppState, showType, toggleShowType, isNotRecent, toggleRecent,
    HeaderStore, MenuStore, history, intl, filter, setFilter,
  } = useContext(Store);

  function changeData() {
    const proData = HeaderStore.getProData || [];
    dataSet.loadData(toJS(proData));
  }

  useEffect(() => {
    changeData();
  }, [isNotRecent]);

  // function handleClickProject(record) {
  //   // const record = dataSet.current;
  //   const { id, name, type, organizationId, category } = record.toData();
  //   MenuStore.loadMenuData({ type, id }, false).then((menus) => {
  //     let route;
  //     let path;
  //     let domain;
  //     if (menus.length) {
  //       const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
  //       route = menuRoute;
  //       domain = menuDomain;
  //     }
  //     // if (route) {
  //     path = `/?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
  //     if (organizationId) {
  //       path += `&organizationId=${organizationId}&orgId=${organizationId}`;
  //     }
  //     // }
  //     if (path) {
  //       historyPushMenu(history, path, domain);
  //     }
  //   });
  // }

  function handleSearch(value, oldValue) {
    if (value !== oldValue) {
      setFilter(value);
    }
  }

  function renderTool() {
    return (
      <div className="c7n-projects-tool">
        <TextField
          placeholder="请输入查询条件"
          prefix={<Icon type="search" />}
          style={{ width: '4.7rem' }}
          onChange={handleSearch}
        />
        <div className="c7n-projects-tool-icon-group">
          <Icon type="dashboard" style={iconStyle} className={showType === 'block' ? 'active' : null} onClick={() => toggleShowType('block')} />
          <Icon type="format_list_bulleted" style={iconStyle} className={showType === 'table' ? 'active' : null} onClick={() => toggleShowType('table')} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderTool()}
      <TabView
        {...props}
        // handleClickProject={handleClickProject}
      />
    </div>
  );
});

export default ListView;
