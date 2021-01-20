import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';

import './index.less';

const ProjectNotification = observer(({ notificationKey, isModify }) => {
  const prefixCls = 'c7ncd-project-create-notification';
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState('pending');

  const getTitle = useMemo(() => {
    let [iconType, title, des] = ['info', '创建项目', '正在创建项目'];
    switch (status) {
      case 'updating':
        [title, des] = ['修改项目', '正在修改项目'];
        break;
      case 'failed':
        [iconType, title, des] = ['cancel', '修改项目', '正在修改项目'];
        break;
      case 'success':
        [iconType, title, des] = ['check_circle', '修改项目', '正在修改项目'];
        break;
    }
  }, [status]);

  return (
    <>
      <div className={`${prefixCls}-progress`} style={{ width: `${progress}%` }} />
      <div className={`${prefixCls}-progress-line`} style={{ width: `${progress}%` }} />
      <div className={`${prefixCls}-content`}>
        <Icon type="info" className={`${prefixCls}-notification-icon`} />
        <div className={`${prefixCls}-title .c7n-notification-notice-message`}>创建项目</div>
        <div className={`${prefixCls}-des`}>正在创建项目</div>
      </div>
    </>
  );
});

export default ProjectNotification;
