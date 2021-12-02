import React, {
  useMemo, useCallback, useState, useEffect,
} from 'react';
import { Button, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import ResponsiveReactGridLayout from 'react-grid-layout';
import ResizeObserver from 'resize-observer-polyfill';
import {
  get, forEach, map,
} from 'lodash';
import { useIntl } from 'react-intl';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import DragCard from '@/containers/components/c7n/components/dragCard';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';
import { Page, Content } from '@/components/c7n-page';
import Breadcrumb from '@/components/c7n-breadCrumb';
import { Permission } from '@/components/permission';
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
import PersonalWorkload from './components/personal-workload';
import Workload from './components/Workload';
import CustomChart from './components/custom-chart';

let observerLayout;

const ProjectOverview = () => {
  const { formatMessage } = useIntl();
  const {
    AppState: {
      currentMenuType: {
        category,
      },
    },
    prefixCls,
    projectOverviewStore,
    componentsDs,
    customChartAvailableList,
    availableServiceList,
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
    projectDynamic: <ProjectDynamic />,
    workLoad: <Workload />,
    personalWorkload: <PersonalWorkload />,
  }), []);

  const renderCustomChart = useCallback((type) => {
    const chartConfig = projectOverviewStore.getCustomChart(type);
    // 无敏捷数据获取hook 则返回空
    if (!chartConfig || !customChartAvailableList.length) {
      return undefined;
    }
    return <CustomChart customChartConfig={chartConfig} />;
  }, [customChartAvailableList, projectOverviewStore]);

  const renderBg = useCallback(() => <GridBg rowHeight={(layOutWidth - 11 * 18) / 10} selector={`.${prefixCls}-container`} cols={10} style={{ padding: '0' }} />, [layOutWidth]);

  function handleEditable() {
    setEdit(true);
  }

  function handleCancel() {
    componentsDs.loadData(projectOverviewStore.initData);
    setEdit(false);
  }

  function addComponent(newTypeArr, deleteArr) {
    const existData = map(componentsDs.filter((record) => !deleteArr.includes(record.get('i'))), (record) => record.toData());
    forEach(newTypeArr, (type) => {
      const {
        layout,
      } = mappings[type] || projectOverviewStore.getCustomChart(type);

      const tempCp = {
        ...layout,
        x: 0,
        y: Infinity,
      };
      existData.push(tempCp);
    });
    componentsDs.loadData(existData);
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
      bodyStyle: { padding: 0 },
      children: <AddModal
        subPrefix={subPrefix}
        existTypes={typeArr}
        addComponent={addComponent}
        mappings={[...allCode.map((item) => (
          mappings[item]
        )), ...projectOverviewStore.customDataList]}
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
    });
  }

  const renderBtns = () => {
    let btnGroups;
    if (isEdit) {
      btnGroups = [
        <Button
          onClick={openAddComponents}
          key="5"
          icon="settings-o"
        >
          卡片配置
        </Button>,
        <Button
          onClick={hanldeSave}
          key="4"
        >
          保存
        </Button>,
        <Button
          onClick={handleResetModal}
          key="3"
        >
          重置
        </Button>,
        <Button
          onClick={handleCancel}
          key="2"
          color="primary"
        >
          取消
        </Button>,
      ];
    } else {
      btnGroups = [
        <Button
          onClick={handleEditable}
          key="1"
          icon="settings-o"
          color="primary"
        >
          {formatMessage({ id: 'agile.projectOverview.Setting' })}
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
  function renderEmptyTitle(groupId, customFlag) {
    if (!availableServiceList.includes(groupId)) {
      return groupId === 'devops' ? '未选择【DevOps流程】项目类型，卡片暂不可用' : '未选择【敏捷管理】项目类型，卡片暂不可用';
    }
    if (customFlag === 'agile' && groupId === 'agile') {
      return customChartAvailableList.length === 0 ? '未安装【敏捷服务】，卡片无法显示' : '当前自定义敏捷图表已被删除，此卡片无法显示';
    }
    return '卡片暂不可用';
  }
  const SwitchComponents = (type, title) => {
    let tempComponent = renderCustomChart(type);
    const hasOwnProperty = tempComponent || Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    const hasType = allCode.includes(type) || projectOverviewStore.getCustomChart(type);
    if (hasOwnProperty && hasType) {
      tempComponent = tempComponent || ComponetsObjs[type];
    } else {
      const chartConfig = mappings[type] || projectOverviewStore.getCustomChart(type);
      tempComponent = (
        <EmptyCard
          title={title}
          emptyTitle={renderEmptyTitle(get(chartConfig, 'groupId'), get(chartConfig, 'layout.customFlag'))}
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
