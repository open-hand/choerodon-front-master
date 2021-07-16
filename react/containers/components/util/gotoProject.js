import React from 'react';
import { historyPushMenu } from '@/utils';
import { inject } from 'mobx-react';
import { Modal, Button } from 'choerodon-ui/pro';
import { Alert } from 'choerodon-ui';
import HeaderStore from '../../stores/c7n/HeaderStore';
import MenuStore, { getMenuType } from '../../stores/c7n/MenuStore';
import findFirstLeafMenu from './findFirstLeafMenu';
import AppState from '../../stores/c7n/AppState';
import axios from '../c7n/tools/axios';
import menuStore from '../../stores/c7n/MenuStore';

const isPro = C7NHasModule('@choerodon/base-pro');
const isHuawei = C7NHasModule('@choerodon/base-huawei');

export default async function handleClickProject(data, history, AppState) {
  const {
    id, name, organizationId, category,
  } = data;

  const selfEmail = AppState.getUserInfo?.email;

  // 如果是pro或者huawei
  if (isPro || isHuawei) {
    const res = await axios.get(`/iam/choerodon/v1/register_saas/notify_senior_due?projectId=${id}`);
    const isOwner = selfEmail === res.email;
    if (res.notify) {
      Modal.open({
        title: '高级版已到期',
        children: (
          <>
            <p>该组织的高级版已到期，并回退至标准版。项目群项目属于高级版功能，因此您进入该项目后，将无法看到项目群相关的菜单以及功能。</p>
            {
              isOwner ? (
                // 说明是owner
                <Alert
                  message="续费后，您将可以继续使用高级版功能。之前的项目群数据将永久保留，不会丢失。"
                  type="info"
                />
              ) : (
              // 成员
                <Alert
                  message={`请联系您所在组织的组织所有者${res.ownerRealName}(${res.ownerEmail})进行续费`}
                  type="info"
                />
              )
            }
          </>
        ),
        onOk: () => {
          if (isOwner) {
            window.open(window._env_.UPGRADE_LINK.split(',')[0]);
          } else {
            gotoProject(true);
          }
        },
        okText: isOwner ? '前往续费' : '进入项目',
        footer: (okBtn, cancelBtn) => (
          <div>
            {
              isOwner ? (
                <>
                  {cancelBtn}
                  <Button
                    onClick={() => gotoProject(true)}
                  >
                    进入项目
                  </Button>
                  {okBtn}
                </>
              ) : (
                <>
                  {cancelBtn}
                  {okBtn}
                </>
              )
            }

          </div>
        ),
      });
    } else {
      gotoProject();
    }
  } else {
    gotoProject();
  }

  /**
   *
   * @param isOwe 是否已欠费
   */
  function gotoProject(isOwe = false) {
    const type = 'project';
    HeaderStore.setRecentItem(data);
    // @ts-ignore
    MenuStore.loadMenuData({ type, id }, false, false).then((menus) => {
      let route = '';
      let path;
      let domain;

      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        // 如果是欠费 默认跳转到知识库界面
        if (isOwe) {
          route = '/knowledge/project';
        } else {
          route = menuRoute;
        }
        domain = menuDomain;
      }
      path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;

      if (String(organizationId)) {
        path += `&organizationId=${organizationId}`;
      }
      if (path) {
        // @ts-ignore
        const t = getMenuType({ type, id }, false) || 'site';
        if (t !== 'user') {
          AppState.currentMenuType.type = t;
          if (id) {
            AppState.currentMenuType.id = id;
          }
        }
        historyPushMenu(history, path, domain);
      }
      AppState.getProjects();
    });
  }
}
