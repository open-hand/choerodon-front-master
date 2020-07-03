import React, { useState, memo, useEffect } from 'react';
import { Button, Icon, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';
import OverviewWrap from '../OverviewWrap';

const ServiceInfo = memo(({
  imageUrl,
  realName = '王王王',
  roles = ['admin', 'admin'],
}) => {
  const clsPrefix = 'c7n-project-overview-service-info';
  const [url, setUrl] = useState(0);
  const renderServiceDetail = () => (
    <React.Fragment>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{9}</span>
        <span>启用应用服务</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>10</span>
        <span>停用应用服务</span>
      </div>
    </React.Fragment>
  );
  const renderEnvironmentDetail = () => (
    <React.Fragment>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{28}</span>
        <span>运行中环境</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>11</span>
        <span>未连接环境</span>
      </div>
    </React.Fragment>
  );
  return (
    <div className="c7n-project-overview-service-info">
      <OverviewWrap width="50%" height={140} marginRight=".2rem">
        <OverviewWrap.Content className={`${clsPrefix}-content`}>
          <Icon type="dashboard" className={`${clsPrefix}-content-icon-service`} />
          <div className={`${clsPrefix}-content-group`}>
            {renderServiceDetail()}
          </div>
        </OverviewWrap.Content>
      </OverviewWrap>
      <OverviewWrap width="50%" height={140}>
        <OverviewWrap.Content className={`${clsPrefix}-content`}>
          <Icon type="settings_input_svideo" className={`${clsPrefix}-content-icon-env`} />
          <div className={`${clsPrefix}-content-group`}>
            {renderEnvironmentDetail()}
          </div>
        </OverviewWrap.Content>
      </OverviewWrap>
    </div>
  );
});

export default ServiceInfo;
