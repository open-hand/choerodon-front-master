/* eslint-disable no-plusplus */
import React, { useState, memo, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
/**
 * 行列表格
 * @param {Array<string>} headerText 左上角数据
 * @param {number}  columnLength 需要显示的列长
 * @param {number}  cellHeight 内容页的单元格高
 * @param {number}  rowLength 需要显示的几行
 * @param {Array<string>}  columns 列数据
 * @param {number}  current 从哪一列定位首列
 * @param {Array<string>}  rowIndex 行名数组
 * @param {Function}  render 单元格渲染
 * @param {Map<key,Map<key,object>>}  quickMapData 快速查询数据的map 第一层map key为列 第二层map key为行
 * @param {Array<number>}  filterRowIndex 筛选的行序列号
 * @param {Array<{}>}  sumArr 最后一行数据
 * @param {boolean}  isSum 是否有最后一行
 * @param {boolean}  headerSplit 头部列是否有分割线
 * @author DingZc
 * 
 */
const DateTable = observer(({
  headerTexts = ['成员', '日期'],
  columnLength = 7,
  cellHeight,
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
  const rowRef = useRef();
  const clsPrefix = 'c7n-project-overview-date-table';
  const [columnSize, setColumnSize] = useState(columnLength);
  const [currentPosition, setCurrentPosition] = useState(current);
  const [sumData, setData] = useState(sumArr);
  const [dateList, setDateList] = useState([]);
  const [rowMap, setRowMap] = useState();
  // 对列进行处理
  useEffect(() => {
    setDateList(columns);
  }, [columns]);

  /**
   * 渲染除列名单元格外的单元格
   * @param {*} data 
   */
  const renderCell = (data) => {
    if (render) {
      return render(data);
    }
    return data.toString();
  };
  // 单元格
  const Cell = memo(({ children, className }) => (
    <div className={`${clsPrefix}-cell ${className || ''}`} style={{ minHeight: cellHeight }}>
      {children}
    </div>
  ));
  // 行
  const Row = memo(({ sum, rowName, size = columnSize, data = new Map(), children, className }) => {
    const cells = [];
    // 增加y轴
    cells.push(<Cell key={`cell-${rowName}`} className={`${clsPrefix}-row-cell-first border-right`}><span>{rowName}</span></Cell>);
    // 增加内容页  从当前位置出发
    for (let index = currentPosition; index < size + currentPosition && index < dateList.length; index++) {
      const currentDate = columns[index];
      cells.push(<Cell key={`cell-${index}`} className={`${clsPrefix}-row-cell animate-table`}>{renderCell(sum ? data[index] : data.get(currentDate).get(rowName))}</Cell>);
    }
    // 填补空白格
    if (size > cells.length) {
      const breakLength = size - cells.length;
      for (let i = 0; i <= breakLength; i++) {
        cells.push(<Cell key={`cell-space-${i}`} className={`${clsPrefix}-row-cell`} />);
      }
    }
    return (
      <div className={`${clsPrefix}-row`}>
        {children || cells}
      </div>
    );
  });

  /**
   * 根据传入的 rowLength 行数进行显示的高度调整 
   * @param {*} isAuto 
   */
  function resetScrollHeight(isAuto = false) {
    let scrollHeight = 'auto';
    const element = document.getElementsByClassName('c7n-project-overview-date-table-content')[0];
    if (!isAuto) {
      let height = 0;
      scrollHeight = '';
      const elements = rowRef.current.getElementsByClassName('c7n-project-overview-date-table-row');
      for (let i = 0; elements && i < rowLength && i < elements.length; i++) {
        height += elements[i].offsetHeight;
      }
      scrollHeight = `${height}px`;
    }
    // 如果相等就放弃更改高度
    if (element.style.height === scrollHeight) {
      return;
    }
    rowRef.current.style.height = scrollHeight;
  }
  //  行初始化完成后，进行高度调整
  useEffect(() => {
    // const doc = document.getElementsByClassName('c7n-project-overview-date-table-content')[0];
    if (rowRef.current && rowLength < rowIndex.length) {
      resetScrollHeight();
    }
  }, [rowIndex]);
  //  根据选择成员自动调整高度 进行滚动
  useEffect(() => {
    if (rowRef.current) {
      if (rowLength >= rowIndex.length || (filterRowIndex.length > 0 && filterRowIndex.length <= rowLength)) {
        resetScrollHeight(true);
      } else {
        resetScrollHeight();
      }
    }
  }, [filterRowIndex]);

  /**
   * 渲染底部 （即最后一行)
   */
  const renderFooter = () => {
    // 假如有数据，则增加一行总计
    if (isSum && rowIndex.length > 0 && sumData) {
      // 如果有筛选，则计算需要渲染的列的数据的和
      if (filterRowIndex.length > 0 && filterRowIndex.length !== rowIndex.length) {
        const newSumData = new Array(dateList.length);
        // 遍历需要渲染的列，只计算需要渲染的总计单元格
        for (let index = currentPosition; index < currentPosition + columnSize && index < dateList.length; index++) {
          const quickItem = quickMapData.get(columns[index]); // 获取当前日期天全部数据
          const newObj = {};
          // 当前日期下，筛选到的成员在当前日期的数据 
          filterRowIndex.forEach(i => {
            const dateData = quickItem.get(rowIndex[i]);
            if (dateData) {
              Object.keys(dateData).forEach(key => {
                if (typeof (dateData[key]) === 'number') {
                  if (Object.prototype.hasOwnProperty.call(newObj, key)) {
                    newObj[key] += dateData[key];
                  } else {
                    newObj[key] = dateData[key];
                  }
                }
              });
            }
          });
          newSumData[index] = Object.keys(newObj).length > 0 ? newObj : undefined;
        }
        return <Row key="row-sum" rowName="总计" data={newSumData} sum={isSum} />;
      }

      return <Row key="row-sum" rowName="总计" data={sumData} sum={isSum} />;
    }
  };
  /**
   * 渲染行
   */
  const renderRows = () => {
    if (rowIndex.length === 0) {
      return (
        <Row>
          <span className={`${clsPrefix}-row-no-data`}>暂无数据</span>
        </Row>
      );
    }
    const rowArr = rowIndex.filter((row, index) => filterRowIndex.length === 0 || filterRowIndex.some(f => f === index)).map((row, index) => <Row key={`row-${index}`} rowName={row} data={quickMapData} />);
    return rowArr;
  };
  /**
   * 前后翻页
   * @param {*} isNext 是否向后翻
   */
  const handlePreOrNext = (isNext) => {
    if (currentPosition >= 0 && currentPosition <= dateList.length - columnSize) {
      if (isNext && currentPosition < dateList.length - columnSize) {
        setCurrentPosition(currentPosition + 1);
      } else if (!isNext && currentPosition !== 0) {
        setCurrentPosition(currentPosition - 1);
      }
    }
  };
  /**
   * 渲染前后翻页按钮
   * @param {*} isNext 是否向后翻
   */
  const renderPreOrNext = (isNext = false) => {
    if (isNext) {
      return (
        <span className={`${clsPrefix}-header-btn`}><Button
          className={`${clsPrefix}-header-btn-right`}
          funcType="flat"
          icon="baseline-arrow_right"
          color="primary"
          disabled={columnSize >= dateList.length || currentPosition === dateList.length - columnSize}
          onClick={handlePreOrNext.bind(this, isNext)}
        />
        </span>
      );
    }
    return (
      <span className={`${clsPrefix}-header-btn`}> <Button
        className={`${clsPrefix}-header-btn-left`}
        funcType="flat"
        icon="baseline-arrow_left"
        color="primary"
        disabled={currentPosition === 0}
        onClick={handlePreOrNext.bind(this, isNext)}
      />
      </span>
    );
  };
  /**
   * 渲染日历行 （即列名）
   */
  const renderDate = () => {
    const dateCells = [];
    for (let index = 0; index < columnSize - 1; index++) {
      dateCells.push(<Cell key={`cell-date-${index}`} className={`${clsPrefix}-header-cell animate-table ${headerSplit ? 'border-right' : ''}`}><span className={`${clsPrefix}-header-cell-content`}>{dateList[currentPosition + index]}</span></Cell>);
    }
    dateCells.push(<Cell key={`cell-date-${columnSize}`} className={`${clsPrefix}-header-cell animate-table`}><span className={`${clsPrefix}-header-cell-content margin-right`}>{dateList[currentPosition + columnSize - 1]}</span></Cell>);
    return dateCells;
  };

  return (
    <div className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}>
        <div className={`${clsPrefix}-header-cell ${clsPrefix}-header-cell-top `}>
          <div className={`${clsPrefix}-header-cell-top-y`}>{headerTexts[0]}</div>
          <div className={`${clsPrefix}-header-cell-top-x`}>{headerTexts[1]}</div>
        </div>
        {renderPreOrNext(false)}
        {renderDate()}
        {renderPreOrNext(true)}
      </div>
      <div ref={rowRef} className={`${clsPrefix}-content`}>
        {renderRows()}
      </div>
      { // 无数据则不显示最后一行
        rowIndex.length > 0 ? (
          <div className={`${clsPrefix}-footer`}>
            {renderFooter()}
          </div>
        ) : ''
      }
    </div>
  );
});

export default DateTable;
