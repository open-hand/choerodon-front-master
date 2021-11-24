import { useVirtualList } from 'ahooks';
import { filter, map } from 'lodash';
import React, { useMemo, useState } from 'react';
import { Icon } from 'choerodon-ui';
import { TextField } from 'choerodon-ui/pro/lib';
import { COMMON_ZH_CN } from '@/locale/zh_CN/common';

const prefixCls = 'c7ncd-dev-tool-localeLists-list';

const CNLists = () => {
  const [searchValue, setValue] = useState('');
  const localeLists = useMemo(() => map(COMMON_ZH_CN, (value, key) => ({
    value,
    key: key.replace('boot.', ''),
  })), []);

  const { list, containerProps, wrapperProps } = useVirtualList(localeLists, {
    itemHeight: 50,
    overscan: 10,
  });

  const renderItem = (key:string, value:string) => (
    <div
      className={`${prefixCls}-item`}
      style={{
        height: 42,
        border: '1px solid #e8e8e8',
        marginBottom: 8,
      }}
      key={key}
    >
      <span>{key}</span>
      ：
      <span>{value}</span>
    </div>
  );

  const renderVlist = () => (
    <div {...containerProps} style={{ height: '300px', overflow: 'auto' }}>
      <div {...wrapperProps}>
        {list.map(({ data }) => (
          renderItem(data.key, data.value)
        ))}
      </div>
    </div>
  );

  const renderSearchList = () => {
    const currentLists = filter(list, ({ data: { value, key } }) => value.includes(searchValue) || searchValue.includes(value));
    if (!currentLists.length) {
      return <p>糟了，没数据...去master加吧</p>;
    }
    return (
      <div style={{
        height: '300px',
        overflow: 'scroll',
      }}
      >
        {map(currentLists, ({ data }) => renderItem(data.key, data.value))}
      </div>
    );
  };

  const renderContent = () => {
    if (searchValue) {
      return renderSearchList();
    }
    return renderVlist();
  };

  return (
    <div className={prefixCls}>
      <TextField
        wait={500}
        className={`${prefixCls}-search`}
        placeholder="输入中文搜索对应id："
        prefix={<Icon type="search" />}
        value={searchValue}
        onChange={setValue}
        valueChangeAction={'input' as any}
      />
      {
        renderContent()
      }
    </div>
  );
};

export default CNLists;
