import React, { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { get, noop } from 'lodash';

import DragCard from '@/containers/components/c7n/components/dragCard';
import EmptyCard from '@/containers/components/c7n/components/EmptyCard';
import GridBg from '@/containers/components/c7n/components/gridBackground';
// import UserConfirmationTwo from '@/containers/components/c7n/components/UserConfirm';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import useUpgrade from '@/hooks/useUpgrade';
import EmptyPage from '../../list/components/empty-page';
import StarTargetPro from '../StarTargetPro';
import SelfIntro from '../SelfIntro';
import ServiceList from '../ServiceList';
import Doc from '../doc';
import EnvList from '../EnvList';
import QuickLink from '../QuickLink';
import TodoThings from '../TodoThings';
import QuestionTodo from '../question-todo';
import QuestionFocus from '../question-focus';
import QuestionBug from '../question-bug';
import QuestionReport from '../question-report';
import ExecutionQuestions from '../question-execution';

import SelfCode from '../SelfCode';
import MyHandler from '../my-handler';
import ResourceOverview from '../ResourceOverview';
import ResourceMonitoring from '../ResourceMonitoring';
import BeginnerGuide from '../BeginnerGuide';
import Notice from '../Notice';
import { useWorkBenchStore } from '../../stores';
import './index.less';
import HeaderButtons from '@/containers/components/c7n/tools/header-btns';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ComponetsObjs = {
  starTarget: <StarTargetPro />,
  selfInfo: <SelfIntro />,
  todoQustions: <QuestionTodo />,
  myReport: <QuestionReport />,
  myStar: <QuestionFocus />,
  myDefect: <QuestionBug />,
  todoThings: <TodoThings />,
  serviceList: <ServiceList />,
  quickLink: <QuickLink />,
  doc: <Doc />,
  envList: <EnvList />,
  selfCode: <SelfCode />,
  myExecution: <ExecutionQuestions />,
  myhandler: <MyHandler />,
  resourceOverview: <ResourceOverview />,
  resourceMonitoring: <ResourceMonitoring />,
  beginnerGuide: <BeginnerGuide />,
  notice: <Notice />,
};

let observerLayout;

export function injectWorkBench(key, component) {
  ComponetsObjs[key] = component;
}
const groupMap = new Map([
  ['devops', 'DevOps管理'],
  ['agile', '敏捷管理'],
  ['backlog', '需求管理'],
  ['resourceManagement', 'DevOps管理'], // 资源管理目前和devops模块关联
]);

const fdLevelMap = new Map([
  ['site', '平台'],
  ['organization', '组织'],
  ['project', '项目'],
]);

const WorkBenchDashboard = (props) => {
  const {
    prefixCls,
    dashboardDs,
    allowedModules,
    AppState,
    addCardDs,
  } = useWorkBenchStore();

  const isMounted = useRef(false);
  const [containerWidth, setContainerWidth] = useState(1280);

  const { isEdit = false, onOpenCardModal = noop } = props;

  const loadLayout = () => {
    dashboardDs.setQueryParameter('dashboardId', props.dashboardId);
    dashboardDs.query();
  };

  useEffect(() => {
    if (props.dashboardId) {
      loadLayout();
    }
  }, [props.dashboardId]);

  const { data: needUpgrade } = useUpgrade({
    organizationId: AppState.currentMenuType?.organizationId,
  });

  useEffect(() => {
    if (!observerLayout) {
      const domTem = document.querySelector(`.${prefixCls}-container`);
      if (domTem) {
        new ResizeObserver((entries) => {
          const dom = get(entries[0], 'target');
          const width = get(dom, 'offsetWidth');
          setContainerWidth(width);
        }).observe(domTem);
      }
    }
  }, []);

  useEffect(() => function () {
    observerLayout && observerLayout.disconnect();
  });

  // function openEditAlertModal(props) {
  //   Modal.open({
  //     title: '提示',
  //     children: '工作台改动未保存，是否进行保存?',
  //     cancelProps: {
  //       color: 'dark',
  //     },
  //     onOk() {
  //       const tempData = dashboardDs.toData();
  //       workBenchUseStore.setInitData(tempData);
  //       workBenchUseStore.saveConfig(tempData);
  //       workBenchUseStore.setEdit(false);
  //     },
  //     onCancel() {
  //       history.push({ ...props });
  //       return true;
  //     },
  //   });
  //   return false;
  // }

  function onLayoutChange(layouts) {
    layouts.map((card) => {
      dashboardDs.map((record) => {
        if (record.get('i') === card.i) {
          record.set('x', card.x);
          record.set('y', card.y);
          record.set('w', card.w);
          record.set('h', card.h);
        }
        return null;
      });
      return null;
    });
    // dashboardDs.loadData(layouts);
  }

  function handleDelete(record) {
    dashboardDs.remove(record);
  }

  const SwitchComponents = ({
    type, title, permissionFlag = 1, emptyDiscribe,
  }) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    const hasType = allowedModules.includes(type);

    if ((hasOwnProperty && hasType) && permissionFlag === 1) {
      tempComponent = ComponetsObjs[type];
    } else {
      tempComponent = <EmptyCard title={title} emptyDiscribe={emptyDiscribe} emptyTitle={permissionFlag ? '暂未安装对应模块' : '暂无权限'} />;
    }
    if (type === 'backlogApprove' && needUpgrade) {
      tempComponent = <EmptyCard title={title} emptyDiscribe="此模块为高级版功能，升级高级版后，才能使用此卡片。" emptyTitle="暂未安装对应模块" />;
    }
    return tempComponent;
  };

  const generateDOM = () => {
    const cardData = addCardDs.toData();
    return dashboardDs.map((record) => {
      const key = record.get('i');
      const { groupId, fdLevel, title } = cardData.find((item) => item.i === key);
      const permissionFlag = record.get('permissionFlag');
      let emptyDiscribe;
      if (permissionFlag) {
        emptyDiscribe = `安装部署【${groupMap.get(groupId || 'agile')}】模块后，才能使用此卡片。`;
      } else {
        emptyDiscribe = `分配${fdLevelMap.get(fdLevel)}层级角色后，才能使用此卡片。`;
      }

      return (
        <DragCard
          record={record}
          onDelete={() => handleDelete(record)}
          isEdit={isEdit}
          key={key}
        >
          {SwitchComponents({
            type: key, title, permissionFlag, emptyDiscribe,
          })}
        </DragCard>
      );
    });
  };

  const renderGridLayouts = () => {
    const layoutData = dashboardDs.toData();
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      margin: [18, 18],
      layouts: { lg: layoutData },
      breakpoints: { lg: 1200 },
      resizeHandles: ['se'],
      cols: { lg: 12 },
      measureBeforeMount: true,
      containerPadding: [0, 0],
      useCSSTransforms: true,
      isDraggable: isEdit,
      isResizable: isEdit,
    };

    return (
      <>
        {isEdit && <GridBg rowHeight={(containerWidth - 11 * 18) / 12} selector={`.${prefixCls}-container`} style={{ padding: 0 }} />}
        <ResponsiveGridLayout
          {...tempObj}
          rowHeight={(containerWidth - 11 * 18) / 12}
        >
          {generateDOM()}
        </ResponsiveGridLayout>
      </>
    );
  };

  const renderContent = () => {
    if (dashboardDs.status === 'loading' || addCardDs.status === 'loading') {
      return (
        <div style={{ marginTop: '10%' }}>
          <LoadingBar display />
        </div>
      );
    }

    if (!dashboardDs.length || !addCardDs.length) {
      return (
        <EmptyPage
          isEdit={isEdit}
          onOpenCardModal={onOpenCardModal}
        />
      );
    }
    return renderGridLayouts();
  };

  return (
    <div
      className={classnames([`${prefixCls}-wrapper`], {
        [`${prefixCls}-wrapper-view`]: !isEdit,
        [`${prefixCls}-wrapper-edit`]: isEdit,
      })}
    >
      <div className={`${prefixCls}-container`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default observer(WorkBenchDashboard);
