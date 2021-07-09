import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import ResponsiveReactGridLayout from 'react-grid-layout';
import {
  map, get, filter,
} from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import { observer } from 'mobx-react-lite';
import DragCard from '@/containers/components/c7n/components/dragCard';
import EmptyCard from '@/containers/components/c7n/components/EmptyCard';
import { Modal } from 'choerodon-ui/pro';
import useUpgrade from '@/hooks/useUpgrade';
import { Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/QuickLink';
import TodoThings from './components/TodoThings';
import { useWorkBenchStore } from './stores';
import componnetsMapping from './stores/mappings';
import GridBg from '../../components/gridBackground';
import QuestionTodo from './components/question-todo';
import QuestionFocus from './components/question-focus';
import QuestionBug from './components/question-bug';
import QuestionReport from './components/question-report';
import UserConfirmationTwo from '../../components/UserConfirm';
import ExecutionQuestions from './components/question-execution';
import './WorkBench.less';
import SelfCode from './components/SelfCode';
import MyHandler from './components/my-handler';

let observerLayout;

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
};
export function injectWorkBench(key, component) {
  ComponetsObjs[key] = component;
}
const groupMap = new Map([
  ['devops', 'DevOps管理'],
  ['agile', '敏捷管理'],
  ['backlog', '需求管理'],
]);

const WorkBench = () => {
  const {
    workBenchUseStore,
    prefixCls,
    componentsDs,
    history,
    allowedModules,
    AppState,
    organizationId,
  } = useWorkBenchStore();

  const { data: needUpgrade } = useUpgrade({
    organizationId: AppState.currentMenuType?.organizationId,
  });

  const {
    isEdit,
  } = workBenchUseStore;

  const [layOutWidth, setWidth] = useState(0);

  useEffect(() => {
    AppState.getProjects();
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

  function onLayoutChange(layouts) {
    componentsDs.loadData(layouts);
  }

  function handleDelete(record) {
    componentsDs.remove(record);
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

  const renderBg = useCallback(() => <GridBg rowHeight={(layOutWidth - 11 * 18) / 12} selector={`.${prefixCls}-container`} />, [layOutWidth]);

  const generateDOM = () => (
    componentsDs.map((record) => {
      const key = record.get('i');
      const title = get(componnetsMapping[key], 'title');
      const emptyDiscribe = `安装部署【${groupMap.get(get(componnetsMapping[key], 'groupId') || 'agile')}】模块后，才能使用此卡片。`;
      return (
        <DragCard
          record={record}
          onDelete={() => handleDelete(record)}
          isEdit={isEdit}
          key={key}
          isStatic={key === 'starTarget'}
          style={key === 'starTarget' && {
            borderRadius: '10px 0 10px 10px',
          }}
        >
          {SwitchComponents(key, title, emptyDiscribe)}
        </DragCard>
      );
    })
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
      rowHeight: (layOutWidth - 11 * 18) / 12,
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
      {/* <Header>
        <HeaderButtons items={[
          {
            icon: 'info',
            name: 'test',
            group: 1,
            groupBtnItems: [
              {
                name: 'test',
                handler: test,
                tooltipsConfig: {
                  title: 'hell',
                },
              },
              {
                name: 'test2',
                handler: () => {
                  Modal.open({
                    key: Modal.key(),
                    title: 'dsadas',
                    children: ' sadasdas',
                  });
                },
                tooltipsConfig: {
                  title: 'hell',
                },
              },
            ],
          },
          {
            icon: 'info',
            name: 'asdas',
            groupBtnItems: [
              {
                name: 'test',
                handler: () => alert('dsada'),
                tooltipsConfig: {
                  title: 'hell',
                },
              },
            ],
          },
          {
            name: 'asdas',
            groupBtnItems: [
              {
                name: 'test',
                handler: () => alert('dsada'),
                tooltipsConfig: {
                  title: 'hell',
                },
              },
            ],
          },
        ]}
        />
        <BtnGroup
          name="shit"
          renderCustomDropDownPanel={(setvisible) => (
            <div style={{
              height: '20px',
            }}
            >
              fuck
              <span
                role="none"
                onClick={(e) => {
                  alert('sssss');
                  setvisible(true, e);
                }}
              >
                fukcss
              </span>
            </div>
          )}
        />
      </Header> */}
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
