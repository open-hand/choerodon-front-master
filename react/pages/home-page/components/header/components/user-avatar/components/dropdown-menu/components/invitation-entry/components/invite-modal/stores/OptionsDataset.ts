import { DataSet } from 'choerodon-ui/pro';

const businessDataSet:any = {
  fields: [
    { name: 'text', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { text: '制造业', value: 'manufacturing' },
    { text: '建筑业', value: 'constructionIndustry' },
    { text: '房地产业', value: 'realEstate' },
    { text: 'IT', value: 'IT' },
    { text: '金融保险业', value: 'financeAndInsurance' },
    { text: '交通运输业', value: 'transportation' },
    { text: '零售批发业', value: 'retailandWholesale' },
    { text: '企业商业服务', value: 'enterpriseBusinessServices' },
    { text: '科学研究和技术服务业', value: 'techlonogy' },
    { text: '其他', value: 'other' },
  ],
};

const wantsDataset:any = {
  fields: [
    { name: 'text', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { text: '敏捷管理', value: 'agile' },
    { text: '敏捷项目群组', value: 'agile_group' },
    { text: '需求管理', value: 'demand_management' },
    { text: 'DevOps流程', value: 'devops' },
    { text: '运维管理', value: 'mocho_ITOM' },
    { text: '测试管理', value: 'test_management' },
  ],
};

const BusinessDataSet = new DataSet(businessDataSet);
const WantsDataset = new DataSet(wantsDataset);

export { BusinessDataSet, WantsDataset };
