import request from '../utils/request';
import { stringify } from 'qs';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}



// 正常登陆
export async function reqLogin(params) {
  return request('/erp-site/login', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}

export async function reqLogout() {
  return request('/api/user/logout');
}
// 自动登陆
export async function reqAuth() {
  return request('/erp-site/check-token', {
    method: 'POST',
    // headers: {
    //   authorization: '',
    // },
    body: {
      data: {
        access_token: localStorage.getItem('token'),
      },
    },
  });
}
