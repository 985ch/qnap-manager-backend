/**
 *登陆账号
 *@param {string} name 用户名
 *@param {string} password 密码
*/
'use strict';

module.exports = () => {
  return {
    params: {
      name: 'string',
      password: 'string',
    },
    async controller() {
      const { name, password } = this.state.params;

      const userdata = await this.service.users.login(name, password);
      this.success(userdata);
    },
  };
};
