import React, {
  useState, memo, useEffect, useRef,
} from 'react';
import {
  Button, Tooltip, Select, Icon, Form,
} from 'choerodon-ui/pro';
import { debounce, toLength } from 'lodash';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';

import { Loading } from '@zknow/components';
import OverviewWrap from '../OverviewWrap';
import DateTable from './components/DateTable';
import { useWorkloadStore } from './stores';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import './index.less';
import useSize from './useSize';

const { Option } = Select;
const showIcons = [
  {
    icon: 'agile_task',
    colour: '#4d90fe',
    typeCode: 'taskCount',
    label: '任务：',
  },
  {
    icon: 'agile_story',
    colour: '#00bfa5',
    typeCode: 'story',
    label: '故事：',
  },
  {
    icon: 'agile_fault',
    colour: '#f44336',
    typeCode: 'bugFixCount',
    label: '解决缺陷：',
  },
  {
    icon: 'agile_fault',
    colour: '#f44336',
    typeCode: 'bugCreatedCount',
    label: '提出缺陷：',
  },

  {
    icon: 'watch_later-o',
    colour: 'rgba(255, 185, 106, 1)',
    typeCode: 'workTime',
    label: '工时：',
  },
];

const Workload = observer(() => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-workload';
  const [selectOption, setSelectOption] = useState([]);
  const { workloadStore } = useWorkloadStore();
  const containerRef = useRef();
  const [rowSize, setRowSize] = useState({ length: 3, height: 135 });
  const containerSize = useSize(containerRef);
  const { startedRecord, startSprintDs } = useProjectOverviewStore();
  const TimeIcon = () => (
    <div className={`${clsPrefix}-icon-workTime`}>
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect rx="3" id="svg_1" height="14.75" width="15.124999" y="0.181641" x="-0.0625" />
          <ellipse ry="4.499996" rx="4.750006" id="svg_4" cy="7.5" cx="7.5" />
          <line id="svg_9" y2="8.119141" x2="7.4375" y1="4.681634" x1="7.187501" />
          <line id="svg_12" y2="8.931641" x2="10.437501" y1="7.806641" x1="7.062501" />
        </g>
      </svg>
    </div>
  );

  const handleChangeSelect = (value) => {
    if (value) {
      setSelectOption(value);
    } else {
      setSelectOption([]);
    }
  };
  /**
   * 检查数据是否是空数据
   * @param {*} data
   * @param {*} exceptKey
   */
  function checkIsNullData(data, exceptKey) {
    if (!data) {
      return true;
    }
    delete data[exceptKey];
    const values = Object.values(data);
    return values.length === 0 || values.reduce((sum, c) => sum + c) === 0;
  }
  const renderCell = (data) => {
    if (!checkIsNullData(data, 'worker')) {
      return (
        <div className={`${clsPrefix}-cell`}>
          {showIcons.map((item) => (
            <div className={`${clsPrefix}-cell-item`}>
              {item.typeCode !== 'workTime' ? (
                <Icon
                  type={item.icon}
                  className={`${clsPrefix}-cell-item-icon`}
                  style={{
                    color: item.colour,
                  }}
                />
              ) : <TimeIcon />}
              {item.typeCode !== 'story' ? `${item.label}${data[item.typeCode] || 0}` : `${item.label}${data.storyCount || 0}（${data.storyPointCount || 0}点）`}
            </div>
          ))}

        </div>
      );
    }
    return '';
  };
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.workload.per.member.per.day' })}</span>
      <Tooltip placement="topLeft" arrowPointAtCenter title="统计当前迭代内团队成员每天完成的任务数，完成的故事数量及其对应故事点数量，提出的缺陷数量，解决的缺陷数量，当天工作记录的总工时。">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
      {// 若冲刺数据已加载完成 但工作量无数据则不显示
        startSprintDs.status !== 'loading' && workloadStore.getData ? (
          <Tooltip title={selectOption.map((option) => workloadStore.getAssignee[option]).join('，')} placement="top">
            <div className="c7n-pro-form-float" style={{ marginLeft: 24 }}>
              <Select
                multiple
                label={formatMessage({ id: 'agile.projectOverview.searchAssignees' })}
                // placeholder={formatMessage({ id: 'agile.projectOverview.searchAssignees' })}
                clearButton
                maxTagCount={5}
                style={{
                  width: 'auto',
                }}
                labelLayout="float"
                popupCls="c7n-project-overview-assignee"
                popupStyle={{ minWidth: '2rem' }}
                onChange={handleChangeSelect}
              >
                {workloadStore.getAssignee ? workloadStore.getAssignee.map((item, index) => <Option value={index}>{item}</Option>) : ''}
              </Select>
            </div>

          </Tooltip>

        ) : ''
      }

    </div>
  );

  useEffect(() => {
    const handleResetRowSize = debounce(() => {
      let newCellSizeHeight = 135;
      let newRowSizeLength = 3;
      const initRowSizeHeight = 136; // 初始时实际一行高度
      const dateTableHeaderHeight = 58; // 表格头部
      const containerHeaderHeight = 62; // 容器头部（标题）
      const containerPaddingHeight = 40; // 上下padding
      let dateTableContentMaxHeight = containerSize.height - containerPaddingHeight - containerHeaderHeight - dateTableHeaderHeight;
      dateTableContentMaxHeight -= initRowSizeHeight;// 预留一行总和， 减去总和这一行高度
      newRowSizeLength = Math.floor(dateTableContentMaxHeight / initRowSizeHeight) || 1;
      dateTableContentMaxHeight -= initRowSizeHeight * newRowSizeLength; // 减去所有展示行的高度
      newCellSizeHeight += Math.floor((dateTableContentMaxHeight || 0) / (newRowSizeLength + 1));
      setRowSize({ height: newCellSizeHeight, length: newRowSizeLength });
    }, 560);
    handleResetRowSize();
  }, [containerSize]);
  function render() {
    if (startedRecord) {
      if (workloadStore.getData) {
        return (
          workloadStore.getData.size > 0
            ? (
              <DateTable
                cellHeight={rowSize.height}
                current={workloadStore.getData.size > 7 ? workloadStore.getData.size - 7 : 0}
                quickMapData={workloadStore.getData}
                rowIndex={workloadStore.getAssignee}
                filterRowIndex={selectOption}
                columns={workloadStore.getDate}
                sumArr={workloadStore.getTotal}
                render={renderCell}
                rowLength={rowSize.length}
              />
            ) : <EmptyPage content="暂无数据" />
        );
      }
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    } if (startSprintDs.status !== 'loading') {
      return <EmptyPage />; // content="暂无活跃的冲刺"
    }
    return '';
  }
  return (
    <OverviewWrap containerRef={containerRef}>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>
  );
});

export default Workload;
