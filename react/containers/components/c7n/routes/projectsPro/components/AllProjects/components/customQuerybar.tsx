/* eslint-disable consistent-return */
/* eslint-disable react/require-default-props */
import React, {
  useEffect, useMemo, useRef, useState, useImperativeHandle, useCallback,
} from 'react';
import { FlatSelect, FlatTreeSelect } from '@zknow/components';
import {
  Button, TextField, Icon, DataSet, Tooltip, DateTimePicker, Select, DatePicker, TimePicker, NumberField,
} from 'choerodon-ui/pro';

import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { forIn, isNil, omit } from 'lodash';
import { observer } from 'mobx-react-lite';
import SearchFilterBtn, { ICheckBoxFields } from './customQueryBarFilter';
import LocalCacheStore, { LocalCacheStoreIssueTypeKeys } from '@/stores/cacheStore/LocalCacheStore';
import './customQuerybar.less';

window.onunload = () => {
  LocalCacheStore.clear();
};

window.onbeforeunload = () => {
  LocalCacheStore.clear();
};

export interface IProps {
  /**
   * 外面搜索条config，包含系统预定义字段、系统自定义字段的config
   */
  searchFieldsConfig: ISearchFields[]
  /**
   * 系统预定义字段
   */
  filterFieldsConfig: ICheckBoxFields[]
  /**
   * 系统自定义字段
   */
  customfilterFieldsConfig: ICheckBoxFields[]
  /**
   * 缓存key
   */
  cacheKey?: LocalCacheStoreIssueTypeKeys
  onChange: (data: { [key: string]: any }, name?: string, record?: Record) => void
  showResetButton?: boolean
  showSearchInput?: boolean
  dateFieldsArr?: string[]
  cRef?: any
}

export interface ISearchFields {
  type: string,
  /**
   * 是否初始化展示
   */
  initial: boolean
  dsProps: { [key: string]: any }
  eleProps: { [key: string]: any }
  width?: number
}

const fieldsMap = new Map(
  [
    ['TextField', TextField],
    ['FlatSelect', FlatSelect],
    ['Select', Select],
    ['TimePicker', TimePicker],
    ['NumberField', NumberField],
    ['FlatTreeSelect', FlatTreeSelect],
    ['DateTimePicker', DateTimePicker],
    ['DatePicker', DatePicker],
  ],
);

export const getCacheData = (cacheKey: LocalCacheStoreIssueTypeKeys) => {
  const d = cacheKey ? LocalCacheStore.getItem(cacheKey) : '';
  const cacheData = d ? JSON.parse(d) : {};
  return cacheData;
};

const Index: React.FC<IProps> = (props) => {
  const {
    cacheKey, searchFieldsConfig, filterFieldsConfig, customfilterFieldsConfig, onChange, cRef, showResetButton = true, showSearchInput = true, dateFieldsArr = [],
  } = props;
  const [visibleOptionalFieldsNum, setVisibleOptionalFieldsNum] = useState(0);
  const [recordExistedValue, setRecordExistedValue] = useState(false);
  const [expandBtnVisible, setExpandBtnVisible] = useState<boolean>(false);
  const [expandBtnType, setExpandBtnType] = useState<'expand_less' | 'expand_more'>('expand_less');

  const childRef = useRef<any>();
  const divRef1 = useRef<any>();
  const divRef2 = useRef<any>();

  useImperativeHandle(cRef, () => ({
    reset: handleReset,
  }));

  function queryBarDsInit(ds: DataSet, config: ISearchFields[]) {
    config.forEach((item: ISearchFields) => {
      if (!ds.getField(item.dsProps.name as string)) {
        ds.addField(item.dsProps.name as string, {
          ...item.dsProps,
        });
        ds.setState(item.dsProps.name as string, {
          initial: item.initial,
          type: item.type,
          visible: item.initial,
          width: item.width,
          eleProps: item.eleProps,
        });
      }
    });
  }

  function searchFilterDsInit(ds: DataSet, config: ICheckBoxFields[], isSystem: boolean) {
    config.forEach((item: ICheckBoxFields) => {
      if (!ds.getField(item.name as string)) {
        ds.addField(item.name, {
          type: 'boolean' as any,
        });
        ds.setState(item.name, {
          visible: true,
          label: item.label,
          isSystem,
        });
      }
    });
  }

  const getVisibleOptionalFieldsNum = useCallback(
    () => {
      let num = 0;
      [...queryBarDataSet.fields].map((arr) => {
        const fieldName = arr[0];
        const state = queryBarDataSet?.getState(fieldName);
        if (state?.visible && !state?.initial) { // 第一个input框没有
          num += 1;
        }
      });
      searchFilterDataSet.setState('checkedNum', num);
      return num;
    },
    [],
  );

  const queryBarDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
      events: {
        update: ({
          dataSet, record, name, value, oldValue,
        }: { dataSet: DataSet, record: Record, name: string, value: any, oldValue: any }) => {
          if (isNil(oldValue) && Array.isArray(value) && !value.length) {
            return;
          }

          if (dateFieldsArr.includes(name)) {
            if (oldValue && (!oldValue[0] || !oldValue[1])) {
              return;
            }
            if (value && (!value[0] || !value[1])) {
              setTimeout(() => {
                record.set(name, null);
              }, 1500);
              return;
            }
          }

          let returnData = omit(record?.toData(), '__dirty');

          const omitArr: string[] = [];
          Object.keys(returnData).forEach((key) => {
            if (dateFieldsArr.includes(key) && returnData[key] && (!returnData[key][0] || !returnData[key][1])) {
              omitArr.push(key);
            }
          });
          returnData = omit(returnData, omitArr); // 防止settimeout 期间请求

          if (cacheKey) {
            const d = LocalCacheStore.getItem(cacheKey);
            const cacheData = d ? JSON.parse(d) : {};
            LocalCacheStore.setItem(cacheKey as any, JSON.stringify({
              ...cacheData,
              ...returnData,
            }));
          }

          if (dataSet.getState('initFinish')) {
            onChange(returnData, name, record);
          }
        },
      },
    });
    queryBarDsInit(ds, searchFieldsConfig);
    return ds;
  }, [dateFieldsArr, searchFieldsConfig, onChange]);

  const searchFilterDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
      events: {
        update: ({ record, name, value }: { record: Record, name: string, value: any }) => {
          if (cacheKey) {
            const d = LocalCacheStore.getItem(cacheKey);
            const cacheData = d ? JSON.parse(d) : {};

            if (!Object.keys(cacheData).includes(name) && value) {
              const obj = {
                ...cacheData,
                [name]: null,
              };

              LocalCacheStore.setItem(cacheKey as any, JSON.stringify(
                obj,
              ));
            }
          }
          const state = queryBarDataSet?.getState(name);
          if (!state) {
            return;
          }
          queryBarDataSet?.setState(name, {
            ...state,
            visible: value,
          });
          if (!value) {
            queryBarDataSet?.current?.set(name, null);
          } else {
            queryBarDataSet?.current?.getField(name)?.options?.query();
          }
          setVisibleOptionalFieldsNum(getVisibleOptionalFieldsNum());
        },
      },
    });
    searchFilterDsInit(ds, filterFieldsConfig, true);
    searchFilterDsInit(ds, customfilterFieldsConfig, false);
    return ds;
  }, [filterFieldsConfig, customfilterFieldsConfig, queryBarDataSet, getVisibleOptionalFieldsNum]);

  useEffect(() => {
    const d = cacheKey ? LocalCacheStore.getItem(cacheKey) : '';
    const cacheData = d ? JSON.parse(d) : {};
    const arr = Object.keys(cacheData);
    arr.forEach((key, index) => {
      searchFilterDataSet?.current?.set(key, true);
      queryBarDataSet?.current?.set(key, cacheData[key]);
      if (index === arr.length - 1) {
        queryBarDataSet.setState('initFinish', true);
      }
    });
    if (!arr.length) {
      queryBarDataSet.setState('initFinish', true);
    }
  }, [cacheKey, queryBarDataSet, searchFilterDataSet]);

  useEffect(() => {
    const ele = divRef2?.current;
    const height = +(window.getComputedStyle(ele).height.split('px')[0]);
    const num = height / 42;
    if (num > 1) {
      setExpandBtnVisible(true);
    } else {
      setExpandBtnVisible(false);
    }
  }, [searchFilterDataSet?.current?.toData()]);

  useEffect(() => {
    const record = queryBarDataSet?.current;
    const obj = omit(record?.toData(), ['__dirty']);
    let bool = false;
    forIn(obj, (value, key) => {
      if (Array.isArray(value)) {
        if (value.length) {
          bool = true;
          return false;
        }
      } else if (!isNil(value)) {
        bool = true;
        return false;
      }
    });
    setRecordExistedValue(bool);
  }, [queryBarDataSet?.current?.toData()]);

  const handleDeleteField = (fieldName: string) => { // 外面X掉
    const queryBarRecord = queryBarDataSet?.current;
    const queryBarState = queryBarDataSet?.getState(fieldName);
    queryBarDataSet?.setState(fieldName, {
      ...queryBarState,
      visible: false,
    });
    queryBarRecord?.set(fieldName, null);

    const searchFilterRecord = searchFilterDataSet?.current;
    searchFilterRecord?.set(fieldName, false);

    setVisibleOptionalFieldsNum(getVisibleOptionalFieldsNum());
  };

  const getFields = (arr: Array<any>) => {
    const field = arr[1];
    const fieldName = field.name;
    const state = queryBarDataSet?.getState(fieldName);
    if (!state) {
      return <span />;
    }
    const {
      initial, type, width, visible, eleProps,
    } = state;
    const Ele = fieldsMap.get(type);

    return visible ? (
      <div className={initial ? 'searchField-item' : 'searchField-item-deletable'}>
        {/*  @ts-ignore */}
        <Ele
          name={fieldName}
          style={{ width: width || 'auto' }}
          dataSet={queryBarDataSet}
          onChange={(v: any) => {
            queryBarDataSet.getField(fieldName)?.options?.setState('selectids', v);
          }}
          {...eleProps}
        />
        {
          !initial
          && (
            <div
              className="deletable-div"
              role="none"
              onClick={() => {
                handleDeleteField(fieldName);
              }}
            >
              <Icon type="close" />
            </div>
          )
        }
      </div>
    ) : '';
  };

  const handleReset = () => {
    queryBarDataSet?.current?.reset();
    searchFilterDataSet?.current?.reset();
    setExpandBtnVisible(false);
    setExpandBtnType('expand_less');
    setVisibleOptionalFieldsNum(0);
    childRef?.current?.reset();
    onChange({});
    LocalCacheStore.setItem(cacheKey as any, JSON.stringify({}));
  };

  const handleExpandClick = () => {
    if (expandBtnType === 'expand_less') {
      divRef1?.current.classList.add('searchField-container-left-block1-only1line');
      setExpandBtnType('expand_more');
      return;
    }
    divRef1?.current.classList.remove('searchField-container-left-block1-only1line');
    setExpandBtnType('expand_less');
  };

  return (
    <>
      <div className="searchField-container">
        <div className="searchField-container-left">
          {
            showSearchInput && (
              <div className="searchField-item">
                <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" dataSet={queryBarDataSet} name="searchContent" />
              </div>
            )
          }
          <div ref={divRef1} className="searchField-container-left-block1">
            <div ref={divRef2} className="searchField-container-left-block1-inner">
              {
                [...queryBarDataSet.fields].map((item) => getFields(item))
              }
              {
                filterFieldsConfig.length > 0 ? (
                  <div className="searchField-item">
                    <SearchFilterBtn
                      dataSet={searchFilterDataSet}
                      cRef={childRef}
                    />
                  </div>
                ) : ''
              }
            </div>
          </div>
          <div className="searchField-container-left-block2">
            {
              (visibleOptionalFieldsNum > 0 || recordExistedValue)
              && showResetButton && (
                <>
                  <Button onClick={handleReset}>重置</Button>
                  <Tooltip title={expandBtnType === 'expand_less' ? '折叠筛选' : '展开筛选'}>
                    {expandBtnVisible && <Button icon={expandBtnType} onClick={handleExpandClick} />}
                  </Tooltip>
                </>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(Index);
