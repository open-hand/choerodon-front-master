import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import NewUserTrackTable from '../Test';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import DateTable from './components/DateTable';
const { Option } = Select;
const Workload = memo(({
  userNumber = 100,
}) => {
  const clsPrefix = 'c7n-project-overview-workload';
  const [selectValue, setSelectValue] = useState('remember');
  const handleChangeSelect = () => {
    // setSelectValue
  };
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>工作量统计</span>
      <Tooltip placement="topLeft" arrowPointAtCenter title="统计当前迭代内团队成员每天完成的任务数，完成的故事数量及其对应故事点数量，提出的缺陷数量，解决的缺陷数量，当天工作记录的总工时。">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
      <Select
        getPopupContainer={triggerNode => triggerNode.parentNode}
        style={{ width: 100, marginLeft: 24 }}
        className="c7n-project-overview-SelectTheme"
        label="单位"
        clearButton={false}
        defaultValue={selectValue}
        onChange={handleChangeSelect}
      >
        <Option value="remember">选择成员</Option>
        <Option value="storyPoints">选择成员</Option>
        <Option value="issueCount">选择成员</Option>
      </Select>
    </div>
  );
  return (
    <OverviewWrap width="100%">
      <OverviewWrap.Header title={renderTitle()} />
      {/* <NewUserTrackTable tableId={9}/> */}
      <DateTable />
    </OverviewWrap>
  );
});

export default Workload;
