import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { difference } from 'lodash';
import { useMenuStore } from '../../../../stores';
import UnfoldImg from './assets/unfold.svg';
import FoldImg from './assets/folding.svg';

const prefixCls = 'c7ncd-subMenu-collapseBtn';

function CollapsedBtn() {
  const {
    mainStore,
    MenuStore: {
      openKeys,
    },
    MenuStore,
  } = useMenuStore();

  const [savedOpenkeys, setSavedKeys] = useState();

  const {
    isExpanded,
    setIsExpanded,
  } = mainStore;

  const toggleMenuExpand = () => {
    setIsExpanded(!isExpanded);
    MenuStore.setOpenKeys([]);
    if (!isExpanded) {
      setIsExpanded(true);
      const rest = difference(savedOpenkeys, JSON.parse(JSON.stringify(openKeys)));
      MenuStore.setClosedKeys(rest, true);
      MenuStore.setOpenKeys(savedOpenkeys);
    } else {
      setSavedKeys(openKeys);
      MenuStore.setCollapsed(false);
      MenuStore.setOpenKeys([]);
    }
  };

  return (
    <div
      role="none"
      className={`${prefixCls}`}
    >
      <img
        role="none"
        src={!isExpanded ? UnfoldImg : FoldImg}
        alt="img"
        onClick={toggleMenuExpand}
      />
    </div>
  );
}

export default observer(CollapsedBtn);
