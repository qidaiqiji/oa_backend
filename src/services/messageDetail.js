import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInfo(params) {
    return request(`/info/info/detail?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/info/info/config?${stringify(params)}`);
}

export async function reqExecute(url,params) {
  // return request('/info/info/done-task', {
  //   method: 'POST',
  //   body: {
  //       ...params,
  //   },
  // });
  return request(url, {
      method: 'POST',
      body: {
          ...params,
      },
    });
}
export async function reqComment(params) {
  return request('/info/info/create-comment', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}

