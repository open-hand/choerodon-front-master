import React, { useEffect } from 'react';
import { Loading } from '@choerodon/components';
import * as dd from 'dingtalk-jsapi';
import useQueryString from '@/hooks/useQueryString';
import { API_HOST } from '@/utils/constants';

const Index = () => {
    const { corpId, organization_id, code } = useQueryString()

    useEffect(() => {
        if (dd.env.platform === "notInDingTalk" && corpId) {
            window.location.href = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${organization_id}&code=${code}&state=STATE&way=web`
        } else {
            if (corpId) {
                dd.ready(function () {
                    dd.runtime.permission.requestAuthCode({
                        corpId: corpId, // 企业id
                        // @ts-ignore
                        onSuccess: function (info: any) {
                            let infoCode = info.code; // 通过该免登授权码可以获取用户身份
                            window.location.href = `${API_HOST}/oauth/open/ding_talk/callback?organization_id=${organization_id}&code=${infoCode}&state=STATE&way=web`
                        },
                    });
                });
            }
        }
    }, [])


    return <Loading type="c7n"/>
};

export default Index;
