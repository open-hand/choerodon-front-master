export default class MasterApis {
  static getGuideUrl(menuId, orgId, proId, guideCode) {
    return `/iam/choerodon/v1/guides?${menuId ? `menu_id=${menuId}` : ''}${orgId ? `&organization_id=${orgId}` : ''}${proId ? `&project_id=${proId}` : ''}${guideCode ? `&guide_code=${guideCode}` : ''}`
  }
}
