import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSagaDetailsStore } from '../../stores';
import CodeShow from '../codeShow';

const TaskDetail = () => {
  const {
    intl: { formatMessage },
    instance,
    sagaStore,
    intlPrefix,
  } = useSagaDetailsStore();

  const {
    getTask,
  } = sagaStore;

  const {
    code,
    taskCode,
    description,
    seq,
    maxRetryCount,
    timeoutSeconds,
    timeoutPolicy,
    service,
    concurrentLimitPolicy,
    concurrentLimitNum,
    inputSchema,
  } = getTask;

  const list = [{
    key: formatMessage({ id: `${intlPrefix}.task.code` }),
    value: code || taskCode,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.desc` }),
    value: description,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.seq` }),
    value: seq,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.concurrentlimit.policy` }),
    value: concurrentLimitPolicy,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.concurrentlimit.num` }),
    value: concurrentLimitNum,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.max-retry` }),
    value: maxRetryCount,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.timeout.time` }),
    value: timeoutSeconds,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.timeout.policy` }),
    value: timeoutPolicy,
  }, {
    key: formatMessage({ id: `${intlPrefix}.task.service` }),
    value: service,
  }];
  const input = {
    key: formatMessage({ id: `${intlPrefix}.task.input.demo` }),
  };
  return (
    <div className="c7n-saga-task-detail">
      <div className="c7n-saga-task-detail-content">
        {list.map(({ key, value }) => (
          <div className="c7n-saga-task-detail-content-item">
            <div className="c7n-saga-task-detail-content-label">{key}</div>
            <div className="c7n-saga-task-detail-content-value">{value}</div>
          </div>
        ))}
        {!instance && (
          <div>
            {input.key}
            :
            <div className="c7n-saga-detail-json">
              <CodeShow
                value={inputSchema}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(TaskDetail);
