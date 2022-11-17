import JSONBig from 'json-bigint';

export default function transformResponseTreeData(res, attrName) {
  try {
    const data = JSONBig.parse(res);

    if (data && data[attrName]) {
      // eslint-disable-next-line max-len
      const removeOrgItem = data[attrName].filter((item) => !(item.parentId === null && item.id === null));
      return removeOrgItem.map((item) => {
        if (item.id === null && item.parentId === 0) {
          return { ...item, id: '0', parentId: null };
        }
        return { ...item, parentId: item.parentId ? item.parentId : null };
      });
    }
    return data;
  } catch (error) {
    return res;
  }
}
