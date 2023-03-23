import React, {
  useEffect, FC, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import { get } from '@choerodon/inject';

import { Loading } from '@zknow/components';

import './index.less';
import { useQuery } from 'react-query';
import { inject } from 'mobx-react';
import { useVirtualList, useDebounceFn, useRequest } from 'ahooks';
import map from 'lodash/map';
import { organizationsApi } from '@/apis';
import { useProjectsSelectorStore } from '../../stores';

export type FilterProjectsListsProps = {

}

const FilterProjectsLists:FC<FilterProjectsListsProps> = (props:any) => {
  const {
    selectorRef,
    prefixCls,
    handleSelectProjectCallback,
  } = useProjectsSelectorStore();

  const {
    AppState,
  } = props;

  const userId = AppState.getUserId;
  const searchData = selectorRef.current?.text;

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  // const {
  //   data,
  //   isLoading,
  //   isFetching,
  //   refetch,
  // } = useQuery<{
  //   content:any[]
  // }>('c7ncd-projects-filter', getData, { enabled: false });

  // // 防抖
  // const { run } = useDebounceFn(refetch, {
  //   wait: 1000,
  //   leading: true,
  // });

  const { data, loading, run }: any = useRequest(getData, {
    debounceWait: 100,
    manual: true,
  });

  // // 使用virtuallists
  // const [list] = useVirtualList(data?.content || [], {
  //   containerTarget: containerRef,
  //   wrapperTarget: wrapperRef,
  //   overscan: 5,
  //   itemHeight: 29,
  // });

  function getData() {
    return organizationsApi.getProjectsIds(userId, searchData);
  }

  const renderLists = () => (
    data?.content?.length && map(data?.content, (listItem:any) => (
      <div
        role="none"
        key={listItem.index}
        onClick={() => handleSelectProjectCallback(listItem)}
        className={`${prefixCls}-lists-content-item`}
      >
        {listItem?.name || 'unkown'}
      </div>
    ))
  );

  useEffect(() => {
    searchData && run();
  }, [searchData]);

  if (loading) {
    return <Loading display={loading} type={get('configuration.master-global:loadingType') || 'c7n'} />;
  }

  if (!data?.content?.length) {
    return <div className={`${prefixCls}-lists-content-empty`}>{`找不到"${searchData}"对应项目`}</div>;
  }

  return (
    <div className={`${prefixCls}-lists-content`} ref={containerRef} style={{ maxHeight: '1.5rem', overflow: 'auto' }}>
      <div ref={wrapperRef}>
        {renderLists()}
      </div>
    </div>
  );
};

export default inject('AppState')(observer(FilterProjectsLists));
