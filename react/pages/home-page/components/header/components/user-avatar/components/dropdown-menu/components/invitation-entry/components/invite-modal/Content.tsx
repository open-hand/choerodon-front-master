import React, { useState, useEffect } from 'react';
import { Tabs, Alert } from 'choerodon-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  TextField, EmailField, Form, message, Select,
} from 'choerodon-ui/pro';
import { useQuery } from 'react-query';
import { useInviteEntryStore } from './stores';
import { registersInvitationApi } from '@/apis';

const { TabPane } = Tabs;

function InvitationModal() {
  const {
    formDs,
    modal,
  } = useInviteEntryStore();

  const [tabkey, setTabkey] = useState('link');

  // 获取链接
  const { isLoading, error, data: link } = useQuery<{
    invitedUsers: number
    invitationUrl: string
  }>('getLink', () => registersInvitationApi.batchInvite());

  const handleCopy = () => {
    message.info('复制成功');
    modal.close();
  };

  const isLink = tabkey === 'link';

  useEffect(() => {
    modal.update({ // 更新modal
      cancelText: '取消',
      okText: isLink ? '复制' : '邀请',
      onOk: isLink ? handleCopy : handleSubmit,
      footer: (okBtn:any, cancelBtn:any) => {
        const confimBtn = isLink ? (
          <CopyToClipboard
            text={link?.invitationUrl}
          >
            {okBtn}
          </CopyToClipboard>
        ) : okBtn;
        return (
          <div>
            {cancelBtn}
            {confimBtn}
          </div>
        );
      },
    });
  }, [tabkey, link]);

  // 公告栏

  const LINK_MESSAGE = '将您的专属推广链接分享给好友，邀请好友分享页面进行试用注册，成为推荐达人可领取实物礼品';
  const FORM_MESSAGE = '填写好友信息，分享专属邀请给好友，邀请好友在分享页面进行试用注册，成为推荐达人可领实物礼品';
  const notice = (
    <div>
      <Alert
        style={{ marginBottom: '20px', height: '60px' }}
        message={isLink ? LINK_MESSAGE : FORM_MESSAGE}
        type="info"
        showIcon
      />
    </div>
  );

  // 链接框
  const linkInvite = (
    <div>
      <div>
        <strong>邀请链接</strong>
      </div>
      <div style={{
        width: '340px',
        height: '82px',
        background: '#F5F6FA',
      }}
      >
        <div style={{
          marginLeft: '4px',
        }}
        >
          {link?.invitationUrl}
        </div>
      </div>
    </div>
  );

  // 发送表单
  const handleSubmit = async () => {
    const checkRes = await formDs.current?.validate();
    if (!checkRes) {
      return false;
    }
    try {
      const data = await formDs.submit();
      if (data && data?.failed) {
        throw new Error(data?.message);
      }
      modal.close();
      return true;
    } catch (err) {
      return '出现错误，请联系管理员';
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={setTabkey}>
        <TabPane tab="链接邀请" key="link">
          {notice}
          {linkInvite}
        </TabPane>
        <TabPane tab="注册邀请" key="register">
          {notice}
          <Form record={formDs.current} style={{ width: '3.4rem' }}>
            <TextField name="userName" />
            <TextField name="userPhone" />
            <EmailField name="userEmail" />
            <TextField name="orgName" />
            <TextField name="orgHomePage" />
            <Select name="orgBusinessType" />
            <Select name="wants" />
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default InvitationModal;
