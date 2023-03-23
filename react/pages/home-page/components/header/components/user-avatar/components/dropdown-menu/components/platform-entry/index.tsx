import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { useQueryString } from '@zknow/components';
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
    HeaderStore: {
      getOrgData,
    },
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
        let routeWithOrgId = `${route}?organizationId=${organizationId}`;
        // 避免登录进来id是0的时候跳平台层引起的bug
        if (organizationId == '0') {
          routeWithOrgId = `${route}?organizationId=${getOrgData[0]?.id}`;
        }
        historyPushMenu(history, routeWithOrgId, domain);
      }
    });
  };

  if (isError || !data) {
    return null;
  }

  return (
    // eslint-disable-next-line
    <div className={prefixCls} onClick={getGlobalMenuData} role="button">
      <Icon type="settings-o" />
      <span>{formatUserAvater({ id: 'plateEntry' })}</span>
    </div>
  );
};

export default inject('MenuStore', 'HeaderStore')(observer(PlatformEntry));
