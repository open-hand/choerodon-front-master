import {
  map, get, filter, includes, memoize,
} from 'lodash';
import mappings from './mappings';

const HAS_AGILEPRO = true || C7NHasModule('@choerodon/agile-pro');
/**
 * 获取初始时项目概览数据
 * @param {*} availableServiceList
 * @returns
 */
function getInitProjectOverviewLayout(availableServiceList) {
  if (!Array.isArray(availableServiceList) || !availableServiceList.length) {
    return [];
  }
  const isHasProService = includes(availableServiceList, 'agilePro');
  const defaultValues = map(filter(mappings, (item) => {
    if (!HAS_AGILEPRO) {
      return item.injectGroupId !== 'agilePro';
    }
    return (isHasProService ? includes(availableServiceList, item.groupId)
            || (item.injectGroupId && includes(availableServiceList, item.injectGroupId)) : true);
  }), (item) => {
    if (isHasProService && item.layout.i === 'featureProgress') {
      return {
        ...item.layout,
        y: 0,
      };
    }
    return item.layout;
  });
  return defaultValues;
}
const memoizeGetInitProjectOverviewLayout = memoize(getInitProjectOverviewLayout);
export { memoizeGetInitProjectOverviewLayout as getInitProjectOverviewLayout };
