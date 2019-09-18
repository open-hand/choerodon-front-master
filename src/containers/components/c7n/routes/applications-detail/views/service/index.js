import React, { useContext } from 'react';
import { Table } from 'choerodon-ui/pro';
import { Breadcrumb as Bread, Tag } from 'choerodon-ui';
import { Link } from 'react-router-dom';
import TabPage from '../../../../tools/tab-page/TabPage';
import Breadcrumb from '../../../../tools/tab-page/Breadcrumb';
import Content from '../../../../tools/page/Content';
import Store from '../../stores';

const { Column } = Table;
const { Item } = Bread;

const Index = () => {
  const { serviceDs } = useContext(Store);

  function renderType({ record }) {
    const MAP = {
      normal: '开发',
      test: '测试',
    };
    return MAP[record.get('type')];
  }

  function renderActive({ record }) {
    const active = record.get('active');
    return <Tag color={active ? '#00bf96' : '#d3d3d3'}>{active ? '开启' : '停用'}</Tag>;
  }

  return (
    <TabPage>
      <Breadcrumb custom>
        <Item>
          <Link to="/applications">应用</Link>
        </Item>
        <Item><span className="title">查看应用</span></Item>
      </Breadcrumb>
      <Content>
        <Table dataSet={serviceDs} queryBar="none">
          <Column name="name" />
          <Column name="code" />
          <Column name="type" renderer={renderType} />
          <Column name="active" renderer={renderActive} />
        </Table>
      </Content>
    </TabPage>
  );
};

export default Index;
