import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import { Loading } from '@choerodon/components';

import './index.less';
import { useQuery } from 'react-query';
import { inject } from 'mobx-react';
import { useVirtualList, useDebounceFn } from 'ahooks';
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

  const {
    data = {
      content: [],
    },
    isLoading,
    isFetching,
    refetch,
  } = useQuery<{
    content:any[]
  }>('c7ncd-projects-filter', getData, { enabled: false });

  // 防抖
  const { run } = useDebounceFn(refetch, {
    wait: 500,
    leading: true,
  });

  // 使用virtuallists
  const { list, containerProps, wrapperProps } = useVirtualList(data?.content || [], {
    overscan: 5,
    itemHeight: 29,
  });

  function getData() {
    return organizationsApi.getProjectsIds(userId, searchData);
  }

  const renderLists = () => (
    list?.length && map(list, (listItem:any) => (
      <div
        role="none"
        key={listItem.index}
        onClick={() => handleSelectProjectCallback(listItem.data)}
        className={`${prefixCls}-lists-content-item`}
      >
        {listItem?.data?.name || 'unkown'}
      </div>
    ))
  );

  useEffect(() => {
    searchData && run();
  }, [run, searchData]);

  if (isLoading || isFetching) {
    return <Loading display={isLoading || isFetching} type="c7n" />;
  }

  if (!list?.length) {
    return <div className={`${prefixCls}-lists-content-empty`}>{`找不到"${searchData}"对应项目`}</div>;
  }

  return (
    <div className={`${prefixCls}-lists-content`} {...containerProps} style={{ maxHeight: '1.5rem', overflow: 'auto' }}>
      <div {...wrapperProps}>
        {renderLists()}
      </div>
    </div>
  );
};

export default inject('AppState')(observer(FilterProjectsLists));
