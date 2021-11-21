import React, {
  FC,
} from 'react';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import OrgEntryBtn from './components/org-entry-btn';
import WsboxBtn from './components/wsbox-btn';
import QuestionBtn from './components/question-btn';

export type HeaderRightListsProps = {

}

const prefixCls = 'c7ncd-header-right-lists';
const intlPrefix = 'c7ncd.header.right.lists';

const btnGroups = [
  <OrgEntryBtn />,
  <QuestionBtn />,
  <WsboxBtn />,
];

const HeaderRightLists:FC<HeaderRightListsProps> = (props) => {
  const {

  } = props;

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
