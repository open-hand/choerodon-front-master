/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Form, TextField, CheckBox, Button, Select, EmailField,
} from 'choerodon-ui/pro';
import { CaptchaField } from '@zknow/components/lib/index.js';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { notification } from 'choerodon-ui';
// @ts-ignore
import Cookies from 'universal-cookie';
import { omit } from 'lodash';
import { useStore } from '../../stores';
import { toLoginAddress } from '../utils';
import { registerOrganizationApi } from '@/apis';
import './index.less';

interface IProps {

}

const cookies = new Cookies();

const Index:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, registerFormDs, mainStore: { setPageType, setUserEmail },
  } = useStore();

  const search = window.location.href.split('?')[1] ? `?${window.location.href.split('?')[1]}` : '';

  const pagePrefixCls = `${prefixCls}-register-form-content`;

  const handleJump = (e:React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (window.location.href.indexOf('/iam') !== -1) {
      window.open(`/#/iam/register-organization/${url}`);
    } else {
      window.open(`/register-organization/#/${url}`);
    }
  };

  const toLogin = (e:React.MouseEvent) => {
    e.preventDefault();
    toLoginAddress();
  };

  function getPostData() {
    let obj:any = {};

    const map = new Map([
      ['inviter_info', 'inviterInfo'],
      ['source', 'source'],
      ['zk', 'zk'],
      ['source_type', 'sourceType'],
      ['channel', 'sourceChannel'],
      ['refid', 'refId'],
    ]);

    const paramsObj = queryString.parse(search, {
      decode: false,
    });
    map.forEach((value, key) => {
      if (paramsObj[key]) {
        obj[value] = paramsObj[key];
      }
    });
    if (obj.keys().every((item:string) => !['source', 'zk', 'source_type', 'channel', 'refid'].includes(item))) {
      obj = {
        ...obj,
        sourceType: 'default',
        sourceChannel: 'default',
        refId: document.referrer,
      };
    }
    return obj;
  }

  const handleSubmit = async () => {
    const validateRes = await registerFormDs.validate();
    const postData:any = registerFormDs.toData()[0];
    const obj = getPostData();
    Object.assign(postData, obj);
    if (validateRes) {
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
            container: 'registerPage',
            content: 'registerApproved',
          });
        } else {
          setPageType({
            container: 'registerPage',
            content: 'registerSuccess',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={`${pagePrefixCls} ${prefixCls}-children-content`}>
      <h4 className={`${pagePrefixCls}-title-1`}>
        预约DEMO体验
      </h4>
      <p className={`${pagePrefixCls}-title-2`}>留下联系方式获得更多信息</p>
      <Form dataSet={registerFormDs} columns={2}>
        <TextField name="userName" colSpan={2} />
        <TextField name="orgName" colSpan={2} />
        <EmailField name="userEmail" colSpan={2} />
        <Select name="orgProvince" colSpan={2} searchable />
        <TextField
          colSpan={1}
          name="userPhone"
        />
        <CaptchaField
          // @ts-ignore
          colSpan={1}
          type="userPhone"
          dataSet={registerFormDs}
          ajaxRequest={registerOrganizationApi.getCaptcha}
          maxAge={600}
        />
        {/*  @ts-ignore */}
        <div colSpan={2} className="row-notice">
          <CheckBox name="isAgree" colSpan={1}>
            <span>我同意</span>
          </CheckBox>
          <span className="row-notice-right">
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
          </span>
        </div>
      </Form>
      <Button disabled={!registerFormDs?.current?.get('isAgree')} className="submit-btn" block color={'primary' as any} onClick={handleSubmit}>预约DEMO体验</Button>
      <div className="row-tologin"><a href="" onClick={(e) => { toLogin(e); }}>已有账号，立即登录</a></div>
    </div>
  );
};

export default observer(Index);
