import React, {
  useCallback,
} from 'react';
import {
  Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';

import Echart from 'echarts-for-react';
import { Loading } from '@zknow/components';
import { useCustomChartStore } from './stores';
import './index.less';
import OverviewWrap from '../OverviewWrap';
// E:\hand\agile615\agile-service\react\routes\ReportHost\custom-report\components\ChartSearch\index.ts
import EmptyPage from '../EmptyPage';
import ExternalComponent from '@/components/external-component';

// const ChartSearch =
// console.log('ChartSearch...', ChartSearch);
const CustomChart = observer(() => {
  const clsPrefix = 'c7n-project-overview-custom-chart';
  const {
    customData,
    loading, isHasData, searchId,
    optionConfig, searchProps,
  } = useCustomChartStore();
  const getOption = useCallback(() => ({
    textStyle: {
      fontSize: 12,
    },
    ...optionConfig,
  }), [optionConfig]);

  function render() {
    if (loading) {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (!optionConfig && !isHasData) {
      return <EmptyPage content="当前暂无数据" />;
    }
    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        {optionConfig ? <Echart option={getOption()} style={{ height: 'calc(100% - .5rem)' }} key={`echarts-${searchId}`} /> : <EmptyPage content="当前暂无数据" />}

      </div>
    );

    // return '';
  }

  const renderTitle = useCallback(() => (
    <div className={`${clsPrefix}-title`}>
      <span>{customData.name}</span>
    </div>
  ), [customData.name]);

  return (
    <OverviewWrap style={{
      paddingTop: '16px',
    }}
    >
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '2px 0 10px 4px',
        }}
      >
        <span className={`${clsPrefix}-search`}>
          <ExternalComponent
            system={{ scope: 'agile', module: 'agile:CustomChartSearch' }}
            {...searchProps}
          />
        </span>
      </OverviewWrap.Header>
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default CustomChart;
