import React, { useContext } from 'react';
import { Table, Button, Modal } from 'choerodon-ui/pro';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { withRouter, Link } from 'react-router-dom';
import TabPage from '../../../../tools/tab-page/TabPage';
import Breadcrumb from '../../../../tools/tab-page/Breadcrumb';
import Content from '../../../../tools/page/Content';
import Header from '../../../../tools/page/Header';
import Store from '../../stores';
import FormView from './FormView';

const { Column } = Table;
const { Item } = Bread;

const modalKey = Modal.key();
const modalStyle = {
  width: '3.8rem',
};

const Index = () => {
  const context = useContext(Store);
  const { versionDs } = context;

  function handleCreateVersion() {
    versionDs.create();
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '创建版本',
      children: <FormView context={context} />,
      // onOk: handleOkEdit,
      // onCancel: handleCancel,
      style: modalStyle,
    });
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
        <Table dataSet={versionDs}>
          <Column name="name" />
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
