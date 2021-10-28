import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Alert } from 'choerodon-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  DataSet, TextField, EmailField, Form, message, Button, Select,
} from 'choerodon-ui/pro';
import axios from '../../tools/axios';
import InvitationModalDataSet from './InvitationModalDataset';
import { SUCCESS } from '../../tools/permission/PermissionStatus';

const { TabPane } = Tabs;
export default function InvitationModal(props) {
  const [tabkey, setTabkey] = useState('link');
  const [link, setLink] = useState();

  const handleCopy = () => {
    message.info('复制成功');
  };

  const isLink = tabkey === 'link';

  useEffect(() => {
    props.modal.update({ // 更新modal
      cancelText: '取消',
      footer: (okBtn, cancelBtn) => {
        const finsh = isLink ? (
          <CopyToClipboard
            text={link}
          >
            <Button color="primary" onClick={handleCopy}>
              复制
            </Button>
          </CopyToClipboard>
        ) : (
          <Button color="primary" onClick={handleSubmit}>
            邀请
          </Button>
        );
        return (
          <div>
            {cancelBtn}
            {finsh}
          </div>
        );
      },
    });
  }, [tabkey, link]);

  // 获取链接
  useEffect(() => {
    const getLink = async () => {
      const res = await axios.get(
        '/iam/choerodon/v1/registers_invitation/batch_invitations',
      );
      setLink(res);
    };
    getLink();
  }, []);

  // 公告栏
  const notice = (
    <div>
      <Alert
        style={{ marginBottom: '20px', height: '60px' }}
        message="将您的专属推广链接分享给好友，邀请好友分享页面进行适用注册，成为推荐达人可领取实物礼品"
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
          {link}
        </div>
      </div>
    </div>
  );

  const Ds = useMemo(() => new DataSet(InvitationModalDataSet()), []);

  // 发送表单
  const handleSubmit = async () => {
    try {
      const data = await Ds.submit();
      console.log(data);
      if (data && data?.failed) {
        throw new Error(data?.message);
      }
      props.modal.close();
      return true;
    } catch (err) {
      return '出现错误，请联系管理员';
    }
  };

  // if(data && data?.failed){ throw new Error(data?.message)}

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={setTabkey}>
        <TabPane tab="链接邀请" key="link">
          {notice}
          {linkInvite}
        </TabPane>
        <TabPane tab="注册邀请" key="register">
          {notice}
          <Form record={Ds.current} style={{ width: '3.4rem' }}>
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
