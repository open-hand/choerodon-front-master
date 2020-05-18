import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { Avatar } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import Store from '../../stores';
import { Action } from '../../../../../../../index';
import EmptyProject from '../../components/Empty';
import { HAS_AGILE_PRO } from '../../constant';
import axios from '../../../../tools/axios';

const { Column } = Table;

const actionStyle = {
  marginRight: 10,
};

const ListView = observer(({ handleClickProject, handleEditProject, handleEnabledProject }) => {
  const { dataSet } = useContext(Store);
  useEffect(() => {
    async function init() {
      await axios.get(`iam/v1/users/tenant-id?tenantId=${queryString.parse(history.location.search).organizationId}`)
      await dataSet.query();
    }
    init();
  }, [dataSet]);
  const { isNotRecent, HeaderStore, AppState, history } = useContext(Store);

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
          <Avatar src={imageUrl} size={18} style={{ marginRight: 8, fontSize: '12px', verticalAlign: 'top', marginTop: 6, background: 'rgba(104, 135, 232, 0.2)', border: '1px solid #6887E8', color: '#6887E8' }}>{name && name.charAt(0)}</Avatar>
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
        <Avatar src={imageUrl} size={18} style={{ marginRight: 8, fontSize: '12px', verticalAlign: 'top', marginTop: 6, background: 'rgba(104, 135, 232, 0.2)', border: '1px solid #6887E8', color: '#6887E8' }}>{name && name.charAt(0)}</Avatar>
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
    return <Action organizationId={organizationId} type="organization" data={actionDatas} style={actionStyle} />;
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

  const realData = dataSet.originalData.filter(r => filterRecent(r));

  if (realData.length === 0 && dataSet.status === 'ready' && dataSet.queryDataSet.current && Object.keys(dataSet.queryDataSet.current.toData()).filter((item) => item !== '__dirty').length === 0) {
    let description = '';
    if (isNotRecent === 'all') {
      description = '暂无可操作的项目';
    } else if (isNotRecent === 'recent') {
      description = '暂无“最近使用”项目';
    } else if (isNotRecent === 'mine') {
      description = '暂无“我创建的” 项目';
    }

    return <EmptyProject title="暂无项目" description={description} />;
  }

  return (
    <Table pristine dataSet={dataSet} filter={filterRecent} className="c7n-projects-table">
      <Column name="name" renderer={renderName} />
      <Column renderer={renderAction} width={100} />
      <Column name="code" />
      <Column name="category" />
      <Column name="enabled" renderer={renderEnabled} align="left" />
      {HAS_AGILE_PRO && <Column name="programName" />}
      <Column name="createUserName" />
      <Column name="creationDate" />
    </Table>
  );
});

export default ListView;
