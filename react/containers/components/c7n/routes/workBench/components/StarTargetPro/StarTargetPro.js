import React, { useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import emptyImg from '../../../../../../images/owner.png';

import './index.less';

const init = [{
  text: '1',
}, {
  text: '2',
}, {
  text: '1',
}, {
  text: '1',
}, {
  text: '1',
}, {
  text: '1',
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
            <Button funcType="raised" color="primary">转到项目管理</Button>,
          </div>
        </div>
      )
    } else {
      return (
        <div className="c7n-starTargetPro-proContainer">
          {
            starProjects.map(s => (
              <div className="c7n-starTargetPro-proContainer-items">
                <p>{s.text}</p>
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
