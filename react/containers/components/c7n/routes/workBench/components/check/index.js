import React from 'react';
import map from 'lodash/map';
import { Icon } from 'choerodon-ui/pro';

import './index.less';

const data = [
  {
    id: 1,
    projectName: '基础架构管理-区块链中台研发',
    content: '流水线“持续交付流水线”目前暂停于【开发环境】阶段的打法上发放',
    type: 'pipeline',
  },
  {
    id: 2,
    projectName: '基础架构管理-区块链中台研发',
    content: '李丹丹（9211）在应用服务”XXX“中提交了合并请',
    type: 'merge',
    userName: '李丹丹',
    userUrl: '',
  },
  {
    id: 3,
    projectName: '基础架构管理-区块链中台研发',
    content: '流水线“持续交付流水线”目前暂停于【开发环境】阶段的打法上发放',
    type: 'pipeline',
  },
  {
    id: 4,
    projectName: '基础架构管理-区块链中台研发',
    content: '李丹丹（9211）在应用服务”XXX“中提交了合并请',
    type: 'merge',
    userName: '李丹丹',
    userUrl: '',
  },
];

const StarTargetPro = () => (map(data, ({ id, projectName, content, userName, userUrl }) => (
  <div className="c7n-workbench-check-item" key={id}>
    <div className="c7n-workbench-check-item-border" />
    <div className="c7n-workbench-check-item-content">
      <div className="c7n-workbench-check-item-project">{projectName}</div>
      <div className="c7n-workbench-check-item-des">
        {userName && (
          <div className="c7n-workbench-check-item-user">
            {userUrl ? (
              <img src={userUrl} alt="avatar" />) : (
                <span className="c7n-workbench-check-item-user-text">
                  {(userName || '').toUpperCase().substring(0, 1)}
                </span>
            )}
          </div>
        )}
        <span className="c7n-workbench-check-item-des-text">{content}</span>
      </div>
    </div>
    <div className="c7n-workbench-check-item-btn">
      <Icon type="find_in_page" className="c7n-workbench-check-item-btn-icon" />
      <span>详情</span>
    </div>
  </div>
)));

export default StarTargetPro;
