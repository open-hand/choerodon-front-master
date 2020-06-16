import React, { useState } from 'react';
import { Button } from 'choerodon-ui/pro';
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

const StarTargetPro = () => {
  const [starProjects, setStarProjects] = useState([]);

  const handleClickItem = (s) => {
    setStarProjects(starProjects.map(si => {
     if (si.id === s.id) {
       si.active = true;
     } else {
       si.active = false;
     }
     return si;
    }))
  }

  const renderContent = () => {
    if (starProjects.length == 0) {
      return (
        <div className="c7n-starTargetPro-content">
          <img src={emptyImg} alt="empty"/>,
          <div className="c7n-starTargetPro-content-emptyText">
            <p className="c7n-starTargetPro-content-emptyText-emptyP">暂无星标</p>
            <p className="c7n-starTargetPro-content-emptyText-emptySuggest">您还没有星标项目，请前往"项目管理"页面进行添加</p>
            <Button onClick={() => setStarProjects(starProjects.length == 0 ? init : [])} funcType="raised" color="primary">转到项目管理</Button>
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
                <div className="c7n-starTargetPro-proContainer-items-icon" />
                <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }} className="c7n-starTargetPro-proContainer-items-text">{s.text}</p>
                <p style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }} className="c7n-starTargetPro-proContainer-items-project">{s.project}
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
}

export default StarTargetPro;
