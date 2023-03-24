/* eslint-disable no-param-reassign */
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
      console.log(columnsSetConfig, 'columnsSetConfig');
      columnsSetConfig.forEach((item:IColumnSetConfig) => {
        if (item.isSelected) {
          //  还没调整过列宽的时候,后端返回数据为0，系统字段用默认的列宽
          const found = adjustableColumns.find((i) => i.name === item.name);
          if (found) {
            if (item?.width) {
              delete item?.minWidth;
              found.width = item.width;
            }
            arr.push(found);
            return;
          }
          arr.push(item);
        }
      });
      setDisplayColumn(arr);
      console.log(arr, 'arr');
    }
  }, [columnsSetConfig]);

  return displayColumn;
};

export default useGetDisplayColumn;
