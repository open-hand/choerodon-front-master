import React from 'react';
import { Avatar } from 'choerodon-ui';
import { Action } from '../../../../../../../index';
import PROJECT_TYPE from '../../constant';

const Card = ({ handleEditProject, handleClickProject, dataSet, record, ...props }) => {
  const { name, code, imgUrl, applicationName, category, createUserImageUrl, createUserName, creationDate } = props;

  function handleFocus() {
    const index = dataSet.findIndex(r => r.get('code') === code);
    if (index !== -1) {
      dataSet.locate(index);
      handleEditProject();
    }
  }

  function handleClick() {
    handleClickProject(record);
  }
  
  function renderAction() {
    const actionDatas = [
      { service: [], icon: '', text: '编辑', action: handleFocus },
    ];
    return <Action data={actionDatas} />;
  }

  return (
    <div className="card">
      <div className="border-top" />
      <div className="card-content" role="none" onClick={handleClick}>
        <Avatar size={80} src={imgUrl} style={{ fontSize: '32px' }}>{name && name.charAt(0)}</Avatar>
        <h3>{name}</h3>
        <div>
          <span className="text link-text">{applicationName || '无关联应用'}</span>
          <span className="text separator">·</span>
          <span className="text">{code}</span>
          <span className="text separator">·</span>
          <span className="text">{PROJECT_TYPE[category]}</span>
        </div>
      </div>
      <div className="card-footer">
        <div className="card-footer-left">
          <Avatar size={18} style={{ marginRight: 8 }} src={createUserImageUrl}>
            {createUserName ? createUserName.charAt(0) : ''}
          </Avatar>
          <span className="text">{createUserName || '创建用户未知'}</span>
          <span className="text separator">·</span>
          <span className="text">{creationDate}</span>
        </div>
        {renderAction()}
      </div>
    </div>
  );
};

export default Card;
