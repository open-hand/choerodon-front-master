import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';
import OverviewWrap from '../OverviewWrap';
import renderExpandRow from '../../../applications/InRowTable';

const { Option } = Select;
const DateTable = memo(({
  userNumber = 100,
}) => {
  const clsPrefix = 'c7n-project-overview-date-table';
  const [selectValue, setSelectValue] = useState('remember');
  const handleChangeSelect = () => {
    console.log('handleChangeSelect');
    // setSelectValue
  };
  const renderH = () => { };
  const renderRow = () => { };
  const renderCell = () => { };
  return (
    <div className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}></div>
      <div className={`${clsPrefix}-content`}>

      </div>
    </div>
  );
});

export default DateTable;
