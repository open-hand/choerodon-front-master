import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import Store from './stores';
import List from './List';
import { historyPushMenu } from '../../../../common';
import FormView from './FormView';
import { Content, Page } from '../../../../../index';
import './style/index.less';

const modalKey = Modal.key();

const modalStyle = {
  width: '3.8rem',
};
const iconStyle = {
  fontSize: '16px',
  marginLeft: '.11rem',
};

const ListView = observer(() => {
  const context = useContext(Store);
  const { dataSet, showType, toggleShowType, history } = context;

  async function handleOkEdit() {
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
    current.reset();
  }

  function handleEditProject() {
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '编辑应用',
      children: <FormView context={context} />,
      onOk: handleOkEdit,
      onCancel: handleCancel,
      style: modalStyle,
    });
  }

  function handleClickProject(record) {
    const { id, organizationId } = record.toData();
    let path = `/applications/${id}/?type=organization`;
    if (organizationId) {
      path += `&organizationId=${organizationId}&orgId=${organizationId}`;
    }
    historyPushMenu(history, path);
  }

  function renderHeader() {
    return (
      <div className="c7n-projects-tool">
        <div className="c7n-projects-tool-name">应用</div>
        <div className="c7n-projects-tool-icon-group">
          <Icon type="dashboard" style={iconStyle} className={showType === 'block' ? 'active' : null} onClick={() => toggleShowType('block')} />
          <Icon type="format_list_bulleted" style={iconStyle} className={showType === 'table' ? 'active' : null} onClick={() => toggleShowType('table')} />
        </div>
      </div>
    );
  }

  return (
    <Page>
      <Content>
        {renderHeader()}
        <List
          handleClickProject={handleClickProject}
          handleEditProject={handleEditProject}
        />
      </Content>
    </Page>
  );
});

export default ListView;
