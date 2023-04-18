import {
  Icon, Modal, Table, TextField, Tooltip,
} from 'choerodon-ui/pro';
import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { some, throttle } from 'lodash';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import moment from 'moment';
import { get } from '@choerodon/inject';
import { notification } from 'choerodon-ui';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import type { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import useExternalFunc from '@/hooks/useExternalFunc';
import { getRandomBackground } from '@/utils';
import { useProjectsProStore } from '../../stores';
import { axios } from '@/index';
import CreateProject from '../create-project';
import handleClickProject from '@/utils/gotoProject';
import Action from '@/components/action';
import { IColumnSetConfig } from './components/tableColumnSet';
import { organizationsApi } from '@/apis';
import ProjectNotification from '../create-project/components/project-notification';
import useGetDisplayColumn from './hooks/useGetDisplayColumn';
import { getAdjustableColumns } from './config/tableColumnsConfig';
import './table.less';

const modalkey2 = Modal.key();

// 是否存在base的商业版本
const HAS_BASE_BUSINESS = C7NHasModule('@choerodon/base-business');
export interface IProps {
  columnsSetConfig: IColumnSetConfig[] | []
  onColumnResize: ({ column, width, index }:any)=> void
}

export const startProjChange = async (pid: string, enable: boolean, organizationId: string, ProjectsProUseStore: any) => {
  enable ? await axios.post(`/cbase/choerodon/v1/organizations/${organizationId}/star_projects`, {
    projectId: pid,
  }) : await axios.delete(`/cbase/choerodon/v1/organizations/${organizationId}/star_projects?project_id=${pid}`);
  ProjectsProUseStore.axiosGetStarProjects();
  ProjectsProUseStore.axiosGetRecentProjects();
};

const Index: React.FC<any> = (props) => {
  const { columnsSetConfig, onColumnResize: columnResize, fieldFunc } = props;

  const {
    categoryCodes,
    history,
    AppState,
    AppState: { currentMenuType: { organizationId } },
    projectListDataSet,
    intl: { formatMessage },
    ProjectsProUseStore,
    prefix,
    intlPrefix,
    projectId: projectIds,
  } = useProjectsProStore();
  const refresh = () => {
    projectListDataSet.query();
  };
  console.log('ahaa', prefix);

  const { loading: openStatusSettingModalLoading, func: openStatusSettingModal }: any = useExternalFunc('baseBusiness', 'base-business:openStatusSettingModal');

  const {
    data, error, loading, run,
  } = useRequest((paramData:any) => organizationsApi.setHealthStatus(paramData), {
    manual: true,
    onSuccess: (result, params) => {
      refresh();
    },
  });

  const displayColumn = useGetDisplayColumn(columnsSetConfig, getAdjustableColumns(formatMessage, prefix, fieldFunc));
  const renderName = ({ record }: { record: Record }) => {
    const projData: any = record?.toData();
    const unix = String(moment(projData.creationDate).unix());
    projData.background = getRandomBackground(unix.substring(unix.length - 3));
    const disabled = projData.projectStatus === 'creating' || !projData.enabled;
    const projectNameCls = classNames({
      'project-name': true,
      'project-name-disable': disabled,
    });
    return (
      <div className="c7ncd-allprojectslist-table-field-name">
        <div className="c7ncd-allprojectslist-table-field-name-left">
          <span
            className="project-icon"
            style={{
              backgroundImage: projData.imageUrl
                ? `url("${projData.imageUrl}")`
                : projData.background,
            }}
          >
            <span>
              {!projData.imageUrl && projData.name && projData.name.slice(0, 1).toUpperCase()}
            </span>
          </span>

          <span
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled ? '#0F1358' : 'rgba(83, 101, 234, 1)',
            }}
            role="none"
            className={projectNameCls}
            onMouseEnter={(e) => { handleMouseEnter(e, record.get('name')); }}
            onMouseLeave={handleMouseLeave}
            onClick={() => { handleProjClick(projData); }}
          >
            {record.get('name')}
          </span>

          {checkOperation(projData) ? (
            <Icon
              type={projData.starFlag ? 'stars' : 'star_border'}
              style={{
                color: projData.starFlag ? '#faad14' : 'rgba(15, 19, 88, 0.45)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              onClick={() => { handleStarClick(projData); }}
            />
          ) : null}
        </div>
        <div className="c7ncd-allprojectslist-table-field-name-right">
          {renderAction({ record })}
        </div>
      </div>
    );
  };

  const alwaysShowColumns:ColumnProps[] = [
    {
      name: 'name',
      renderer: renderName,
      sortable: true,
      resizable: false,
      width: 265,
      lock: true,
    },
  ];

  const checkOperation = useCallback(
    (projData) => projData
      && (projData.operateType === 'update' || projData.projectStatus === 'success'),
    [],
  );

  const handleEditProj = (pid: string) => {
    Modal.open({
      key: modalkey2,
      drawer: true,
      title: '项目设置',
      className: 'c7n-projects-modal-create-project',
      children: (
        <CreateProject
          refresh={refresh}
          projectId={pid}
          categoryCodes={categoryCodes}
        />
      ),
      okText: '保存',
      style: {
        width: 744,
      },
    });
  };

  const handleEnabledProj = async (pid: string) => {
    if (await axios.put(`/cbase/choerodon/v1/organizations/${organizationId}/projects/${pid}/enable`)) {
      refresh();
    }
  };

  const handleDisableProj = async (pid: Record) => {
    if (await axios.put(`/cbase/choerodon/v1/organizations/${organizationId}/projects/${pid}/disable`)) {
      refresh();
    }
  };

  const openDisableModal = useCallback((projectData) => {
    try {
      const {
        categories, name: projectName, id: projectId, programName,
      } = projectData || {};
      const isProgram = some(categories, ['code', categoryCodes.program]);
      // @ts-ignore
      const ModalContent = ({ modal: newModal }) => {
        let extraMessage;
        if (isProgram) {
          extraMessage = (
            <>
              <div className="c7n-project-disabled-modal-warning">
                <Icon type="info" />
                <span>&nbsp;项目群停用后，ART将自动停止，子项目和项目群的关联也将自动停用，子项目的迭代节奏、迭代规划不再受到ART的统一管理。ART下进行中的PI将直接完成，未完成的PI将会删除，未完成的特性将会移动至待办。子项目进行中的迭代会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！</span>
              </div>
              <div style={{ marginTop: 10 }}>
                请输入
                {' '}
                <span style={{ fontWeight: 600 }}>{projectName}</span>
                {' '}
                来确认停用。
              </div>
              <TextField
                style={{ width: '100%', marginTop: 10 }}
                autoFocus
                onInput={(e) => {
                  newModal.update({
                    okProps: {
                      // @ts-ignore
                      disabled: e.target.value !== projectName,
                    },
                  });
                }}
              />
            </>
          );
        } else if (programName) {
          extraMessage = (
            <div className="c7n-project-disabled-modal-warning">
              <Icon type="info" />
              <span>&nbsp;子项目停用后，与项目群相关的冲刺将发生变动，进行中的冲刺会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！</span>
            </div>
          );
        }
        const content = (
          <div style={{ marginTop: -10 }}>
            {isProgram && (
              <p className="c7n-project-disabled-modal-tips">
                请仔细阅读下列事项！
              </p>
            )}
            <span>
              确定要停用项目“
              {projectName}
              ”吗？停用后，您和项目下其他成员将无法进入此项目。
            </span>
            {extraMessage}
          </div>
        );
        return content;
      };
      if (isProgram) {
        Modal.open({
          title: '停用项目',
          // @ts-ignore
          children: <ModalContent />,
          onOk: () => handleDisableProj(projectId),
          okProps: { disabled: true },
          okText: '我已经知道后果，停用此项目',
        });
      } else {
        Modal.open({
          title: '停用项目',
          // @ts-ignore
          children: <ModalContent />,
          onOk: () => handleDisableProj(projectId),
        });
      }
    } catch (e) {
      return false;
    }
    return false;
  }, []);

  const handleRetry = async (projectId: string, sagaInstanceIds: string, operateType:string) => {
    const notificationKey = `${organizationId}-${projectId}`;
    notification.open({
      key: notificationKey,
      message: (
        <span className="c7ncd-project-create-notification-title">
          {operateType === 'create' ? '创建项目' : '修改项目'}
        </span>
      ),
      description: (
        <ProjectNotification
         // @ts-ignore
          notificationKey={notificationKey}
          organizationId={organizationId}
          projectId={projectId}
          operateType={operateType}
          formatMessage={formatMessage}
          intlPrefix={intlPrefix}
          refresh={refresh}
          isRetry
        />
      ),
      duration: null,
      placement: 'bottomLeft',
      className: 'c7ncd-project-create-notification',
    });
  };

  const handleDelete = async (pid: string) => {
    if (await axios.delete(`/cbase/choerodon/v1/projects/${pid}`)) {
      refresh();
    }
  };

  const handleProjClick = async (projData: any) => {
    if (projData.enabled && checkOperation(projData)) {
      handleClickProject(projData, history, AppState);
    }
  };

  const handleStarClick = throttle(async (item) => {
    if (item.enabled) {
      await startProjChange(item.id, !item.starFlag, organizationId, ProjectsProUseStore);
      refresh();
    }
  }, 2000);

  const handleMouseEnter = (e: any, title: string) => {
    const { currentTarget } = e;
    if (isOverflow(currentTarget)) {
      Tooltip.show(currentTarget, {
        title,
        placement: 'bottom',
      });
    }
  };

  const handleMouseLeave = () => {
    Tooltip.hide();
  };

  const openHealthModal = (record:Record) => {
    const onOk = async (value:any) => {
      const param = { projectId: record.get('id'), healthStateId: value };
      run(param);
    };
    openStatusSettingModal?.default && openStatusSettingModal?.default({ onOk, value: record.get('healthStateDTO')?.id, valueKey: 'id' });
    // get('base-business:openStatusSettingModal')();
  };

  const renderAction = ({ record }: { record: Record }) => {
    const projData = record.toData();
    const {
      projectStatus, editFlag, enabled, id: currentProjectId,
    } = record.toData();
    const editData = {
      text: '修改',
      action: () => handleEditProj(projData.id),
    };
    const disableData = {
      text: '停用',
      action: () => openDisableModal(projData),
    };
    const healthData = {
      text: '设置健康状态',
      action: () => openHealthModal(record),
    };
    let actionData: any = [];
    if (!enabled) {
      actionData = [
        {
          text: '启用',
          action: () => handleEnabledProj(currentProjectId),
        },
      ];
    }
    switch (projectStatus) {
      case 'success':
        actionData = HAS_BASE_BUSINESS ? [editData, disableData, healthData] : [editData, disableData];
        break;
      case 'failed':
        actionData = [
          {
            text: '重试',
            action: () => handleRetry(projData.id, projData.sagaInstanceIds, projData.operateType),
          },
        ];
        if (projData.operateType === 'create') {
          actionData.push({
            text: '删除',
            action: () => handleDelete(projData.id),
          });
        } else {
          // @ts-ignore
          actionData.unshift(editData);
          // @ts-ignore
          actionData.push(disableData);
        }
        break;
      default:
        break;
    }
    return editFlag && actionData ? (
      <Action
        data={actionData}
      />
    ) : null;
  };
  return (
    <Table columns={alwaysShowColumns.concat(displayColumn)} columnResizable onColumnResize={columnResize} dataSet={projectListDataSet} queryBar={'none' as any} className="c7ncd-allprojectslist-table" />
  );
};

export default observer(Index);
