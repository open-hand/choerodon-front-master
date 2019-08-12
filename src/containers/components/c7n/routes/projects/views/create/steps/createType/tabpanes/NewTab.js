import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Form, Output } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import './index.less';

const FormView = observer(({ context }) => {
  const { dataSet } = context;
  const record = dataSet.current;

  const TYPE_MAP = {
    MICROSERVICE: '创建普通应用项目',
    AGILE: '创建敏捷管理项目',
    PROGRAM: '创建敏捷项目群项目',
    LOWCODE: '创建低代码应用项目',
  };

  function handleClickType(type) {
    const currentCreateType = record.get('category');
    if (currentCreateType === type) {
      // record.set('category', undefined);
    } else {
      record.set('category', type);
    }
  }

  function renderCard(type) {
    const idActive = type === record.get('category');
    const classNames = classnames({
      card: true,
      active: idActive,
    });
    return (
      <div className={classNames} onClick={() => handleClickType(type)}>
        <div className="card-body">
          <Icon type="playlist_add" style={{ color: '#3f51b5', fontSize: '64px' }} />
        </div>
        <div className="card-footer">{TYPE_MAP[type]}</div>
        <div className="check-icon" style={{ display: idActive ? 'block' : 'none' }}>
          <Icon type="check" />
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-tab-card-block">
      {['MICROSERVICE', 'AGILE', 'PROGRAM', 'LOWCODE'].map(t => renderCard(t))}
    </div>
  );
});

export default FormView;
