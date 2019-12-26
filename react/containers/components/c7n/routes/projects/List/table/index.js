import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Avatar } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import queryString from 'query-string';
import Store from '../../stores';
import { Action } from '../../../../../../../index';
import EmptyProject from '../EmptyProject';

const { Column } = Table;

const actionStyle = {
  marginRight: 10,
};

const ListView = observer(({ handleClickProject, handleEditProject, handleEnabledProject }) => {
  const { dataSet, isNotRecent, HeaderStore, AppState, history } = useContext(Store);

  function filterRecent(record) {
    if (isNotRecent === 'all') {
      return true;
    } else if (isNotRecent === 'recent') {
      const recents = HeaderStore.getRecentItem;
      return !!recents.find(v => v.id === record.get('id'));
    } else {
      return record.get('createdBy') === AppState.getUserId;
    }
  }

  function renderName({ record }) {
    const { imageUrl, name, enabled, into } = record.toData();
    if (!into || !enabled) {
      return (
        <span>
          <Avatar src={imageUrl} size={16} style={{ marginRight: 8, fontSize: '12px', verticalAlign: 'top', marginTop: 10 }}>{name && name.charAt(0)}</Avatar>
          {name}
        </span>
      );
    }
    return (
      <span
        role="none"
        onClick={() => handleClickProject(record)}
        className="link"
      >
        <Avatar src={imageUrl} size={16} style={{ marginRight: 8, fontSize: '12px', verticalAlign: 'top', marginTop: 10 }}>{name && name.charAt(0)}</Avatar>
        {name}
      </span>
    );
  }

  function renderAction({ record }) {
    const { organizationId } = queryString.parse(history.location.search);
    const actionDatas = [
      { service: ['base-service.organization-project.update'], icon: '', text: '编辑', action: handleEditProject },
      { service: ['base-service.organization-project.disableProject', 'base-service.organization-project.enableProject'], icon: '', text: record.get('enabled') ? '停用' : '启用', action: handleEnabledProject },
    ];
    return <Action data={actionDatas} style={actionStyle} organizationId={organizationId} type="organization" />;
  }

  function renderEnabled({ record }) {
    if (record.status === 'add') return '';
    const enabled = record.get('enabled');
    return (
      <div className="project-status-wrap" style={{ background: enabled ? '#00bfa5' : '#d3d3d3' }}>
        <div className="word">{enabled ? '启用' : '停用'}</div>
      </div>
    );
  }

  const realData = dataSet.originalData.filter(r => filterRecent(r) && r.status !== 'add');

  if (realData.length === 0 && dataSet.status === 'ready' && Object.keys(dataSet.queryDataSet.current.toData()).filter((item) => item !== '__dirty').length === 0) {
    return <EmptyProject />;
  }

  return (
    <Table dataSet={dataSet} filter={filterRecent} className="c7n-projects-table" pristine>
      <Column name="name" renderer={renderName} />
      <Column renderer={renderAction} width={100} />
      <Column name="code" />
      <Column name="category" />
      <Column width={100} name="enabled" renderer={renderEnabled} align="left" />
      <Column name="createUserName" />
      <Column name="creationDate" />
    </Table>
  );
});

export default ListView;
