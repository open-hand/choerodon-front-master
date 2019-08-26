import React, { useContext } from 'react';
import { Table, Button, Modal } from 'choerodon-ui/pro';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { Link } from 'react-router-dom';
import TabPage from '../../../../tools/tab-page/TabPage';
import Breadcrumb from '../../../../tools/tab-page/Breadcrumb';
import Content from '../../../../tools/page/Content';
import Header from '../../../../tools/page/Header';
import Action from '../../../../tools/action';
import Store from '../../stores';
import FormView from './FormView';

const { Column } = Table;
const { Item } = Bread;

const modalKey = Modal.key();
const modalStyle = {
  width: '3.8rem',
};
const actionStyle = {
  marginRight: '.1rem',
};

const Index = () => {
  const context = useContext(Store);
  const { versionDs } = context;

  async function handleOk() {
    try {
      if ((await versionDs.submit()) !== false) {
        versionDs.query();
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  function handleCancel() {
    const { current } = versionDs;
    if (current.status === 'add') {
      versionDs.remove(current);
    }
  }

  function handleCreateVersion() {
    versionDs.create();
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '创建版本',
      children: <FormView context={context} />,
      onOk: handleOk,
      onCancel: handleCancel,
      style: modalStyle,
    });
  }

  function renderAction() {
    const actionDatas = [
      { service: [], icon: '', text: '发布', action: () => {} },
      { service: [], icon: '', text: '归档', action: () => {} },
      { service: [], icon: '', text: '编辑', action: () => {} },
      { service: [], icon: '', text: '删除', action: () => {} },
    ];
    return <Action data={actionDatas} style={actionStyle} />;
  }

  return (
    <TabPage>
      <Header>
        <Button icon="playlist_add" color="primary" onClick={handleCreateVersion}>创建版本</Button>
      </Header>
      <Breadcrumb custom>
        <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
          <Link to="/applications">应用</Link>
        </Item>
        <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>查看应用</Item>
      </Breadcrumb>
      <Content>
        <Table dataSet={versionDs} queryBar="none">
          <Column name="name" />
          <Column renderer={renderAction} />
          <Column name="status" />
          <Column name="startTime" />
          <Column name="publishTime" />
          <Column name="description" />
        </Table>
      </Content>
    </TabPage>
  );
};

export default Index;
