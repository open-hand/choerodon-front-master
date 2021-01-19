import React, { useState, memo, useEffect } from 'react';
import { Button, Icon, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';

import './index.less';

const ServiceInfo = () => {
  const clsPrefix = 'c7n-project-overview-service-info';
  const {
    appServiceDs,
  } = useProjectOverviewStore();

  const renderServiceDetail = () => (
    <>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{appServiceDs.current ? appServiceDs.current.get('up') : 0}</span>
        <span>启用应用服务</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{appServiceDs.current ? appServiceDs.current.get('down') : 0}</span>
        <span>停用应用服务</span>
      </div>
    </>
  );

  return (
    <OverviewWrap>
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Icon type="dashboard" className={`${clsPrefix}-content-icon-service`} />
        <div className={`${clsPrefix}-content-group`}>
          {renderServiceDetail()}
        </div>
      </OverviewWrap.Content>
    </OverviewWrap>
  );
};

export default observer(ServiceInfo);
