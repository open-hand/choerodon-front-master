// 只读页的头
import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '../../../../stores';
import WorkBenchTabs from '../WorkBenchTabs';
import styles from './index.less';

const WorkBenchHeader = () => {
  const {
    prefixCls,
    AppState: { getUserInfo },
  } = useWorkBenchStore();

  const {
    imageUrl,
    realName,
    email,
  } = getUserInfo || {};

  return (
    <div className={styles[`${prefixCls}-header`]}>
      <div className={styles[`${prefixCls}-header-main`]}>
        <div className={styles[`${prefixCls}-header-title`]}>
          {imageUrl ? (
            <img
              src={imageUrl}
              className={styles[`${prefixCls}-header-head`]}
              alt=""
            />
          ) : (
            <span className={styles[`${prefixCls}-header-head`]}>
              {(realName || '').substring(0, 1).toUpperCase()}
            </span>
          )}
          <span className={styles[`${prefixCls}-header-name`]}>Hi，{realName}</span>
          <div className={styles[`${prefixCls}-header-email`]}>
            <Icon type="email-o" className={styles[`${prefixCls}-header-icon`]} />
            <span className="c7n-selfInfo-email-text">{email}</span>
          </div>
        </div>
      </div>
      {/* 因为UI图的底边不足2px，需要border来补充，所以用单独的div来放背景图 */}
      <div className={styles[`${prefixCls}-header-right-bg`]} />
      <WorkBenchTabs />
    </div>
  );
};

export default WorkBenchHeader;
