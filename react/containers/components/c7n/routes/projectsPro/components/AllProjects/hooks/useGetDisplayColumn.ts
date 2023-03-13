import { useEffect, useState } from 'react';
import type { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { IColumnSetConfig } from '../tableColumnSet';

const useGetDisplayColumn = (columnsSetConfig:IColumnSetConfig[], adjustableColumns:ColumnProps[]) => {
  const [displayColumn, setDisplayColumn] = useState<ColumnProps[]>([]);

  useEffect(() => {
    let arr: ColumnProps[] = [];
    if (!columnsSetConfig.length) {
      arr = [];
    } else {
      columnsSetConfig.forEach((item:IColumnSetConfig) => {
        if (item.isSelected) {
          if (item.isConfig) {
            // isConfig参数代表是第三方配置项 如果有 可直接插入
            arr.push(item);
          } else {
            const found = adjustableColumns.find((i) => i.name === item.name);
            if (found) {
              if (item?.width) {
                // eslint-disable-next-line no-param-reassign
                delete item?.minWidth;
                found.width = item.width;
              }
              arr.push(found);
            }
          }
        }
      });
      setDisplayColumn(arr);
    }
  }, [columnsSetConfig]);

  return displayColumn;
};

export default useGetDisplayColumn;
