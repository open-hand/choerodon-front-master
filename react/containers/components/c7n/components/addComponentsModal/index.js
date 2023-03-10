import React, { useEffect, useState } from 'react';
import './index.less';

import {
  get, xor, map, without, difference, omit,
} from 'lodash';
import { Icon, Spin } from 'choerodon-ui';
import classnames from 'classnames';
import useExternalFunc from '@/hooks/useExternalFunc';
import useUpgrade from '@/hooks/useUpgrade';
import groupMappings from './groupMappings';
import EmptyPage from '../empty-page';
import AppState from '../../../../stores/c7n/AppState';

const AddModal = (props) => {
  const {
    modal,
    addComponent,
    existTypes,
    mappings,
    isProjects,
  } = props;

  const subPrefix = 'c7ncd-workbench-addModal';
  const [activeItem, setActiveItem] = useState(groupMappings(mappings)[0]);
  const [dis, setDis] = useState(0);
  const [seletedComponents, setSelectedComponents] = useState(existTypes);
  const { func: checkUpgrade } = useExternalFunc('saas', 'base-saas:checkUpgrade');

  const { isFetching, data: needUpgrade } = useUpgrade({
    organizationId: AppState.currentMenuType?.organizationId,
    checkUpgrade: checkUpgrade?.default?.checkSaaSUpgrade,
    key: `useUpgrade-${checkUpgrade?.default?.checkSaaSUpgrade}-${AppState.currentMenuType?.organizationId}`,
  });

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

  const renderMenuItems = () => map(groupMappings(mappings, needUpgrade), (item, index) => ((
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
      // if (get(item, 'type') === 'starTarget') {
      //   return null;
      // }
      const type = get(item, 'type');
      const hasItem = seletedComponents.includes(type);
      const itemsClassname = classnames({
        [`${subPrefix}-right-item`]: true,
        [`${subPrefix}-right-item-selected`]: hasItem,
      });
      const imgProps = typeof (item.img) === 'object' ? omit(item.img, 'className') : { };
      return (
        <div
          className={itemsClassname}
          key={type}
          role="none"
          onClick={() => handleSelect(type)}
        >
          <div className={`${subPrefix}-right-item-img`}>
            {/* <div></div> */}
            <img src={item.img} alt="" className={classnames(`${subPrefix}-right-item-img-wrap`, imgProps.className)} {...imgProps} />
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
                color: hasItem && 'var(--primary-color)',
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
    const newTypeArr = without(seletedComponents, ...existTypes);
    const deleteArr = difference(existTypes, seletedComponents);
    addComponent(newTypeArr, deleteArr);
    return true;
  });

  return (
    <div className={`${subPrefix}-container`}>
      <Spin spinning={isFetching}>
        <div className={`${subPrefix}-content`}>
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
      </Spin>
    </div>
  );
};

export default AddModal;
