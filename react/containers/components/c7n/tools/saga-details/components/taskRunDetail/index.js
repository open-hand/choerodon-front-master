/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Choerodon } from '@/index';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import CodeShow from '../codeShow';
import { useSagaDetailsStore } from '../../stores';

const TaskRunDetail = (props) => {
  const {
    reload,
    handleRetry,
  } = props;

  const {
    intlPrefix,
    intl: {
      formatMessage,
    },
    sagaStore,
    apiGetway,
  } = useSagaDetailsStore();

  const {
    unLock,
    abort,
  } = sagaStore;

  const {
    code,
    taskCode,
    status,
    seq,
    maxRetryCount,
    retriedCount,
    instanceLock,
    exceptionMessage,
    output,
    plannedStartTime,
    actualStartTime,
    actualEndTime,
    id: taskId,
  } = sagaStore && sagaStore.getTask;

  const renderStatus = (tempStatus) => {
    let obj = {};
    switch (tempStatus) {
      case 'RUNNING':
        obj = {
          key: 'running',
          value: '运行中',
        };
        break;
      case 'FAILED':
        obj = {
          key: 'failed',
          value: '失败',
        };
        break;
      case 'WAIT_TO_BE_PULLED':
        obj = {
          key: 'queue',
          value: '等待被拉取',
        };
        break;
      case 'COMPLETED':
        obj = {
          key: 'completed',
          value: '完成',
        };
        break;
      default:
        break;
    }
    return (
      <span className={`c7n-saga-status ${obj.key}`}>
        {obj.value}
      </span>
    );
  };

  const list = [
    {
      key: formatMessage({ id: `${intlPrefix}.task.code` }),
      value: code || taskCode,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.run.status` }),
      value: renderStatus(status),
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.seq` }),
      value: seq,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.run.service-instance` }),
      value: instanceLock,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.max-retry` }),
      value: maxRetryCount,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.run.retried` }),
      value: retriedCount,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.plannedstarttime` }),
      value: plannedStartTime,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.actualstarttime` }),
      value: actualStartTime,
    },
    {
      key: formatMessage({ id: `${intlPrefix}.task.actualendtime` }),
      value: actualEndTime,
    },
  ];

  const failed = {
    key: formatMessage({ id: `${intlPrefix}.task.run.exception.msg` }),
    value: exceptionMessage,
  };

  const completed = {
    key: formatMessage({ id: `${intlPrefix}.task.run.result.msg` }),
  };

  function handleUnLock() {
    unLock(taskId, apiGetway).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        reload();
        Choerodon.prompt(formatMessage({ id: `${intlPrefix}.task.unlock.success` }));
      }
    });
  }

  function handleAbort() {
    abort(taskId, apiGetway).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        reload();
      }
    });
  }

  function handleCopy() {
    const tempFailed = document.getElementById('failed');
    tempFailed.value = exceptionMessage;
    tempFailed.select();
    document.execCommand('copy');
    Choerodon.prompt(formatMessage({ id: 'copy.success' }));
  }

  return (
    <div className="c7n-saga-task-run">
      <div className="c7n-saga-task-btns">
        {instanceLock && (status === 'RUNNING' || status === 'FAILED') && (
          <span onClick={handleUnLock}>
            <Icon type="lock_open" />
            {formatMessage({ id: `${intlPrefix}.task.unlock` })}
          </span>
        )}
        {status === 'FAILED' && (
          <span onClick={() => handleRetry(taskId)}>
            <Icon type="sync" />
            {formatMessage({ id: `${intlPrefix}.task.retry` })}
          </span>
        )}
        {(status === 'RUNNING' || status === 'WAIT_TO_BE_PULLED') && (
          <span onClick={handleAbort} style={{ color: '#f44336' }}>
            <Icon type="power_settings_new" />
            {formatMessage({ id: `${intlPrefix}.task.abort` })}
          </span>
        )}
      </div>
      <div className="c7n-saga-task-detail">
        <div className="c7n-saga-task-detail-content">
          {list.map(({ key, value }) => (
            <div className="c7n-saga-task-detail-content-item">
              <div className="c7n-saga-task-detail-content-label">{key}</div>
              <div className="c7n-saga-task-detail-content-value">{value}</div>
            </div>
          ))}
          {status === 'FAILED' && (
            <div>
              {failed.key}
              :
              <div className="c7n-saga-detail-json">
                <pre style={{ maxHeight: '350px' }}><code>{failed.value.trim()}</code></pre>
                <textarea id="failed" />
                {failed.value && (
                <Icon
                  type="library_books"
                  className="copy-icon"
                  onClick={handleCopy}
                />
                )}
              </div>
            </div>
          )}
          {status === 'COMPLETED' && (
            <div>
              <span className="c7n-saga-task-detail-content-label">{completed.key}</span>
              <div className="c7n-saga-detail-json">
                <CodeShow
                  value={output}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(TaskRunDetail);
