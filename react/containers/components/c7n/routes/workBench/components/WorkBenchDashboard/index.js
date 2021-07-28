import React, { useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';
// import {
//   map, get, filter,
// } from 'lodash';

import { observer } from 'mobx-react-lite';
import { SizeMe } from 'react-sizeme';

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
import { useWorkBenchStore } from '../../stores';
// import componnetsMapping from '../../stores/mappings';

import QuestionTodo from '../question-todo';
import QuestionFocus from '../question-focus';
import QuestionBug from '../question-bug';
import QuestionReport from '../question-report';
import ExecutionQuestions from '../question-execution';
import './index.less';
import SelfCode from '../SelfCode';
import MyHandler from '../my-handler';
import ResourceOverview from '../ResourceOverview';
import ResourceMonitoring from '../ResourceMonitoring';
import BeginnerGuide from '../BeginnerGuide';
import Notice from '../Notice';

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

export function injectWorkBench(key, component) {
  ComponetsObjs[key] = component;
}
const groupMap = new Map([
  ['devops', 'DevOps管理'],
  ['agile', '敏捷管理'],
  ['backlog', '需求管理'],
  ['resourceManagement', 'DevOps管理'], // 资源管理目前和devops模块关联
]);

const WorkBenchDashboard = (props) => {
  const {
    prefixCls,
    dashboardDs,
    allowedModules,
    AppState,
    addCardDs,
  } = useWorkBenchStore();

  const { isEdit = false } = props;

  const loadLayout = async () => {
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

  const SwitchComponents = (type, title, emptyDiscribe) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    const hasType = allowedModules.includes(type);

    if (hasOwnProperty && hasType) {
      tempComponent = ComponetsObjs[type];
    } else {
      tempComponent = <EmptyCard title={title} emptyDiscribe={emptyDiscribe} emptyTitle="暂未安装对应模块" />;
    }
    if (type === 'backlogApprove' && needUpgrade) {
      tempComponent = <EmptyCard title={title} emptyDiscribe="此模块为高级版功能，升级高级版后，才能使用此卡片。" emptyTitle="暂未安装对应模块" />;
    }
    return tempComponent;
  };

  const generateDOM = () => (
    dashboardDs.map((record) => {
      const key = record.get('i');
      const cardData = addCardDs.toData();
      const { title, groupId } = cardData.find((item) => item.i === key);
      const emptyDiscribe = `安装部署【${groupMap.get(groupId || 'agile')}】模块后，才能使用此卡片。`;
      return (
        <DragCard
          record={record}
          onDelete={() => handleDelete(record)}
          isEdit={isEdit}
          key={key}
        >
          {SwitchComponents(key, title, emptyDiscribe)}
        </DragCard>
      );
    })
  );

  const renderGridLayouts = () => {
    const layoutData = dashboardDs.toData();
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      breakpoints: 1200,
      margin: [18, 18],
      layout: layoutData,
      resizeHandles: ['se'],
      cols: 12,
      // width: size.width,
      // measureBeforeMount: true,
      containerPadding: [0, 0],
      useCSSTransforms: true,
      rowHeight: 16,
      isDraggable: isEdit,
      isResizable: isEdit,
    };

    return (
      <SizeMe>
        {({ size }) => (
          <>
            {isEdit && <GridBg rowHeight={(size.width - 11 * 18) / 12} selector={`.${prefixCls}-container`} style={{ padding: 0 }} />}
            <ReactGridLayout
              {...tempObj}
              width={size.width}
              rowHeight={(size.width - 11 * 18) / 12}
            >
              {generateDOM()}
            </ReactGridLayout>
          </>
        )}
      </SizeMe>
    );
  };

  if (!dashboardDs || dashboardDs.status === 'loading' || addCardDs.status === 'loading') {
    return <LoadingBar display />;
  }

  return (
    <div className={`${prefixCls}-wrapper`}>
      {
        !dashboardDs.length ? <EmptyPage style={{}} /> : (
          <div
            className={`${prefixCls}-container`}
          >
            {(dashboardDs.length > 0 && addCardDs.length > 0) && (
              renderGridLayouts()
            )}
            {/* <UserConfirmationTwo when={isEdit} title="提示" content="工作台配置尚未保存，是否跳转到新页面？" /> */}
          </div>
        )
      }
    </div>
  );
};

export default observer(WorkBenchDashboard);
