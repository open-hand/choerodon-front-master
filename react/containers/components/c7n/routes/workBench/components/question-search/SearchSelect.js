import React, {
  useEffect,
  useCallback, useMemo, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, TextField, Button, Dropdown, Form, Select, DataSet,
} from 'choerodon-ui/pro';
import {
  debounce, isEmpty, isEqual, merge,
} from 'lodash';
import useSelect from '@/hooks/useSelect';
import axios from '@/components/axios';
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
    const filterParamKey = filterParamName || 'param';
    const readAxiosConfigProps = typeof (readAxiosConfig) === 'function' ? readAxiosConfig({ organizationId, [filterParamKey]: filter || '' }) : readAxiosConfig;
    const newReadAxiosConfig = { ...readAxiosConfigProps, params: merge(readAxiosConfigProps.params || {}, paging ? { [filterParamKey]: filter || '', page } : {}) };

    return axios({ ...newReadAxiosConfig });
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
