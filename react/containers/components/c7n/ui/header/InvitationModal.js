import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Alert } from 'choerodon-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  DataSet, TextField, Icon, Row, Col, EmailField, Form, message, Button,
} from 'choerodon-ui/pro';
import { pick } from 'lodash';
import axios from '../../tools/axios';
import InvitationModalDataSet from './InvitationModalDataset';

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
      footer: (okBtn, cancelBtn) => (
        <div>
          {
            isLink ? (
              <>
                {cancelBtn}
                <CopyToClipboard
                  text={link}
                >
                  <Button color="primary" onClick={handleCopy}>
                    复制
                  </Button>
                </CopyToClipboard>
              </>
            ) : (
              <>
                {cancelBtn}
                <Button color="primary" onClick={handleSubmit}>
                  邀请
                </Button>
              </>
            )
          }
        </div>
      ),
    });
  }, [tabkey, link]);

  // 获取链接
  useEffect(() => {
    const getLink = async (ds) => {
      const res = await axios.get(
        '/iam/choerodon/v1/registers_invitation/batch_invitations',
      );
      setLink(res);
    }; getLink();
  }, [link]);

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
    const data = await Ds.submit();
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
          <Form record={Ds.current} style={{ width: '3.4rem' }}>
            <TextField name="userName" />
            <TextField pattern="1[3-9]\d{9}" name="userPhone" />
            <EmailField name="userEmail" />
            <TextField name="orgName" />
            <TextField name="orgHomePage" />
            <TextField name="orgBusiness" />
            <TextField name="wants" />
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
}
