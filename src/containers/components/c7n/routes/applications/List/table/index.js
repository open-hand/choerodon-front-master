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

const ListView = observer(({ handleClickProject, handleEditProject }) => {
  const { dataSet, isNotRecent, HeaderStore } = useContext(Store);

  function renderName({ record }) {
    const { imageUrl, name } = record.toData();
    return (
      <React.Fragment>
        <a
          role="none"
          onClick={() => handleClickProject(record)}
        >
          <Avatar src={imageUrl} size={16} style={{ marginRight: 8, fontSize: '12px', verticalAlign: 'top', marginTop: 10 }}>{name && name.charAt(0)}</Avatar>
          {name}
        </a>
      </React.Fragment>
    );
  }

  function renderAction() {
    const actionDatas = [
      { service: [], icon: '', text: '编辑', action: handleEditProject },
    ];
    return <Action data={actionDatas} style={actionStyle} />;
  }

  function renderType({ record }) {
    return record.get('type') === 'custom' ? '新建' : '内置';
  }

  return (
    <Table dataSet={dataSet} queryBar="none">
      <Column name="name" renderer={renderName} />
      <Column renderer={renderAction} width={100} />
      <Column name="connect" />
      <Column name="code" />
      <Column name="type" renderer={renderType} />
      <Column name="creationDate" />
    </Table>
  );
});

export default ListView;
