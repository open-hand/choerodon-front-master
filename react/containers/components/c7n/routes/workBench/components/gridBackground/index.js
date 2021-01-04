import React, { useCallback, useEffect, useState } from 'react';
import { get, map } from 'lodash';
import './index.less';

function getColsNumber(domWidth) {
  let tempNum;
  if (domWidth < 480) {
    tempNum = 2;
  } else if (domWidth < 768) {
    tempNum = 4;
  } else if (domWidth < 996) {
    tempNum = 8;
  } else if (domWidth < 1200) {
    tempNum = 10;
  } else {
    tempNum = 12;
  }
  return tempNum;
}

const GridBg = () => {
  const [cols, setCol] = useState(0);
  const [rows, setRow] = useState(0);

  const renderCol = useCallback(() => {
    if (cols && rows) {
      const tempArr = new Array(cols * rows).fill(0);
      return (
        map(tempArr, (item, index) => (
          <div key={index} />
        ))
      );
    }
    return '';
  }, [cols, rows]);

  const resizeDom = useCallback((domTem) => {
    if (domTem) {
      const workbenchW = get(domTem, 'offsetWidth');
      const workbenchH = get(domTem, 'offsetHeight');
      const numC = getColsNumber(workbenchW);
      const numR = Math.floor(workbenchH / 109);
      numC && setCol(numC);
      numR && setRow(numR);
    }
  }, []);

  useEffect(() => {
    const domTem = document.querySelector('.c7n-workbench-container');
    new ResizeObserver((entries) => {
      const dom = get(entries[0], 'target');
      resizeDom(dom);
    }).observe(domTem);
  }, []);

  return (
    <div
      className="c7ncd-workbench-gridBg"
      style={{
        gridTemplateColumns: `repeat(${cols},1fr)`,
      }}
    >
      {renderCol()}
    </div>
  );
};

export default GridBg;
