import React, { useMemo, useCallback } from 'react';
import { Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import {
  Content, Breadcrumb, Page,
} from '../../../../../index';
import ServiceInfo from './components/ServiceInfo';
import BurnDownChart from './components/BurnDownChart';
import DefectTreatment from './components/DefectTreatment';
import SprintWaterWave from './components/SprintWaterWave';
import UserList from './components/UserList';
import SprintCount from './components/SprintCount';
import DeployChart from './components/deploy-chart';
import CommitChart from './components/commit-chart';
import DefectChart from './components/defect-chart';
import PipelineChart from './components/pipeline-chart';
import GridBg from './components/gridBackground';
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
  } = useProjectOverviewStore();

  const {
    isEdit,
  } = projectOverviewStore;

  const showDevops = useMemo(() => category === 'GENERAL' || category === 'OPERATIONS', [category]);

  const renderBg = useCallback(() => <GridBg />, []);

  function handleEditable() {
    projectOverviewStore.setEdit(true);
  }

  function handleCancel() {
    projectOverviewStore.setEdit(false);
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

  return (
    <Page className={prefixCls}>
      <Breadcrumb />
      {renderBtns()}
      <Content className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-container`}>
          {isEdit && renderBg()}
          {
            // renderGridLayouts()
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
