import React, { useMemo, useCallback } from 'react';
import { Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { WidthProvider, Responsive } from 'react-grid-layout';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import DragCard from '@/containers/components/c7n/components/dragCard';

import { get } from 'lodash';
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
import { useProjectOverviewStore } from './stores';

import './ProjectOverview.less';

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
  } = useProjectOverviewStore();

  const {
    isEdit,
  } = projectOverviewStore;

  const showDevops = useMemo(() => category === 'GENERAL' || category === 'OPERATIONS', [category]);

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
    projectOverviewStore.setEdit(true);
    componentsDs.forEach((record) => {
      record.set('static', false);
    });
  }

  function handleCancel() {
    projectOverviewStore.setEdit(false);
    componentsDs.forEach((record) => {
      record.set('static', true);
    });
  }

  const renderBtns = () => {
    let btnGroups;
    if (isEdit) {
      btnGroups = [
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          // onClick={openAddComponents}
        >
          添加卡片
        </Button>,
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          // onClick={hanldeSave}
        >
          保存
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
    console.log(layout);
  }

  const SwitchComponents = (type) => {
    let tempComponent;
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(ComponetsObjs, type);
    if (hasOwnProperty) {
      tempComponent = ComponetsObjs[type];
    }
    return tempComponent;
  };

  const generateDOM = useCallback(() => {
    const mainData = componentsDs.toData();
    return (
      mainData.map((dataGrid, i) => (
        <DragCard
          dataGrid={dataGrid}
          // onDelete={() => handleDelete(dataGrid)}
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
            renderGridLayouts()
          }
        </div>
        {/* <div className="c7n-project-overview-content">
          <div className="c7n-project-overview-content-left">
            {showDevops ? <ServiceInfo /> : null}
            <BurnDownChart showDevops={showDevops} />
            <DefectTreatment showDevops={showDevops} />
          </div>
          <div className="c7n-project-overview-content-right">
            <SprintWaterWave />
            <SprintCount />
            <UserList />
          </div>
        </div>
        <div className="c7n-project-overview-item">
          <DefectChart />
          {showDevops ? <PipelineChart /> : null}
        </div>
        {showDevops ? (
          <div className="c7n-project-overview-item">
            <CommitChart />
            <DeployChart />
          </div>
        ) : null} */}
      </Content>
    </Page>
  );
};

export default observer(ProjectOverview);
