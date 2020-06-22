import React from 'react';
import {Icon} from "choerodon-ui";
import TimePopover from "@/containers/components/c7n/routes/workBench/components/time-popover";
import { useProjectsProStore } from "../stores";

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
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '60%' }}>
          <div
            className="starProjects-items-content-icon"
            style={{
              backgroundImage: data.imageUrl ? `url("${data.imageUrl}")` : 'linear-gradient(225deg, #98e5da 0%, #00bfa5 100%)',
            }}
          >
            {data.name.slice(0, 1)}
          </div>
          <div className="starProjects-items-content-center">
            <p className="starProjects-items-content-center-title">{data.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 7 }}>
              <p className="starProjects-items-content-center-code">{data.code && data.code.toUpperCase()}</p>
              <p className="starProjects-items-content-center-status">{data.enabled ? '启用' : '未启用'}</p>
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
              const starFlag = data.starFlag
              ProjectsProUseStore.handleStarProject(data).then(() => {
                const allProjects = ProjectsProUseStore.getAllProjects;
                const index = allProjects.findIndex(i => String(i.id) === String(data.id));
                if (index || String(index) === '0') {
                  ProjectsProUseStore.setAllProjects(allProjects.map((p, pI) => {
                    if (String(pI) === String(index)) {
                      p.starFlag = !starFlag;
                    }
                    return p;
                  }))
                  console.log(ProjectsProUseStore.getAllProjects);
                }
                ProjectsProUseStore.handleChangeStarProjects(data);
              });
            }}
          />
          <div className="starProjects-items-content-right-down">
            <div
              className="starProjects-items-content-right-down-avatur"
              style={{
                backgroundImage: `url(${data.createUserImageUrl})`
              }}
            />
            <p style={{ marginTop: 7 }}>
              <TimePopover datetime={data.creationDate} />创建
            </p>
          </div>
        </div>
      </div>
      <div className="starProjects-items-down">
        <div>
        <span>
          <Icon style={{ color: 'rgba(104,135,232,1)' }} type="project_line" />
        </span>
          <p style={{ display: 'inline-block' }}>{data.categories && data.categories.find(c => c.code !== 'PROGRAM_PROJECT') && data.categories.find(c => c.code !== 'PROGRAM_PROJECT').name}</p>
        </div>
        {
          data.categories && data.categories.find(c => c.code === 'PROGRAM_PROJECT') && (
            <div>
            <span>
              <Icon style={{ color: 'rgba(104,135,232,1)' }} type="project_group" />
            </span>
              <p style={{ display: 'inline-block' }}>{data.categories.find(c => c.code === 'PROGRAM_PROJECT').name}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
