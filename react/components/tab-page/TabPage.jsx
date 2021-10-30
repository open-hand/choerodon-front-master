import React from 'react';
import classNames from 'classnames';
import { Spin } from 'choerodon-ui/pro';
import { Permission } from '@/components/permission';
import NoAccess from '@/components/c7n-error-pages/403';

const spinStyle = {
  textAlign: 'center',
  paddingTop: 300,
};

const defaultChildren = (
  <div style={spinStyle}>
    <Spin size="large" />
  </div>
);

const TabPage = ({
  className, service, onAccess, ...props
}) => {
  const classString = classNames(className);
  const page = (
    <div
      {...props}
      className={classString}
      style={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F6FA',
      }}
    />
  );
  if (service && service.length) {
    return (
      <Permission
        service={service}
        defaultChildren={defaultChildren}
        noAccessChildren={<NoAccess />}
        onAccess={onAccess}
      >
        {page}
      </Permission>
    );
  }
  return page;
};

export default TabPage;
