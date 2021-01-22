import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, notification } from 'choerodon-ui';
import { axios } from '@/index';

import './index.less';

const ProjectNotification = observer(({
  organizationId, projectId, notificationKey, operateType,
  intlPrefix, formatMessage, refresh,
}) => {
  const prefixCls = 'c7ncd-project-create-notification';
  const iconType = useMemo(() => ({
    success: 'check_circle',
    failed: 'cancel',
  }), []);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(operateType === 'create' ? 'creating' : 'updating');
  const [sagaInstanceIds, setSagaInstanceIds] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const refreshList = useCallback(() => {
    const pathname = window.location.hash.match(/#(\S*)\?/)[1];
    if (pathname === '/projects') {
      refresh();
    }
  }, [window.location.hash]);

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`/iam/choerodon/v1/organizations/${organizationId}/saga/${projectId}?operateType=${operateType}`);
      if (res && !res.failed) {
        setStatus(res.status);
        if (res.status === 'success') {
          refreshList();
          setTimeout(() => {
            notification.close(notificationKey);
          }, 3000);
          return;
        }
        if (res.status === 'failed') {
          setSagaInstanceIds(res.sagaInstanceIds);
          refreshList();
          return;
        }
        setProgress(res.completedCount / res.allTask * 100);
        loadData();
      }
    } catch (e) {
      throw new Error(e);
    }
  }, [organizationId, projectId, operateType]);

  const handleRetry = useCallback(async () => {
    try {
      console.log(sagaInstanceIds);
      const res = await axios.put(`/hagd/v1/sagas/projects/${projectId}/tasks/instances/retry`, sagaInstanceIds);
      if (res && res.failed) {
        return;
      }
      loadData();
      refreshList();
    } catch (e) {
      throw new Error(e);
    }
  }, [projectId, sagaInstanceIds]);

  const getDescription = useMemo(() => {
    if (status !== 'failed') {
      return formatMessage({ id: `${intlPrefix}.saga.des.${status}.${operateType}` });
    }
    return (
      <div>
        <span>
          项目
          {operateType === 'create' ? '创建' : '更新'}
          失败, 您可在此
        </span>
        <span
          className={`${prefixCls}-retry`}
          onClick={handleRetry}
          role="none"
        >
          重试
        </span>
        此操作。
      </div>
    );
  }, [status, operateType, sagaInstanceIds]);

  return (
    <>
      {!['success', 'failed'].includes(status) && ([
        <div className={`${prefixCls}-progress`} style={{ width: `${progress}%` }} />,
        <div className={`${prefixCls}-progress-line`} style={{ width: `${progress}%` }} />,
      ])}
      <Icon type={iconType[status] || 'info'} className={`${prefixCls}-icon-${status} c7n-notification-notice-icon`} />
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-title c7n-notification-notice-message`}>
          {formatMessage({ id: `${intlPrefix}.saga.title.${status}.${operateType}` })}
        </div>
        <div className={`${prefixCls}-des`}>
          {getDescription}
        </div>
      </div>
    </>
  );
});

export default ProjectNotification;
