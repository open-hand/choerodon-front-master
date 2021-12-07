/* eslint-disable */
import React from 'react';
import { Icon } from 'choerodon-ui';
import { Tooltip } from 'choerodon-ui/pro';
import { TimePopover } from '@choerodon/components';
import { getRandomBackground } from '@/utils';
import { useProjectsProStore } from '../stores';

import './projectTaskContent.less';
import moment from "moment";
import ProjectCategory from "./project-category";

export default ({ data, alltrue }) => {
  const {
    ProjectsProUseStore,
  } = useProjectsProStore();
  if (alltrue) {
    data.starFlag = true;
  }
  const unix = String(moment(data.creationDate).unix());
  return (
    <div>
      <div className="starProjects-items-content">
        <div
          className="starProjects-items-content-icon"
          style={{
            backgroundImage: data.imageUrl ? `url("${data.imageUrl}")` : getRandomBackground(unix.substring(unix.length - 3)),
          }}
        >
          {!data.imageUrl && data.name && data.name.slice(0, 1)}
        </div>
        <div className="starProjects-rightContent">
          <div className="starProjects-first">
            <p className="starProjects-items-content-center-title">
              <Tooltip title={data.name} placement="top">
                {data.name}
              </Tooltip>
            </p>
            <Icon
              type={data.starFlag ? 'stars' : 'star_border'}
              style={{
                color: data.starFlag ? '#faad14' : 'rgba(15, 19, 88, 0.45)',
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
          </div>
          <div className="starProjects-second">
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
              <Tooltip title={data.code && data.code.toUpperCase()}>
                <p className="starProjects-items-content-center-code">{data.code && data.code.toUpperCase()}</p>
              </Tooltip>
              <p className={`starProjects-items-content-center-status starProjects-items-content-center-status-${data.enabled}`}>
                {data.enabled ? '启用' : '停用'}
              </p>
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
                  <TimePopover content={data.creationDate} />创建
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="starProjects-items-down">
        <ProjectCategory
          data={data.categories}
          className="allProjects-content-item-right-down-text1"
        />
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
