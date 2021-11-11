import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';

export type StarProjectsListsProps = {

}

const prefixCls = 'c7ncd-star-projects-lists';
const intlPrefix = 'c7ncd.star.projects.lists'

const StarProjectsLists:FC<StarProjectsListsProps> = (props) => {
  const {

  } = props;

  useEffect(()=>{

  }, []);

  return (
    <div className={prefixCls}>
      StarProjectsLists
    </div>
  )
}

export default StarProjectsLists