import React, {
  useMemo, useCallback, useState, useEffect,
} from 'react';
import { Button, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import ResponsiveReactGridLayout from 'react-grid-layout';
import ResizeObserver from 'resize-observer-polyfill';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import DragCard from '@/containers/components/c7n/components/dragCard';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';
import useTheme from '@/hooks/useTheme';

import {
  get, filter, map, forEach, some, without, keys,
} from 'lodash';
import {
  Content, Breadcrumb, Page, Permission,
} from '../../../../../index';
import ServiceInfo from './components/ServiceInfo';
import EnvInfo from './components/EnvInfo';

import BurnDownChart from './components/BurnDownChart';
import DefectTreatment from './components/DefectTreatment';
import SprintWaterWave from './components/SprintWaterWave';
import UserList from './components/UserList';
import SprintCount from './components/SprintCount';
import DeployChart from './components/deploy-chart';
import CommitChart from './components/commit-chart';
import DefectChart from './components/defect-chart';
import PipelineChart from './components/pipeline-chart';
import AssigneeChart from './components/assignee-chart';
import mappings from './stores/mappings';
import { useProjectOverviewStore } from './stores';

import './ProjectOverview.less';
import UserConfirmation from '../../components/UserConfirm';
import EmptyCard from '../../components/EmptyCard';
import PriorityChart from './components/priority-chart';
import IssueTypeChart from './components/issue-type-chart';
import IssueTable from './components/issue-table';
import ProjectDynamic from './components/project-dynamic';
import Workload from './components/Workload';

let observerLayout;

const ProjectOverview = () => {
  const {
    AppState: {
      currentMenuType: {
        category,
      },
    },
    prefixCls,
    projectOverviewStore,
    componentsDs,
    allCode,
  } = useProjectOverviewStore();

  const {
    isEdit,
    setEdit,
  } = projectOverviewStore;

  const [layOutWidth, setWidth] = useState(0);
  const [theme] = useTheme();

  useEffect(() => {
    if (!observerLayout) {
      const domTem = document.querySelector('.c7n-project-overview-container');
      observerLayout = new ResizeObserver((entries) => {
        const dom = get(entries[0], 'target');
        const width = get(dom, 'offsetWidth');
        setWidth(width);
      }).observe(domTem);
    }
  }, []);

  useEffect(() => function () {
    observerLayout && observerLayout.disconnect();
  });

  const ComponetsObjs = useMemo(() => ({
    sprintNotDone: <SprintWaterWave />,
    sprintCount: <SprintCount />,
    burnDownChart: <BurnDownChart />,
    defectTreatment: <DefectTreatment />,
    defectChart: <DefectChart />,
    appService: <ServiceInfo />,
    env: <EnvInfo />,
    pipelineChart: <PipelineChart />,
    commitChart: <CommitChart />,
    deployChart: <DeployChart />,
    onlineMember: <UserList />,
    assigneeChart: <AssigneeChart />,
    priorityChart: <PriorityChart />,
    issueTypeChart: <IssueTypeChart />,
    issueTable: <IssueTable />,
    projectDynamic: <ProjectDynamic />,
    workLoad: <Workload />,

  }), []);

  const renderBg = useCallback(() => <GridBg rowHeight={(layOutWidth - 11 * 18) / 10} selector={`.${prefixCls}-container`} cols={10} style={{ padding: '0' }} />, [layOutWidth]);

  function handleEditable() {
    setEdit(true);
  }

  function handleCancel() {
    componentsDs.loadData(projectOverviewStore.initData);
    setEdit(false);
  }

  function addComponent(types) {
    forEach(types, (type) => {
      const {
        layout,
      } = mappings[type];
      const tempCp = {
        ...layout,
        x: 0,
        y: Infinity,
      };
      componentsDs.create(tempCp);
    });
  }

  function openAddComponents() {
    const subPrefix = 'c7ncd-workbench-addModal';
    const typeArr = map(componentsDs.toData(), (item) => get(item, 'i'));

    Modal.open({
      title: '添加卡片',
      key: Modal.key(),
      drawer: true,
      style: {
        width: '740px',
      },
      children: <AddModal
        subPrefix={subPrefix}
        existTypes={typeArr}
        addComponent={addComponent}
        mappings={allCode.map((item) => (
          mappings[item]
        ))}
        isProjects
      />,
      className: `${subPrefix}`,
    });
  }

  function hanldeSave() {
    const tempData = componentsDs.toData();
    projectOverviewStore.setInitData(tempData);
    projectOverviewStore.saveConfig(tempData);
    setEdit(false);
  }

  function handleReset() {
    const defaultValues = map(mappings, (item) => item.layout);
    componentsDs.loadData(defaultValues);
  }

  function handleResetModal() {
    Modal.open({
      className: 'c7n-reset-modal',
      title: '重置项目概览页面',
      children: '确定要重置项目概览页面吗？',
      onOk: handleReset,
      cancelProps: {
        color: 'dark',
      },
    });
  }

  const renderBtns = () => {
    let btnGroups;
    const secondBtnObj = {
      funcType: 'raised',
    };
    const primaryBtnObj = {
      color: 'primary',
      funcType: 'raised',
    };
    if (theme !== 'theme4') {
      secondBtnObj.color = 'primary';
      primaryBtnObj.funcType = 'flat';
    }
    if (isEdit) {
      btnGroups = [
        <Button
          {...primaryBtnObj}
          onClick={openAddComponents}
          key="5"
        >
          添加卡片
        </Button>,
        <Button
          {...primaryBtnObj}
          onClick={hanldeSave}
          key="4"
        >
          保存
        </Button>,
        <Button
          {...secondBtnObj}
          onClick={handleResetModal}
          key="3"
        >
          重置
        </Button>,
        <Button
          {...secondBtnObj}
          onClick={handleCancel}
          key="2"

        >
          取消
        </Button>,
      ];
    } else {
      btnGroups = [
        <Button
          {...secondBtnObj}
          onClick={handleEditable}
          key="1"
        >
          项目概览配置
        </Button>,
      ];
    }
    return (
      <div
        className={`${prefixCls}-btnGroups`}
      >
        {btnGroups}
      </div>
    );
  };

  function onLayoutChange(layout, layouts) {
    componentsDs.loadData(layout);
  }

  const SwitchComponents = (type, title) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    const hasType = allCode.includes(type);
    if (hasOwnProperty && hasType) {
      tempComponent = ComponetsObjs[type];
    } else {
      tempComponent = (
        <EmptyCard
          title={title}
          emptyTitle={
          get(mappings[type], 'groupId') === 'devops' ? '未选择【DevOps流程】项目类型，卡片暂不可用' : '未选择【敏捷管理】项目类型，卡片暂不可用'

        }
          index={type}
          sizeObserver={['appService', 'env'].includes(type)}
        />
      );
    }
    return tempComponent;
  };

  function handleDelete(record) {
    componentsDs.remove(record);
  }

  const generateDOM = useMemo(() => componentsDs.map((record) => {
    const key = record.get('i');
    const title = get(mappings[key], 'title');
    return (
      <DragCard
        record={record}
        onDelete={() => handleDelete(record)}
        isEdit={isEdit}
        key={record.get('i')}
      >
        {SwitchComponents(record.get('i'), title)}
      </DragCard>
    );
  }),
  [componentsDs, handleDelete, isEdit]);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      layout: componentsDs.toData(),
      breakpoints: 1200,
      margin: [18, 18],
      resizeHandles: ['se'],
      cols: 10,
      measureBeforeMount: true,
      containerPadding: [0, 0],
      useCSSTransformss: true,
      rowHeight: (layOutWidth - 11 * 18) / 10,
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

  function renderConfirm() {
    return <UserConfirmation title="提示" content="项目概览配置未保存，确认跳转新页面？" when={isEdit} />;
  }

  return (
    <Page className={prefixCls}>
      <Breadcrumb />
      <Permission service={['choerodon.code.project.project.overview.edit']}>
        {renderBtns()}

      </Permission>
      <Content className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-container`}>
          {isEdit && renderBg()}
          {
            category && renderGridLayouts()
          }
        </div>
      </Content>
      {renderConfirm()}
    </Page>
  );
};

export default observer(ProjectOverview);
