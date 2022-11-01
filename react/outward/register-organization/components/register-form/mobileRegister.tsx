import React from 'react';
import {
  Form, TextField, UrlField, CheckBox, Button, Select,
} from 'choerodon-ui/pro';
import { CaptchaField } from '@choerodon/components/lib/index.js';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
// import { ButtonColor } from '@/interface';
// eslint-disable-next-line import/order
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import './index.less';

interface IProps{

}
const Index:React.FC<IProps> = (props:IProps) => {
  // 通过context获取我们的通信变量
  const { mobileFormDs } = useStore();
  // 指定类的前缀
  const prefix = 'mobileRegister';
  // 跳转查看协议与条款
  const handleJump = (e:React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (window.location.href.indexOf('/iam') !== -1) {
      window.open(`/#/iam/register-organization/${url}`);
    } else {
      window.open(`/register-organization/#/${url}`);
    }
  };
  // 注册成功的回调
  const handleSubmit = () => {

  };
  return (
    <div className={`${prefix}-wrapper`}>
      <div className="top" />
      <div className="form">
        <Form dataSet={mobileFormDs} labelLayout={LabelLayout.vertical}>
          <TextField name="name" placeholder="请输入姓名" />
          <TextField name="b" placeholder="请输入公司名称" />
          <UrlField name="c" placeholder="请输入公司邮箱" />
          <Select name="d" searchable placeholder="请选择省份" />
          <TextField
            name="phone"
          // @ts-ignore
            type="phone"
            placeholder="请输入手机"
          />
          <CaptchaField
          // @ts-ignore
            name="captcha"
            type="phone"
            dataSet={mobileFormDs}
            ajaxRequest={() => {}}
            maxAge={600}
          />
          <CheckBox name="isAgree" className="agree">
            <div className="font">
              <span>我同意</span>
              <a
                onClick={(e) => {
                  handleJump(e, 'serviceAgreement');
                }}
                role="none"
                rel="noopener noreferrer"
              >
                服务协议
              </a>
              与
              <a
                role="none"
                onClick={(e) => {
                  handleJump(e, 'agreement');
                }}
                rel="noopener noreferrer"
              >
                隐私条款
              </a>
            </div>
          </CheckBox>
          <Button onClick={handleSubmit} color={'primary' as any}> 免费注册</Button>
        </Form>
      </div>
    </div>
  );
};

export default observer(Index);
