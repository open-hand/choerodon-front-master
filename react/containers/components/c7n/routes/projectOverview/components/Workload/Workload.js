import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import DateTable from './components/DateTable';
import { useWorkloadStore } from './stores';
import { useProjectOverviewStore } from '../../stores';
import { EmptyPage } from '../EmptyPage';
import './index.less';

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
    }
];
const Workload = observer(({
}) => {
    const clsPrefix = 'c7n-project-overview-workload';
    const [selectOption, setSelectOption] = useState([]);
    const { workloadStore } = useWorkloadStore();
    const { projectOverviewStore } = useProjectOverviewStore();
    // const tee= <Icon type="watch_later-o" className={`${clsPrefix}-icon-workTime-watch`} style={{ color: "rgba(255, 185, 106, 1)" }} />;
    const TimeIcon = () => <div className={`${clsPrefix}-icon-workTime`}><span ></span></div>

    const handleChangeSelect = (value) => {
        if (value) {
            setSelectOption(value);
        } else {
            setSelectOption([]);
        }
    };
    function checkIsNullData(data, exceptKey) {
        if (!data) {
            return false;
        }
        delete data[exceptKey];
        const values = Object.values(data);
        return values.length === 0 || values.reduce((sum, c) => sum + c) === 0;
    }
    const renderCell = (data) => {

        if (!checkIsNullData(data, 'worker')) {
            return <div className={`${clsPrefix}-cell`}>
                {showIcons.map(item => {
                    return (<div className={`${clsPrefix}-cell-item`}>
                        <Icon type={item.icon}
                            className={`${clsPrefix}-cell-item-icon`}
                            style={{
                                color: item.colour,
                            }} />
                        {item.typeCode !== 'story' ? `${item.label}${data[item.typeCode]}` : `${item.label}${data.storyCount}（${data.storyPointCount}点）`}
                    </div>)

                })}

            </div>;
        } else {
            return ''
        }

    };
    const renderTitle = () => (
        <div className={`${clsPrefix}-title`}>
            <span>工作量统计</span>
            <Tooltip placement="topLeft" arrowPointAtCenter title="统计当前迭代内团队成员每天完成的任务数，完成的故事数量及其对应故事点数量，提出的缺陷数量，解决的缺陷数量，当天工作记录的总工时。">
                <Icon type="help" className={`${clsPrefix}-icon`} />
            </Tooltip>
            {// 若冲刺数据已加载完成 但工作量无数据则不显示
                projectOverviewStore.getIsFinishLoad && workloadStore.getData ? <Select
                    multiple
                    // searchable
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    style={{ marginLeft: 24 }}
                    className="c7n-project-overview-SelectTheme"
                    label="选择经办人"
                    placeholder="选择经办人"
                    clearButton={true}
                    maxTagCount={5}
                    popupCls="c7n-project-overview-assignee"
                    popupStyle={{ minWidth: "2rem" }}
                    // defaultValue={selectValue}
                    onChange={handleChangeSelect}
                >
                    {workloadStore.getAssignee ? workloadStore.getAssignee.map((item, index) => {
                        return <Option value={index}>{item}</Option>
                    }) : ''}
                </Select> : ''
            }

        </div>
    );
    return (
        <OverviewWrap width="100%" style={{ minHeight: 150 }} >
            <OverviewWrap.Header title={renderTitle()} />
            <OverviewWrap.Content>
                {projectOverviewStore.getIsFinishLoad && workloadStore.getData ? <DateTable
                    cellHeight={138}
                    current={workloadStore.getData.size > 7 ? workloadStore.getData.size - 7 : 0}
                    quickMapData={workloadStore.getData}
                    rowIndex={workloadStore.getAssignee}
                    filterRowIndex={selectOption}
                    columns={workloadStore.getDate}
                    sumArr={workloadStore.getTotal}
                    render={renderCell}
                /> : <EmptyPage content="暂无活跃的冲刺" />}
            </OverviewWrap.Content>
        </OverviewWrap>
    );
});

export default Workload;
