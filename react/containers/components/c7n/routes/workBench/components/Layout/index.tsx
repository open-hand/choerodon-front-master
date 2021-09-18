import React from 'react';
import classNames from 'classnames';
import { Spin } from 'choerodon-ui/pro';
import styles from './index.less';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export default function Layout({
  title, children, className, loading, ...rest
} : LayoutProps) {
  return (
    <div className={classNames(styles.card, className)} {...rest}>
      <div className={styles['card-header']}>
        <div className={styles['card-header-title']}>{title}</div>
      </div>
      <Spin spinning={loading}>
        <div className={styles['card-content']}>{children}</div>
      </Spin>
    </div>
  );
}

Layout.defaultProps = {
  className: '',
  loading: false,
};
