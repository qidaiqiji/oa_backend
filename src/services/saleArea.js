import { stringify } from 'qs';
import request from '../utils/request';

export async function reqArea() {
  return request('/sale/area/detail');
}
export async function reqConfig() {
  return request('/sale/area/config');
}
export async function reqEdit(params) {
  return request('/sale/area/bind', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

