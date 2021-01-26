import React from 'react';
import EmptyPage from '../empty-page';

import './index.less';

const prefixCls = 'c7ncd-emptyCard';

const EmptyCard = ({title, emptyDiscribe, emptyTitle }) => (
  <div className={prefixCls}>
    <header>
      <span>{title}</span>
    </header>
    <main>
      <EmptyPage title={emptyTitle} describe={emptyDiscribe} />
    </main>
  </div>
);

export default EmptyCard;
