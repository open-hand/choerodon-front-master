import React, { useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import { Icon } from "choerodon-ui";
import emptyImg from '../../../../../../images/owner.png';

import './index.less';

const init = [{
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
}, {
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
}, {
  text: '基础架构管理-区块链中…(rdm01)',
  project: 'DevOps全流程项目',
}];

const StarTargetPro = () => {
  const [starProjects, setStarProjects] = useState([]);

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
              <div className="c7n-starTargetPro-proContainer-items">
                <div className="c7n-starTargetPro-proContainer-items-icon" />
                <p className="c7n-starTargetPro-proContainer-items-text">{s.text}</p>
                <p className="c7n-starTargetPro-proContainer-items-project">{s.project}
                  <span>
                    <Icon type="trending_flat" />
                  </span>
                </p>
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
