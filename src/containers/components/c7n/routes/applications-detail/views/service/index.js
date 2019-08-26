import React, { useContext } from 'react';
import { Table } from 'choerodon-ui/pro';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { withRouter, Link } from 'react-router-dom';
import TabPage from '../../../../tools/tab-page/TabPage';
import Breadcrumb from '../../../../tools/tab-page/Breadcrumb';
import Content from '../../../../tools/page/Content';
import Store from '../../stores';

const { Column } = Table;
const { Item } = Bread;

const Index = () => {
  const { serviceDs } = useContext(Store);

  return (
    <TabPage>
      <Breadcrumb custom>
        <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
          <Link to="/applications">应用</Link>
        </Item>
        <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>查看应用</Item>
      </Breadcrumb>
      <Content>
        <Table dataSet={serviceDs}>
          <Column name="name" />
          <Column name="code" />
          <Column name="type" />
          <Column name="status" />
        </Table>
      </Content>
    </TabPage>
  );
};

export default Index;
