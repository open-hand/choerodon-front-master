import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Avatar } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import Store from '../../stores';
import { Action } from '../../../../../../../index';

const { Column } = Table;

const actionStyle = {
  marginRight: 10,
};

const ListView = observer(({ handleClickProject, handleEditProject, handleEnabledProject }) => {
  const { dataSet, isNotRecent, HeaderStore, AppState, auto } = useContext(Store);

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
    const { imageUrl, name } = record.toData();
    if (!record.get('enabled')) {
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
    const actionDatas = [
      { service: [], icon: '', text: '编辑', action: handleEditProject },
      { service: [], icon: '', text: record.get('enabled') ? '停用' : '启用', action: handleEnabledProject },
    ];
    return <Action data={actionDatas} style={actionStyle} />;
  }

  function renderEnabled({ record }) {
    if (record.status === 'add') return '';
    return record.get('enabled') ? '启用' : '停用';
  }

  return (
    <Table dataSet={dataSet} filter={filterRecent} className="c7n-projects-table">
      <Column name="name" renderer={renderName} />
      <Column renderer={renderAction} width={100} />
      <Column name="code" />
      {/* <Column name="applicationName" /> */}
      <Column name="category" />
      <Column name="enabled" renderer={renderEnabled} />
      <Column name="programName" />
      <Column name="createUserName" />
      <Column name="creationDate" />
    </Table>
  );
});

export default ListView;
