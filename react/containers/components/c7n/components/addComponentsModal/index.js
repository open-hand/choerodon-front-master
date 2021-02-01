import React, { useEffect, useState } from 'react';
import './index.less';

import {
  get, includes, map,
} from 'lodash';
import { Icon } from 'choerodon-ui';
import classnames from 'classnames';
import groupMappings from './groupMappings';
import EmptyPage from '../empty-page';

const AddModal = (props) => {
  const {
    modal,
    addComponent,
    existTypes,
    mappings,
    isProjects,
    // modules,
  } = props;

  const subPrefix = 'c7ncd-workbench-addModal';

  const [activeItem, setActiveItem] = useState(groupMappings(mappings)[0]);
  const [dis, setDis] = useState(0);
  const [seletedComponents, setSelectedComponents] = useState([]);

  useEffect(() => {

  }, []);

  function handleClick(key, index) {
    setActiveItem(key);
    setDis(index);
  }

  function handleSelect(type) {
    const hasItem = seletedComponents.includes(type);
    if (hasItem) {
      setSelectedComponents(seletedComponents.filter((temp) => temp !== type));
      return;
    }
    setSelectedComponents(seletedComponents.concat([type]));
  }

  const renderMenuItems = () => map(groupMappings(mappings), (item, index) => ((
    <div
      role="none"
      onClick={() => handleClick(item, index)}
      key={get(item, 'key')}
      className={`${subPrefix}-sider-item ${item.key === activeItem.key ? `${subPrefix}-sider-item-active` : ''}`}
    >
      {item.name}
    </div>
  )));

  const renderItems = () => {
    const arr = activeItem.opts;
    if (!get(arr, 'length')) {
      const title = (isProjects && get(activeItem, 'emptyTitle')) || '暂未安装对应模块';
      const describe = (isProjects && get(activeItem, 'emptyDesc')) || '暂未安装对应模块，无卡片信息';
      return <EmptyPage title={title} describe={describe} />;
    }
    return map(arr, (item, i) => {
      if (get(item, 'type') === 'starTarget') {
        return null;
      }
      const type = get(item, 'type');
      const hasItem = seletedComponents.includes(type);
      const isExist = includes(existTypes, type);
      const itemsClassname = classnames({
        [`${subPrefix}-right-item`]: true,
        [`${subPrefix}-right-item-selected`]: !isExist && hasItem,
      });
      return (
        <div
          className={itemsClassname}
          key={type}
          role="none"
          onClick={() => !isExist && handleSelect(type)}
        >
          {isExist && <div className={`${subPrefix}-right-item-disabled`} />}
          <div className={`${subPrefix}-right-item-img`}>
            <img src={item.img} alt="" />
            <div
              className={`${subPrefix}-right-item-img-selected`}
              style={{
                display: hasItem ? 'block' : 'none',
              }}
            >
              <Icon type="check" />
            </div>
          </div>
          <div className={`${subPrefix}-right-item-text`}>
            <span
              style={{
                color: hasItem && '#5365ea',
              }}
            >
              {item.title}
            </span>
            <span>{item.describe}</span>
          </div>
        </div>
      );
    });
  };

  const renderDis = () => {
    if (dis) {
      return 37 * dis;
    }
    return 0;
  };

  modal.handleOk(() => {
    addComponent(seletedComponents);
    return true;
  });

  return (
    <div className={`${subPrefix}-container`}>
      <div className={`${subPrefix}-sider`}>
        {renderMenuItems()}
        <div
          className={`${subPrefix}-sider-shadow`}
          style={{
            transform: `translateY(${renderDis()}px)`,
          }}
        />
      </div>
      <div className={`${subPrefix}-right`}>
        {renderItems()}
      </div>
    </div>
  );
};

export default AddModal;
