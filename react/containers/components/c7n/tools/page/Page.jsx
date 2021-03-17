import React from 'react';
import classNames from 'classnames';
import { Spin } from 'choerodon-ui';
import Permission from '../permission';
import NoAccess from '../error-pages/403';
import Skeleton from '../../master/skeleton';

const spinStyle = {
  textAlign: 'center',
  paddingTop: 300,
};

const defaultChildren = (
  <div style={spinStyle}>
    <Spin size="large" />
  </div>
);

const Page = ({
  className, service, onAccess, ...props
}) => {
  const classString = classNames('page-container', className);
  const page = <div {...props} className={classString} />;
  if (service && service.length) {
    return (
      <Permission
        service={service}
        defaultChildren={<Skeleton />}
        noAccessChildren={<NoAccess />}
        onAccess={onAccess}
      >
        {page}
      </Permission>
    );
  }
  return page;
};

export default Page;
