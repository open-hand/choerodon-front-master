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
let refs = [null, null, null];

const DateTable = observer(({
  headerTexts = ['成员', '日期'],
  columnLength = 7,
  rowHeight,
  rowLength = 3,
  columns = undefined,
  current = 0,
  rowIndex = [], // 行名数组
  render,
  quickMapData,
  filterRowIndex, // 过滤行的序列号 对应着rowIndx数组的index
  sumArr = undefined,
  isSum = true,
  headerSplit = false,
}) => {
  useEffect(() => {

  }, []);
  const rowRef = useRef();
  const clsPrefix = 'c7n-project-overview-date-table';
  const [selectValue, setSelectValue] = useState('remember');
  const [columnSize, setColumnSize] = useState(columnLength);
  const [currentPosition, setCurrentPosition] = useState(current);
  const [sumData, setData] = useState(sumArr);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [dateList, setDateList] = useState([]);
  const [rowMap, setRowMap] = useState();
  useEffect(() => {
    setDateList(columns);
  }, [columns]);

  const handleChangeSelect = () => {
    // setSelectValue
  };
  const renderCell = (data) => {
    if (render) {
      return render(data);
    }
    return data.toString();
  };
  const Cell = memo(({ children, className }) => <div className={`${clsPrefix}-cell ${className || ''}`} style={{ height: rowHeight }}>
    {children}
  </div>);
  const Row = memo(({ sum, rowName, size = columnSize, data = new Map(), children, className }) => {
    const cells = [];
    // 增加x轴
    cells.push(<Cell className={`${clsPrefix}-row-cell-first border-right`}><span>{rowName}</span></Cell>)
    // 增加内容页  从当前位置出发
    for (let index = currentPosition; index < size && index < dateList.length; index++) {
      const currentDate = columns[index];
      cells.push(<Cell className={`${clsPrefix}-row-cell`}>{renderCell(sum ? data[index] : data.get(currentDate).get(rowName))}</Cell>);
    }
    // 填补空白格
    if (size > cells.length) {
      const breakLength = size - cells.length;
      for (let i = 0; i <= breakLength; i++) {
        cells.push(<Cell className={`${clsPrefix}-row-cell`}></Cell>);
      }
    }

    return <div className={`${clsPrefix}-row`}>
      {children || cells}
    </div>;
  });

  useEffect(() => {
    // const doc = document.getElementsByClassName('c7n-project-overview-date-table-content')[0];
    if (rowRef.current && rowLength < rowIndex.length) {
      let height = 0;
      const elements = rowRef.current.getElementsByClassName('c7n-project-overview-date-table-row');
      for (let i = 0; i < rowLength; i++) {
        height += elements[i].offsetHeight;
      }
      setScrollHeight(height);
    }

  }, [rowRef]);
  useEffect(() => {
    if (scrollHeight !== 0) {
      const element = document.getElementsByClassName('c7n-project-overview-date-table-content')[0];
      element.style.height = scrollHeight + 'px';
    }
  }, [scrollHeight])
  const renderFooter = () => {
    // 假如有数据，则增加一行总计
    if (isSum && rowIndex.length > 0 && sumData) {
      if (filterRowIndex.length > 0 && filterRowIndex.length !== rowIndex.length) {
        const newSumData = [];
        sumData.forEach((obj, index) => { //遍历总计
          const quickItem = quickMapData.get(columns[index]); // 获取当前日期天全部数据
          let newObj = {};
          // 当前日期下，筛选到的成员在当前日期的数据 
          filterRowIndex.forEach(i => {
            const dateData = quickItem.get(rowIndex[i]);
            if (dateData) {
              for (const key in dateData) {
                if (typeof dateData[key] === 'number') {
                  if (newObj.hasOwnProperty(key)) {
                    newObj[key] += dateData[key];
                  } else {
                    newObj[key] = dateData[key]
                  }
                }
              }
            }
          });
          newSumData.push(Object.keys(newObj).length > 0 ? newObj : undefined);
        });
        return <Row rowName="总计" data={newSumData} sum={isSum} />
      }


      return <Row rowName="总计" data={sumData} sum={isSum} />
    }
  };
  const renderRows = () => {
    if (rowIndex.length === 0) {
      return <Row>
        暂无数据
      </Row>
    }
    const rowArr = rowIndex.filter((row, index) => filterRowIndex.length === 0 || filterRowIndex.some(f => f === index)).map((row) => {
      return <Row rowName={row} data={quickMapData} />
    });
    return rowArr;
  };
  const handlePreOrNext = (isNext) => {
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
        disabled={columnSize >= dateList.length || currentPosition === dateList.length - columnSize}
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
    const dateCells = [];
    for (let index = 0; index < columnSize - 1; index++) {
      dateCells.push(<Cell className={`${clsPrefix}-header-cell ${headerSplit ? 'border-right' : ''}`}><span className={`${clsPrefix}-header-cell-content`}>{dateList[currentPosition + index]}</span></Cell>)
    }
    dateCells.push(<Cell className={`${clsPrefix}-header-cell`}><span className={`${clsPrefix}-header-cell-content margin-right`}>{dateList[currentPosition + columnSize - 1]}</span></Cell>)
    return dateCells;
  };

  console.log('renderrenderrender')
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
      <div ref={rowRef} className={`${clsPrefix}-content`} >
        {renderRows()}
      </div>
      <div className={`${clsPrefix}-footer`}>
        {renderFooter()}
      </div>
    </div >
  );
});

export default DateTable;
