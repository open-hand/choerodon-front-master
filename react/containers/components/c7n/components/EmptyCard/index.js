import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import EmptyPage from '../empty-page';

import './index.less';

const prefixCls = 'c7ncd-emptyCard';

let observeResize;

const EmptyCard = ({
  title, emptyDiscribe, emptyTitle, sizeObserver, index,
}) => {
  const [isOnlyShowText, setShowText] = useState(false);

  useEffect(() => {
    if (sizeObserver) {
      const domTem = document.querySelector(`#emtyCard-${index}`);
      observeResize = new ResizeObserver((entries) => {
        const dom = get(entries[0], 'target');
        const height = get(dom, 'offsetHeight');
        if (height < 218) {
          setShowText(true);
        } else {
          setShowText(false);
        }
      }).observe(domTem);
    }
  }, []);

  useEffect(() => function () {
    if (observeResize) {
      observeResize.disconnect();
    }
  });

  return (
    <div className={prefixCls} id={`emtyCard-${index}`}>
      {!isOnlyShowText && (
      <header>
        <span>{title}</span>
      </header>
      )}
      <main className={isOnlyShowText ? `${prefixCls}-onlyText` : ''}>
        <EmptyPage title={emptyTitle} describe={emptyDiscribe} />
      </main>
    </div>
  );
};

export default EmptyCard;
