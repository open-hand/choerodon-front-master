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
import mappings from './stores/mappings';
import { useProjectOverviewStore } from './stores';

import './ProjectOverview.less';
import UserConfirmation from '../../components/UserConfirm';

let observerLayout;

const ProjectOverview = () => {
  const {
    AppState: {
      currentMenuType: {
        category,
        categories,
      },
    },
    prefixCls,
    projectOverviewStore,
    componentsDs,
    cpOptsObj,
  } = useProjectOverviewStore();

  const {
    isEdit,
    setEdit,
  } = projectOverviewStore;

  const showDevops = useMemo(() => some(categories, ['code', 'N_DEVOPS']), [categories]);

  const [layOutWidth, setWidth] = useState(0);

  useEffect(() => {
    if (!observerLayout) {
      const domTem = document.querySelector('.c7n-project-overview-container');
      new ResizeObserver((entries) => {
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
    appService: showDevops ? <ServiceInfo /> : '',
    env: <EnvInfo />,
    pipelineChart: showDevops ? <PipelineChart /> : '',
    commitChart: showDevops ? <CommitChart /> : '',
    deployChart: showDevops ? <DeployChart /> : '',
    onlineMember: <UserList />,
  }), [showDevops]);

  const renderBg = useCallback(() => <GridBg selector={`.${prefixCls}-container`} cols={10} style={{ padding: '0' }} />, []);

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
        mappings={mappings}
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
    projectOverviewStore.setInitData(defaultValues);
    componentsDs.loadData(defaultValues);
    projectOverviewStore.saveConfig(defaultValues);
    setEdit(false);
    const withoutData = without(keys(cpOptsObj), projectOverviewStore.queryComponents);
    forEach(withoutData, (item) => {
      cpOptsObj[item]();
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
          className={`${prefixCls}-btnGroups-primary`}
          onClick={handleReset}
        >
          重置工作台
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

  const SwitchComponents = (type) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    if (hasOwnProperty) {
      tempComponent = ComponetsObjs[type];
    }
    return tempComponent;
  };

  function handleDelete(record) {
    componentsDs.remove(record);
  }

  const generateDOM = useMemo(() => componentsDs.map((record) => (
    <DragCard
      record={record}
      onDelete={() => handleDelete(record)}
      isEdit={isEdit}
      key={record.get('i')}
    >
      {SwitchComponents(record.get('i'))}
    </DragCard>
  )),
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
      rowHeight: 100,
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
      <UserConfirmation title="提示" content="项目概览配置未保存，确认跳转新页面？" when={isEdit} />
    </Page>
  );
};

export default observer(ProjectOverview);
