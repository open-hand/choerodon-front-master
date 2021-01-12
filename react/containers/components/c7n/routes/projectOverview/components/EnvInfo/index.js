import React, { useState, memo, useEffect } from 'react';
import { Button, Icon, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';

import './index.less';

const EnvInfo = () => {
  const clsPrefix = 'c7n-project-overview-service-info';
  const {
    envDs,
  } = useProjectOverviewStore();

  const renderEnvironmentDetail = () => (
    <>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{envDs.current ? envDs.current.get('up') : 0}</span>
        <span>运行中环境</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{envDs.current ? envDs.current.get('down') : 0}</span>
        <span>未连接环境</span>
      </div>
    </>
  );
  return (
    <OverviewWrap>
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Icon type="settings_input_svideo" className={`${clsPrefix}-content-icon-env`} />
        <div className={`${clsPrefix}-content-group`}>
          {renderEnvironmentDetail()}
        </div>
      </OverviewWrap.Content>
    </OverviewWrap>

  );
};

export default observer(EnvInfo);
