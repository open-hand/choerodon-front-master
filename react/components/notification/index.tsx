/* eslint-disable react/require-default-props */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, notification } from 'choerodon-ui/pro';
import { useRequest } from 'ahooks';
import { noop } from 'lodash';
import WSHandler from '@/components/ws/WSHandler';
import WSProvider from '@/components/ws/WSProvider';
import Choerodon from '@/utils/choerodon';
import styles from './index.less';

interface Props {
  notificationKey: string,
  type?: 'polling' | 'ws', // 查询进度方式：轮询或ws
  afterSuccess?: () => void, // 成功后回调函数
  loadStatus?: () => Promise<string>, // 用于ws方式下刚打开弹窗时查询，避免打开弹窗时ws已经发完
  loadProgress?: () => Promise<{ status: 'success' | 'failed' | 'doing', progress: number }>
  duration?: number // 轮询间隔时间
  messageKey?: string, // ws方式下messageKey
  // 弹窗显示文案
  textObject: {
    failed: {
      title: string,
      description: ReactNode,
      icon?: string,
    },
    success: {
      title: string,
      description: ReactNode,
      icon?: string,
    },
    doing: {
      title: string,
      description: ReactNode,
      icon?: string,
    }
  }
}

const CreateNotification = ({
  // @ts-ignore
  notificationKey, afterSuccess, textObject, messageKey, loadStatus: propsLoadStatus, type = 'polling', loadProgress = new Promise(noop), duration = 1500,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState<boolean | 'success' | 'failed'>(true);
  const { data: progressData, cancel, error } = useRequest(loadProgress, {
    pollingInterval: type === 'ws' ? 0 : duration,
  });
  useEffect(() => {
    if (error) {
      cancel();
    }
  }, [error]);
  useEffect(() => {
    if (progressData?.status) {
      switch (progressData?.status) {
        case 'success': {
          onSuccess(progressData.progress);
          cancel();
          break;
        }
        case 'failed': {
          setLoading('failed');
          cancel();
          break;
        }
        default: {
          setProgress(Number(progressData.progress || 0));
        }
      }
    }
  }, [progressData]);
  const text = useMemo(() => {
    switch (loading) {
      case 'failed':
        return {
          icon: 'cancel',
          className: styles.icon_failed,
          ...textObject.failed,
        };
      case 'success':
        return {
          icon: 'check_circle',
          className: styles.icon_success,
          ...textObject.success,
        };
      default:
        return {
          icon: 'info',
          className: styles.icon_doing,
          ...textObject.doing,
        };
    }
  }, [loading]);

  const content = useMemo(() => (
    <>
      {typeof loading === 'boolean' && ([
        <div className={styles.progress} style={{ width: `${progress}%` }} />,
        <div className={styles.progress_line} style={{ width: `${progress}%` }} />,
      ])}
      <Icon type={text.icon} className={`${text.className} c7n-notification-notice-icon`} />
      <div className={styles.content}>
        <div className={`${styles.title} c7n-notification-notice-message`}>
          {text.title}
        </div>
        <div className={styles.des}>
          {text.description}
        </div>
      </div>
    </>
  ), [text, progress]);

  const loadStatus = useCallback(async () => {
    if (progress === 0 && propsLoadStatus) {
      const res = await propsLoadStatus();
      if (res === 'succeed') {
        setProgress(80);
        setTimeout(() => onSuccess && onSuccess(100), 500);
      } else if (res === 'failed') {
        setLoading('failed');
      }
    }
  }, [propsLoadStatus, progress]);

  useEffect(() => {
    setTimeout(() => loadStatus(), 1000);
  }, []);

  const onSuccess = useCallback((newProcess) => {
    if (loading === 'success') {
      return;
    }
    setLoading('success');
    setProgress(Number(newProcess));
    setTimeout(() => {
      if (afterSuccess) {
        afterSuccess();
      }
      notification?.close(notificationKey);
    }, 2000);
  }, [loading, afterSuccess, notificationKey]);

  const handleMessage = (message: string) => {
    if (message === 'ok') {
      return;
    }
    const data = JSON.parse(message);
    if (data) {
      const { status, process } = data;
      switch (status) {
        case 'succeed': {
          onSuccess(process);
          break;
        }
        case 'doing': {
          setProgress(Number(process));
          break;
        }
        case 'failed': {
          setLoading('failed');
          break;
        }
        default: break;
      }
    }
  };

  return type === 'ws' ? (
    <WSProvider server={Choerodon.WEBSOCKET_SERVER}>
      <WSHandler
        messageKey={messageKey}
        onMessage={handleMessage}
      >
        {content}
      </WSHandler>
    </WSProvider>
  ) : content;
};

const ObserverCreateNotification = observer(CreateNotification);

const openCreateNotification = (props: Props) => {
  notification.open({
    key: props.notificationKey,
    message: <span className={styles.notification_title}>生成快照</span>,
    description: (
      <ObserverCreateNotification {...props} />
    ),
    duration: null,
    placement: 'bottomLeft',
    className: styles.notification,
  });
};

export default openCreateNotification;
