import React, {
  useCallback, useMemo,
} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import {
  map, get, filter, omit, forEach, findIndex,
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

  function onLayoutChange(layouts, tempLayouts) {
    workBenchUseStore.setEditLayout(layouts);
  }

  function handleDelete(dataGrid) {
    const tempArr = workBenchUseStore.editLayout;
    componentsDs.loadData(filter(tempArr, (item) => item.i !== dataGrid.i));
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

  const generateDOM = useMemo(() => {
    const mainData = componentsDs.toData();
    return (
      mainData.map((dataGrid, i) => (
        <DragCard
          dataGrid={dataGrid}
          onDelete={() => handleDelete(dataGrid)}
          isEdit={isEdit}
          data-grid={dataGrid}
          key={dataGrid.i}
        >
          {SwitchComponents(get(dataGrid, 'i'))}
        </DragCard>
      ))
    );
  }, [componentsDs, handleDelete, isEdit]);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      breakpoints: {
        lg: 1200,
      },
      margin: [18, 18],
      resizeHandles: ['se'],
      cols: {
        lg: 12,
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
