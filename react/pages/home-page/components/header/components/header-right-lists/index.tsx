import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import OrgEntryBtn from './components/org-entry-btn';
import QuestionsBtn from './components/questions-btn';
import WsboxBtn from './components/wsbox-btn';

export type HeaderRightListsProps = {

}

const prefixCls = 'c7ncd-header-right-lists';
const intlPrefix = 'c7ncd.header.right.lists';

const HeaderRightLists:FC<HeaderRightListsProps> = (props) => {
  const {

  } = props;

  useEffect(() => {

  }, []);

  const btnGroups = [
    <OrgEntryBtn />,
    <QuestionsBtn />,
    <WsboxBtn />,
  ];

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
