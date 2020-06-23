import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useStarTargetPro } from "./stores";
import { useWorkBenchStore } from "../../stores";
import { Icon } from "choerodon-ui";
import emptyImg from '../../../../../../images/owner.png';

import './index.less';
import {getRandomBackground} from "@/containers/components/c7n/util";

const init = [{
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
  id: 1,
  time: '2018-07-07',
}, {
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
  id: 2,
  time: '2018-07-07',
}, {
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
  id: 3,
  time: '2018-07-07',
}];

const StarTargetPro = observer(() => {
  const {
    starTargetProUseStore,
  } = useStarTargetPro();

  const {
    workBenchUseStore,
    history,
    location: { search },
    AppState: { currentMenuType: { organizationId } },
  } = useWorkBenchStore();

  useEffect(() => {
    workBenchUseStore.setActiveStarProject(null);
    starTargetProUseStore.axiosGetStarProjects();
  }, [organizationId]);

  const handleClickItem = (s) => {
    const origin = starTargetProUseStore.getStarProjects;
    starTargetProUseStore.setStarProjects(origin.map(si => {
     if (si.id === s.id) {
       workBenchUseStore.setActiveStarProject(!s.active ? si : undefined)
       si.active = !s.active;
     } else {
       si.active = false;
     }
     return si;
    }))
  }

  const renderContent = () => {
    const starProjects = starTargetProUseStore.getStarProjects;
    if (starProjects.length == 0) {
      return (
        <div className="c7n-starTargetPro-content">
          <img src={emptyImg} alt="empty"/>
          <div className="c7n-starTargetPro-content-emptyText">
            <p className="c7n-starTargetPro-content-emptyText-emptyP">暂无星标</p>
            <p className="c7n-starTargetPro-content-emptyText-emptySuggest">您还没有星标项目，请前往"项目管理"页面进行添加</p>
            <Button onClick={() => {
              history.push({
                pathname: '/projects',
                search,
              })
            }} funcType="raised" color="primary">转到项目管理</Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="c7n-starTargetPro-proContainer">
          {
            starProjects.slice(0, 6).map((s, sIndex) => (
              <div
                className={s.active ? "c7n-starTargetPro-proContainer-items c7n-starTargetPro-proContainer-focus" : "c7n-starTargetPro-proContainer-items"}
                onClick={() => handleClickItem(s)}
                style={{
                  marginRight: sIndex === 5 ? 0 : '20px',
                  maxWidth: 'calc((100% - 100px) / 6)',
                }}
              >
                {
                  s.active && (
                    <div className="c7n-starTargetPro-proContainer-items-correct">
                      <i className="c7n-starTargetPro-proContainer-items-correct-icon" />
                    </div>
                  )
                }
                <div
                  className="c7n-starTargetPro-proContainer-items-icon"
                  style={{
                    backgroundImage: s.imageUrl ? `url("${s.imageUrl}")` : getRandomBackground(s.id),
                  }}
                >
                  {!s.imageUrl && s.name.slice(0, 1)}
                </div>
                <Tooltip title={`${s.name} (${s.code})`} placement="top">
                  <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }} className="c7n-starTargetPro-proContainer-items-text">{s.name}&nbsp;({s.code})</p>
                </Tooltip>
                <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,0.65)' }} className="c7n-starTargetPro-proContainer-items-project">
                  <Tooltip title={s.categories && s.categories[0].name} placement="top">
                    <span className="c7n-starTargetPro-proContainer-items-project-categories">{s.categories && s.categories[0].name}</span>
                  </Tooltip>
                  <span
                    className="c7n-starTargetPro-proContainer-items-project-goNext"
                    style={{
                      position: s.active ? 'relative' : 'unset',
                      top: s.active ? '40px' : 'unset',
                      left: s.active ? '8px' : 'unset',
                      background: s.active ? 'rgba(255,255,255,0.12)' : 'rgba(104,135,232,0.1)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      workBenchUseStore.handleClickProject(s);
                    }}
                  >
                    <Icon style={{ color: s.active ? 'white' : '#6887E8' }} type="trending_flat" />
                  </span>
                </p>
                {
                  s.active && (
                    <div className="c7n-starTargetPro-proContainer-items-extra">
                      <Tooltip title={s.createUserName} placement="top">
                        <div
                          className="c7n-starTargetPro-proContainer-items-extra-icon"
                          style={{
                            backgroundImage: `url(${s.createUserImageUrl})`
                          }}
                        >
                          {!s.createUserImageUrl && s.createUserName.slice(0, 1)}
                        </div>
                      </Tooltip>
                      <div className="c7n-starTargetPro-proContainer-items-extra-text">
                        <p>创建于</p>
                        <p>{s.creationDate && s.creationDate.split(' ')[0]}</p>
                      </div>
                    </div>
                  )
                }
              </div>
            ))
          }
        </div>
      )
    }
  }

  return (
    <div className="c7n-starTargetPro">
      <p className="c7n-starTargetPro-name">星标项目</p>
      {renderContent()}
    </div>
  )
});

export default StarTargetPro;
