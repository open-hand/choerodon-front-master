import React, {
  useMemo, useCallback, useState, useEffect,
} from 'react';
import { Button, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import ResponsiveReactGridLayout from 'react-grid-layout';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import DragCard from '@/containers/components/c7n/components/dragCard';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';

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
    cpOptsObj,
    allCode,
  } = useProjectOverviewStore();

  const {
    isEdit,
    setEdit,
  } = projectOverviewStore;

  const [layOutWidth, setWidth] = useState(0);

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
    const existCps = projectOverviewStore.queryComponents;
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
      if (!existCps.includes(type)) {
        cpOptsObj[type]();
        projectOverviewStore.addQueryComponents(type);
      }
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
    const withoutData = without(keys(cpOptsObj), projectOverviewStore.queryComponents);
    forEach(withoutData, (item) => {
      cpOptsObj[item]();
    });
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
    if (isEdit) {
      btnGroups = [
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          onClick={openAddComponents}
        >
          添加卡片
        </Button>,
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          onClick={hanldeSave}
        >
          保存
        </Button>,
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-default`}
          onClick={handleResetModal}
        >
          重置
        </Button>,
        <Button
          className={`${prefixCls}-btnGroups-default`}
          color="primary"
          onClick={handleCancel}
        >
          取消
        </Button>,
      ];
    } else {
      btnGroups = [
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-default`}
          onClick={handleEditable}
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
          get(mappings[type], 'groupId') === 'devops' ? '未选择【DevOps流程】项目类型，卡片暂不可用' : '不含【敏捷管理】项目类型时，敏捷相关模块的卡片就显示为空'
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
