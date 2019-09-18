import React, { useContext, useEffect, useRef, useCallback } from 'react';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { Icon, Button } from 'choerodon-ui';
import { Modal, Table, Select } from 'choerodon-ui/pro';
import Store from './stores';
import List from './List';
import findFirstLeafMenu from '../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../common';
import FormView from './FormView';
import CreateView from './views/create';
import { Content, Page, axios } from '../../../../../index';
import { prompt } from '../../../../common';
import './style/index.less';


import Breadcrumb from '../../tools/tab-page/Breadcrumb';

const { Option } = Select;
const modalKey = Modal.key();
const createModalKey = Modal.key();

const modalStyle = {
  width: '3.8rem',
};
const largeModalStyle = {
  width: 'calc(100% - 3.5rem)',
};
const iconStyle = {
  fontSize: '16px',
  marginLeft: '.11rem',
};

const ListView = observer(() => {
  const context = useContext(Store);
  const cancelCreate = useRef(false);
  const {
    dataSet, showType, toggleShowType, isNotRecent, toggleRecent, setAuto,
    HeaderStore, MenuStore, history, intl, AppState,
  } = context;

  const checkRecentIsEmpty = useCallback(({ dataSet: ds }) => {
    const recents = HeaderStore.getRecentItem;
    if (!ds.find(r => recents.find(v => v.id === r.get('id')))) {
      toggleRecent('all');
    }
  }, [dataSet]);

  useEffect(() => {
    dataSet.addEventListener('load', checkRecentIsEmpty);
  }, []);

  async function handleCreate() {
    const { currentMenuType: { orgId } } = AppState;
    const { current } = dataSet;
    if (await current.validate() === true) {
      const { category, code, name } = current.toData();
      const data = {
        name,
        code,
        category,
      };
      const res = await axios.post(`/base/v1/organizations/${orgId}/projects`, data);
      if (res.failed) {
        prompt(res.message);
        return false;
      } else {
        prompt('创建成功');
        dataSet.query();
        return true;
      }
    }
  }

  async function handleOkEdit() {
    if (dataSet.current.status === 'add') {
      return (await handleCreate() === true);
    } else {
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
  }

  function handleCancel() {
    const { current } = dataSet;
    current.reset();
  }

  function handleCancelCreate() {
    cancelCreate.current = true;
  }

  function handleRomove() {
    if (!cancelCreate.current) {
      return;
    }
    const { current } = dataSet;
    if (current.status === 'add') {
      dataSet.remove(current);
    } else {
      current.reset();
    }
    cancelCreate.current = false;
  }

  function handleCreateProject() {
    dataSet.create();
    Modal.open({
      key: createModalKey,
      drawer: true,
      title: '创建项目',
      className: 'c7n-projects-modal-create-project',
      children: <FormView context={context} />,
      onOk: handleOkEdit,
      onCancel: handleCancelCreate,
      afterClose: handleRomove,
      style: modalStyle,
    });
  }

  function handleEditProject() {
    // dataSet.create();
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '项目设置',
      children: <FormView context={context} />,
      onOk: handleOkEdit,
      onCancel: handleCancel,
      style: modalStyle,
    });
  }

  async function handleEnabledProject() {
    const { current } = dataSet;
    try {
      const { id, organizationId, enabled } = current.toData();
      await axios.put(`/base/v1/organizations/${organizationId}/projects/${id}/${enabled ? 'disable' : 'enable'}`);
      dataSet.query();
    } catch (e) {
      return false;
    }
  }

  function handleChangeRecent(value) {
    setAuto(false);
    toggleRecent(value);
  }

  function handleClickProject(record) {
    // const record = dataSet.current;
    const { id, name, organizationId, category } = record.toData();
    const type = 'project';
    HeaderStore.setRecentItem(record.toData());
    MenuStore.loadMenuData({ type, id }, false).then((menus) => {
      let route = '';
      let path;
      let domain;
      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        route = menuRoute;
        domain = menuDomain;
      }
      // if (route) {
      path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
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
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === orgId) || { name: '' };
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
        <Select labelLayout="float" label="项目" clearButton={false} value={isNotRecent} onChange={handleChangeRecent}>
          <Option key="recent" value="recent">最近使用</Option>
          <Option key="all" value="all">全部项目</Option>
          <Option key="mine" value="mine">我创建的项目</Option>
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
          handleEnabledProject={handleEnabledProject}
        />
      </Content>
    </Page>
  );
});

export default ListView;
