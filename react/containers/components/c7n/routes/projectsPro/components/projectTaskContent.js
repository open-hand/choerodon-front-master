/* eslint-disable */
import React from 'react';
import { Icon,Tag } from 'choerodon-ui';
import { Tooltip } from 'choerodon-ui/pro';
import { TimePopover } from '@choerodon/components';
import TimeAgo from 'timeago-react';
import { getRandomBackground } from '@/utils';
import { useProjectsProStore } from '../stores';

import './projectTaskContent.less';
import moment from "moment";
import ProjectCategory from "./project-category";

export const renderCategoriesTags = (arr)=>(
   arr.map((item,index)=>{
    if(index<=1) {
      return <Tag key={item.name} className="categories-tag" color="rgba(15, 19, 88, 0.06)">{item.name}</Tag>
    }else if (index===2) {
      return (
        <Tooltip title={getText(arr)}>
        <span style={{cursor:'pointer'}}>...</span>
        </Tooltip>
      )
    }
  })
)

const getText = (arr)=>{
  let str = ''
  arr.map((item,index)=>{
    if(index!==arr.length-1) {
      str+=item.name+','
    } else {
      str+=item.name
    }
  })
  return str
}

export default ({ data, alltrue, lastVisitTime }) => {
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
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={data.code && data.code.toUpperCase()}>
                  <p className="starProjects-items-content-center-code">{data.code && data.code.toUpperCase()}</p>
                </Tooltip>
                <p className={`starProjects-items-content-center-status starProjects-items-content-center-status-${data.enabled}`}>
                  {data.enabled ? '启用' : '停用'}
                </p>
              </div>
              <div className='starProjects-items-content-right-down'>
                {lastVisitTime && 
                <div className='time-div'>
                <TimeAgo datetime={lastVisitTime} locale="zh_CN" />
                <span>使用</span>
                </div>
                }
                
              </div>
              {/* <div className="starProjects-items-content-right-down">
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
                  <TimePopover style={{ display: 'inline' }} content={data.creationDate} />创建
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="starProjects-items-down">
        <span className='items-label'>项目类型：</span>
        {
           renderCategoriesTags(data?.categories || [])
        }

      </div>
    </div>
  );
};
