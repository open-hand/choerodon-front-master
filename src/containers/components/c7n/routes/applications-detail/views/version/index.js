import React, { useContext } from 'react';
import { Table, Button, Modal } from 'choerodon-ui/pro';
import { Breadcrumb as Bread, Tag } from 'choerodon-ui';
import { Link } from 'react-router-dom';
import TabPage from '../../../../tools/tab-page/TabPage';
import Breadcrumb from '../../../../tools/tab-page/Breadcrumb';
import Content from '../../../../tools/page/Content';
import Header from '../../../../tools/page/Header';
import Action from '../../../../tools/action';
import axios from '../../../../tools/axios';
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
  const { versionDs, proId } = context;

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

  function handleOpenModal() {
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

  function handleCreateVersion() {
    versionDs.create();
    handleOpenModal();
  }

  async function handlePublish() {
    const record = versionDs.current;
    await axios.put(`/base/v1/projects/${proId}/applications/versions/publish/${record.get('id')}`);
    versionDs.query();
  }

  async function handleArchive() {
    const record = versionDs.current;
    await axios.put(`/base/v1/projects/${proId}/applications/versions/archive/${record.get('id')}`);
    versionDs.query();
  }

  function handleEdit() {
    handleOpenModal();
  }

  async function handleDelete() {
    const record = versionDs.current;
    await axios.delete(`/base/v1/projects/${proId}/applications/versions/${record.get('id')}`);
    versionDs.query();
  }

  function renderAction({ record }) {
    const status = record.get('statusCode');
    const actionDatas = [
      { service: [], icon: '', text: '发布', action: handlePublish },
      { service: [], icon: '', text: '归档', action: handleArchive },
      { service: [], icon: '', text: '编辑', action: handleEdit },
      { service: [], icon: '', text: '删除', action: handleDelete },
    ];
    if (status === 'archived') {
      actionDatas.splice(1, 1);
    }
    if (status === 'released') {
      actionDatas.splice(0, 1);
    }
    return <Action data={actionDatas} style={actionStyle} />;
  }

  function renderStatus({ record }) {
    const MAP = {
      version_planning: { title: '规划中', color: '#ffb100' },
      released: { title: '已发布', color: '#00bfa5' },
      archived: { title: '已归档', color: '#b2b2b2' },
    };
    const current = MAP[record.get('statusCode')];
    if (!current) return null;
    const { title, color } = current;
    return <Tag color={color}>{title}</Tag>;
  }

  return (
    <TabPage>
      <Header>
        <Button icon="playlist_add" color="primary" onClick={handleCreateVersion}>创建版本</Button>
      </Header>
      <Breadcrumb custom>
        <Item>
          <Link to="/applications">应用</Link>
        </Item>
        <Item>查看应用</Item>
      </Breadcrumb>
      <Content>
        <Table dataSet={versionDs} queryBar="none">
          <Column name="name" />
          <Column renderer={renderAction} />
          <Column name="statusCode" renderer={renderStatus} />
          <Column name="startDate" />
          <Column name="releaseDate" />
          <Column name="description" />
        </Table>
      </Content>
    </TabPage>
  );
};

export default Index;
