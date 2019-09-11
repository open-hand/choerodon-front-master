import React, { useEffect } from 'react';
import { configure } from 'choerodon-ui';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { UI_CONFIGURE } from '../../../common/constants';
import uiAxios from '../tools/axios/UiAxios';
import MasterDefault from './MasterDefault';

const InitUiConfigMaster = ({ AutoRouter }) => {
  useEffect(() => {
    function initUiConfigure() {
      const uiConfigure = UI_CONFIGURE || {};
      configure({
        ...uiConfigure,
        axios: uiAxios,
        dataKey: 'list',
        labelLayout: 'float',
        queryBar: 'bar',
        tableBorder: false,
        lookupAxiosMethod: 'get',
        tableHighLightRow: false,
        tableRowHeight: 32,
        tableColumnResizable: false,
        modalSectionBorder: false,
        modalOkFirst: false,
        buttonFuncType: 'flat',
        generatePageQuery: ({ page, pageSize, sortName, sortOrder }) => ({
          page,
          size: pageSize,
          sort: sortName && (sortOrder ? `${sortName},${sortOrder}` : sortName),
        }),
        // lovDefineAxiosConfig: code => ({
        //   url: `/base/v1/lov/code?code=${code}`,
        //   method: 'GET',
        //   transformResponse: [
        //     data => {
        //       let originData = {};
      
        //       try {
        //         originData = JSON.parse(data);
        //       } catch (e) {
        //         return data;
        //       }
      
        //       const {
        //         valueField = 'value',
        //         textField = 'name',
        //         pageSize = 5,
        //         queryFields = [],
        //         gridFields = [],
        //         url,
        //       } = originData;
        //       let { title } = originData;
        //       if (originData.failed) {
        //         title = `值集视图未定义: "${code}", 请维护值集视图!`;
        //       } else if (!originData.code) {
        //         title = `lov ${code} loading...`;
        //       }
        //       const lovItems = [];
        //       let tableWidth = 0;
        //       queryFields.forEach(queryItem => {
        //         const lovItem = {
        //           gridFieldName: queryItem.field,
        //           gridField: 'N',
        //           display: queryItem.label,
        //           conditionField: 'Y',
        //           conditionFieldType: null,
        //           conditionFieldName: null,
        //           conditionFieldSelectUrl: null,
        //           conditionFieldSelectVf: null,
        //           conditionFieldSelectTf: null,
        //           conditionFieldSelectCode: null,
        //           conditionFieldLovCode: null,
        //           conditionFieldSequence: 1,
        //           gridFieldSequence: 1,
        //           gridFieldWidth: queryItem.queryFieldWidth,
        //           gridFieldAlign: 'left',
        //         };
        //         lovItems.push(lovItem);
        //       });
        //       gridFields.forEach(tableItem => {
        //         const lovItem = {
        //           gridFieldName: tableItem.dataIndex,
        //           gridFieldWidth: tableItem.width,
        //           gridFieldAlign: 'left',
        //           conditionField: 'Y',
        //           gridField: 'Y',
        //           display: tableItem.title,
        //           conditionFieldType: null,
        //           conditionFieldName: null,
        //           conditionFieldSelectUrl: null,
        //           conditionFieldSelectVf: null,
        //           conditionFieldSelectTf: null,
        //           conditionFieldSelectCode: null,
        //           conditionFieldSequence: 1,
        //           gridFieldSequence: 1,
        //         };
        //         lovItems.push(lovItem);
        //         tableWidth += tableItem.width;
        //       });
      
        //       const convertedData = {
        //         originData,
        //         title: title || code,
        //         placeholder: title || code,
        //         queryColumns: queryFields && queryFields.length ? 1 : 0,
        //         customUrl: null,
        //         textField,
        //         valueField,
        //         editableFlag: 'Y',
        //         lovPageSize: pageSize,
        //         treeFlag: 'N',
        //         idField: null,
        //         parentIdField: null,
        //         lovItems,
        //         width: tableWidth ? tableWidth + 120 : 520,
        //       };
        //       return convertedData;
        //     },
        //   ],
        // }),
        // lovQueryAxiosConfig: (code, lovConfig = {}) => {
        //   const { url } = lovConfig.originData || {};
        //   let realUrl;
        //   if (url) {
        //     // realUrl = `${API_HOST}${url}?lovCode=${code}`;
        //     const organizationRe = /\{organization_id\}|\{project_id\}/g;
        //     if (organizationRe.test(url)) {
        //       const tId = AppState.currentOrginazationOrProjectId || '';
        //       realUrl = url.replace(organizationRe, tId);
        //     }
        //   }
        //   return {
        //     url: realUrl,
        //     method: 'GET',
        //   };
        // },
      });
    }

    initUiConfigure();
  }, []);

  return (
    <MasterDefault
      AutoRouter={AutoRouter}
    />
  );
};

// export default inject('AppState')(observer(InitUiConfigMaster));
export default InitUiConfigMaster;
