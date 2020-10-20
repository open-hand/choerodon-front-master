import React from 'react';
import { Icon } from 'choerodon-ui';
import { Tooltip } from 'choerodon-ui/pro';
import TimePopover from '@/containers/components/c7n/routes/workBench/components/time-popover';
import { getRandomBackground } from '@/containers/components/c7n/util';
import { useProjectsProStore } from '../stores';

import './projectTaskContent.less';

export default ({ data, alltrue }) => {
  const {
    ProjectsProUseStore,
  } = useProjectsProStore();
  if (alltrue) {
    data.starFlag = true;
  }
  return (
    <div>
      <div className="starProjects-items-content">
        <div style={{ display: 'flex', alignItems: 'center', width: '60%' }}>
          <div
            className="starProjects-items-content-icon"
            style={{
              backgroundImage: data.imageUrl ? `url("${data.imageUrl}")` : getRandomBackground(data.id),
            }}
          >
            {!data.imageUrl && data.name && data.name.slice(0, 1)}
          </div>
          <div className="starProjects-items-content-center">
            <p className="starProjects-items-content-center-title">
              <Tooltip title={data.name} placement="top">
                {data.name}
              </Tooltip>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
              <Tooltip title={data.code && data.code.toUpperCase()}>
                <p className="starProjects-items-content-center-code">{data.code && data.code.toUpperCase()}</p>
              </Tooltip>
              <p className={`starProjects-items-content-center-status starProjects-items-content-center-status-${data.enabled}`}>
                {data.enabled ? '启用' : '停用'}
              </p>
            </div>
          </div>
        </div>

        <div className="starProjects-items-content-right">
          <Icon
            type={data.starFlag ? 'turned_in' : 'turned_in_not'}
            style={{
              color: data.starFlag ? 'rgb(86, 111, 225)' : 'rgb(196, 195, 225)',
              fontSize: '20px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              const { starFlag } = data;
              ProjectsProUseStore.handleStarProject(data).then(() => {
                const allProjects = ProjectsProUseStore.getAllProjects;
                const index = allProjects.findIndex(i => String(i.id) === String(data.id));
                if (index || String(index) === '0') {
                  ProjectsProUseStore.setAllProjects(allProjects.map((p, pI) => {
                    if (String(pI) === String(index)) {
                      p.starFlag = !starFlag;
                    }
                    return p;
                  }));
                }
                ProjectsProUseStore.handleChangeStarProjects(data);
              });
            }}
          />
          <div className="starProjects-items-content-right-down">
            <Tooltip title={data.createUserName} placement="top">
              <div
                className="starProjects-items-content-right-down-avatur"
                style={{
                  backgroundImage: `url(${data.createUserImageUrl})`,
                }}
              >
                {!data.createUserImageUrl && data.createUserName && data.createUserName.slice(0, 1)}
              </div>
            </Tooltip>
            <p
              style={{
                marginTop: 7,
                fontSize: '12px',
                fontFamily: 'PingFangSC-Regular,PingFang SC',
                fontWeight: 400,
                color: 'rgba(58,52,95,0.65)',
              }}
            >
              <TimePopover datetime={data.creationDate} />创建
            </p>
          </div>
        </div>
      </div>
      <div className="starProjects-items-down">
        <Tooltip
          title={data.categories && data.categories.find(c => c.code !== 'PROGRAM_PROJECT') && data.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}
        >
          <div>
            <span>
              <Icon style={{ color: 'rgba(104,135,232,1)' }} type="project_line" />
            </span>
            <p style={{
              display: 'inline-block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{data.categories && data.categories.find(c => c.code !== 'PROGRAM_PROJECT') && data.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}</p>
          </div>
        </Tooltip>

        {data.programName && (
          <Tooltip title={data.programName}>
            <div>
              <span>
                <Icon style={{ color: 'rgba(104,135,232,1)' }} type="project_group" />
              </span>
              <p
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {data.programName}
              </p>
            </div>
          </Tooltip>
        )}

      </div>
    </div>
  );
};
