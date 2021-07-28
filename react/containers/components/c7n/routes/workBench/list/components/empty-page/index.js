import React from 'react';
import defaultImg from '../../../img/empty.svg';

import styles from './index.less';

const EmptyPage = (props) => (
  <div className={styles['c7n-workBench-empty']}>
    <img className={styles['c7n-workBench-empty-image']} alt="" src={defaultImg} />
    <div className={styles['c7n-workBench-empty-title']}>
      您还没有配置任何卡片，请通过“
      <span className={styles['c7n-workBench-empty-title-btn']}>卡片配置</span>
      ”添加卡片
    </div>
  </div>
);

export default EmptyPage;
