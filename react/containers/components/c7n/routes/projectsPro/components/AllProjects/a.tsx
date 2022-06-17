import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  Button, TextField, Icon, Select, DataSet, Tooltip,
} from 'choerodon-ui/pro';
import {
  cloneDeep, forIn, isNil, omit, remove,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import { organizationsApiConfig } from '@/apis';
import ChooseFieldsBtn, { ICheckBoxFields } from './chooseFieldsBtn';
import './a.less';

export interface IProps {
    searchFieldsConfig: ISearchFields[]
}

export interface ISearchFields {
    name: string
    type: string,
    fieldProps: any
    prefixIcon?: string
    width?: number
    onChange: (value: string) => void
    initial: boolean
    optionQueryConfig?: () => void
    optionsTextField?: string
    optionsValueField?: string
}

const fieldsMap = new Map(
  [
    ['TextField', TextField],
    ['Select', Select],
  ],
);

const Index: React.FC<IProps> = (props: any) => {
  const { searchFieldsConfig } = props;
  const [initialFieldNum, setInitialFieldNum] = useState<number>(0);
  const [expandBtnVisible, setExpandBtnVisible] = useState<boolean>(false);
  const [expandBtnType, setExpandBtnType] = useState<'expand_less' | 'expand_more'>('expand_less');
  const [searchFields, setSearchFields] = useState<ISearchFields[]>([]);
  const [searchFieldsOrigin, setSearchFieldsOrigin] = useState<ISearchFields[]>([]);

  const childRef = useRef<any>();

  useEffect(() => {
    // 没有保存的数据的时候
    setSearchFields(searchFieldsConfig);
    setSearchFieldsOrigin(searchFieldsConfig);
    searchFieldsConfig.forEach((item: any) => {
      if (!item.optionQueryConfig) {
        dsFieldAdd(item.name);
      } else {
        dsOptionFieldAdd(item.name, item.optionsTextField, item.optionsValueField, item.optionQueryConfig);
      }
    });
    setInitialFieldNum(getInitialFieldNum(searchFieldsConfig));
  }, []);

  const compDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
    });
    return ds;
  }, []);

  useEffect(() => {
    const ele = document.getElementsByClassName('searchField-container-left-block1-inner')[0];
    const height = +(window.getComputedStyle(ele).height.split('px')[0]);
    const num = height / 52;
    if (num > 1) {
      setExpandBtnVisible(true);
    } else {
      setExpandBtnVisible(false);
    }
  }, [searchFields]);

  const getInitialFieldNum = (arr:ISearchFields[]) => {
    let num = 0;
    arr.forEach((item) => {
      if (item.initial) {
        num += 1;
      }
    });
    return num;
  };

  const dsFieldAdd = (name:string) => {
    if (!compDataSet.getField(name)) {
      compDataSet.addField(name, {});
    }
  };

  const dsOptionFieldAdd = (name:string, textField:string | undefined, valueField:string | undefined, optionQueryConfig:any) => {
    if (!compDataSet.getField(name)) {
      compDataSet.addField(name, {
        textField,
        valueField,
        options: new DataSet({
          autoQuery: true,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...optionQueryConfig,
              };
            },
          },
        }),
      });
    }
  };

  const handleDeleteField = (index: number, name:string) => { // 外面X掉
    compDataSet?.current?.set(name, null);
    const cloneSearchFields = cloneDeep(searchFields);
    cloneSearchFields.splice(index, 1);
    setSearchFields(cloneSearchFields);
    childRef.current.checkChange(false, index - 2);
  };

  const getSearchField = (item: ISearchFields, index: number) => {
    const Ele = fieldsMap.get(item.type);
    return item.initial ? (
      <div className="searchField-item">
        {/*  @ts-ignore */}
        <Ele style={{ width: item.width || 100 }} {...item.fieldProps} dataSet={compDataSet} name={item.name} prefix={item.prefixIcon ? <Icon type={item.prefixIcon} /> : null} />
      </div>
    ) : (
      <div className="searchField-item searchField-item-deletable">
        {/*  @ts-ignore */}
        <Ele style={{ width: item.width || 100 }} {...item.fieldProps} dataSet={compDataSet} name={item.name} prefix={item.prefixIcon ? <Icon type={item.prefixIcon} /> : null} />
        <div
          className="deletable-div"
          role="none"
          onClick={() => {
            handleDeleteField(index, item.name);
          }}
        >
          <Icon type="close" />
        </div>
      </div>
    );
  };

  const fieldAdd = (changeArr:ICheckBoxFields[]) => {
    const cloneSearchFields = cloneDeep(searchFields);
    changeArr.forEach((i) => {
      { /*  @ts-ignore */ }
      cloneSearchFields.push(i);
      if (!i.optionQueryConfig) {
        dsFieldAdd(i.name);
      } else {
        dsOptionFieldAdd(i.name, i.optionsTextField, i.optionsValueField, i.optionQueryConfig);
      }
    });
    setSearchFields(cloneSearchFields);
  };

  const fieldRemove = (changeArr:ICheckBoxFields[]) => { // 里面checkbox 移除外面字段
    const cloneSearchFields = cloneDeep(searchFields);
    changeArr.forEach((item) => {
      compDataSet?.current?.set(item.name, null);
      remove(cloneSearchFields, (i) => item.name === i.name);
    });
    setSearchFields(cloneSearchFields);
  };

  const chooseFieldsChange = (value: boolean, changeArr: ICheckBoxFields[]) => {
    if (value) {
      fieldAdd(changeArr);
    } else {
      fieldRemove(changeArr);
    }
  };

  const handleReset = () => {
    setSearchFields(cloneDeep(searchFieldsOrigin));
    compDataSet.reset();
    setExpandBtnVisible(false);
    setExpandBtnType('expand_less');
    // 再去请求数据
  };

  const getIfValue = () => {
    const obj = omit(compDataSet?.current?.toData(), '__dirty');
    let bool = false;
    // eslint-disable-next-line consistent-return
    forIn(obj, (value, key) => {
      if (!isNil(value)) {
        bool = true;
        return false;
      }
    });
    return bool;
  };

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
            <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" dataSet={compDataSet} name="a" />
          </div>
          <div className="searchField-container-left-block1">
            <div className="searchField-container-left-block1-inner">
              {
            searchFields.map((item, index) => getSearchField(item, index))
            }
              <div className="searchField-item">
                <ChooseFieldsBtn
                  fields={[
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签1',
                      name: 'label',
                      show: true,
                      type: 'Select',
                      fieldProps: {
                        placeholder: '标签1',
                      },
                      onChange: () => {},
                      optionQueryConfig: organizationsApiConfig.cooperationProjStatusList(),
                      optionsTextField: 'name',
                      optionsValueField: 'id',
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签2',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签2',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签3',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签3',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签4',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签4',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签5',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签5',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签6',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签6',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签7',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签7',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签8',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签8',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签9',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签9',
                      },
                      onChange: () => {},
                    },
                    {
                      initial: false,
                      checked: false,
                      checkboxLabel: '标签10',
                      name: 'label2',
                      show: true,
                      type: 'TextField',
                      fieldProps: {
                        placeholder: '标签10',
                      },
                      onChange: () => {},
                    },
                  ]}
                  onChange={chooseFieldsChange}
                  cRef={childRef}
                  reset={handleReset}
                />
              </div>
            </div>
          </div>
          <div className="searchField-container-left-block2">
            {
                (searchFields.length > initialFieldNum || getIfValue())
                && (
                <>
                  <Button onClick={handleReset}>重置</Button>
                  <Tooltip title={expandBtnType === 'expand_less' ? '折叠筛选' : '展开筛选'}>
                    { expandBtnVisible && <Button icon={expandBtnType} onClick={handleExpandClick} />}
                  </Tooltip>
                </>
                )
          }
          </div>
        </div>
        <div className="searchField-container-right">
          <Button icon="view_column" />
        </div>
      </div>
    </>
  );
};

export default observer(Index);
