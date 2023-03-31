/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import type { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { IColumnSetConfig } from '../components/tableColumnSet';
import { renderUsers } from '../config/tableColumnsConfig';

const useGetDisplayColumn = (columnsSetConfig:IColumnSetConfig[], adjustableColumns:ColumnProps[]) => {
  const [displayColumn, setDisplayColumn] = useState<ColumnProps[]>([]);

  useEffect(() => {
    let arr: ColumnProps[] = [];
    if (!columnsSetConfig.length) {
      arr = [];
    } else {
      columnsSetConfig.forEach((item:IColumnSetConfig) => {
        if (item.isSelected) {
          const found = adjustableColumns.find((i) => i.name === item.name);
          if (found) { // 处理width、minWidth属性
            if (item?.width) {
              delete item?.minWidth;
              found.width = item.width;
            }
            arr.push(found);
            return;
          }
          // @ts-ignore
          item.tooltip = 'overflow';
          if (!item.width) { // 去掉width为 0
            delete item.width;
          }
          if (item.isUser) {
            // @ts-ignore
            item.renderer = renderUsers;
          }
          arr.push(item);
        }
      });
      setDisplayColumn(arr);
    }
  }, [columnsSetConfig]);

  return displayColumn;
};

export default useGetDisplayColumn;
