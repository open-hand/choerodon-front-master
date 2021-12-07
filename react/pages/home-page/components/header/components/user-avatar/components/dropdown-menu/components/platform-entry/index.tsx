import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { useQueryString } from '@choerodon/components';
import { useHistory } from 'react-router';

import './index.less';
import { useQuery } from 'react-query';
import { inject } from 'mobx-react';
import { menusApi } from '@/apis';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import { useUserAvatarStore } from '../../../../stores';

export type PlatformEntryProps = {

}

const prefixCls = 'c7ncd-platform-entry';

const PlatformEntry:FC<PlatformEntryProps> = (props:any) => {
  const {
    MenuStore,
  } = props;

  const {
    formatUserAvater,
  } = useUserAvatarStore();

  const { isError, data } = useQuery('platformEntryPermission', () => menusApi.getPlatFormMenuEntryPermission());

  const params = useQueryString();

  const { organizationId } = params;

  const history = useHistory();

  const getGlobalMenuData = () => {
    MenuStore.loadMenuData({ type: 'site' }, false).then((menus: string | any[]) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        const routeWithOrgId = `${route}?organizationId=${organizationId}`;
        historyPushMenu(history, routeWithOrgId, domain);
      }
    });
  };

  if (isError || !data) {
    return null;
  }

  return (
    <div className={prefixCls} onClick={getGlobalMenuData} role="none">
      <Icon type="settings-o" />
      <span>{formatUserAvater({ id: 'plateEntry' })}</span>
    </div>
  );
};

export default inject('MenuStore')(observer(PlatformEntry));
