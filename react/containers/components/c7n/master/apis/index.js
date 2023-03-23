export default class MasterApis {
  static getGuideUrl(menuId, orgId, proId, tab_code) {
    return `/cbase/choerodon/v1/guides?${menuId ? `menu_id=${menuId}` : ''}${orgId ? `&organization_id=${orgId}` : ''}${proId ? `&project_id=${proId}` : ''}${tab_code ? `&tab_code=${tab_code}` : ''}`;
  }

  static getCheckUserCountUrl(tenantId) {
    return `/cbase/choerodon/v1/register_saas/check_user_count?tenant_id=${tenantId}`;
  }

  static getCheckOwnerUrl(tenantId) {
    return `/cbase/choerodon/v1/register_saas/check_owner?tenantId=${tenantId}`;
  }

  static getPageMemberUrl(orgId) {
    return `/cbase/choerodon/v1/register_saas/${orgId}/page_member`;
  }

  static getCleanMemberUrl(tenantId) {
    return `/cbase/choerodon/v1/register_saas/clean_member?tenant_id=${tenantId}`;
  }

  static getHelpDocUrl(props) {
    let str = '';
    if (props.menuId) {
      str += `menu_id=${props.menuId}`;
    }
    if (props.menuCode) {
      str += `&menu_code=${props.menuCode}`;
    }
    if (props.tabCode) {
      str += `&tab_code=${props.tabCode}`;
    }
    return `/cbase/choerodon/v1/help-doc?${str}`;
  }
}
