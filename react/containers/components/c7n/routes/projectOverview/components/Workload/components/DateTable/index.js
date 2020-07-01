import React, { useState, memo, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
const dateData = ['2020-05-06', '2020-05-06', '2020-05-06', '2020-05-06', '2020-05-06'];
const { Option } = Select;
const DateTable = memo(({
  headerTexts = ['成员', '日期'],
  rows = [{ name: '小王' }, { name: '小黑' }, { name: '小白' }]
}) => {
  useEffect(() => {

  }, []);
  const canvas = useRef();
  const clsPrefix = 'c7n-project-overview-date-table';
  const [selectValue, setSelectValue] = useState('remember');
  const handleChangeSelect = () => {
    console.log('handleChangeSelect');
    // setSelectValue
  };
  const Cell = memo(({ children, className }) => <div className={`${clsPrefix}-cell`}>
    {children}
  </div>);
  const Row = memo(({ rowName, size = 0, data = [], children }) => {
    const cells = [];
    cells.push(<Cell >{rowName}</Cell>)
    cells.push(...data.map(item => <Cell>{item}</Cell>));
    if (size > data.size) {
      cells.push(<Cell>我是空白</Cell>)
    }
    console.log('row', cells);
    return <div className={`${clsPrefix}-row`}>
      {children || cells}
    </div>;

  })
  const renderCell = () => {
    return <div className={`${clsPrefix}-cell`}>

    </div>
  };
  const renderH = () => { };
  const renderRows = () => {
    console.log('row');
    if (rows.length === 0) {
      return <Row>
        暂无数据
      </Row>
    } else {
      return <Row>
        暂无数据
      </Row>
    }
    const row = rows.map(row => {
      return <Row rowName={row.name} data={['222']} />
    });

  };
  const renderDate = () => {
    console.log('renderHeader');
  };
 
  return (
    <div className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}>
        <div className={`${clsPrefix}-header-cell ${clsPrefix}-header-cell-top`}>
          <div>成员</div>
          <div>日期</div>
        </div>
        {renderDate()}
      </div>
      <div className={`${clsPrefix}-content`}>
        {renderRows()}
      </div>
    </div>
  );
});

export default DateTable;
