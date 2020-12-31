import React, { useCallback, useEffect, useRef } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { map, get } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Button } from 'choerodon-ui';
import { Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
// import WorkBenchAgile from './components/WorkBenchAgile';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/QuickLink';
import DragCard from './components/dragCard';
import TodoThings from './components/TodoThings';

import './WorkBench.less';
import { useWorkBenchStore } from './stores';
import GridBg from './components/gridBackground';
import TodoQuestion from './components/TodoQuestion';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const WorkBench = () => {
  useEffect(() => {

  }, []);

  const {
    workBenchUseStore,
    prefixCls,
  } = useWorkBenchStore();

  const {
    setLayOuts,
    layouts,
    addNewComponents,
    deleteComponents,
    isEdit,
  } = workBenchUseStore;

  function onLayoutChange(layout, tempLayouts) {
    setLayOuts(tempLayouts);
  }
  function handleDelete(dataGrid) {
    deleteComponents(dataGrid);
  }

  const SwitchComponents = (type) => {
    let tempComponent;
    switch (type) {
      case 'starTarget':
        tempComponent = <StarTargetPro />;
        break;
      case 'selfInfo':
        tempComponent = <SelfIntro />;
        break;
      case 'todoQustions':
        tempComponent = <TodoQuestion />;
        break;
      case 'todoThings':
        tempComponent = <TodoThings />;
        break;
      case 'serviceList':
        tempComponent = <ServiceList />;
        break;
      case 'quickLink':
        tempComponent = <QuickLink />;
        break;
      case 'doc':
        tempComponent = <Doc />;
        break;
      case 'envList':
        tempComponent = <EnvList />;
        break;
      default:
        break;
    }
    return tempComponent;
  };

  const generateDOM = useCallback(() => (
    map(workBenchUseStore.getWorkComponents, (l, i) => (
      <DragCard
        dataGrid={l}
        key={l.i}
        data-grid={l}
        onDelete={handleDelete}
        isEdit={isEdit}
      >
        {SwitchComponents(get(l, 'type'))}
      </DragCard>
    ))
  ), [handleDelete, workBenchUseStore.getWorkComponents]);

  const renderBg = useCallback(() => <GridBg />, []);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      layouts: workBenchUseStore.getLayouts,
      onLayoutChange,
      breakpoints: {
        lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0,
      },
      margin: [18, 18],
      resizeHandles: ['se'],
      cols: {
        lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
      },
      measureBeforeMount: isEdit,
      containerPadding: [4, 0],
      useCSSTransformss: !isEdit,
      rowHeight: 100,
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
        {isEdit && renderGridLayouts()}
        {!isEdit && renderGridLayouts() }
      </div>

      {/* <div className="c7n-workbench-left">
      <StarTargetPro />
      <WorkBenchAgile />
      <div style={{ display: 'flex' }}>
        <QuickLink />
        <Doc />
      </div>
    </div>
    <div className="c7n-workbench-right">
      <SelfIntro />
      <ServiceList />
      <EnvList />
    </div> */}

    </Page>
  );
};

export default observer(WorkBench);
