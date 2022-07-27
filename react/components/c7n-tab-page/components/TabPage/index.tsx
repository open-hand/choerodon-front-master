import React from 'react';
import classNames from 'classnames';
import { Loading } from '@choerodon/components';
import { Permission } from '@/components/permission';
import { useInject } from '@/hooks';
import NoAccess from '@/components/c7n-error-pages/403';
import { C7NPageProps } from '../../interface';
import './index.less';

const prefixCls = 'page-tab-container';

const TabPage = ({
  className, service, onAccess, ...props
}:C7NPageProps) => {
  const [list]: any[] = useInject({
    idList: ['master-global:loadingType'],
  });

  const classString = classNames(prefixCls, className);

  const content = (
    <div
      className={classString}
      {...props}
    />
  );

  if (service && service.length) {
    return (
      <Permission
        service={service}
        defaultChildren={<Loading type={list?.['master-global:loadingType'] || 'c7n'} />}
        noAccessChildren={<NoAccess />}
        onAccess={onAccess}
      >
        {content}
      </Permission>
    );
  }
  return content;
};

export default TabPage;
