import React, { useState, memo, useEffect } from 'react';
import {
  Tooltip, Progress, Icon, Spin,
} from 'choerodon-ui/pro';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Echart from 'echarts-for-react';
import { reduce } from 'lodash';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';

import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';

import EmptyPage from '../EmptyPage';

const clsPrefix = 'c7n-project-overview-assignee-chart';
const SprintCount = observer(() => {
  const { assigneeChartDs, startSprintDs, startedRecord } = useProjectOverviewStore();
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>经办人分布</span>
      {/* <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip> */}
    </div>
  );

  function getOption() {
    const assigneeInfo = assigneeChartDs.toData();
    const data = assigneeInfo.map((v) => ({
      name: v.assigneeName,
      value: v.issueNum,
    }));
    const allCount = reduce(assigneeInfo, (sum, n) => sum + n.issueNum, 0);
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        textStyle: {
          color: '#000',
        },
        formatter(params) {
          const res = `${params.name}：${params.value} 个<br/>占比：
            ${((params.value / allCount).toFixed(2) * 100).toFixed(0)}%`;
          return res;
        },
        extraCssText:
          'box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2); border: 1px solid #ddd; border-radius: 0;',
      },
      series: [
        {
          color: ['#9665e2', '#f7667f', '#fad352', '#45a3fc', '#56ca77'],
          type: 'pie',
          radius: '70%',
          hoverAnimation: false,
          center: ['50%', '50%'],
          data,
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#fff',
            },
          },
        },
      ],
    };
    return option;
  }
  function render() {
    if (startedRecord) {
      return (
        <Spin dataSet={assigneeChartDs}>
          <OverviewWrap.Content className={`${clsPrefix}-content`}>
            <Echart option={getOption()} style={{ height: '100%' }} />
          </OverviewWrap.Content>
        </Spin>
      );
    } if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;
    }
    return <LoadingBar display />;
  }

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        titleMarginBottom={12}
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      {render()}
    </OverviewWrap>
  );
});

export default SprintCount;
