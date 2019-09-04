import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInfo(params) {
  return request(`/employee/employee/detail?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/employee/employee/config?${stringify(params)}`);
}

export async function reqPosition(params) {
  return request(`/employee/employee/get-position?${stringify(params)}`);
}


export async function reqCommit(params) {
  return request('/employee/employee/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
