import React from 'react';
import { Icon, Button } from 'choerodon-ui/pro';
import { useStore } from '../../stores';
import Img3 from '../../assets/3.svg';
import { toLoginAddress } from '../utils/index';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, mainStore: { getUserEmail },
  } = useStore();

  const toLogin = () => {
    toLoginAddress(`?username=${getUserEmail}`);
  };

  const pagePrefixCls = `${prefixCls}-compelete-info-success-content`;

  return (
    <div className={`${pagePrefixCls} ${prefixCls}-compelete-info-children-content`}>
      <h4 className={`${pagePrefixCls}-title`}>
        <Icon type="check_circle" />
        账户激活成功
      </h4>
      <div className={`${pagePrefixCls}-text-content`}>
        <p>
          您的账号“
          {getUserEmail}
          ”设置密码成功，
          请进行产品试用!
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
