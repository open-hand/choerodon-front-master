import React, { useState, memo, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { Button, Tooltip, Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
const { Option } = Select;
/**
 * @param {Array<string>} headerText 左上角数据
 * @param {Array<{}>}  rows 行数据， 需要有name名字，data对应这一行的数据
 * 
 */
const DateTable = observer(({
  headerTexts = ['成员', '日期'],
  columnLength = 8,
  columns = ['2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13', '2020-05-14'],
  current = 0,
  rows = [],
  render,
  isSum = true,
  headerSplit = false,
}) => {
  useEffect(() => {

  }, []);
  const canvas = useRef();
  const clsPrefix = 'c7n-project-overview-date-table';
  const [selectValue, setSelectValue] = useState('remember');
  const [columnSize, setColumnSize] = useState(columnLength);
  const [currentPosition, setCurrentPosition] = useState(current);
  const [sumData, setData] = useState(undefined);
  const [dateList, setDateList] = useState(columns);
  const handleChangeSelect = () => {
    // setSelectValue
  };
  const renderCell = (data) => {
    if (render) {
      return render(data);
    }
    return data.toString();
  };
  const Cell = memo(({ children, className }) => <div className={`${clsPrefix}-cell ${className || ''}`}>
    {children}
  </div>);
  const Row = memo(({ rowName, size = columnSize, data = [], children, className }) => {
    const cells = [];
    // 增加x轴
    cells.push(<Cell className={`${clsPrefix}-row-cell-first border-right`}><span>{rowName}</span></Cell>)
    // 增加内容页  从当前位置出发
    for (let index = currentPosition; index < size && index < data.length; index++) {
      cells.push(<Cell className={`${clsPrefix}-row-cell`}>{renderCell(data[index])}</Cell>);
    }
    // console.log('size:', size, cells.length, size - cells.length);
    if (size > cells.length) {
      const breakLength = size - cells.length;
      for (let i = 0; i <= breakLength; i++) {
        cells.push(<Cell className={`${clsPrefix}-row-cell`}></Cell>);
        // console.log('i:', i);
      }
    }
    // console.log('cells.length:', cells.length);
    // console.log('cells', cells);
    return <div className={`${clsPrefix}-row`}>
      {children || cells}
    </div>;

  })
  // const renderCell = () => {
  //   return <div className={`${clsPrefix}-cell`}>

  //   </div>
  // };
  const renderH = () => { };
  const renderRows = () => {
    // console.log('row');
    if (rows.length === 0) {
      return <Row>
        暂无数据
      </Row>
    }
    const rowArr = rows.map(row => {
      return <Row rowName={row.name} data={row.data || ''} />
    });
    // 假如有数据，则增加一行总计
    if (isSum && rowArr.length > 0) {
      if (sumData) {
        rowArr.push(<Row rowName="总计" data={sumData} sum />)
      } else {
        const sumMaps = new Map();
        rows.forEach(row => {
          if (Array.isArray(row.data)) {

          }
          if (Object.is(row)) {
            const sumObj = {};
            for (const key in row) {

              const element = object[key];

            }
          }
        });
        rowArr.push(<Row rowName="总计" sum />)
      }
    }
    return rowArr;
  };
  const handlePreOrNext = (isNext) => {
    console.log('handlePreOrNext', isNext, currentPosition);
    if (currentPosition >= 0 && currentPosition <= dateList.length - columnSize) {
      if (isNext && currentPosition < dateList.length - columnSize) {
        setCurrentPosition(currentPosition + 1);
      } else if (!isNext && currentPosition !== 0) {
        setCurrentPosition(currentPosition - 1)
      }
    }

  };
  const renderPreOrNext = (isNext = false) => {
    if (isNext) {
      return <span className={`${clsPrefix}-header-btn`}><Button
        className={`${clsPrefix}-header-btn-right`}
        funcType="flat"
        icon="baseline-arrow_right"
        color="primary"
        disabled={currentPosition === dateList.length - columnSize}
        onClick={handlePreOrNext.bind(this, isNext)}
      />
      </span>;
    }
    return <span className={`${clsPrefix}-header-btn`}> <Button
      className={`${clsPrefix}-header-btn-left`}
      funcType="flat"
      icon="baseline-arrow_left"
      color="primary"
      disabled={currentPosition === 0}
      onClick={handlePreOrNext.bind(this, isNext)}
    /></span>;
  };
  const renderDate = () => {
    console.log('renderHeader');
    const dateCells = [];
    for (let index = 0; index < columnSize - 1; index++) {
      dateCells.push(<Cell className={`${clsPrefix}-header-cell ${headerSplit?'border-right':''}`}><span className={`${clsPrefix}-header-cell-content`}>{dateList[currentPosition + index]}</span></Cell>)
    }
    dateCells.push(<Cell className={`${clsPrefix}-header-cell`}><span className={`${clsPrefix}-header-cell-content margin-right`}>{dateList[currentPosition + columnSize - 1]}</span></Cell>)
    return dateCells;
  };
  useEffect(() => {
    // dateList.fill(...dateList, 0, 8);
    // console.log('useEffect', dateList);
  }, []);
  useEffect(() => {

  }, [dateList]);
  console.log('  renderrenderrender')
  return (
    <div className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}>
        < div className={`${clsPrefix}-header-cell ${clsPrefix}-header-cell-top `}>
          <div className={`${clsPrefix}-header-cell-top-y`}>{headerTexts[0]}</div>
          <div className={`${clsPrefix}-header-cell-top-x`}>{headerTexts[1]}</div>
        </div>
        {renderPreOrNext(false)}
        {renderDate()}
        {renderPreOrNext(true)}
      </div>
      <div className={`${clsPrefix}-content`}>
        {renderRows()}
      </div>
    </div >
  );
});

export default DateTable;
