import React from 'react';
import { Avatar } from 'choerodon-ui';
import { Action } from '../../../../../../../index';

const Card = ({ name, imgUrl }) => (
  <div className="card">
    <div className="border-top" />
    <div className="card-content">
      <Avatar size={80} />
      <h3>{name}</h3>
      <div>
        <span className="text link-text">Choerodon DevOps</span>
        <span className="text separator">·</span>
        <span className="text">c7ncd</span>
        <span className="text separator">·</span>
        <span className="text">敏捷管理</span>
      </div>
    </div>
    <div className="card-footer">
      <div className="card-footer-left">
        <Avatar size={18} style={{ marginRight: 8 }}>M</Avatar>
        <span className="text">周唧唧</span>
        <span className="text separator">·</span>
        <span className="text">2019-07-21</span>
      </div>
      <Action />
    </div>
  </div>
);

export default Card;
