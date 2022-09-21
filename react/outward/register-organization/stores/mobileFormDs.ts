import { DataSet } from 'choerodon-ui/pro';
import provincesArr from '../assets/provinces';

export default ({ }: {}): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'userName',
      label: '姓名',
      required: true,
    },
    {
      name: 'orgName',
      label: '公司名称',
      required: true,
      maxLength: 150,
      validator: (value:string) => {
        if (!/^[A-Za-z0-9\u4e00-\u9fa5_\-\.——\(\)\（） ]+$/.test(value)) {
          return '公司名称由汉字、字母、数字、"_"、"."、"-"、"——"、空格、中英文括号组成';
        }
        return true;
      },
    },
    {
      name: 'userEmail',
      label: '公司邮箱',
      required: true,
      type: 'email',
    },
    {
      name: 'orgProvince',
      label: '所在省份',
      required: true,
      options: new DataSet({
        pageSize: 1000,
        data: provincesArr,
      }),
    },
    {
      name: 'userPhone',
      label: '手机',
      required: true,
      maxLength: 11,
      pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    },
    {
      name: 'captcha',
      label: '验证码',
      placeholder: '请输入验证码',
      required: true,
    },
    {
      name: 'captchaKey',
    },
    {
      name: 'isAgree',
      ignore: 'always',
      type: 'boolean',
      required: true,
    },
  ],
});
