import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import copy from 'copy-to-clipboard';
import { notification } from 'choerodon-ui';

interface IProps{

}
const Index:React.FC<IProps> = (props:IProps) => {
  // 点击cope按钮的回调
  const getUrl = () => {
    copy('https://api.choerodon.com.cn/oauth/choerodon/login');
    notification.success({
      description: '请在游览器中打开此链接进行产品试用',
      message: '复制成功',
      duration: 2,
    });
  };
  return (
    <div className="content-approved">
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
  );
};

export default Index;
