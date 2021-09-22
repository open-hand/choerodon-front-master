import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Layout({
  title, children, className, ...rest
} : LayoutProps) {
  return (
    <div className={classNames(styles.card, className)} {...rest}>
      <div className={styles['card-header']}>
        <div className={styles['card-header-title']}>{title}</div>
      </div>
      <div className={styles['card-content']}>{children}</div>
    </div>
  );
}

Layout.defaultProps = {
  className: '',
};
