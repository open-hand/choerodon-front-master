/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { Tooltip, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { get } from '@choerodon/inject';

import './index.less';

import { Loading } from '@choerodon/components';
import OverviewWrap from '../OverviewWrap';
import WaterWave from './components/WaterWave';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import normalToSvg from '../number-font';
import { useSprintWaterChartStore } from './stores';

const clsPrefix = 'c7n-project-overview-sprint-water-wave';

const SprintWaterWave = observer(() => {
  const { formatMessage } = useIntl();
  const {
    startedRecord,
    startSprintDs,
  } = useProjectOverviewStore();

  const {
    sprintWaterWaveDataSet,
  } = useSprintWaterChartStore();

  function render() {
    const { current } = sprintWaterWaveDataSet;
    if (current) {
      const remainingDays = current.get('remainingDays') || 0;
      const totalDays = current.get('totalDays') || 0;
      return (
        <>
          <div className={`${clsPrefix}-content-left`}>
            <WaterWave
              height={120}
              title={formatMessage({ id: 'agile.projectOverview.remainingTime' })}
              percent={totalDays && remainingDays > 0 ? (remainingDays / totalDays) * 100 : 0} // "totalDays": remainingDays
              percentRender={() => (
                <div className={`${clsPrefix}-percent`}>
                  {normalToSvg(current ? current.get('remainingDays') : '', 20)}
                  <span>天</span>
                </div>
              )}
            />
          </div>
          <ul className={`${clsPrefix}-content-right`}>
            <li>
              <label>{formatMessage({ id: 'agile.projectOverview.issueCount' })}</label>
              <span>
                {`${current.get('remainingIssueCount')}/${current.get('totalIssueCount')}`}
                (个)
              </span>
            </li>
            <li>
              <label>{formatMessage({ id: 'agile.projectOverview.storyPoints' })}</label>
              <span>
                {`${current.get('remainingStoryPoints')}/${current.get('totalStoryPoints')}`}
                (个)
              </span>
            </li>
            <li>
              <label>{formatMessage({ id: 'agile.projectOverview.remainingWorkingHours' })}</label>
              <span>
                {`${current.get('remainingEstimatedTime')}/${current.get('totalEstimatedTime')}`}
                (小时)
              </span>
            </li>
          </ul>
        </>
      );
    }
    if (startedRecord) {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;
    }
    return '';
  }
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.unfinishedWork' })}</span>
      <Tooltip title="统计当前迭代未完成的工作项数量、故事点数量、工时数量，以及当前迭代剩余天数。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
    </div>
  );

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default SprintWaterWave;
