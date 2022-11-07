import React from 'react';
import { Icon } from 'choerodon-ui/pro';

interface IProps{

}
const Index:React.FC<IProps> = (props:IProps) => (
  <div className="content">
    <div className="markWords-top">
      <Icon type="check_circle" />
      <div className="register-success">
        注册成功
      </div>
    </div>
    <div className="markWords-center">
      <div>你的注册信息已提交，</div>
      <div>系统将会在 2 ～ 3 个工作日内通过邮件和短信向您</div>
      <div>反馈审核结果，请耐心等待。</div>
    </div>
    <div className="markWords-bottom">
      <div>若您需要行业解决方案或其他帮助，</div>
      <div>可通过官方邮箱 marketing@zknow.com，</div>
      <div>或热线400 800 2077直接与我们联系。</div>
    </div>
  </div>
);

export default Index;
