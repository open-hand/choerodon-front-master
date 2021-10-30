import React from 'react';
import classNames from 'classnames';
import { Permission } from '@/components/permission';
import NoAccess from '@/components/c7n-error-pages/403';
import Skeleton from '@/components/skeleton';
import './index.less';
import { C7NPageProps } from '../../interface';

const Page:React.FC<C7NPageProps> = ({
  className, service, onAccess, ...props
}) => {
  const cls = classNames('page-container', className);

  const pageContent = <div {...props} className={cls} />;

  if (service && service.length) {
    return (
      <Permission
        service={service}
        defaultChildren={<Skeleton />}
        noAccessChildren={<NoAccess />}
        onAccess={onAccess}
      >
        {pageContent}
      </Permission>
    );
  }
  return pageContent;
};

export default Page;
