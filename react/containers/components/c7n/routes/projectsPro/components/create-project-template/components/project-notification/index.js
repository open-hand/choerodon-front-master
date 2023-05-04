import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  CheckBox,
} from 'choerodon-ui/pro';
import { Icon, notification } from 'choerodon-ui';
import NotifitionModal from '../notifition-modal';
import { axios } from '@/index';

import './index.less';

const ProjectNotification = observer(({
  organizationId, projectId, notificationKey, operateType,
  intlPrefix, formatMessage, refresh, isRetry, setSuccess,
}) => {
  let interval;
  const prefixCls = 'c7ncd-project-create-notification';
  const iconType = useMemo(() => ({
    success: 'check_circle',
    failed: 'cancel',
  }), []);
  const [progress, setProgress] = useState(0);
  const [check, setCheck] = useState(true);
  const [status, setStatus] = useState(operateType === 'create' ? 'creating' : 'updating');
  const [sagaInstanceIds, setSagaInstanceIds] = useState();

  useEffect(() => {
    setNewInterval();
    return () => { handleClearInterval(); };
  }, []);

  const setNewInterval = useCallback(() => {
    handleClearInterval();
    interval = setInterval(loadData, 1500);
  }, []);

  const handleClearInterval = useCallback(() => {
    if (interval) {
      clearInterval(interval);
    }
  }, [interval]);

  const refreshList = useCallback(() => {
    const pathname = window.location.hash.match(/#(\S*)\?/)[1];
    if (pathname === '/projects') {
      refresh();
    }
  }, [window.location.hash]);
  // 控制下次创建是否还提示
  const handleChange = (value) => {
    setCheck(value);
    if (value) {
      sessionStorage.setItem('checkFlag', 'check');
    }
  };
  const loadData = useCallback(async () => {
    if (isRetry) {
      await axios.put(`cbase/choerodon/v1/organizations/${organizationId}/saga/${projectId}/retry?operateType=${operateType}`);
    }
    try {
      const res = await axios.get(`/cbase/choerodon/v1/organizations/${organizationId}/saga/${projectId}?operateType=${operateType}`);
      if (res && !res.failed) {
        setStatus(res.status);
        if (res.status === 'success') {
          if (operateType === 'create') {
            !sessionStorage.getItem('checkFlag') && Modal.open({
              key: Modal.key(),
              title: '项目模板指引',
              children: <NotifitionModal />,
              okCancel: false,
              okText: '关闭',
              style: { width: 600 },
              bodyStyle: { background: '#f5f6fa' },
              // onOk: () => {
              //   setSuccess();
              // },
              footer: (okBtn, cancelBtn) => (
                <div className={`${prefixCls}-modal-footer`}>
                  <div className={`${prefixCls}-modal-footer-check`}>
                    <CheckBox value={check} onChange={handleChange}>
                      关闭游览器前不再提示
                    </CheckBox>
                  </div>
                  {okBtn}
                </div>
              ),
            });
          }
          setSuccess();
          handleClearInterval();
          refreshList();
          setTimeout(() => {
            notification.close(notificationKey);
          }, 1000);
          return;
        }
        if (res.status === 'failed') {
          handleClearInterval();
          setSagaInstanceIds(res.sagaInstanceIds);
          refreshList();
          return;
        }
        setProgress(res.completedCount / res.allTask * 100);
      }
    } catch (e) {
      handleClearInterval();
      throw new Error(e);
    }
  }, [organizationId, projectId, operateType]);

  const handleRetry = useCallback(async () => {
    try {
      const res = await axios.put(`/hagd/v1/sagas/projects/${projectId}/tasks/instances/retry`, sagaInstanceIds);
      if (res && res.failed) {
        return;
      }
      setNewInterval();
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
