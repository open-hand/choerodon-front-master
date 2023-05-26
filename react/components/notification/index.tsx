/* eslint-disable react/require-default-props */
import React, {
  ReactNode, useCallback, useEffect,
  useMemo, useState, useRef,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, notification } from 'choerodon-ui/pro';
import { useRequest, useWhyDidYouUpdate } from 'ahooks';
import { noop } from 'lodash';
import WSHandler from '@/components/ws/WSHandler';
import WSProvider from '@/components/ws/WSProvider';
import Choerodon from '@/utils/choerodon';
import styles from './index.less';

type DescriptionType = ReactNode | string | ((wsData: object) => string | ReactNode)

interface Props {
  /**
   * 弹窗key，方便用于关闭
   */
  notificationKey: string,
  /**
   * 查询进度方式：轮询或ws
   * @default polling
   */
  type?: 'polling' | 'ws',
  /**
   * 成功后延迟执行2秒执行的回调函数
   */
  afterSuccess?: (data?: object) => void,
  /**
   * 用于ws方式下刚打开弹窗时查询，避免打开弹窗时ws已经发完
   */
  loadStatus?: () => Promise<string>,
  /**
   * 轮询模式下查询进度方法
   */
  loadProgress?: () => Promise<{ status: 'success' | 'failed' | 'doing', progress?: number, completedCount?:number, allTask?:number }>
  /**
   * 轮询间隔时间
   * @default 1500
   */
  duration?: number,
  /**
   * ws方式下messageKey
   */
  messageKey?: string,
  /**
   * 弹窗显示文案
   */
  textObject: {
    failed: {
      title: string,
      description: DescriptionType,
      icon?: string,
    },
    success: {
      title: string,
      description: DescriptionType,
      icon?: string,
    },
    doing: {
      title: string,
      description: DescriptionType,
      icon?: string,
    }
  }
  /**
   * 成功后自动关闭弹窗时间
   * @default 2000
   * @description 默认 2 秒后自动关闭，配置为 null 则不自动关闭
   */
  closeDuration?: number | null
  /**
   * ws方式下：自定义ws数据中的进度字段名
   * @default process
   */
  customProgressKey?: string
}

const CreateNotification = ({
  // @ts-ignore
  notificationKey, afterSuccess, textObject, messageKey, loadStatus: propsLoadStatus, type = 'polling', loadProgress = new Promise(noop),
  duration = 1500, closeDuration = 2000, customProgressKey = 'process',
}: Props) => {
  useWhyDidYouUpdate('CreateNotification', [textObject, propsLoadStatus, afterSuccess, notificationKey, duration, closeDuration]);

  const [progress, setProgress] = useState(0);
  const [wsData, setWsData] = useState({});
  const [loading, setLoading] = useState<boolean | 'success' | 'failed'>(true);

  const closeTimer = useRef<number | null>(null);
  const isOnMouseEnterRef = useRef(false);

  const { data: progressData, cancel, error } = useRequest(loadProgress, {
    pollingInterval: type === 'ws' ? 0 : duration,
  });

  const clearCloseTimer = useCallback(() => {
    const { current } = closeTimer;
    if (current) {
      window.clearTimeout(current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimer();
    notification?.close(notificationKey);
  }, [notificationKey]);

  const startCloseTimer = useCallback(() => {
    if (closeDuration !== null) {
      const { current } = closeTimer;
      if (current) {
        // 需要将旧的timeout清空
        window.clearTimeout(current);
      }
      closeTimer.current = window.setTimeout(close, closeDuration);
    }
  }, [close]);

  useEffect(() => clearCloseTimer, []);

  useEffect(() => {
    if (error) {
      cancel();
    }
  }, [error]);

  useEffect(() => {
    if (progressData?.status) {
      switch (progressData?.status) {
        case 'success': {
          // @ts-ignore
          onSuccess(progressData?.progress || (progressData?.completedCount / progressData?.allTask * 100));
          cancel();
          break;
        }
        case 'failed': {
          setLoading('failed');
          cancel();
          break;
        }
        default: {
          // @ts-ignore
          setProgress(Number(progressData?.progress || (progressData?.completedCount / progressData?.allTask * 100) || 0));
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

  const handleMouseEnter = useCallback(() => {
    isOnMouseEnterRef.current = true;
    clearCloseTimer();
  }, [clearCloseTimer]);

  const handleMouseLeave = useCallback(() => {
    isOnMouseEnterRef.current = false;
    if (loading === 'success') {
      startCloseTimer();
    }
  }, [loading, startCloseTimer]);

  const content = useMemo(() => (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
          {typeof text.description === 'function' ? text.description(wsData) : text.description}
        </div>
      </div>
    </div>
  ), [text, progress, wsData]);

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
    if (afterSuccess) {
      afterSuccess();
    }
    !isOnMouseEnterRef.current && startCloseTimer();
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
          onSuccess(data[customProgressKey]);
          setWsData(data);
          break;
        }
        case 'doing': {
          setProgress(Number(data[customProgressKey]));
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
