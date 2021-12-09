import React, {
  FC, useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, message } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { useHistory } from 'react-router';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import findIndex from 'lodash/findIndex';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';

export type OrgEntryBtnProps = {

}

const prefixCls = 'c7ncd-org-entry-btn';

const OrgEntryBtn:FC<OrgEntryBtnProps> = (props:any) => {
  const {
    AppState: {
      currentMenuType: {
        name, category, organizationId, id,
      },
    },
    MenuStore,
    HeaderStore: {
      getOrgData,
    },
  } = props;

  const history = useHistory();

  // 这里的currentOrgdata的数据可能不包含当前选中的组织的数据，因为可能从平台组织管理那边跳转的
  const currentOrgData = useMemo(() => (getOrgData ? toJS(getOrgData) : []), [getOrgData]);

  // todo
  const currentSelectedOrg = useMemo(() => currentOrgData.find((v: { id: any; }) => String(v.id) === String(organizationId || id)), [currentOrgData, id, organizationId]);

  const gotoOrganizationManager = async () => {
    try {
      const res = await MenuStore.loadMenuData({ type: 'organization', id: organizationId }, false);
      if (res && res?.failed) {
        message.error(res?.message);
        return;
      }
      if (res.length) {
        const { route } = findFirstLeafMenu(res[0]);
        const params:Record<string, any> = {
          type: 'organization',
          id: organizationId,
          name,
          organizationId,
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

  if (!currentSelectedOrg || !currentSelectedOrg?.into) {
    return null;
  }

  return (
    <div className="c7ncd-header-right-lists-item">
      <Icon onClick={gotoOrganizationManager} type="settings-o" className={prefixCls} />
    </div>
  );
};

export default inject('MenuStore', 'AppState', 'HeaderStore')(observer(OrgEntryBtn));
