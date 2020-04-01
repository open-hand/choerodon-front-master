import React, { useContext, useEffect, useRef, useCallback } from 'react';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import { Icon, Button, Modal as OldModal, Tooltip } from 'choerodon-ui';
import { Modal, Select, message } from 'choerodon-ui/pro';
import Store from './stores';
import List from './List';
import findFirstLeafMenu from '../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../common';
import FormView from './FormView';
import { Content, Page, axios, Permission } from '../../../../../index';
import { prompt } from '../../../../common';
import './style/index.less';

const { Option } = Select;
const modalKey = Modal.key();
const createModalKey = Modal.key();

const modalStyle = {
  width: '3.8rem',
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
    HeaderStore, MenuStore, history, AppState,
    projectStore,
    intl: { formatMessage },
  } = context;
  const recents = HeaderStore.getRecentItem;
  const { getCanCreate } = projectStore;
  const checkRecentIsEmpty = useCallback(({ dataSet: ds }) => {
    if (!ds.find(r => recents.find(v => v.id === r.get('id')))) {
      toggleRecent('all');
    } else {
      toggleRecent('recent');
    }
  }, [dataSet]);

  function filterRecent(record, type) {
    if (type === 'all') {
      return true;
    } else if (type === 'recent') {
      return !!recents.find(v => v.id === record.get('id'));
    } else {
      return record.get('createdBy') === AppState.getUserId;
    }
  }

  function realData(type) {
    return dataSet.filter(r => filterRecent(r, type));
  }

  useEffect(() => {
    dataSet.addEventListener('load', checkRecentIsEmpty);
  }, []);

  async function handleCreate() {
    const { currentMenuType: { organizationId } } = AppState;
    const { current } = dataSet;
    if (await current.validate() === true) {
      const { category, code, name, imageUrl } = current.toData();
      const data = {
        name,
        code,
        category,
        imageUrl,
      };
      const res = await axios.post(`/base/v1/organizations/${organizationId}/projects`, data);
      if (res.failed) {
        prompt(res.message);
        return false;
      } else {
        prompt('创建成功');
        HeaderStore.setRecentItem(res);
        dataSet.query();
        projectStore.checkCreate(organizationId);
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
      const { id, organizationId, enabled, name } = current.toData();
      if (enabled) {
        OldModal.confirm({
          className: 'c7n-iam-confirm-modal',
          title: '停用项目',
          content: `确定要停用项目"${name}"吗？停用后，您和项目下其他成员将无法进入此项目。`,
          onOk: async () => {
            try {
              const result = await axios.put(`/base/v1/organizations/${organizationId}/projects/${id}/disable`);
              if (result.failed) {
                throw result.message;
              }
              dataSet.query();
            } catch (err) {
              message.error(err);
              return false;
            }
          },
        });
      } else {
        try {
          const result = await axios.put(`/base/v1/organizations/${organizationId}/projects/${id}/enable`);
          if (result.failed) {
            throw result.message;
          }
        } catch (err) {
          message.error(err);
          return false;
        }
      }
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
        path += `&organizationId=${organizationId}`;
      }
      // }
      if (path) {
        historyPushMenu(history, path, domain);
      }
    });
  }

  function renderHeader() {
    const { organizationId } = queryString.parse(history.location.search);
    const org = (HeaderStore.getOrgData || []).find(v => String(v.id) === organizationId) || { name: '' };
    return (
      <div className="c7n-projects-header">
        <div className="c7n-projects-title">{`${org.name}中的项目`}</div>
        <Permission
          service={['base-service.organization-project.create']}
          type="organization"
          organizationId={organizationId}
        >
          <Tooltip
            title={getCanCreate ? '' : '项目数量已达上限，无法创建更多项目'}
            placement="bottom"
          >
            <Button
              type="primary"
              funcType="raised"
              disabled={!getCanCreate}
              onClick={handleCreateProject}
            >
              创建项目
            </Button>
          </Tooltip>
        </Permission>
      </div>
    );
  }

  function renderTool() {
    return (
      <div className="c7n-projects-tool">
        <Select labelLayout="float" label="项目" clearButton={false} value={isNotRecent} onChange={handleChangeRecent} style={{ width: 260 }}>
          {(realData('recent').length > 0 || dataSet.queryDataSet.length > 0) && <Option key="recent" value="recent">最近使用</Option>}
          <Option key="all" value="all">全部项目</Option>
          {(realData('mine').length > 0 || dataSet.queryDataSet.length > 0) && <Option key="mine" value="mine">我创建的</Option>}
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
