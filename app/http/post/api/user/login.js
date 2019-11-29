/**
 *登陆账号
 *@param {string} name 用户名
 *@param {string} password 密码
*/
'use strict';

module.exports = () => {
  return {
    params: {
      username: 'string',
      password: 'string',
    },
    async controller() {
      const { username, password } = this.state.params;
      const userdata = await this.service.user.data.login(username, password);
      this.success(userdata);
    },
  };
};
