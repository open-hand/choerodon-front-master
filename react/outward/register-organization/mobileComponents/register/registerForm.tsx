import React from 'react';
import {
  Form, TextField, UrlField, CheckBox, Button, Select,
} from 'choerodon-ui/pro';
import { CaptchaField } from '@zknow/components/lib/index.js';
import { observer } from 'mobx-react-lite';
import { notification } from 'choerodon-ui';
// eslint-disable-next-line import/order
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
// 使用useLocation获取当前页面的url hash search pathname
import { useLocation } from 'react-router';
// @ts-ignore
import queryString from 'query-string';
// @ts-ignore
import Cookies from 'universal-cookie';
import { omit } from 'lodash';
import { useStore } from '../../stores';
// import { ButtonColor } from '@/interface';
import { registerOrganizationApi } from '@/apis';
import './index.less';

interface IProps{

}
const cookies = new Cookies();
const Index:React.FC<IProps> = (props:IProps) => {
  // 通过context获取我们的通信变量
  const { mobileFormDs, mainStore: { setPageType, setUserEmail } } = useStore();
  const { search } = useLocation();
  // 跳转查看协议与条款
  const handleJump = (e:React.MouseEvent, url: string) => {
    e.stopPropagation();
    // 必须在带有iam路由路径下打开
    if (window.location.href.indexOf('/iam') !== -1) {
      window.open(`/#/iam/register-organization/${url}`);
    } else {
      window.open(`/register-organization/#/${url}`);
    }
  };
  // 注册成功的回调
  const handleSubmit = async () => {
    // DS验证
    const validateRes = await mobileFormDs.validate();
    const postData:any = mobileFormDs.toData()[0];
    // 检验是否带有qurey查询参数，有就通过queryString解析之后放入postData里面
    if (search.indexOf('inviter_info') !== -1) {
      postData.inviterInfo = queryString.parse(search).inviter_info;
    }
    if (validateRes) {
      // 没有发送验证码，直接输入的形式
      if (!cookies.get('captchaKey')) {
        notification.warning({
          message: '警告',
          description: '请先获取验证码',
          placement: 'bottomLeft',
        });
        return;
      }
      try {
        const res = await registerOrganizationApi.registeSubmit({
          ...omit(postData, 'isAgree'),
          captchaKey: cookies.get('captchaKey'),
        });
        setUserEmail(postData.userEmail);
        if (res) {
          setPageType({
            container: 'registerPhonePage',
            content: 'approvedPhone',
          });
        } else {
          setPageType({
            container: 'registerPhonePage',
            content: 'registerSuccessPhone',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="form">
      <Form dataSet={mobileFormDs} labelLayout={LabelLayout.vertical}>
        <TextField name="userName" placeholder="请输入姓名" />
        <TextField name="orgName" placeholder="请输入公司名称" />
        <UrlField name="userEmail" placeholder="请输入公司邮箱" />
        <Select name="orgProvince" searchable placeholder="请选择省份" />
        <TextField
          name="userPhone"
          // @ts-ignore
          type="phone"
          placeholder="请输入手机"
        />
        <CaptchaField
          // @ts-ignore
          name="captcha"
          type="userPhone"
          dataSet={mobileFormDs}
          ajaxRequest={registerOrganizationApi.getCaptcha}
          maxAge={600}
        />
        <CheckBox name="isAgree" className="agree" colSpan={0.7}>
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
        <Button disabled={!mobileFormDs?.current?.get('isAgree')} block color={'primary' as any} onClick={handleSubmit}>免费试用</Button>
      </Form>
    </div>
  );
};

export default observer(Index);
