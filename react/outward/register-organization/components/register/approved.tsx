import React from 'react';
import { Icon, Button } from 'choerodon-ui/pro';
import { useStore } from '../../stores';
import Img3 from '../../assets/3.svg';
import { toLoginAddress } from '../utils';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, mainStore: { getUserEmail },
  } = useStore();
  const pagePrefixCls = `${prefixCls}-approved-content`;
  const toLogin = () => {
    toLoginAddress(`?username=${getUserEmail}`);
  };
  return (
    <div className={`${pagePrefixCls} ${prefixCls}-children-content`}>
      <h4 className={`${pagePrefixCls}-title`}>
        <Icon type="check_circle" />
        提交成功
      </h4>
      <div className={`${pagePrefixCls}-text-content`}>
        <p>
          您的注册信息可直接进行系统登录，
        </p>
        <p>
          返回登录页使用邮箱账号和密码或手机验证码进行登录。
        </p>
      </div>
      <div className={`${pagePrefixCls}-img-container`}>
        <img src={Img3} alt="" />
      </div>
      <Button onClick={toLogin} color={'primary' as any} block>直接登录</Button>
    </div>
  );
};

export default Index;
