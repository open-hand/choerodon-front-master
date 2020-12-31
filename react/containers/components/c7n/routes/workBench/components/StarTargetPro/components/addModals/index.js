import React, { useEffect, useState } from 'react';
import './index.less';

import {
  filter, findIndex, get, map, without,
} from 'lodash';
// import todoThings from './img/todoQuestions.png';
import { Icon } from 'choerodon-ui';
import groupMappings from './groupMappings';

const AddModal = (props) => {
  const {
    subPrefix,
    modal,
  } = props;

  const [activeItem, setActiveItem] = useState(groupMappings[0]);
  const [dis, setDis] = useState(0);
  const [seletedComponents, setSelectedComponents] = useState([]);

  useEffect(() => {

  }, []);

  function handleClick(key, index) {
    setActiveItem(key);
    setDis(index);
  }

  function handleSelect(item) {
    const hasItem = seletedComponents.includes(item.i);
    const tempArr = seletedComponents;
    if (hasItem) {
      setSelectedComponents(without(seletedComponents, item.i));
      return;
    }
    tempArr.push(item.i);
    setSelectedComponents([...tempArr]);
  }

  const renderMenuItems = () => map(groupMappings, (item, index) => (
    <div
      role="none"
      onClick={() => handleClick(item, index)}
      key={get(item, 'key')}
      className={`${subPrefix}-sider-item ${item.key === activeItem.key ? `${subPrefix}-sider-item-active` : ''}`}
    >
      {item.name}
    </div>
  ));

  const renderItems = () => (
    map(activeItem.opts, (item, i) => {
      const hasItem = seletedComponents.includes(item.i);
      return (
        <div
          className={`${subPrefix}-right-item ${hasItem ? `${subPrefix}-right-item-selected` : ''}`}
          key={get(item, 'i')}
          role="none"
          onClick={() => handleSelect(item)}
        >
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
    })
  );

  const renderDis = () => {
    if (dis) {
      return 37 * dis;
    }
    return 0;
  };

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
