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
  const [columSize, setColumSize] = useState(8);
  const [dateList, setDateList] = useState(dateData);
  const handleChangeSelect = () => {
    // setSelectValue
  };
  const Cell = memo(({ children, className }) => <div className={`${clsPrefix}-cell ${className || ''}`}>
    {children}
  </div>);
  const Row = memo(({ rowName, size = columSize, data = [], children }) => {
    const cells = [];
    cells.push(<Cell className={`${clsPrefix}-row-cell-first border-right`}>{rowName}</Cell>)
    cells.push(...data.map(item => <Cell className={`${clsPrefix}-row-cell`}>{item}</Cell>));
    if (size > data.length) {
      for (let i = 0; i < size-data.length; i++) {
        cells.push(<Cell className={`${clsPrefix}-row-cell`}>我是空白</Cell>)
        
      }
      console.log('cells', cells);
    }
    // console.log('cells', cells);
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
    // console.log('row');
    // if (rows.length === 0) {
    //   return <Row>
    //     暂无数据
    //   </Row>
    // } else {
    //   return <Row>
    //     暂无数据
    //   </Row>
    // }
    const row = rows.map(row => {
      return <Row rowName={row.name} data={['222']} />
    });
    // 假如有数据，则增加一行总计
    if (row.length > 0) {
      row.push(<Row rowName="总计" />)
    }
    return row;

  };
  const renderPreOrNext = (isNext = false) => {
    console.log('renderPreOrNex');
    if (isNext) {
      return <span className={`${clsPrefix}-header-btn`}><Button className={`${clsPrefix}-header-btn-right`} funcType="flat" icon="baseline-arrow_right" color="primary" /></span>;
    }
    return <span className={`${clsPrefix}-header-btn`}> <Button className={`${clsPrefix}-header-btn-left`} funcType="flat" icon="baseline-arrow_left" color="primary" /></span>;
  };
  const renderDate = () => {
    console.log('renderHeader');
    const dateCells = [];
    for (let index = 0; index < columSize-1; index++) {
      dateCells.push(<Cell className={`${clsPrefix}-header-cell border-right`}>{dateList[index]}</Cell>)
    }
    dateCells.push(<Cell className={`${clsPrefix}-header-cell`}>{dateList[columSize-1]}</Cell>)
    return dateCells;
  };
  useEffect(() => {
    // dateList.fill(...dateData, 0, 8);
    console.log('useEffect', dateList);
  }, []);
  useEffect(() => {

  }, [dateList])
  return (
    <div className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}>
        <div className={`${clsPrefix}-header-cell ${clsPrefix}-header-cell-top `}>
          <div className={`${clsPrefix}-header-cell-top-y`}>成员</div>
          <div className={`${clsPrefix}-header-cell-top-x`}>日期</div>

        </div>
        {renderPreOrNext(false)}
        {renderDate()}
        {renderPreOrNext(true)}
      </div>
      <div className={`${clsPrefix}-content`}>
        {renderRows()}
      </div>
    </div>
  );
});

export default DateTable;
