import {
  Icon, Modal, Table, TextField, Tooltip,
} from 'choerodon-ui/pro';
import { Tag } from 'choerodon-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { StatusTag, UserInfo, HealthStatus } from '@choerodon/components';
import { some, throttle } from 'lodash';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import moment from 'moment';
import { get } from '@choerodon/inject';
import { useRequest } from 'ahooks';
import { getRandomBackground } from '@/utils';
import { useProjectsProStore } from '../../stores';
import { axios } from '@/index';
import CreateProject from '../create-project';
import handleClickProject from '@/utils/gotoProject';
import {
  MODAL_WIDTH,
} from '@/constants/MODAL';
import Action from '@/components/action';
import { IColumnSetConfig } from './tableColumnSet';
import './table.less';

import { organizationsApi } from '@/apis';
// TODO: 把column的代码拆出去

const { MIDDLE } = MODAL_WIDTH;

const modalkey2 = Modal.key();

const colorMap = new Map([
  ['failed', 'failed'],
  ['creating', 'operating'],
  ['updating', 'operating'],
]);

export interface IProps {
  columnsConfig: IColumnSetConfig[] | []
}

export const startProjChange = async (pid: string, enable: boolean, organizationId: string, ProjectsProUseStore: any) => {
  enable ? await axios.post(`/iam/choerodon/v1/organizations/${organizationId}/star_projects`, {
    projectId: pid,
  }) : await axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/star_projects?project_id=${pid}`);
  ProjectsProUseStore.axiosGetStarProjects();
  ProjectsProUseStore.axiosGetRecentProjects();
};

const Index: React.FC<IProps> = (props) => {
  const { columnsConfig } = props;
  const {
    categoryCodes,
    history,
    AppState,
    AppState: { getUserId, currentMenuType: { organizationId } },
    projectListDataSet,
    intl: { formatMessage },
    ProjectsProUseStore,
    prefix,
  } = useProjectsProStore();
  const refresh = () => {
    projectListDataSet.query();
  };
  const {
    data, error, loading, run,
  } = useRequest((paramData:any) => organizationsApi.setHealthStatus(paramData), {

    manual: true,
    onSuccess: (result, params) => {
      refresh();
    },

  });

  const checkOperation = useCallback(
    (data) => data
      && (data.operateType === 'update' || data.projectStatus === 'success'),
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
        // inNewUserGuideStepOne={inNewUserGuideStepOne}
        />
      ),
      okText: '保存',
      style: {
        width: MIDDLE,
      },
    });
  };

  const handleEnabledProj = async (pid: string) => {
    if (await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/projects/${pid}/enable`)) {
      refresh();
    }
  };

  const handleDisableProj = async (pid: Record) => {
    if (await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/projects/${pid}/disable`)) {
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

  const handleRetry = async (projectId: string, sagaInstanceIds: string) => {
    if (
      await axios.put(`/hagd/v1/sagas/projects/${projectId}/tasks/instances/retry`, sagaInstanceIds)
    ) {
      refresh();
    }
  };

  const handleDelete = async (pid: string) => {
    if (await axios.delete(`/iam/choerodon/v1/projects/${pid}`)) {
      refresh();
    }
  };

  const handleProjClick = async (data: any) => {
    if (data.enabled && checkOperation(data)) {
      handleClickProject(data, history, AppState);
    }
  };

  const handleStarClick = throttle(async (data) => {
    if (data.enabled) {
      await startProjChange(data.id, !data.starFlag, organizationId, ProjectsProUseStore);
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

  const renderName = ({ record }: { record: Record }) => {
    const projData: any = record?.toData();
    const unix = String(moment(projData.creationDate).unix());
    projData.background = getRandomBackground(unix.substring(unix.length - 3));
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
              cursor: projData.enabled ? 'pointer' : 'not-allowed',
              color: 'rgba(83, 101, 234, 1)',
            }}
            role="none"
            className="project-name"
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

  const openHealthModal = (record:Record) => {
    const onOk = async (value:any) => {
      const param = { projectId: record.get('id'), healthStateId: value };
      run(param);
    };
    get('base-business:openStatusSettingModal')({ onOk, value: record.get('healthStateDTO')?.id, valueKey: 'id' });
  };
  const renderAction = ({ record }: { record: Record }) => {
    const data = record.toData();
    const {
      projectStatus, editFlag, enabled, id: currentProjectId,
    } = record.toData();
    const editData = {
      text: '修改',
      action: () => handleEditProj(data.id),
    };
    const disableData = {
      text: '停用',
      action: () => openDisableModal(data),
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
        actionData = [editData, disableData, healthData];
        break;
      case 'failed':
        actionData = [
          {
            text: '重试',
            action: () => handleRetry(data.id, data.sagaInstanceIds),
          },
        ];
        if (data.operateType === 'create') {
          actionData.push({
            text: '删除',
            action: () => handleDelete(data.id),
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

  const getStatusName = (record: Record) => {
    const pData = record.toData();
    if (pData.statusName) {
      return pData.statusName;
    }
    const getName = (p: any) => (
      // eslint-disable-next-line no-nested-ternary
      !p.projectStatus || p.projectStatus === 'success'
        ? p.enabled
          ? '启用'
          : '停用'
        : formatMessage({
          id: `c7ncd.project.${p.projectStatus}${p.projectStatus === 'failed'
            ? `.${p.operateType}`
            : ''
          }`,
        }));
    return getName(pData);
  };

  const getColor = (record: Record) => {
    const p = record.toData();
    if (['creating', 'updating', 'failed'].includes(p.projectStatus)) {
      return '';
    }
    return record?.get('color') || '';
  };

  const getStatusColorCode = (record: Record) => {
    const p = record.toData();
    if (!p.projectStatus || p.projectStatus === 'success') {
      return p.enabled ? 'success' : 'failed';
    }
    return colorMap.get(p.projectStatus);
  };

  const renderEnabled = ({ value, record }: { value: boolean, record: Record }) => (
    <div style={{
      display: 'flex', justifyContent: 'left', height: '100%', alignItems: 'center',
    }}
    >
      <StatusTag
        color={getColor(record)}
      // @ts-ignore
        colorCode={getStatusColorCode(record)}
        name={getStatusName(record)}
      />
    </div>
  );

  const renderWorkGroup = ({ value, record }: { value: string, record: Record }) => {
    if (value) {
      if (value.indexOf('-') === -1) {
        return (
          <Tooltip title={value}>
            {value}
          </Tooltip>
        );
      }
      const strEnd = value.split('-').pop();
      return (
        <Tooltip title={value}>
          {strEnd}
        </Tooltip>
      );
    }
    return '';
  };

  const renderCategories = ({ value }: { value: any }) => {
    if (!value) {
      return '';
    }
    let title = '';
    value.forEach((i:any) => {
      title += `${i.name}，`;
    });
    return (
      <Tooltip title={title.substring(0, title.length - 1)}>
        { value.map((item:any, index:number) => (
          <Tag
            key={item.name}
            className="categories-tag"
            color="rgba(15, 19, 88, 0.06)"
          >
            {item.name}
          </Tag>

        ))}
      </Tooltip>
    );
  };

  const renderCreater = ({ record }: { record: Record }) => <UserInfo realName={record?.get('createUserName')} avatar={record?.get('createUserImageUrl')} />;

  const renderUpdater = ({ record }: { record: Record }) => <UserInfo realName={record?.get('updateUserName')} avatar={record?.get('updateUserImageUrl')} />;
  const renderHealthState = ({ record }: { record: Record }) => {
    const { color, name, description } = record.get('healthStateDTO') || {};
    return <HealthStatus color={color} name={name} description={description} className={`${prefix}-healthStatus`} />;
  };
  const getColumns = useMemo(() => {
    if (!columnsConfig.length) {
      return [];
    }
    const adjustableColumns = [
      {
        name: 'code',
        tooltip: 'overflow',
        sortable: true,
        align: 'left',
        minWidth: 120,
      },
      {
        name: 'enabled',
        renderer: renderEnabled,
        sortable: true,
        align: 'left',
        minWidth: 110,
      },
      {
        name: 'workGroup',
        renderer: renderWorkGroup,
        align: 'left',
      },
      {
        name: 'projectClassfication',
        tooltip: 'overflow',
        align: 'left',
      },
      {
        name: 'programName',
        tooltip: 'overflow',
        align: 'left',
      },
      {
        name: 'categories',
        renderer: renderCategories,
        align: 'left',
      },
      {
        name: 'description',
        tooltip: 'overflow',
        align: 'left',
      },
      {
        name: 'devopsComponentCode',
        tooltip: 'overflow',
        align: 'left',
        minWidth: 140,
      },
      {
        name: 'createUserName',
        renderer: renderCreater,
        align: 'left',
      },
      {
        name: 'creationDate',
        tooltip: 'overflow',
        align: 'left',
        width: 155,
      },
      {
        name: 'updateUserName',
        renderer: renderUpdater,
        align: 'left',
      },
      {
        name: 'lastUpdateDate',
        tooltip: 'overflow',
        align: 'left',
        width: 155,
      },
      {
        name: 'healthState',
        renderer: renderHealthState,
        sortable: true,
        width: 265,
        lock: true,
      },
    ];
    const displayColumn: any = [
      {
        name: 'name',
        renderer: renderName,
        sortable: true,
        width: 265,
        lock: true,
      },
    ];
    columnsConfig.forEach((item:IColumnSetConfig) => {
      if (item.isSelected) {
        const found = adjustableColumns.find((i) => i.name === item.name);
        displayColumn.push(found);
      }
    });
    return displayColumn;
  }, [columnsConfig]);

  return (
    <Table columns={getColumns} columnResizable dataSet={projectListDataSet} queryBar={'none' as any} className="c7ncd-allprojectslist-table" />
  );
};

export default observer(Index);
