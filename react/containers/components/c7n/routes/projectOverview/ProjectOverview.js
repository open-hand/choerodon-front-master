import React, { useMemo, useCallback } from 'react';
import { Button, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { WidthProvider, Responsive } from 'react-grid-layout';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import DragCard from '@/containers/components/c7n/components/dragCard';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';

import {
  get, filter, map, forEach, some,
} from 'lodash';
import {
  Content, Breadcrumb, Page,
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
  } = useProjectOverviewStore();

  const {
    isEdit,
    setEdit,
  } = projectOverviewStore;

  const showDevops = useMemo(() => some(categories, ['code', 'N_DEVOPS']), [categories]);

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
    componentsDs.forEach((record) => {
      record.set('static', false);
    });
  }

  function handleCancel() {
    setEdit(false);
    componentsDs.loadData(projectOverviewStore.initData);
  }

  function addComponent(types) {
    const typeCp = [];
    forEach(types, (type) => {
      const {
        layout,
      } = mappings[type];
      const tempCp = {
        ...layout,
        x: 0,
        y: Infinity,
        static: false,
      };
      typeCp.push(tempCp);
    });

    const tempArr = projectOverviewStore.editLayout;
    componentsDs.loadData(tempArr.concat(typeCp));
  }

  function openAddComponents() {
    const subPrefix = 'c7ncd-workbench-addModal';
    const typeArr = map(projectOverviewStore.editLayout, (item) => get(item, 'i'));

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
    const tempData = projectOverviewStore.editLayout.map((data) => {
      const temp = data;
      temp.static = true;
      return temp;
    });
    projectOverviewStore.setInitData(tempData);
    componentsDs.loadData(projectOverviewStore.editLayout);
    projectOverviewStore.saveConfig(tempData);
    setEdit(false);
  }

  function handleReset() {
    const defaultValues = map(mappings, (item) => item.layout);
    projectOverviewStore.setInitData(defaultValues);
    componentsDs.loadData(defaultValues);
    projectOverviewStore.saveConfig(defaultValues);
    setEdit(false);
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
    projectOverviewStore.setEditLayout(layout);
  }

  const SwitchComponents = (type) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    if (hasOwnProperty) {
      tempComponent = ComponetsObjs[type];
    }
    return tempComponent;
  };

  function handleDelete(dataGrid) {
    const tempArr = projectOverviewStore.editLayout;
    const filterData = filter(tempArr, (item) => item.i !== dataGrid.i);
    componentsDs.loadData(filterData);
    projectOverviewStore.setEditLayout(filterData);
  }

  const generateDOM = useCallback(() => {
    const mainData = componentsDs.toData();
    return (
      mainData.map((dataGrid, i) => (
        <DragCard
          dataGrid={dataGrid}
          onDelete={() => handleDelete(dataGrid)}
          isEdit={isEdit}
          data-grid={dataGrid}
          key={dataGrid.i}
        >
          {SwitchComponents(get(dataGrid, 'i'))}
        </DragCard>
      ))
    );
  }, [componentsDs, isEdit]);

  const renderGridLayouts = () => {
    const tempObj = {
      className: `${prefixCls}-layout`,
      onLayoutChange,
      breakpoints: {
        lg: 1200,
      },
      margin: [18, 18],
      resizeHandles: ['se'],
      cols: {
        lg: 10,
      },
      measureBeforeMount: true,
      containerPadding: [0, 0],
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
    <Page className={prefixCls}>
      <Breadcrumb />
      {renderBtns()}
      <Content className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-container`}>
          {isEdit && renderBg()}
          {
            category && renderGridLayouts()
          }
        </div>
      </Content>
    </Page>
  );
};

export default observer(ProjectOverview);
