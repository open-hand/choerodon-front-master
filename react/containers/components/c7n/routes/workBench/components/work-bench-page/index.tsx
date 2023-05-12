import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { get as choerodonGet, has, mount } from '@choerodon/inject';

import { get, noop } from 'lodash';

import { Loading, EmptyPage } from '@zknow/components';
import ExternalComponent from '@/components/external-component';

import DragCard from '@/containers/components/c7n/components/dragCard';
import EmptyCard from '@/containers/components/c7n/components/EmptyCard';
import GridBg from '@/containers/components/c7n/components/gridBackground';
import defaultImg from '../../img/empty.svg';

import { useWorkBenchStore } from '../../stores';
import './index.less';

const ComponentMountMap = {
  gantt: 'agile:WorkbenchGantt',
  workTime: 'agile:WorkbenchWorkTime',
};
type ComponentMountMapKey = keyof typeof ComponentMountMap
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
interface WorkBenchPageProps {
  dashboardId: string
  // isEdit: false
  // onOpenCardModal:
}
/**
 * 工作台页面模式
 * 独占整个视图
 * @param props
 * @returns
 */
const WorkBenchPage: React.FC<WorkBenchPageProps> = (props) => {
  const {
    prefixCls,
    dashboardDs,
    allowedModules,
    AppState,
    addCardDs,
  } = useWorkBenchStore();
  const { dashboardId } = props;
  const loadLayout = () => {
    dashboardDs.setQueryParameter('dashboardId', props.dashboardId);
    dashboardDs.query();
  };
  const { organizationId } = AppState.currentMenuType || {};

  const renderContent = () => {
    if (dashboardDs.status === 'loading' || addCardDs.status === 'loading') {
      return (
        <div style={{ marginTop: '10%' }}>
          <Loading display type={choerodonGet('configuration.master-global:loadingType') || 'c7n'} />
        </div>
      );
    }

    const emptyDescription = `安装部署【${groupMap.get('agile')}】模块后，才能使用此视图。`;
    if (!Object.keys(ComponentMountMap).includes(dashboardId)) {
      return <EmptyPage image={defaultImg} description={emptyDescription} />;
    }
    return (
      <ExternalComponent
        system={{ scope: 'agile', module: ComponentMountMap[dashboardId as ComponentMountMapKey] }}
        organizationId={organizationId}
        notFound={<EmptyPage image={defaultImg} description={emptyDescription} />}
      />
    );
  };

  return (
    <div
      className={classnames([`${prefixCls}-page-wrapper`], {
        [`${prefixCls}-page-wrapper-view`]: true,
      })}
    >
      <div className={`${prefixCls}-page-container`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default observer(WorkBenchPage);
