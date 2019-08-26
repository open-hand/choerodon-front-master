import React from 'react';
import { Avatar } from 'choerodon-ui';
import { Action } from '../../../../../../../index';

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
        <Avatar size={50} src={imgUrl} style={{ fontSize: '32px' }}>{name && name.charAt(0)}</Avatar>
        <h3>{name}</h3>
        <div>
          <span className="text link-text">{applicationName || '无关联应用'}</span>
          <span className="text separator">·</span>
          <span className="text">{code}</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="text">{creationDate}</span>
        {renderAction()}
      </div>
    </div>
  );
};

export default Card;
