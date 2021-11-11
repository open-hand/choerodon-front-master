import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';

export type RecentUseProjectsListsProps = {

}

const prefixCls = 'c7ncd-recent-use-projects-lists';
const intlPrefix = 'c7ncd.recent.use.projects.lists';

const RecentUseProjectsLists:FC<RecentUseProjectsListsProps> = (props) => {
  const {

  } = props;

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      RecentUseProjectsLists
    </div>
  );
};

export default RecentUseProjectsLists;
