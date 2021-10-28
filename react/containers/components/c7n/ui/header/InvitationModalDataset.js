import { pick, omit, join } from 'lodash';
import { DataSet } from 'choerodon-ui/pro';
import axios from '../../tools/axios';
import { businessDataSet, wantsDataset } from './optionDataset';

const BusinessDataSet = new DataSet(businessDataSet);
const WantsDataset = new DataSet(wantsDataset);

function InvitationModalDataSet() {
  // 手机校验
  async function checkPhone(userPhone) {
    const res = await axios.get(`/iam/choerodon/v1/registers_invitation/check_user_phone?phone=${userPhone}`);
    try {
      if (!res) {
        return '已存在';
      } return true;
    } catch (err) {
      return '手机校验失败，请稍后重试';
    }
  }

  // 邮箱校验
  async function checkEmail(userEmail) {
    try {
      const res = await axios.get(`/iam/choerodon/v1/registers_invitation/check_user_email?email=${userEmail}`);

      if (res === 'exist') {
        return '邮箱已存在';
      }
      if (res === 'invited') {
        return '已经被邀请';
      }
      if (res === 'registered') {
        return '已经提交注册';
      }
      if (res === 'invitable') {
        return true;
      }
      return '请输入邮箱';
    } catch (err) {
      return '校验邮箱失败，请稍后重试';
    }
  }

  return ({
    autoCreate: true,
    fields: [
      {
        name: 'userName',
        type: 'string',
        label: '姓名',
        required: true,
        maxLength: 40,
      },
      {
        name: 'userPhone',
        type: 'string',
        label: '手机',
        required: true,
        maxLength: 11,
        pattern: '^1[3-9]\\d{9}$',
        validator: checkPhone,
      },
      {
        name: 'userEmail',
        type: 'email',
        label: '邮箱',
        required: true,
        maxLength: 40,
        validator: checkEmail,
      },
      {
        name: 'orgName',
        type: 'string',
        label: '公司名称',
      },
      {
        name: 'orgHomePage',
        type: 'string',
        label: '官网地址',
      },
      {
        name: 'orgBusinessType',
        type: 'string',
        label: '行业',
        options: BusinessDataSet,
        textField: 'text',
        valueField: 'value',
      },
      {
        name: 'wants',
        type: 'string',
        label: '想要使用功能',
        options: WantsDataset,
        textField: 'text',
        valueField: 'value',
        multiple: true,
      },
    ],

    transport: {
      create: ({ data: [data] }) => {
        const temp = data;
        const { wants } = temp;
        const wantsData = wants.join(',');
        temp.wants = wantsData;

        return ({
          url: '/iam/choerodon/v1/registers_invitation/single_invitation',
          method: 'post',
          // params: pick(data, 'userName', 'userPhone', 'userEmail', 'orgName', 'orgHomePage', 'orgBusiness', 'wants'),
          data: temp,
        });
      },
    },

  });
}

export default InvitationModalDataSet;
