import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import ResponsiveReactGridLayout from 'react-grid-layout';
import {
  map, get, filter,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import DragCard from '@/containers/components/c7n/components/dragCard';
import { Modal } from 'choerodon-ui/pro';
import { Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/QuickLink';
import TodoThings from './components/TodoThings';
import { useWorkBenchStore } from './stores';
import GridBg from '../../components/gridBackground';
import QuestionTodo from './components/question-todo';
import QuestionFocus from './components/question-focus';
import QuestionBug from './components/question-bug';
import UserConfirmationTwo from '../../components/UserConfirm';

import './WorkBench.less';

let observerLayout;

const ComponetsObjs = {
  starTarget: <StarTargetPro />,
  selfInfo: <SelfIntro />,
  todoQustions: <QuestionTodo />,
  myStar: <QuestionFocus />,
  myDefect: <QuestionBug />,
  todoThings: <TodoThings />,
  serviceList: <ServiceList />,
  quickLink: <QuickLink />,
  doc: <Doc />,
  envList: <EnvList />,
};

const WorkBench = () => {
  const {
    workBenchUseStore,
    prefixCls,
    componentsDs,
    history,
  } = useWorkBenchStore();

  const {
    isEdit,
  } = workBenchUseStore;

  const [layOutWidth, setWidth] = useState(0);

  useEffect(() => {
    if (!observerLayout) {
      const domTem = document.querySelector(`.${prefixCls}-container`);
      if (domTem) {
        new ResizeObserver((entries) => {
          const dom = get(entries[0], 'target');
          const width = get(dom, 'offsetWidth');
          setWidth(width);
        }).observe(domTem);
      }
    }
  }, []);

  useEffect(() => function () {
    observerLayout && observerLayout.disconnect();
  });

  function openEditAlertModal(props) {
    Modal.open({
      title: '提示',
      children: '工作台改动未保存，是否进行保存?',
      cancelProps: {
        color: 'dark',
      },
      onOk() {
        const tempData = componentsDs.toData();
        workBenchUseStore.setInitData(tempData);
        workBenchUseStore.saveConfig(tempData);
        workBenchUseStore.setEdit(false);
      },
      onCancel() {
        history.push({ ...props });
        return true;
      },
    });
    return false;
  }

  function onLayoutChange(layouts, tempLayouts) {
    componentsDs.loadData(layouts);
  }

  function handleDelete(record) {
    componentsDs.remove(record);
  }

  const SwitchComponents = (type) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    if (hasOwnProperty) {
      tempComponent = ComponetsObjs[type];
    }
    return tempComponent;
  };

  const renderBg = useCallback(() => <GridBg selector={`.${prefixCls}-container`} />, []);

  const generateDOM = () => (
    componentsDs.map((record) => (
      <DragCard
        record={record}
        onDelete={() => handleDelete(record)}
        isEdit={isEdit}
        key={record.get('i')}
        isStatic={record.get('i') === 'starTarget'}
      >
        {SwitchComponents(record.get('i'))}
      </DragCard>
    ))
  );

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      breakpoints: 1200,
      margin: [18, 18],
      layout: componentsDs.toData(),
      resizeHandles: ['se'],
      cols: 12,
      measureBeforeMount: true,
      containerPadding: [0, 0],
      useCSSTransformss: true,
      rowHeight: 100,
      shouldComponentUpdate: true,
      width: layOutWidth,
      isDraggable: isEdit,
      isResizable: isEdit,
    };

    return (
      <ResponsiveReactGridLayout
        {...tempObj}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    );
  };

  return (
    <Page className={`${prefixCls}`}>
      <div
        className={`${prefixCls}-container`}
      >
        {isEdit && renderBg()}
        {
          renderGridLayouts()
        }
        <UserConfirmationTwo when={workBenchUseStore.isEdit} title="提示" content="工作台配置尚未保存，是否跳转到新页面？" />
      </div>
    </Page>
  );
};

export default observer(WorkBench);
