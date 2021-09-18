import React from 'react';
import { noop } from 'lodash';
import defaultImg from '../../../img/empty.svg';

import styles from './index.less';

const EmptyPage = (props) => {
  const { isEdit = false, onOpenCardModal = noop } = props;


  return (
    <div className={styles['c7n-workBench-empty']}>
      <img className={styles['c7n-workBench-empty-image']} alt="" src={defaultImg} />
      {
        isEdit && (
          <div className={styles['c7n-workBench-empty-title']}>
            您还没有配置任何卡片，请通过“
            <span
              className={styles['c7n-workBench-empty-title-btn']}
              onClick={onOpenCardModal}
              role="none"
            >
              卡片配置
            </span>
            ”添加卡片
          </div>
        )
      }
      {
        !isEdit && (
          <div className={styles['c7n-workBench-empty-title']}>
            您还没有配置任何卡片，请“
            <span
              className={styles['c7n-workBench-empty-title-btn']}
              onClick={onOpenCardModal}
              role="none"
            >
              配置自定义视图
            </span>
            ”
          </div>
        )
      }
    </div>
  );
};

export default EmptyPage;
