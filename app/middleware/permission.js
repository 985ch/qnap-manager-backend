/**
* 用户身份验证中间件
* @description options={
    needLogin:true, //是否需要登录，若为真，则在用户无法提供有效guid时返回一个错误
    vipChecker:null, //vip验证模块，不同的模块类型可以支持不同的额外参数，为null时不验证VIP；详情可参见service目录下对应的vip验证模块
    needVip:false, //该参数依赖于vipChecker参数，若为真，则在用户无法通过VIP验证时返回一个错误
}
*/
'use strict';
const _ = require('lodash');

module.exports = options => {
  return async function(ctx, next) {
    await next();
  };
};
