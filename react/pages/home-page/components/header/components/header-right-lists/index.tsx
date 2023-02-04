import React, {
  FC,
} from 'react';
import {} from 'choerodon-ui/pro';
import {} from '@zknow/components';

import './index.less';
import OrgEntryBtn from './components/org-entry-btn';
import WsboxBtn from './components/wsbox-btn';
import QuestionBtn from './components/question-btn';

export type HeaderRightListsProps = {

}

const prefixCls = 'c7ncd-header-right-lists';
const intlPrefix = 'c7ncd.header.right.lists';

const HeaderRightLists:FC<HeaderRightListsProps> = (props) => {
  const btnGroups = [
    <OrgEntryBtn />,
    <QuestionBtn />,
    <WsboxBtn />,
  ];

  return (
    <div className={prefixCls}>
      {btnGroups}
    </div>
  );
};

export default HeaderRightLists;
