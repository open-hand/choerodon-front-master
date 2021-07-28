import React from 'react';
import { Card } from 'choerodon-ui';

import { StoreProvider } from './store';
import Layout from '../Layout';
import HostTable from './HostTable';
import ClusterTable from './ClusterTable';
import styles from './index.less';

const classNamePrefix = 'c7n-card-monitor';

const ResourceOverview = () => (
  <Layout title="资源池监控" className={styles[classNamePrefix]}>
    <Card title="主机" bordered={false} className={styles[`${classNamePrefix}-card`]}>
      <HostTable classNamePrefix={classNamePrefix} />
    </Card>
    <Card title="K8S集群" bordered={false} className={styles[`${classNamePrefix}-card`]}>
      <ClusterTable classNamePrefix={classNamePrefix} />
    </Card>
  </Layout>
);

const Index = () => (
  <StoreProvider>
    <ResourceOverview />
  </StoreProvider>
);

export default Index;
