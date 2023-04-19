/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { get, noop } from 'lodash';
import { has as hasInject, mount, get as choerodonGet } from '@choerodon/inject';
import ResizeObserver from 'resize-observer-polyfill';

import { Loading } from '@zknow/components';
import DragCard from '@/containers/components/c7n/components/dragCard';
import EmptyCard from '@/containers/components/c7n/components/EmptyCard';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import useExternalFunc from '@/hooks/useExternalFunc';
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
import ExternalComponent from '@/components/external-component';

import { useWorkBenchStore } from '../../stores';
import './index.less';

const ResponsiveGridLayout = WidthProvider(Responsive);

const UserIssue = () => (hasInject('agilePro:workbenchUserIssue') ? mount('agilePro:workbenchUserIssue', {}) : <></>);
const ProjectProgress = () => (hasInject('agilePro:workbenchProjectStatistics') ? mount('agilePro:workbenchProjectStatistics', {}) : <></>);
const ProjectReleaseSchedule = <ExternalComponent system={{ scope: 'haitianMaster', module: 'project-release-schedule' }} />;
const TeamLeaderOrder = <ExternalComponent system={{ scope: 'haitianMaster', module: 'technical-director-schedule' }} />;
const DevoperSchedule = <ExternalComponent system={{ scope: 'haitianMaster', module: 'devoper-schedule' }} />;
/** 临时兼容性操作 */
// eslint-disable-next-line no-underscore-dangle
window.___choeordonWorkbenchComponent__ = window.___choeordonWorkbenchComponent__ || {};
// eslint-disable-next-line no-underscore-dangle
const injectWorkbenchComponent = window.___choeordonWorkbenchComponent__;

const ComponetsObjs = Object.create(injectWorkbenchComponent);
Object.assign(ComponetsObjs, {
  starTarget: <StarTargetPro />,
  selfInfo: <SelfIntro />,
  todoQustions: <QuestionTodo />, // 待办事项卡片
  myReport: <QuestionReport />, // 我报告的
  myStar: <QuestionFocus />, // 我关注的
  myDefect: <QuestionBug />, // 缺陷
  todoThings: <TodoThings />,
  serviceList: <ServiceList />,
  quickLink: <QuickLink />,
  doc: <Doc />, // 文档
  envList: <EnvList />,
  selfCode: <SelfCode />,
  myExecution: <ExecutionQuestions />,
  myhandler: <MyHandler />, // 我经手的
  resourceOverview: <ResourceOverview />,
  resourceMonitoring: <ResourceMonitoring />,
  beginnerGuide: <BeginnerGuide />,
  notice: <Notice />,
  userIssue: <UserIssue />,
  projectProgress: <ProjectProgress />,
  projectVersionProgress: ProjectReleaseSchedule,
  teamLeaderOrder: TeamLeaderOrder,
  developerRank: DevoperSchedule,
});
const componentCodeMapInJectCode = {
  backlogApprove: 'backlog:workBenchApprove',
};

let observerLayout;
/**
 * @deprecated 后续会移除 先使用 '@choerodon/inject' 库中的 set 方式 可以使用微前端分享组件方式
 * @param {*} key
 * @param {*} component
 */
export function injectWorkBench(key, component) {
  injectWorkbenchComponent[key] = component;
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
    cacheStore,
    allowedModules,
    AppState,
    addCardDs,
    detailPropsCurrent,
  } = useWorkBenchStore();

  const [containerWidth, setContainerWidth] = useState(1280);

  const { isEdit = false, onOpenCardModal = noop } = props;
  const currentDashboardId = props.dashboardId;
  const mountedComponentFromDashboardId = useRef();
  const loadLayout = async () => {
    mountedComponentFromDashboardId.current = props.dashboardId;
    dashboardDs.setQueryParameter('dashboardId', props.dashboardId);
    await dashboardDs.deleteAll(false);
    await dashboardDs.query();
  };

  useEffect(() => {
    if (props.dashboardId) {
      cacheStore.clear();
      loadLayout();
    }
  }, [props.dashboardId]);

  const { func: checkUpgrade } = useExternalFunc('saas', 'base-saas:checkUpgrade');

  const { data: needUpgrade } = useUpgrade({
    organizationId: AppState.currentMenuType?.organizationId,
    checkUpgrade: checkUpgrade?.default?.checkSaaSUpgrade,
    key: `useUpgrade-${checkUpgrade?.default?.checkSaaSUpgrade}-${AppState.currentMenuType?.organizationId}`,
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

  function onLayoutChange(layouts) {
    const data = layouts.map((card) => {
      let newCard = card;
      dashboardDs.forEach((record) => {
        if (record.get('i') === card.i) {
          record.set('x', card.x);
          record.set('y', card.y);
          record.set('w', card.w);
          record.set('h', card.h);
          newCard = {
            ...record?.toData(),
            ...card,
          };
        }
      });
      return newCard;
    });
    dashboardDs.loadData(data);
  }

  function handleDelete(record) {
    dashboardDs.remove(record);
  }

  const SwitchComponents = ({
    type, title, permissionFlag = 1, emptyDiscribe, height,
  }) => {
    let tempComponent;
    const injectComponentCode = componentCodeMapInJectCode[type] && hasInject(componentCodeMapInJectCode[type]) ? componentCodeMapInJectCode[type] : undefined;
    const injectComponent = injectComponentCode ? mount(injectComponentCode) : null;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type) || Object.prototype.hasOwnProperty.call(injectWorkbenchComponent, type) || !!injectComponent;
    const hasType = allowedModules.includes(type);

    if ((hasOwnProperty && hasType) && permissionFlag === 1) {
      tempComponent = ComponetsObjs[type] || injectComponent;
    } else {
      tempComponent = <EmptyCard title={title} emptyDiscribe={emptyDiscribe} emptyTitle={permissionFlag ? '暂未安装对应模块' : '暂无权限'} />;
    }
    if (type === 'backlogApprove' && needUpgrade) {
      tempComponent = <EmptyCard title={title} emptyDiscribe="此模块为高级版功能，升级高级版后，才能使用此卡片。" emptyTitle="暂未安装对应模块" />;
    }
    if (type === 'todoQustions') {
      return <QuestionTodo height={height} />;
    }
    return tempComponent;
  };

  const generateDOM = () => {
    const cardData = addCardDs.toData();
    return dashboardDs.map((record) => {
      const key = record.get('i');
      const height = record.get('h');
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
            type: key, title, permissionFlag, emptyDiscribe, height,
          })}
        </DragCard>
      );
    });
  };

  const renderGridLayouts = () => {
    const layoutData = dashboardDs.toData();
    layoutData.forEach((item) => {
      if (item.cardCode === 'starTarget') {
        if (document.body.clientWidth <= 1300) {
          item.h = 2.3;
          item.minH = 2.3;
        } else {
          item.h = 2;
          item.minH = 2;
        }
      }
    });
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      margin: [18, 18],
      layouts: { lg: layoutData, md: layoutData, sm: layoutData },
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
    if (dashboardDs.status === 'loading' || addCardDs.status === 'loading' || mountedComponentFromDashboardId.current !== currentDashboardId) {
      return (
        <div style={{ marginTop: '10%' }}>
          <Loading display type={choerodonGet('configuration.master-global:loadingType') || 'c7n'} />
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
      {mount('agile:DetailContainer', detailPropsCurrent)}
    </div>
  );
};

export default observer(WorkBenchDashboard);
