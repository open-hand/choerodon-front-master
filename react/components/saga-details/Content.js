/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  createRef, useEffect, useState,
} from 'react';
import { Tabs } from 'choerodon-ui';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { Content, Choerodon } from '@/index';
import TaskRunDetail from './components/taskRunDetail';
import TaskDetail from './components/taskDetail';
import CodeShow from './components/codeShow';
import { useSagaDetailsStore } from './stores';

import './index.less';

const { TabPane } = Tabs;

let intervals;

const SagaDetails = () => {
  const {
    instance,
    intl: { formatMessage },
    intlPrefix,
    sagaStore,
    sagaInstanceId,
    apiGetway,
    organizationId,
    type,
    tips,
  } = useSagaDetailsStore();

  const {
    getData,
    getLineDatas,
    setLineData,
    setData,
    getTask,
    setTask,
    retry,
    loadDetailData,
  } = sagaStore;

  useEffect(() => {
    reload();
  }, [sagaInstanceId]);

  useEffect(() => {
    addScrollEventListener();
  }, []);

  useEffect(() => function () {
    intervals && clearInterval(intervals);
  }, []);

  const [isDetailShow, setIsDetailShow] = useState(false);
  const [jsonTitle, setJsontitle] = useState(false);
  const [activeTab, setActiveTab] = useState(instance ? 'run' : '');
  const [activeCode, setActiveCode] = useState('');
  const [json, setJson] = useState('');

  const taskImg = createRef(null);
  const taskDetail = createRef(null);

  const clsNames = classnames('c7n-saga-img-detail-wrapper', {
    'c7n-saga-instance': !!instance,
  });

  const getLineData = (tasks) => {
    const lineData = {};
    tasks.forEach((items) => items.forEach(
      (item) => { lineData[item.code || item.taskCode] = item; },
    ));

    const tempTask = { ...lineData[getTask?.code || getTask?.taskCode] };
    setTask(tempTask);
    setLineData(lineData);
  };

  const reload = async () => {
    try {
      const res = await loadDetailData(sagaInstanceId, apiGetway);
      if (res && res.failed) {
        Choerodon.prompt(res.message);
      } else {
        const { tasks, status: tempStatus } = res;
        setData(res);
        getLineData(tasks);
        if (tempStatus !== 'RUNNING' && intervals) {
          clearInterval(intervals);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  function handleRetry(taskId) {
    retry(taskId, organizationId, type, apiGetway).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        clearInterval(intervals);
        intervals = setInterval(() => reload(), 2000);
        reload();
        Choerodon.prompt(formatMessage({ id: `${intlPrefix}.task.retry.success` }));
      }
    });
  }

  const renderLine = () => (<div className="c7n-saga-img-line" />);

  function getSidebarContainer() {
    const content = document.body.getElementsByClassName('c7n-pro-modal-active')[0];
    return content.getElementsByClassName('c7n-pro-modal-body')[0];
  }

  function addScrollEventListener() {
    const container = getSidebarContainer();
    container.addEventListener('scroll', () => handleScroll(container));
  }

  const handleScroll = (container) => {
    const imgDom = taskImg.current;
    const detail = taskDetail.current;
    if (!imgDom) {
      return;
    }
    const imgHeight = imgDom.scrollHeight;
    const top = imgDom.offsetTop;
    if (detail && imgHeight + top > container.clientHeight && imgHeight > detail.scrollHeight) {
      const detailHeight = detail.scrollHeight;
      let detailTop = container.scrollTop;
      if (detailTop > top) {
        if (detailHeight > container.clientHeight) {
          detailTop = Math.min((imgHeight - detailHeight) + top, detailTop);
        }
        detail.style.cssText = `top: ${detailTop}px`;
        detail.classList.add('autoscroll');
      } else {
        detail.classList.remove('autoscroll');
        detail.style.cssText = '';
      }
    } else if (detail) {
      detail.classList.remove('autoscroll');
      detail.style.cssText = '';
    }
  };

  const showDetail = (code) => {
    if (!instance && code === 'output') {
      return;
    }
    if (code === 'input' || code === 'output') {
      setIsDetailShow(false);
      setJsontitle(formatMessage({ id: `${intlPrefix}.task.${code}.title` }));
      setActiveCode(code);
      setJson(getData[code]);
      const container = getSidebarContainer();
      handleScroll(container);
      return;
    }
    const tempTask = getLineDatas ? { ...getLineDatas[code] } : {};
    setIsDetailShow(true);
    setJsontitle(false);
    setTask(tempTask);
    setActiveCode(code);
    const container = getSidebarContainer();
    handleScroll(container);
  };

  const squareWrapper = (node, status = '') => {
    if (typeof node === 'string') {
      const classNames = classnames('c7n-saga-img-square', {
        'c7n-saga-task-active': node === activeCode,
        [status.toLowerCase()]: !!instance,
      });
      return (
        <div
          className={classNames}
          onClick={() => showDetail(node)}
          key={node}
        >
          <span>{node}</span>
        </div>
      );
    }
    return (
      <div className="c7n-saga-img-squares">
        {node}
      </div>
    );
  };

  const renderContent = () => {
    const { tasks } = getData;
    const line = renderLine();
    const content = [];
    if (tasks && tasks.length) {
      content.push(line);
      tasks.forEach((items) => {
        const node = items.map(({ code, taskCode, status }) => squareWrapper(code || taskCode, status));
        if (node && node.length === 1) {
          content.push(node);
        } else {
          content.push(squareWrapper(node));
        }
        content.push(line);
      });
      return content;
    }
    return line;
  };

  const circleWrapper = (code) => {
    const tempClsNames = classnames('c7n-saga-img-circle', {
      'c7n-saga-task-active': code.toLowerCase() === activeCode,
      output: !instance && code === 'Output',
    });
    return (
      <div
        className={tempClsNames}
        onClick={() => showDetail(code.toLowerCase())}
        key={code}
      >
        {code}
      </div>
    );
  };

  const handleTabChange = (TempActiveTab) => {
    setActiveTab(instance ? TempActiveTab : '');
  };

  const renderWithoutInstance = () => (
    <div className="c7n-saga-task-detail">
      <div className="c7n-saga-task-detail-title">
        <FormattedMessage id={`${intlPrefix}.task.detail.title`} />
      </div>
      <TaskDetail />
    </div>
  );

  const renderJson = () => (
    <div className="c7n-saga-task-detail">
      <div className="c7n-saga-task-detail-title">
        {jsonTitle}
      </div>
      <div className="c7n-saga-task-detail-content">
        <div className="c7n-saga-detail-json">
          <CodeShow
            value={json || formatMessage({ id: `${intlPrefix}.json.nodata` })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Content className="sidebar-content">
      {tips && (
      <div className={`${clsNames}-tips`}>
        <span>{tips}</span>
      </div>
      )}
      <div className={clsNames}>
        <div className="c7n-saga-img" ref={taskImg}>
          {circleWrapper('Input')}
          {renderContent()}
          {circleWrapper('Output')}
        </div>
        {isDetailShow && (
          <div className="c7n-saga-img-detail" ref={taskDetail}>
            {instance && (
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane
                tab={<FormattedMessage id={`${intlPrefix}.task.run.title`} />}
                key="run"
              />
              <TabPane
                tab={
                  <FormattedMessage id={`${intlPrefix}.task.detail.title`} />
                }
                key="detail"
              />
            </Tabs>
            )}
            {instance && activeTab === 'run' ? (
              <TaskRunDetail
                reload={reload}
                handleRetry={handleRetry}
              />
            ) : ''}
            {instance && activeTab !== 'run' ? <TaskDetail /> : ''}
            {instance ? '' : renderWithoutInstance()}
          </div>
        )}
        {jsonTitle && (
          <div className="c7n-saga-img-detail" ref={taskDetail}>
            {renderJson()}
          </div>
        )}
      </div>

    </Content>
  );
};

export default observer(SagaDetails);
