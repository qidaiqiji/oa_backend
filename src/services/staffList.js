import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/employee/employee/list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/employee/employee/config?${stringify(params)}`);
}

export async function reqSearchByPhone(params) {
  return request(`/employee/employee/get-name-by-phone?${stringify(params)}`);
}

export async function reqPosition(params) {
  return request(`/employee/employee/get-position?${stringify(params)}`);
}


export async function reqCommit(params) {
  return request('/employee/employee/add', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}

