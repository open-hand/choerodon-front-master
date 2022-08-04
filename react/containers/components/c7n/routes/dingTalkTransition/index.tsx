import React, { useEffect } from 'react';
import { Loading } from '@choerodon/components';
import * as dd from 'dingtalk-jsapi';
import Cookies from 'universal-cookie';
import { get } from '@choerodon/inject';
import { useHistory } from 'react-router-dom';
import useQueryString from '@/hooks/useQueryString';
import axios from '@/components/axios';
import { API_HOST } from '@/utils/constants';

const cookies = new Cookies();

const Index = () => {
  const { corpId, organization_id: orgId, code } = useQueryString();

  const history = useHistory();

  useEffect(() => {
    const dingTalkLogin = async () => {
      if (dd.env.platform === 'notInDingTalk' && corpId) {
        window.location.href = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${code}&state=STATE&way=web`;
      } else if (corpId) {
        const res = await axios.get(`/iam/choerodon/v1/organizations/${orgId}/open_app/internal_browser?app_type=ding_talk`);
        if (cookies.get('access_token')) {
          if (res) { // 内部跳转
            history.push(sessionStorage.getItem('historyPath') || '/workbench');
          } else {
            history.push('/workbench');
            dd.ready(() => {
              dd.runtime.permission.requestAuthCode({
                corpId, // 企业id
                // @ts-ignore
                onSuccess(info: any) {
                  const infoCode = info.code; // 通过该免登授权码可以获取用户身份
                  dd.biz.util.openLink({
                    url: `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${infoCode}&state=STATE&way=web`,
                    // @ts-ignore
                    onSuccess(result) {},
                    onFail(err:any) {
                      console.log(err);
                    },
                  });
                },
              });
            });
          }
        } else {
          dd.ready(() => {
            dd.runtime.permission.requestAuthCode({
              corpId, // 企业id
              // @ts-ignore
              onSuccess(info: any) {
                const infoCode = info.code; // 通过该免登授权码可以获取用户身份
                const innerCallBackUrl = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${infoCode}&state=STATE&way=web`;
                window.location.href = innerCallBackUrl;
                if (!res) { // 跳外部
                  dd.runtime.permission.requestAuthCode({
                    corpId, // 企业id
                    // @ts-ignore
                    onSuccess(info2: any) {
                      const infoCode2 = info2.code; // 通过该免登授权码可以获取用户身份
                      const outerCallBackUrl = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${orgId}&code=${infoCode2}&state=STATE&way=web`;
                      dd.biz.util.openLink({
                        url: outerCallBackUrl,
                        // @ts-ignore
                        onSuccess(result) {},
                        onFail(err:any) {
                          console.log(err);
                        },
                      });
                    },
                  });
                }
              },
            });
          });
        }
      }
    };

    dingTalkLogin();
  }, []);

  return <Loading type={get('master-global:loadingType') || 'c7n'} />;
};

export default Index;
