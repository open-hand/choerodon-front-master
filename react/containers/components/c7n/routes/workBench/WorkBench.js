import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import ResponsiveReactGridLayout from 'react-grid-layout';
import {
  map, get, filter,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import DragCard from '@/containers/components/c7n/components/dragCard';
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

  const generateDOM = useMemo(() => (
    componentsDs.map((record) => (
      <DragCard
        record={record}
        onDelete={() => handleDelete(record)}
        isEdit={isEdit}
        data-grid={record.toData()}
        key={record.get('i')}
        isStatic={record.get('i') === 'starTarget'}
      >
        {SwitchComponents(record.get('i'))}
      </DragCard>
    ))
  ), [componentsDs, handleDelete, isEdit]);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      breakpoints: 1200,
      margin: [18, 18],
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
        {generateDOM}
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
      </div>
    </Page>
  );
};

export default observer(WorkBench);
