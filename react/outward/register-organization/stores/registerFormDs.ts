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
      maxLength: 120,
      validator: (value:string) => {
        if (!/^[（）_()-—\.\w\s\u4e00-\u9fa5]{1,32}$/.test(value)) {
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
      validator: (value:string) => {
        const regex = /^1[3|4|5|7|8|9][0-9]{9}$/;
        if (!regex.test(value)) {
          return '请输入正确格式的手机号';
        }
        return true;
      },
    },
    {
      name: 'captcha',
      label: '验证码',
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
