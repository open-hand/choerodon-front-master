import uiAxios from '@/containers/components/c7n/tools/axios/UiAxios';
import AppState from '@/containers/stores/c7n/AppState';
import { UI_CONFIGURE } from '@/utils';
import { configure } from 'choerodon-ui';

const uiConfigure = UI_CONFIGURE || {};

const UI_CONFIG = {
  ...uiConfigure,
  modalMaskClosable: 'dblclick',
  axios: uiAxios,
  dataKey: 'list',
  labelLayout: 'float',
  queryBar: 'bar',
  tableBorder: false,
  lookupAxiosMethod: 'get',
  lookupUrl: (code) => `/hpfm/v1/lovs/value?lovCode=${code}`,
  tableHighLightRow: false,
  tableRowHeight: 32,
  tableColumnResizable: false,
  modalOkFirst: false,
  modalKeyboard: false,
  modalSectionBorder: false,
  drawerOkFirst: true,
  buttonFuncType: 'flat',
  lovQueryUrl: (code) => `/iam/choerodon/v1/lov/code?code=${code}`,
  generatePageQuery: ({
    page, pageSize, sortName, sortOrder,
  }) => ({
    page,
    size: pageSize,
    sort: sortName && (sortOrder ? `${sortName},${sortOrder}` : sortName),
  }),
  lovDefineAxiosConfig: (code) => ({
    url: `/iam/choerodon/v1/lov/code?code=${code}`,
    method: 'GET',
    transformResponse: [
      (data) => {
        let originData = {};

        try {
          originData = JSON.parse(data);
        } catch (e) {
          return data;
        }

        const {
          valueField = 'value',
          textField = 'name',
          pageSize = 5,
          queryFields = [],
          gridFields = [],
          url,
          description,
        } = originData;
        let { title } = originData;
        if (originData.failed) {
          title = `值集视图未定义: "${code}", 请维护值集视图!`;
        } else if (!originData.code) {
          title = `lov ${code} loading...`;
        }
        const lovItems = [];
        let tableWidth = 0;
        queryFields.forEach((queryItem) => {
          const lovItem = {
            display: queryItem.queryFieldLabel,
            conditionField: 'Y',
            conditionFieldType: null,
            conditionFieldName: queryItem.queryFieldName,
            conditionFieldSelectUrl: null,
            conditionFieldSelectVf: null,
            conditionFieldSelectTf: null,
            conditionFieldSelectCode: null,
            conditionFieldLovCode: null,
            conditionFieldSequence: 1,
            conditionFieldRequired: queryItem.queryFieldRequiredFlag,
            gridField: 'N',
            gridFieldName: queryItem.queryFieldName,
            gridFieldWidth: queryItem.queryFieldWidth,
            gridFieldAlign: 'left',
            gridFieldSequence: queryItem.queryFieldOrder,
          };
          lovItems.push(lovItem);
        });
        gridFields.forEach((tableItem) => {
          const lovItem = {
            gridFieldName: tableItem.gridFieldName,
            gridFieldWidth: tableItem.gridFieldWidth,
            gridFieldAlign: tableItem.gridFieldAlign,
            conditionField: 'N',
            gridField: 'Y',
            display: tableItem.gridFieldLabel,
            conditionFieldType: null,
            conditionFieldName: null,
            conditionFieldSelectUrl: null,
            conditionFieldSelectVf: null,
            conditionFieldSelectTf: null,
            conditionFieldSelectCode: null,
            conditionFieldSequence: 1,
            gridFieldSequence: tableItem.gridFieldOrder,
          };
          lovItems.push(lovItem);
          tableWidth += tableItem.gridFieldWidth;
        });

        const convertedData = {
          originData,
          title: title || code,
          width: tableWidth ? tableWidth + 120 : 520,
          customUrl: null,
          lovPageSize: pageSize,
          lovItems,
          treeFlag: originData.treeFlag ? 'Y' : 'N',
          parentIdField: originData.parentField,
          idField: originData.idField,
          textField,
          valueField,
          placeholder: description || title || code,
          editableFlag: originData.editFlag ? 'Y' : 'N',
          queryColumns: queryFields && queryFields.length ? 1 : 0,
        };
        return convertedData;
      },
    ],
  }),
  lovQueryAxiosConfig: (code, lovConfig = {}) => {
    const { url } = lovConfig.originData || {};
    let realUrl = url;
    if (url) {
      // realUrl = `${API_HOST}${url}?lovCode=${code}`;
      const organizationRe = /\{organization_id\}|\{project_id\}/g;
      if (organizationRe.test(url)) {
        const tId = AppState.currentOrginazationOrProjectId || '';
        realUrl = url.replace(organizationRe, tId);
      }
    }
    return {
      url: realUrl,
      method: 'GET',
    };
  },
};
const UI_CONFIG_THEME4 = {
  ...UI_CONFIG,
  tableRowHeight: 50,
};
function initUiConfigure(theme) {
  configure(theme === 'theme4' ? UI_CONFIG_THEME4 : UI_CONFIG);
}

export {
  initUiConfigure,
  UI_CONFIG,
};
