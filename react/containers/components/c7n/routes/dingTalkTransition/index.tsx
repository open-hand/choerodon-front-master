import React, { useEffect } from 'react';
import { Loading } from '@choerodon/components';
import * as dd from 'dingtalk-jsapi';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import useQueryString from '@/hooks/useQueryString';
import { API_HOST } from '@/utils/constants';

const cookies = new Cookies();

const Index = () => {
  const { corpId, organization_id: orgId, code } = useQueryString();

  const history = useHistory();

  useEffect(() => {
    if (dd.env.platform === 'notInDingTalk' && corpId) {
      window.location.href = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${code}&state=STATE&way=web`;
    } else if (corpId) {
      if (cookies.get('access_token')) {
        history.push(sessionStorage.getItem('historyPath') || '/workbench');
      } else {
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId, // 企业id
            // @ts-ignore
            onSuccess(info: any) {
              const infoCode = info.code; // 通过该免登授权码可以获取用户身份
              // window.location.href = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${infoCode}&state=STATE&way=web`;
              dd.biz.util.openLink({
                url: `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${infoCode}&state=STATE&way=web`,
                // 要打开链接的地址
                // @ts-ignore
                onSuccess(result) {
                  /**/
                  console.log(result, 'result');
                },
                onFail(err:any) {
                  console.log(err);
                },
              });
            },
          });
        });
      }
    }
  }, []);

  return <Loading type="c7n" />;
};

export default Index;
