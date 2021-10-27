import queryString from 'query-string';
import HeaderStore from '../../../stores/c7n/HeaderStore';

async function getSearchString(type, key, value, extraProps = {}) {
  if (type === 'project') {
    const proData = HeaderStore.getProData;
    const proObj = proData?.find(v => String(v[key]) === String(value));
    if (proObj) {
      const obj = {
        type,
        id: proObj.id,
        name: proObj.name,
        category: proObj.category,
        organizationId: proObj.organizationId,
        ...extraProps,
      };
      return `?${queryString.stringify(obj)}`;
    } else {
      const proObj = await HeaderStore.axiosGetPro(key, value);
      const obj = {
        type,
        id: proObj.id,
        name: proObj.name,
        category: proObj.category,
        organizationId: proObj.organizationId,
        ...extraProps,
      };
      return `?${queryString.stringify(obj)}`;
    }
  }
  if (type === 'organization') {
    const orgData = HeaderStore.getOrgData;
    const orgObj = orgData?.find(v => String(v[key]) === String(value));
    if (orgObj) {
      const obj = {
        type,
        id: org.id,
        name: orgObj.name,
        category: orgObj.category,
        organizationId: orgObj.id,
        ...extraProps,
      };
      return `?${queryString.stringify(obj)}`;
    }
  }
  return '';
}

export default getSearchString;
