import React, { useState, useEffect } from 'react';
import { Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useStarTargetPro } from "./stores";
import { Icon } from "choerodon-ui";
import emptyImg from '../../../../../../images/owner.png';

import './index.less';

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
    starTargetProUseStore
  } = useStarTargetPro();

  useEffect(() => {
    starTargetProUseStore.axiosGetStarProjects();
  }, []);

  const handleClickItem = (s) => {
    const origin = starTargetProUseStore.getStarProjects;
    starTargetProUseStore.setStarProjects(origin.map(si => {
     if (si.id === s.id) {
       si.active = true;
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
          <img src={emptyImg} alt="empty"/>,
          <div className="c7n-starTargetPro-content-emptyText">
            <p className="c7n-starTargetPro-content-emptyText-emptyP">暂无星标</p>
            <p className="c7n-starTargetPro-content-emptyText-emptySuggest">您还没有星标项目，请前往"项目管理"页面进行添加</p>
            <Button funcType="raised" color="primary">转到项目管理</Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="c7n-starTargetPro-proContainer">
          {
            starProjects.map(s => (
              <div
                className={s.active ? "c7n-starTargetPro-proContainer-items c7n-starTargetPro-proContainer-focus" : "c7n-starTargetPro-proContainer-items"}
                onClick={() => handleClickItem(s)}
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
                    background: s.imageUrl ? `url(${s.imageUrl})` : 'linear-gradient(225deg,rgba(152,229,218,1) 0%,rgba(0,191,165,1) 100%)',
                  }}
                />
                <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }} className="c7n-starTargetPro-proContainer-items-text">{s.name}</p>
                <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }} className="c7n-starTargetPro-proContainer-items-project">{s.categories && s.categories[0].name}
                  <span
                    style={{
                      position: s.active ? 'relative' : 'unset',
                      top: s.active ? '40px' : 'unset'
                    }}
                  >
                    <Icon style={{ color: s.active ? 'white' : '#6887E8' }} type="trending_flat" />
                  </span>
                </p>
                {
                  s.active && (
                    <div className="c7n-starTargetPro-proContainer-items-extra">
                      <div className="c7n-starTargetPro-proContainer-items-extra-icon" />
                      <div className="c7n-starTargetPro-proContainer-items-extra-text">
                        <p>创建于</p>
                        <p>{s.time}</p>
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
