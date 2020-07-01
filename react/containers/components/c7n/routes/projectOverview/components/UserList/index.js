import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';
import OverviewWrap from '../OverviewWrap';

const { Option } = Select;
const UserList = memo(({
  userNumber = 100,
}) => {
  const [selectValue, setSelectValue] = useState('exist');
  const handleChangeSelect=()=>{
    console.log('handleChangeSelect');
    // setSelectValue
  };
  return (
    <OverviewWrap>
      <OverviewWrap.Header title={`项目成员(${userNumber})`} >
        <Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{ width: 100, marginLeft: 34,fontSize:14 }}
          className="c7n-project-overview-SelectTheme"
          label="单位"
          clearButton={false}
          defaultValue={selectValue}
          onChange={handleChangeSelect}
        >
          <Option value="exist"> 活跃人数</Option>
          <Option value="exist2">活跃人数2</Option>
          <Option value="exist3">活跃人数3</Option>
        </Select>  </OverviewWrap.Header>

    </OverviewWrap>
  );
});

export default UserList;
