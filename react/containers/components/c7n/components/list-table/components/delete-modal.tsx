import React from 'react';
import { observer } from 'mobx-react-lite';
import { Alert } from 'choerodon-ui';
import { Select } from 'choerodon-ui/pro';
import './index.less';

interface IProps{
  name:string,
  count:number,
  prefix:string,
  deleteDs:any,

}
const Index:React.FC<IProps> = (props:IProps) => {
  const {
    name,
    count,
    prefix,
    deleteDs,
  } = props;
  const getMessage = () => (
    <div>
      当前有
      <span style={{ fontSize: '18px', color: 'red', padding: '0 3px' }}>
        {count}
      </span>
      个项目模板正在使用此分类
    </div>
  );
  return (
    <div className={`${prefix}-sider-list-deleteModal`}>
      <div className={`${prefix}-sider-list-deleteModal-title`}>
        删除项目模板分类:
        <span>
          {name}
        </span>
      </div>
      <Alert
        style={{ margin: '10px 0px' }}
        message={getMessage()}
        type="warning"
        showIcon
      />
      <div className={`${prefix}-sider-list-deleteModal-tip`}>注意：将会从所有使用的项目模板中删除这个项目模板分类，请您为受影响的项目模板选择一个新的分类。</div>
      <div className={`${prefix}-sider-list-deleteModal-select`}>
        <Select
          placeholder="请选择一个新的项目模板分类"
          dataSet={deleteDs}
          name="type"
          searchable
          clearButton
        />
      </div>
    </div>
  );
};
export default observer(Index);
