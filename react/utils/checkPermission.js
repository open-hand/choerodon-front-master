import axios from '@/components/axios';

export default async function checkPermission({
  projectId, organizationId, code, codeArr,
}) {
  try {
    const res = await axios({
      method: 'post',
      url: '/iam/choerodon/v1/permissions/menus/check-permissions',
      data: codeArr || [code],
      params: { tenantId: organizationId, projectId },
      enabledCancelRoute: false,
    });
    if (res && res.failed) {
      return false;
    }
    if (res && res.length) {
      if (codeArr && codeArr.length) {
        const result = [];
        codeArr.forEach((item, index) => {
          const permission = res.find(({ code: resCode }) => resCode === item);
          const { approve } = permission || {};
          result[index] = approve;
        });
        return result;
      }
      const [{ approve }] = res;
      return approve;
    }
  } catch (e) {
    return false;
  }
}
