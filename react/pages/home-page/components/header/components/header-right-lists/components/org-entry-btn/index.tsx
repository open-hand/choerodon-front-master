import React, {
  FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, message } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { useHistory } from 'react-router';
import { inject } from 'mobx-react';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';

export type OrgEntryBtnProps = {

}

const prefixCls = 'c7ncd-org-entry-btn';

const OrgEntryBtn:FC<OrgEntryBtnProps> = (props:any) => {
  const {
    AppState: {
      currentMenuType: {
        id, name, type, category,
      },
    },
    MenuStore,
  } = props;

  const history = useHistory();

  const gotoOrganizationManager = async () => {
    try {
      const res = await MenuStore.loadMenuData({ type: 'organization', id }, false);
      if (res && res?.failed) {
        message.error(res?.message);
        return;
      }
      if (res.length) {
        const { route } = findFirstLeafMenu(res[0]);
        const params:Record<string, any> = {
          type,
          id,
          name,
          organizationId: id,
        };
        if (category) params.category = category;
        const searchMap = new URLSearchParams(params);
        history.push({
          pathname: route,
          search: searchMap.toString(),
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Icon onClick={gotoOrganizationManager} type="settings-o" className={prefixCls} />
  );
};

export default inject('MenuStore', 'AppState')(observer(OrgEntryBtn));
