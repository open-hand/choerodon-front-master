import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useEnvChartStore } from './stores';

import './index.less';

const EnvInfo = () => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-service-info';
  const {
    envDs,
  } = useEnvChartStore();

  const renderEnvironmentDetail = () => (
    <>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{envDs.current ? envDs.current.get('up') : 0}</span>
        <span>{formatMessage({ id: 'agile.projectOverview.runningEnvironment' })}</span>
      </div>
      <div className={`${clsPrefix}-content-group-item`}>
        <span>{envDs.current ? envDs.current.get('down') : 0}</span>
        <span>{formatMessage({ id: 'agile.projectOverview.disconnected.environment' })}</span>
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
