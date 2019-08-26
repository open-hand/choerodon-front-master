import queryString from 'query-string';
import HeaderStore from '../../../stores/c7n/HeaderStore';

function getSearchString(type, key, value, extraProps = {}) {
  if (type === 'project') {
    const proData = HeaderStore.getProData;
    const proObj = proData.find(v => String(v[key]) === String(value));
    if (proObj) {
      const obj = {
        type,
        id: proObj.id,
        name: encodeURIComponent(proObj.name),
        category: proObj.category,
        orgId: proObj.organizationId,
        ...extraProps,
      };
      return `?${queryString.stringify(obj)}`;
    }
  }
  if (type === 'organization') {
    const orgData = HeaderStore.getOrgData;
    const orgObj = orgData.find(v => String(v[key]) === String(value));
    if (orgObj) {
      const obj = {
        type,
        id: orgObj.id,
        name: encodeURIComponent(orgObj.name),
        category: orgObj.category,
        orgId: orgObj.organizationId,
        ...extraProps,
      };
      return `?${queryString.stringify(obj)}`;
    }
  }
  return '';
}

export default getSearchString;
