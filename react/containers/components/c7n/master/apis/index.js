export default class MasterApis {
  static getGuideUrl(menuId, orgId, proId, guideCode) {
    return `/iam/choerodon/v1/guides?${menuId ? `menu_id=${menuId}` : ''}${orgId ? `&organization_id=${orgId}` : ''}${proId ? `&project_id=${proId}` : ''}${guideCode ? `&guide_code=${guideCode}` : ''}`
  }

  static getCheckUserCountUrl(tenantId) {
    return `/iam/choerodon/v1/register_saas/check_user_count?tenant_id=${tenantId}`;
  }

  static getCheckOwnerUrl(tenantId) {
    return `/iam/choerodon/v1/register_saas/check_owner?tenantId=${tenantId}`;
  }

  static getPageMemberUrl(orgId) {
    return `/iam/choerodon/v1/register_saas/${orgId}/page_member`;
  }

  static getCleanMemberUrl(tenantId) {
    return `/iam/choerodon/v1/register_saas/clean_member?tenant_id=${tenantId}`;
  }
}
