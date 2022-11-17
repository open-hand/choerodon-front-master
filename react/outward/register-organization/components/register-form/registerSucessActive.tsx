import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import './index.less';

interface IProps{

}
const Index:React.FC<IProps> = (props:IProps) => {
  // 类名前缀
  const prefix = 'registerSucessActive';
  // 点击cope按钮的回调
  const getUrl = () => {

  };
  return (
    <div className={`${prefix}-wrapper`}>
      <div className="top" />
      <div className="content">
        <div className="markWords-top">
          <Icon type="check_circle" />
          <div className="register-success">
            提交成功
          </div>
        </div>
        <div className="markWords-center">
          <div>你的注册信息可直接进行系统登录，为提供更</div>
          <div>好的试用体验，请你优先使用PC端登录以下地</div>
          <div>址进行产品试用。</div>
        </div>
        <div className="markWords-bottom">
          <div>
            https://api.choerodon.com.cn/oauth/
          </div>
          <div>
            choerodon/login
            &nbsp;
            <Icon type="content_copy" onClick={getUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
