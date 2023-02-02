import Api from './Api';

class RegisterOrganization extends Api<RegisterOrganization> {
  get prefix() {
    return '/cbase/choerodon/v1';
  }

  getCaptcha= (phone:string) => this.request({
    method: 'get',
    url: `${this.prefix}/captcha/send-phone-captcha`,
    params: {
      phone,
    },
  })

  registeSubmit = (data:any) => this.request({
    method: 'post',
    url: `${this.prefix}/new_registers`,
    data,
  })

  compeleteSubmit = (data:any) => this.request({
    method: 'post',
    url: `${this.prefix}/registers/complete`,
    data,
  })
}

const registerOrganizationApi = new RegisterOrganization();
const registerOrganizationApiConifg = new RegisterOrganization(true);
export { registerOrganizationApi, registerOrganizationApiConifg };
