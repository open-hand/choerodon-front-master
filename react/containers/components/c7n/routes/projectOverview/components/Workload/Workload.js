import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import NewUserTrackTable from '../Test';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import DateTable from './components/DateTable';
const { Option } = Select;
const showIcons = {
    epic: {
        icon: 'agile_epic',
        colour: '#743be7',
        typeCode: 'issue_epic',
        name: '史诗',
    },
    story: {
        icon: 'agile_story',
        colour: '#00bfa5',
        typeCode: 'story',
        name: '故事',
    },
    feature: {
        icon: 'agile-feature',
        colour: '#3D5AFE',
        typeCode: 'feature',
        name: '特性',
    },
    bug: {
        icon: 'agile_fault',
        colour: '#f44336',
        typeCode: 'bug',
        name: '缺陷',
    },
    task: {
        icon: 'agile_task',
        colour: '#4d90fe',
        typeCode: 'task',
        name: '任务',
    },
    subtask: {
        icon: 'agile_subtask',
        colour: '#4d90fe',
        typeCode: 'sub_task',
        name: '子任务',
    },
    time: {
        icon: 'watch_later',
        colour: 'rgba(255, 185, 106, 1)',
        typeCode: 'sub_task',
        name: '工时',
    }
};
const Workload = memo(({
    userNumber = 100,
}) => {
    const clsPrefix = 'c7n-project-overview-workload';
    const [selectValue, setSelectValue] = useState('remember');
    const handleChangeSelect = () => {
        // setSelectValue
    };
    const renderCell = (data) => {
        const cell = [];
        if (data) {
            // console.log('data', data);
            for (const key in data) {
                console.log(key, data[key])
            }
        }

        return <div className={`${clsPrefix}-cell`}>
            <div className={`${clsPrefix}-cell-item`}>
                <Icon type="agile_fault"
                    className={`${clsPrefix}-cell-item-icon`}
                    style={{
                        color: 'rgba(244, 67, 54, 1)',
                    }} />
                    解决缺陷：3
            </div>
            <div className={`${clsPrefix}-cell-item`}>
                <Icon type="agile_fault"
                    className={`${clsPrefix}-cell-item-icon`}
                    style={{
                        color: 'rgba(244, 67, 54, 1)',
                    }} />
                    提出缺陷：0
            </div>
        </div>;
    };
    const renderTitle = () => (
        <div className={`${clsPrefix}-title`}>
            <span>工作量统计</span>
            <Tooltip placement="topLeft" arrowPointAtCenter title="统计当前迭代内团队成员每天完成的任务数，完成的故事数量及其对应故事点数量，提出的缺陷数量，解决的缺陷数量，当天工作记录的总工时。">
                <Icon type="help" className={`${clsPrefix}-icon`} />
            </Tooltip>
            <Select
                multiple
                searchable
                getPopupContainer={triggerNode => triggerNode.parentNode}
                style={{ width: 100, marginLeft: 24 }}
                className="c7n-project-overview-SelectTheme"
                label="选择成员"
                placeholder="选择成员"
                clearButton={true}
                defaultValue={selectValue}
                onChange={handleChangeSelect}
            >
                <Option value="remember">选择成员1</Option>
                <Option value="storyPoints">选择成员2</Option>
                <Option value="issueCount">选择成员3</Option>
            </Select>
        </div>
    );
    return (
        <OverviewWrap width="100%">
            <OverviewWrap.Header title={renderTitle()} />
            {/* <NewUserTrackTable tableId={9}/> */}
            <DateTable rows={
                [{ name: '小王', data: [{ epic: 1, story: 3, bug: 8, time: 30 }] },
                { name: '小黑', },
                { name: '小白' }]
            }
                render={renderCell}
            />
        </OverviewWrap>
    );
});

export default Workload;
