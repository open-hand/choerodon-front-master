import React from 'react';
import { observer } from 'mobx-react-lite';
import { Progress, Icon } from 'choerodon-ui/pro';
import './index.less';

interface IProps{

}
const Index:React.FC<IProps> = (props:IProps) => {
  const prefixCls = 'c7ncd-cooperation-project-template';
  return (
    <div className={`${prefixCls}-notify`}>
      <div className={`${prefixCls}-notify-progress`}>
        <div className={`${prefixCls}-notify-progress-title`}>已完成 1 项，共 3 项</div>
        <Progress value={34} showInfo={false} status={'success' as any} />
      </div>
      <div className={`${prefixCls}-notify-content`}>
        <div className={`${prefixCls}-notify-content-item`}>
          <Icon type="check_circle" style={{ fontSize: '23px', color: '#1FC2BB' }} />
          <div className={`${prefixCls}-notify-content-item-tip`}>
            <div className={`${prefixCls}-notify-content-item-tip-title`}>定义模板基础信息</div>
            <div>定义模板的名称、描述，完成后可在项目模板列表中查看，此时模板状态默认为“未发布”</div>
          </div>
        </div>
        <div className={`${prefixCls}-notify-content-item`}>
          <Icon type="check_circle" style={{ fontSize: '23px', height: '23px', color: '#ABBCCF' }} />
          <div className={`${prefixCls}-notify-content-item-tip`}>
            <div className={`${prefixCls}-notify-content-item-tip-title`}>维护模板详细内容</div>
            <div>
              在项目模板列表中，点击名称旁“
              <Icon type="more_vert" style={{ color: '#6887e8' }} />
              ”选择“修改详细内容”，维护模板详细内容
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-notify-content-item`}>
          <Icon type="check_circle" style={{ fontSize: '23px', height: '23px', color: '#ABBCCF' }} />
          <div className={`${prefixCls}-notify-content-item-tip`}>
            <div className={`${prefixCls}-notify-content-item-tip-title`}>发布项目模板</div>
            <div>模板详细内容完善后可发布模板，“发布”状态的模板可在项目创建时使用</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(Index);
