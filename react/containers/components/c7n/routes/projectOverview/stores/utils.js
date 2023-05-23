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
  const isHasAgile = includes(availableServiceList, 'agile');
  const isHasWaterfall = includes(availableServiceList, 'waterfallPro');
  const withoutDevops = !includes(availableServiceList, 'devops');
  const defaultHasProLayoutMap = {
    issueProgress: {
      x: 0,
      y: 1,
    },
    featureProgress: {
      x: 0,
      y: 0,
    },
  };
  const defaultWaterfallMap = {
    milestoneCard: {
      x: 0,
      y: 1,
    },
    overviewCard: {
      x: 0,
      y: 0,
    },
  };
  const defaultLayoutMapWithoutDevops = {
    priorityChart: {
      h: 3,
      w: 4,
      x: 7,
      y: 11,
    },
  };
  const defaultLayoutMap = {
    ...withoutDevops ? defaultLayoutMapWithoutDevops : {},
    ...isHasProService ? defaultHasProLayoutMap : {},
    ...isHasWaterfall ? defaultWaterfallMap : {},
  };
  const getDefaultLayout = ((layout) => ({ ...layout, ...(defaultLayoutMap[layout.i]) }));
  const defaultValues = map(filter(mappings, (item) => {
    if (!window.agile) {
      return item.injectGroupId !== 'agilePro';
    }
    return ((isHasProService || isHasWaterfall || isHasAgile) ? includes(availableServiceList, item.groupId)
      || (item.injectGroupId && includes(availableServiceList, item.injectGroupId)) : true);
  }), (item) => getDefaultLayout(item.layout));
  return defaultValues;
}

const memoizeGetInitProjectOverviewLayout = memoize(getInitProjectOverviewLayout);
export { memoizeGetInitProjectOverviewLayout as getInitProjectOverviewLayout };
