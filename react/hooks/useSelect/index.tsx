import React, {
  useState, useMemo, useEffect, useRef, useImperativeHandle, useCallback,
} from 'react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import { omit, debounce } from 'lodash';
import { Button, DataSet, Tooltip } from 'choerodon-ui/pro';
import { usePersistFn } from 'ahooks';
import { SearchMatcher } from 'choerodon-ui/pro/lib/select/Select';
import { Renderer } from 'choerodon-ui/pro/lib/field/FormField';

import Record from 'choerodon-ui/pro/lib/data-set/Record';
import FragmentForSearch from './FragmentForSearch';
import './index.less';

type MiddleWare<T> = (data: T[]) => T[];
function applyMiddleWares<T>(data: T[], middleWares: MiddleWare<T>[]): T[] {
  return middleWares.reduce((preData, middleWare) => middleWare(preData), data);
}
function noop<T>(data: T) {
  return data;
}
/**
 * 从对象中获取值，可以传一个key或路径，比如 date.str
 * @param object
 * @param path
 */
function getValueByPath(object: object, path: string) {
  const paths: string[] = path.split('.');
  let result = object;
  while (paths.length > 0) {
    const key = paths.shift();
    if (Object.prototype.hasOwnProperty.call(object, key as string)) {
      // @ts-ignore
      result = result[key as string];
    } else {
      return undefined;
    }
  }
  return result;
}
export interface LoadConfig {
  filter?: string,
  page?: number
}

export interface SelectConfig<T = {}> {
  name: string
  textField: string
  valueField: string
  optionRenderer?: (item: T, tooltip?: boolean) => JSX.Element
  onOption?: ({ record }: { record: Record }) => {
    [key: string]: any
  }
  renderer?: (item: T) => JSX.Element
  request: ({ filter, page }: LoadConfig) => Promise<T[] | { list: T[], hasNextPage: boolean }>
  middleWare?: MiddleWare<T>,
  afterLoad?: (data: T[]) => void
  paging?: boolean
  props?: object
  tooltip?: boolean
  combo?: boolean
}

export interface RefHandle {
  refresh: (config?: LoadConfig) => void
}
export type UseSelectRef = React.MutableRefObject<RefHandle>
export default function useSelect<T extends { [key: string]: any }>(config: SelectConfig<T>, ref?: React.MutableRefObject<RefHandle>) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const textRef = useRef<string>('');
  const dataSetRef = useRef<DataSet>();
  const cacheRef = useRef<Map<any, T>>(new Map());
  const defaultRender = useCallback((item: T, tooltip?: boolean) => {
    const text = item?.meaning || getValueByPath(item, config.textField);
    return tooltip ? <Tooltip title={text} placement="bottomLeft">{text}</Tooltip> : text;
  }, [config.textField]);
  const firstRef = useRef(true);
  const {
    textField = 'meaning',
    valueField = 'value',
    optionRenderer = defaultRender,
    onOption,
    // renderer,
    request: requestFn,
    middleWare = noop,
    afterLoad: afterLoadFn,
    paging = true,
    props,
    combo,
  } = config;
  const request = usePersistFn(requestFn);
  const afterLoad = usePersistFn(afterLoadFn || noop);
  const renderer = useCallback(({
    value, text: originText, maxTagTextLength, ...ote
  }) => {
    // 兼容primitiveValue为false
    const item = value && typeof value === 'object' ? value : cacheRef.current?.get(value);
    if (item) {
      const result = optionRenderer(item);
      const text = maxTagTextLength
        && typeof result === 'string'
        && (result as string).length > maxTagTextLength
        ? `${(result as string).slice(0, maxTagTextLength)}...`
        : result;
      return text;
    }
    if (combo && !firstRef.current && value === originText) {
      return originText;
    }
    return '';
  }, [combo, optionRenderer]);
  // 不分页时，本地搜索
  const localSearch = !paging;
  const loadData = useCallback(async ({ filter = textRef.current, page = 1 }: LoadConfig = {} as LoadConfig) => {
    const res = await request({ filter, page });
    batchedUpdates(() => {
      if (paging) {
        const { list, hasNextPage } = res as { list: T[], hasNextPage: boolean };
        if (afterLoad && firstRef.current) {
          afterLoad(list);
          firstRef.current = false;
        }
        setData((d) => (page > 1 ? d.concat(list) : list));
        setPage(page);
        setCanLoadMore(hasNextPage);
      } else {
        if (afterLoad && firstRef.current) {
          afterLoad(res as T[]);
          firstRef.current = false;
        }
        setData(res as T[]);
      }
    });
    // TODO: 更好的实现
  }, [afterLoad, paging, request]);
  const searchData = useMemo(() => debounce((filter: string) => {
    loadData({ filter });
  }, 500), [loadData]);
  useEffect(() => {
    loadData({ filter: '' });
  }, [loadData]);
  useImperativeHandle<Object, RefHandle>(ref, () => ({
    refresh: loadData,
  }));
  const handleLoadMore = useCallback(() => {
    loadData({ page: currentPage + 1 });
  }, [currentPage, loadData]);
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    textRef.current = value;
    if (!localSearch) {
      searchData(value);
    }
  }, [localSearch, searchData]);
  const filterOptions: SearchMatcher = useCallback(({
    record, text,
  }) => {
    // @ts-ignore
    const meaning = optionRenderer === defaultRender ? getValueByPath(record.data, textField) : optionRenderer(record.data);
    if (!meaning) {
      return true;
    }
    let name = '';
    // 一般情况，option的children是一个字符串
    if (typeof meaning === 'string') {
      name = meaning;
    } else if (React.isValidElement(meaning)) {
      // 其他情况, children是一个元素,那么约定这个元素上的name属性进行搜索
      // @ts-ignore
      // eslint-disable-next-line prefer-destructuring
      name = meaning.props.name;
    } else {
      return true;
    }
    return name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
  }, [defaultRender, optionRenderer, textField]);
  const optionData: Array<T> = useMemo(() => (applyMiddleWares<T>(data, [middleWare]) || []).map((item) => ({
    ...item,
    meaning: item[textField],
    value: item[valueField],
  })), [data, middleWare, textField, valueField]);
  const finalData: Array<T | { loadMoreButton: boolean }> = useMemo(() => (canLoadMore ? [...optionData, { loadMoreButton: true }] : optionData), [canLoadMore, optionData]);
  const loadMoreButton = useMemo(() => (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleLoadMore();
      }}
      style={{ margin: '-4px -12px', width: 'calc(100% + 24px)' }}
    >
      加载更多
    </Button>
  ), [handleLoadMore]);
  const options = useMemo(() => {
    if (!dataSetRef.current) {
      dataSetRef.current = new DataSet({
        data: finalData,
        paging: false,
      });
    } else {
      dataSetRef.current.loadData(finalData);
    }
    optionData.forEach((item) => {
      cacheRef.current?.set(item[valueField], item);
    });
    return dataSetRef.current;
  }, [finalData, optionData, valueField]);
  const renderOption: Renderer = ({ record }) => {
    if (!record) {
      return null;
    }
    if (record.get('loadMoreButton') === true) {
      return loadMoreButton;
    }
    return optionRenderer(record.toData(), config.tooltip);
  };
  const selectProps = {
    searchable: true,
    onInput: handleInput,
    onClear: () => {
      textRef.current = '';
      searchData('');
    },
    // 弹出时自动请求
    onPopupHiddenChange: (hidden: boolean) => {
      if (hidden === false && textRef.current !== '' && paging) {
        textRef.current = '';
        searchData('');
      }
    },
    searchMatcher: paging ? () => true : filterOptions,
    valueField,
    // 这里不传递textField，因为由useSelect来渲染
    textField,
    options,
    // @ts-ignore
    optionRenderer: renderOption,
    // TODO: 考虑如何获取record，来渲染，例如用户
    renderer,
    // renderer: renderer ? ({
    //   // @ts-ignore
    //   value, text, name, record, dataSet,
    // }) => {

    //   return (record ? renderer() : null);
    // } : undefined,
    // @ts-ignore
    onOption: ({ record }) => {
      if (record.get('loadMoreButton') === true) {
        return {
          className: 'load_more',
          disabled: true,
        };
      }
      return onOption ? onOption({ record }) : {};
    },
    ...omit(props, 'renderer', 'optionRenderer'),
  };
  return selectProps;
}
export { FragmentForSearch };
