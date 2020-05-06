import React, { useState } from 'react';
import { Icon } from "choerodon-ui";
import './index.less';

const QuickLink = () => {
  const [links, setLinks] = useState([{
    name: '李丹丹',
    day: '2天前',
    project: '基础架构管理-区块链中台研发',
    linkName: 'Choerodon-UI图 蓝湖地址',
  }])

  const renderLinks = () => {
    return links.map(l => (
      <div className="c7n-quickLink-linkItem">
        <div className="c7n-quickLink-linkItem-left">
          <p className="c7n-quickLink-linkItem-left-name">{l.name}</p>
          <p className="c7n-quickLink-linkItem-left-time">{l.day}</p>
        </div>
        <div className="c7n-quickLink-linkItem-circle" />
        <div className="c7n-quickLink-linkItem-right">
          <div className="c7n-quickLink-linkItem-right-profile" />
          <div className="c7n-quickLink-linkItem-right-content">
            <p className="c7n-quickLink-linkItem-right-content-project">{l.project}</p>
            <p className="c7n-quickLink-linkItem-right-content-linkName">{l.linkName}<Icon style={{ color: '#5266D4' }} type="link2" /></p>
          </div>
          <div>
            <Icon type="more_vert" />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        <Icon type="playlist_add" />
      </div>
      {renderLinks()}
    </div>
  )
}

export default QuickLink;
