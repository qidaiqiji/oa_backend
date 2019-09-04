import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig() {
  return request('/seller/agent/config');
}
export async function reqInfo(params) {
  return request(`/seller/agent/detail?${stringify(params)}`);
}


export async function reqSubmit(params) {
  return request('/seller/agent/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqEdit(params) {
  return request('/seller/agent/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

