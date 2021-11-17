import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { useQueryString } from '@choerodon/components';

import './index.less';
import { inject } from 'mobx-react';
import { useHistory } from 'react-router';
import { USERINFO_PATH } from '@/constants';

export type PersonalEntryProps = {

}

const prefixCls = 'c7ncd-personal-entry';

const PersonalEntry:FC<PersonalEntryProps> = (props:any) => {
  const {
    AppState,
  } = props;

  const params = useQueryString();
  const history = useHistory();

  const {
    name,
    organizationId,
  } = params;

  useEffect(() => {

  }, []);

  const goUserPage = () => {
    AppState.menuType.type = 'user';
    history.push(`${USERINFO_PATH}?type=user&name=${name}&organizationId=${organizationId}`);
  };

  return (
    <div className={prefixCls} onClick={goUserPage} role="none">
      <Icon type="account_circle-o" />
      <span>个人信息</span>
    </div>
  );
};

export default inject('AppState')(observer(PersonalEntry));
