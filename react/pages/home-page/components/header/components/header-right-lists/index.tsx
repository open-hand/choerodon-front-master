import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { mount, get } from '@choerodon/inject';
import OrgEntryBtn from './components/org-entry-btn';
import WsboxBtn from './components/wsbox-btn';

export type HeaderRightListsProps = {

}

const prefixCls = 'c7ncd-header-right-lists';
const intlPrefix = 'c7ncd.header.right.lists';

const btnGroups = [
  <OrgEntryBtn />,
  <WsboxBtn />,
];

const HeaderRightLists:FC<HeaderRightListsProps> = (props) => {
  const {

  } = props;

  useEffect(() => {
    if (get('base-pro:headQuestionBtn')) {
      const ele = (
        <>
          {mount('base-pro:headQuestionBtn', {})}
        </>
      );
      btnGroups.splice(1, 0, ele);
    }
  }, []);

  const renderLists = () => btnGroups.map((element) => (
    <div className={`${prefixCls}-item`}>
      {element}
    </div>
  ));

  return (
    <div className={prefixCls}>
      {renderLists()}
    </div>
  );
};

export default HeaderRightLists;
