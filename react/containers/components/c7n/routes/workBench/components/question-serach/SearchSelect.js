import React, {
  useEffect,
  useCallback, useMemo, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, TextField, Button, Dropdown, Form, Select, DataSet,
} from 'choerodon-ui/pro';
import { debounce, isEmpty, isEqual } from 'lodash';
import useSelect from '@/hooks/useSelect';
import axios from '@/containers/components/c7n/tools/axios';
import AppState from '@/containers/stores/c7n/AppState';

import { transformFieldsToSearch } from './utils';

const QuestionSearchSelect = observer(({
  data, paging, textField, valueField, filterParamName, readAxiosConfig, ...otherProps
}) => {
  const organizationId = useMemo(() => AppState.currentMenuType.organizationId, [AppState.currentMenuType.organizationId]);
  const loadData = useCallback(async ({ filter, page }) => {
    if (!isEmpty(data)) {
      return data;
    }
    if (!readAxiosConfig) {
      return [];
    }
    const readAxiosConfigProps = typeof (readAxiosConfig) === 'function' ? readAxiosConfig({ organizationId }) : readAxiosConfig;
    const filterParamKey = filterParamName || 'param';
    const newReadAxiosConfig = { ...readAxiosConfigProps, params: { ...(readAxiosConfigProps.params || {}), ...(paging ? { [filterParamKey]: filter, page } : {}) } };
    console.log('readAxiosConfig', readAxiosConfigProps, newReadAxiosConfig);

    return axios(newReadAxiosConfig);
  }, [data, filterParamName, organizationId, paging, readAxiosConfig]);
  const config = useMemo(() => ({
    paging: !!paging,
    textField: textField || 'meaning',
    valueField: valueField || 'value',
    request: ({ filter, page }) => loadData({ filter, page }),
  }), [loadData, paging, textField, valueField]);
  const props = useSelect(config);
  return <Select {...props} {...otherProps} />;
});

export default QuestionSearchSelect;
