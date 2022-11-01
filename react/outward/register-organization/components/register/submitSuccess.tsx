import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useStore } from '../../stores';
import Img2 from '../../assets/2.svg';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, mainStore: { getUserEmail },
  } = useStore();

  const pagePrefixCls = `${prefixCls}-submitSuccess-content`;

  return (
    <div className={`${pagePrefixCls} ${prefixCls}-children-content`}>
      <h4 className={`${pagePrefixCls}-title`}>
        <Icon type="check_circle" />
        提交成功
      </h4>
      <div className={`${pagePrefixCls}-text-content`}>
        <p>
          您注册的账号（
          {getUserEmail}
          ）信息已提交，
          系统将会在 2 ～ 3 个工作日内通过邮件和短信向您反馈审核结果，请耐心等待。
        </p>
        <p>了解更多行业解决方案或其他帮助可通过以下方式联系我们。</p>
        <p>微信助手：zknow520</p>
        <p>咨询热线：400-800-2077</p>
        <p>官方邮箱：marketing@zknow.com</p>
      </div>
      <div className={`${pagePrefixCls}-img-container`}>
        <img src={Img2} alt="" />
      </div>
    </div>
  );
};

export default Index;
