import React, { useState, memo, useEffect } from 'react';
import { Button, Icon, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useServiceChartStore } from './stores';

import './index.less';

const ServiceInfo = () => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-service-info';
  const {
    appServiceDs,
  } = useServiceChartStore();

  const renderServiceDetail = () => (
    <>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{appServiceDs.current ? appServiceDs.current.get('up') : 0}</span>
        <span>{formatMessage({ id: 'agile.projectOverview.enabledApplicationServices' })}</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{appServiceDs.current ? appServiceDs.current.get('down') : 0}</span>
        <span>{formatMessage({ id: 'agile.projectOverview.disabledApplicationServices' })}</span>
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
