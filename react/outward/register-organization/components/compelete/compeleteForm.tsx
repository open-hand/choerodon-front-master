/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import {
  Form, TextField, Password, Button,
} from 'choerodon-ui/pro';
// @ts-ignore
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { useStore } from '../../stores';
import { registerOrganizationApi } from '@/apis';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, compeleteInfoDs, mainStore: { setPageType, setUserEmail },
  } = useStore();
  const { search } = useLocation();

  const pagePrefixCls = `${prefixCls}-compelete-info-form-content`;

  const handleSubmitClick = async () => {
    const validateRes = await compeleteInfoDs.validate();
    const postData = compeleteInfoDs?.toData()[0];
    if (validateRes) {
      try {
        await registerOrganizationApi.compeleteSubmit(postData);
        setPageType({
          container: 'compeletePage',
          content: 'compeleteSuccess',
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const queryObj = queryString.parse(search);
    compeleteInfoDs?.current?.set('userToken', queryObj?.user_token);
    compeleteInfoDs?.current?.set('userEmail', queryObj?.user_email);
    setUserEmail(queryObj?.user_email || '');
  }, []);

  return (
    <div className={`${pagePrefixCls} ${prefixCls}-compelete-info-children-content`}>
      <div className={`${pagePrefixCls}-title`}>
        设置密码
      </div>
      <Form dataSet={compeleteInfoDs}>
        <TextField name="userEmail" disabled />
        <Password name="password" autoComplete="new-password" />
      </Form>
      <Button color={'primary' as any} block onClick={handleSubmitClick}>保存</Button>
    </div>
  );
};

export default Index;
