import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMenuStore } from '../../../../stores';
import UnfoldImg from './assets/unfold.svg';
import FoldImg from './assets/folding.svg';

const prefixCls = 'c7ncd-subMenu-collapseBtn';

function CollapsedBtn() {
  const {
    mainStore,
  } = useMenuStore();

  const {
    isExpanded,
    setIsExpanded,
  } = mainStore;

  const toggleMenuExpand = () => {
    setIsExpanded(!isExpanded);
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
