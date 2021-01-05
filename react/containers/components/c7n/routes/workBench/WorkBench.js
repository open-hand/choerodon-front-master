import React, {
  useCallback, useEffect,
} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { map, get, filter } from 'lodash';
import { observer } from 'mobx-react-lite';
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

const WorkBench = () => {
  useEffect(() => {

  }, []);

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

  function onLayoutChange(layout, tempLayouts) {
    setLayOuts(layout);
  }
  function handleDelete(dataGrid) {
    const tempLayout = filter(workBenchUseStore.layouts, (item) => get(dataGrid, 'type') !== get(item, 'i'));
    const tempComponents = getLayoutsComponents(tempLayout);
    workBenchUseStore.setComponents(tempComponents);
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

  const renderBg = useCallback(() => <GridBg />, []);

  const generateDOM = () => {
    const tempComponents = isEdit ? workComponents : componentsDs.toData();
    return (
      map(tempComponents, (item, i) => {
        const {
          layout,
        } = item;
        return (
          <DragCard
            dataGrid={item}
            onDelete={handleDelete}
            isEdit={isEdit}
            data-grid={layout}
            key={layout.i}
          >
            {SwitchComponents(get(layout, 'i'))}
          </DragCard>
        );
      })
    );
  };

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
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
      </div>
    </Page>
  );
};

export default observer(WorkBench);
