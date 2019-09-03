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
    MICROSERVICE: {
      title: '普通应用项目',
      color: '#57aaf8',
      icon: 'micro',
    },
    AGILE: {
      title: '敏捷管理项目',
      color: '#32c6de',
      icon: 'agile',
    },
    PROGRAM: {
      title: '敏捷项目群项目',
      color: '#7589f2',
      icon: 'project_group',
    },
    LOWCODE: {
      title: '低代码应用项目',
      color: '#4d90fe',
      icon: 'code',
    },
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
      'simple-card': true,
      active: idActive,
    });
    return (
      <div className={classNames} onClick={() => handleClickType(type)}>
        <div className="card-body">
          <div className="card-body-radius" style={{ background: TYPE_MAP[type].color }}>
            <Icon type={TYPE_MAP[type].icon} style={{ color: '#fff', fontSize: '48px' }} />
          </div>
        </div>
        <div className="card-footer">{TYPE_MAP[type].title}</div>
        <div className="check-icon" style={{ display: idActive ? 'block' : 'none' }}>
          <Icon type="check" />
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-tab-card-block">
      {['MICROSERVICE', 'AGILE', 'PROGRAM'].map(t => renderCard(t))}
    </div>
  );
});

export default FormView;
