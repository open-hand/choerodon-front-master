import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import queryString from 'query-string';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { toJS } from 'mobx';
import { Icon, Button } from 'choerodon-ui';
import { Modal, Stores, Table, Select } from 'choerodon-ui/pro';
import { HEADER_TITLE_NAME } from '@choerodon/boot/lib/containers/common/constants';
import Store from './stores';
import List from './List';
import findFirstLeafMenu from '../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../common';
import FormView from './FormView';
import CreateView from './views/create';
import { Action, Content, Header, Page, Permission, Breadcrumb } from '../../../../../index';
import './style/index.less';

const { Column } = Table;
const { Option } = Select;
const modalKey = Modal.key();
const createModalKey = Modal.key();

const modalStyle = {
  width: '3.8rem',
};
const largeModalStyle = {
  width: 'calc(100% - 3.5rem)',
};
const contentStyle = {
  width: 512,
  padding: 0,
  overflowX: 'hidden',
};
const actionStyle = {
  marginRight: 10,
};
const iconStyle = {
  fontSize: '16px',
  marginLeft: '.11rem',
};

const ListView = observer(() => {
  const context = useContext(Store);
  const {
    dataSet, AppState, showType, toggleShowType, isNotRecent, toggleRecent,
    HeaderStore, MenuStore, history, intl,
  } = context;

  function changeData() {
    const { orgId } = queryString.parse(history.location.search);
    let proData;
    if (isNotRecent) {
      proData = HeaderStore.getProData || [];
    } else {
      proData = HeaderStore.getRecentItem || [];
    }
    const pros = proData.filter(v => String(v.organizationId) === orgId);
    dataSet.loadData(toJS(pros));
  }

  useEffect(() => {
    changeData();
  }, [isNotRecent]);

  async function handleCreate() {
    try {
      if ((await dataSet.submit()) !== false) {
        dataSet.query();
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  function handleCancel() {
    const { current } = dataSet;
    if (current.status === 'add') {
      dataSet.remove(current);
    } else {
      current.reset();
    }
  }

  function handleCreateProject() {
    dataSet.create();
    Modal.open({
      key: createModalKey,
      drawer: true,
      title: '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: <CreateView context={context} handleCancelCreateProject={handleCancel} />,
      footer: null,
      style: largeModalStyle,
    });
  }

  function handleEditProject() {
    // dataSet.create();
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '创建项目',
      children: <FormView context={context} />,
      // onOk: handleCreate,
      onCancel: handleCancel,
      style: modalStyle,
    });
  }

  function handleChangeRecent(value) {
    toggleRecent(value === 'all');
  }

  function handleClickProject(record) {
    // const record = dataSet.current;
    const { id, name, type, organizationId, category } = record.toData();
    MenuStore.loadMenuData({ type, id }, false).then((menus) => {
      let route;
      let path;
      let domain;
      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        route = menuRoute;
        domain = menuDomain;
      }
      // if (route) {
      path = `/?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
      if (organizationId) {
        path += `&organizationId=${organizationId}&orgId=${organizationId}`;
      }
      // }
      if (path) {
        historyPushMenu(history, path, domain);
      }
    });
  }

  function renderHeader() {
    const { orgId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === orgId) || {};
    return (
      <div className="c7n-projects-header">
        <div className="c7n-projects-title">{`${org.name}中的项目`}</div>
        <Button type="primary" funcType="raised" onClick={handleCreateProject}>创建项目</Button>
      </div>
    );
  }

  function renderTool() {
    return (
      <div className="c7n-projects-tool">
        <Select labelLayout="float" label="项目" clearButton={false} value={isNotRecent ? 'all' : 'recent'} onChange={handleChangeRecent}>
          <Option key="recent" value="recent">最近使用</Option>
          <Option key="all" value="all">全部项目</Option>
        </Select>
        <div className="c7n-projects-tool-icon-group">
          <Icon type="dashboard" style={iconStyle} className={showType === 'block' ? 'active' : null} onClick={() => toggleShowType('block')} />
          <Icon type="format_list_bulleted" style={iconStyle} className={showType === 'table' ? 'active' : null} onClick={() => toggleShowType('table')} />
        </div>
      </div>
    );
  }

  return (
    <Page>
      {renderHeader()}
      <Content>
        {renderTool()}
        <List
          handleClickProject={handleClickProject}
          handleEditProject={handleEditProject}
        />
      </Content>
    </Page>
  );
});

export default ListView;
