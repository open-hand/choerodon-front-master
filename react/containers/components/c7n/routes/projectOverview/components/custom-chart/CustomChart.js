import React, {
  useEffect, useCallback,
} from 'react';
import {
  Select, CheckBox, Spin,
} from 'choerodon-ui/pro';
import { observer, useForceUpdate } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import { get } from '@choerodon/inject';
import { useCustomChartStore } from './stores';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';

import EmptyPage from '../EmptyPage';

const CustomChart = observer(() => {
  const clsPrefix = 'c7n-project-overview-custom-chart';
  const {
    customData,
    loading,
    optionConfig,
  } = useCustomChartStore();
  const getOption = useCallback(() => ({
    textStyle: {
      fontSize: 12,
    },
    ...optionConfig,
  }), [optionConfig]);

  function render() {
    if (loading !== 'loading' && !optionConfig) {
      return <EmptyPage content="当前暂无数据" />;
    }
    return <Echart option={getOption()} style={{ height: '100%' }} />;

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
      />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Spin spinning={loading}>
          {render()}
        </Spin>
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default CustomChart;
