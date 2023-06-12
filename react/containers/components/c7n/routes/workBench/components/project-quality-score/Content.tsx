import React from 'react';
import { Table, Button, Icon } from 'choerodon-ui/pro';
import { NewTips } from '@zknow/components';
import { useStore } from './Stores';
import './index.less';

const { Column } = Table;

const Content:React.FC = () => {
  const {
    intlPrefix, prefixCls, tableDs,
  } = useStore();

  return (
    <div className={`${prefixCls}-container`}>
      <header>
        <div>
          <span>项目质量评分</span>
          <NewTips
            helpText="展示所选项目代码质量评分的情况。"
          />
          <Icon type="settings-o" />
        </div>
        <Button>导出</Button>
      </header>
      <Table dataSet={tableDs} queryBar={'none' as any}>
        <Column name="aa" />
        <Column name="bb" sortable />
        <Column name="cc" sortable />
        <Column name="dd" sortable />
        <Column name="ee" sortable />
      </Table>
    </div>

  );
};

export default Content;
