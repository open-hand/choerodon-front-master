import React, { useCallback, useEffect, useState } from 'react';
import { get, map } from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import './index.less';

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
      // const workbenchW = get(domTem, 'offsetWidth');
      const workbenchH = get(domTem, 'offsetHeight');
      const numC = 12;
      const numR = Math.floor(workbenchH / 109);
      numC && setCol(numC);
      numR && setRow(numR);
    }
  }, []);

  useEffect(() => {
    const domTem = document.querySelector('.c7n-project-overview-container');
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
