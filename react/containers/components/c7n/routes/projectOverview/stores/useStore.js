import { useLocalStore } from 'mobx-react-lite';
import {
  flatMapDeep, map, merge, pick,
} from 'lodash';
import { axios } from '@/index';
import mappings from './mappings';
import barThumbnail from '../img/bar.svg';
import lineThumbnail from '../img/line.svg';
import pieThumbnail from '../img/pieNew.png';
import stackedBarThumbnail from '../img/stackedBar.svg';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    projectId,
    initData: [],
    setInitData(value) {
      this.initData = value;
    },

    editLayout: [],
    setEditLayout(value) {
      this.editLayout = value;
    },

    isEdit: false,
    setEdit(value) {
      this.isEdit = value;
    },

    customData: new Map(),

    setCustomData(data, customFlag = 'agile') {
      Array.isArray(data) && this.customData.set('agile', new Map(data.map((item) => ([`${customFlag}-${item.layout.i}`, {
        ...item,
        layout: { ...item.layout, i: `${customFlag}-${item.layout.i}` },
        name: `${customFlag}-${item.name}`,
        type: `${customFlag}-${item.name}`, // 避免未来有其他模块自定义图表时id重复
      }]))));
      // this.customData = data;
    },
    get customDataList() {
      return flatMapDeep([...this.customData.values()].map((mapItem) => [...mapItem.values()]));
    },
    /**
 *   personalWorkload: {
    layout: {
      h: 4,
      i: 'personalWorkload',
      minH: 4,
      minW: 4,
      w: 6,
      x: 0,
      y: 33,
    },
    name: 'personalWorkload',
    type: 'personalWorkload',
    groupId: 'agile',
    title: '个人工作量统计',
    describe:
      '此模块按问题计数、工时数2种维度统计当前迭代各个团队成员任务总量、完成量和剩余量。',
    img: personalWorklo;ad,
  },
 */
    chartTypeToImg: {
      pie: pieThumbnail,
      bar: { src: barThumbnail, style: { padding: 12 } },
      line: { src: lineThumbnail, style: { padding: 12 } },
      stackedBar: { src: stackedBarThumbnail, style: { padding: 12 } },
    },

    loadAgileCustomData(currentProjectId) {
      this.projectId = currentProjectId || this.projectId;
      axios.get(`agile/v1/projects/${this.projectId}/custom_chart`).then((res) => this.setCustomData(res?.map((item) => {
        const layout = {
          h: 4, i: item.id, minH: 3, minW: 4, w: 5, x: 0, y: 33, customFlag: 'agile',
        };
        return {
          layout,
          name: item.id,
          type: item.id, // 增添时 会使用
          groupId: 'agile',
          title: item.name,
          describe: item.description || '暂无描述',
          customData: item,
          img: this.chartTypeToImg[item.chartType],
        };
      })));
    },

    getCustomChart(i, customFlag = 'agile') {
      if (!this.customData.has(customFlag)) {
        return undefined;
      }
      return this.customData.get(customFlag).get(i);
    },

    saveConfig(value) {
      const tempObj = map(value, (item) => {
        const temp = pick(mappings[item.i] || this.getCustomChart(item.i), ['type', 'name', 'layout']);
        temp.layout = merge(temp.layout, item);
        return temp;
      });
      axios.post(`iam/choerodon/v1/projects/${this.projectId}/project_overview_config`, JSON.stringify({
        data: JSON.stringify(tempObj),
      }));
    },

    totalOnlineUser: 0,

    setTotalOnlineUser(data) {
      this.totalOnlineUser = data;
    },
    get getTotalOnlineUser() {
      return this.totalOnlineUser;
    },
  }));
}
