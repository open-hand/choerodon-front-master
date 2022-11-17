/* eslint-disable consistent-return */
import React, {
  useEffect, useMemo, useRef, useState, useImperativeHandle, useCallback,
} from 'react';
import { FlatSelect, FlatTreeSelect } from '@choerodon/components';
import {
  Button, TextField, Icon, DataSet, Tooltip, DateTimePicker, Select,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { forIn, isNil, omit } from 'lodash';
import { observer } from 'mobx-react-lite';
import SearchFilterBtn, { ICheckBoxFields } from './customQueryBarFilter';
import './customQuerybar.less';

export interface IProps {
  searchFieldsConfig: ISearchFields[]
  filterFieldsConfig: ICheckBoxFields[]
  onChange: (data:{[key:string]:any}) => void
  cRef: any
}

export interface ISearchFields {
  type: string,
  initial: boolean
  dsProps: DataSetProps
  eleProps: {[key:string]:any}
  width?: number
}

const fieldsMap = new Map(
  [
    ['TextField', TextField],
    ['FlatSelect', FlatSelect],
    ['Select', Select],
    ['FlatTreeSelect', FlatTreeSelect],
    ['DateTimePicker', DateTimePicker],
  ],
);

const Index: React.FC<IProps> = (props) => {
  const {
    searchFieldsConfig, filterFieldsConfig, onChange, cRef,
  } = props;
  const [visibleOptionalFieldsNum, setVisibleOptionalFieldsNum] = useState(0);
  const [recordExistedValue, setRecordExistedValue] = useState(false);
  const [expandBtnVisible, setExpandBtnVisible] = useState<boolean>(false);
  const [expandBtnType, setExpandBtnType] = useState<'expand_less' | 'expand_more'>('expand_less');

  const childRef = useRef<any>();

  useImperativeHandle(cRef, () => ({
    reset: handleReset,
  }));

  const queryBarDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
      events: {
        update: ({
          record, name, value, oldValue,
        }: { record: Record, name: string, value: any, oldValue:any }) => {
          // console.log(oldValue, 'oldValue');
          // console.log(omit(record?.toData()));
          if (isNil(oldValue) && Array.isArray(value) && !value.length) {
            return;
          }
          onChange(omit(record?.toData(), '__dirty'));
        },
      },
    });
    searchFieldsConfig.forEach((item: ISearchFields) => {
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
    });
    return ds;
  }, [searchFieldsConfig]);

  const searchFilterDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
      events: {
        update: ({ record, name, value }: { record: Record, name: string, value: any }) => {
          const state = queryBarDataSet?.getState(name);
          queryBarDataSet?.setState(name, {
            ...state,
            visible: value,
          });
          if (!value) {
            queryBarDataSet?.current?.set(name, null);
          }
          setVisibleOptionalFieldsNum(getVisibleOptionalFieldsNum());
        },
      },
    });
    filterFieldsConfig.forEach((item: ICheckBoxFields) => {
      ds.addField(item.name, {
        type: 'boolean' as any,
      });
      ds.setState(item.name, {
        visible: true,
        label: item.label,
      });
    });
    return ds;
  }, [filterFieldsConfig]);

  useEffect(() => {
    const ele = document.getElementsByClassName('searchField-container-left-block1-inner')[0];
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
    const obj = omit(record?.toData(), '__dirty');
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

  const getVisibleOptionalFieldsNum = () => {
    let num = 0;
    [...queryBarDataSet.fields].map((arr) => {
      const fieldName = arr[0];
      const state = queryBarDataSet?.getState(fieldName);
      if (state?.visible && !state?.initial) { // 第一个input框没有
        num += 1;
      }
    });
    return num;
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
  };

  //  useCallback ???
  // const querybarDsCurrentExistValue = useMemo(
  //   () => {
  //   },
  //   [queryBarDataSet?.current?.toData()],
  // );

  const handleExpandClick = () => {
    if (expandBtnType === 'expand_less') {
      document.getElementsByClassName('searchField-container-left-block1')[0].classList
        .add('searchField-container-left-block1-only1line');
      setExpandBtnType('expand_more');
      return;
    }
    document.getElementsByClassName('searchField-container-left-block1')[0].classList
      .remove('searchField-container-left-block1-only1line');
    setExpandBtnType('expand_less');
  };

  return (
    <>
      <div className="searchField-container">
        <div className="searchField-container-left">
          <div className="searchField-item">
            <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" dataSet={queryBarDataSet} name="searchContent" />
          </div>
          <div className="searchField-container-left-block1">
            <div className="searchField-container-left-block1-inner">
              {
                [...queryBarDataSet.fields].map((item) => getFields(item))
              }
              <div className="searchField-item">
                <SearchFilterBtn
                  dataSet={searchFilterDataSet}
                  cRef={childRef}
                />
              </div>
            </div>
          </div>
          <div className="searchField-container-left-block2">
            {
              (visibleOptionalFieldsNum > 0 || recordExistedValue)
              && (
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
