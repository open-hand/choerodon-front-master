import React, { useEffect, useMemo, useState } from 'react';
import { AnimationLoading, useLoading } from '@choerodon/components';
import { uniqueId } from 'lodash';
import { uiAxiosInstance } from '@/components/axios';
import useFormatCommon from '@/hooks/useFormatCommon';
import AppState from '@/containers/stores/c7n/AppState';

export const UI_CONFIGURE = `${process.env.UI_CONFIGURE}`;

const uiConfigure = UI_CONFIGURE || {};

function TableSpin(props) {
  const { className } = props;
  const {
    registerChildren, isHasProvider, cancelRegisterChildren, change,
  } = useLoading();
  const loadId = useMemo(() => uniqueId('table-spin'), []);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //  注册后并更改loading状态， 卸载的时候更改loading状态并卸载
    registerChildren({ loadId, changeLoading: setLoading });
    change(loadId, true);
    return () => {
      change(loadId, false);
      setTimeout(() => cancelRegisterChildren(loadId), 200);
    };
  }, [cancelRegisterChildren, change, loadId, registerChildren]);
  //  无统一Loading管理 则使用table表格内部loading状态判断
  return <AnimationLoading className={className} display={loading} style={{ display: !isHasProvider || loading ? 'inline-block' : 'none' }} />;
}

const useUiConfigs = () => {
  const formatCommon = useFormatCommon({ id: 'filter' });

  /**
   * table select 空界面展示
   * @param {*} cpName
   */
  const renderTableEmpty = (cpName) => formatCommon({ id: 'nodata' });

  return {
    ...uiConfigure,
    renderTableEmpty,
    pagination: {
      showSizeChangerLabel: false,
      showTotal: (total, range) => <span className="word">{`显示${range[0]}-${range[1]} 共 ${total}条`}</span>,
      showPager: true,
      showQuickJumper: true,
    },
    modalMaskClosable: 'dblclick',
    axios: uiAxiosInstance,
    dataKey: 'list',
    labelLayout: 'float',
    queryBar: 'bar',
    queryBarProps: {
      filterBarPlaceholder: formatCommon({ id: 'filter' }),
    },
    tableBorder: false,
    showLengthInfo: false,
    lookupAxiosMethod: 'get',
    lookupUrl: (code) => `/hpfm/v1/lovs/value?lovCode=${code}`,
    tableHighLightRow: false,
    tableColumnResizable: false,
    tableRowHeight: 50,
    modalOkFirst: false,
    modalKeyboard: false,
    modalSectionBorder: false,
    drawerOkFirst: false,
    buttonFuncType: 'raised',
    tableVirtualCell: false,
    lovQueryUrl: (code) => `/iam/choerodon/v1/lov/code?code=${code}`,
    generatePageQuery: ({
      page, pageSize, sortName, sortOrder, sort,
    }) => ({
      page,
      size: pageSize,
      sort: sortName && (sortOrder ? `${sortName},${sortOrder}` : sortName),
    }),
    tableSpinProps: ({
      indicator: <TableSpin />,
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
};

export { useUiConfigs };
