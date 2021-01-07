import React, {
  useCallback, useMemo,
} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import {
  map, get, filter, omit, forEach,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import { Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/QuickLink';
import DragCard from './components/dragCard';
import TodoThings from './components/TodoThings';
import { useWorkBenchStore } from './stores';
import GridBg from './components/gridBackground';
import QuestionTodo from './components/question-todo';
import QuestionFocus from './components/question-focus';
import QuestionBug from './components/question-bug';

import './WorkBench.less';

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
    setLayOuts,
    isEdit,
    getLayoutsComponents,
    workComponents,
  } = workBenchUseStore;

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

  const renderBg = useCallback(() => <GridBg />, []);

  const generateDOM = useMemo(() => (
    componentsDs.map((record, i) => {
      const layout = record.toData();
      return (
        <DragCard
          record={record}
          onDelete={() => handleDelete(record)}
          isEdit={isEdit}
          key={layout.i}
        >
          {SwitchComponents(get(layout, 'i'))}
        </DragCard>
      );
    })
  ), [componentsDs, handleDelete, isEdit]);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      layouts: {
        lg: componentsDs.toData(),
      },
      breakpoints: {
        lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0,
      },
      margin: [18, 18],
      resizeHandles: ['se'],
      cols: {
        lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
      },
      measureBeforeMount: true,
      containerPadding: [4, 0],
      useCSSTransformss: true,
      rowHeight: 100,
      shouldComponentUpdate: true,
    };

    const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
