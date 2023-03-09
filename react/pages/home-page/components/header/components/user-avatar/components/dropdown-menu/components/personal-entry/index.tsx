import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { useQueryString } from '@zknow/components';

import './index.less';
import { inject } from 'mobx-react';
import { useHistory } from 'react-router';
import { USERINFO_PATH } from '@/constants';
import { useUserAvatarStore } from '../../../../stores';

export type PersonalEntryProps = {

}

const prefixCls = 'c7ncd-personal-entry';

const PersonalEntry:FC<PersonalEntryProps> = (props:any) => {
  const {
    AppState,
  } = props;

  const {
    formatCommon,
  } = useUserAvatarStore();

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
    // eslint-disable-next-line
    <div
      className={prefixCls}
      onClick={goUserPage}
      role="button"
    >
      <Icon type="account_circle-o" />
      <span>{formatCommon({ id: 'personalInfo' })}</span>
    </div>
  );
};

export default inject('AppState')(observer(PersonalEntry));
