import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/content/default/config?${stringify(params)}`);
}

export async function reqGetList(params) {
  console.log('666');
  return request(`/content/found-article/index?${stringify(params)}`);
}
export async function reqAction(url) {
  return request(`/${url}`);
}

export async function reqRejectList(params) {
  return request('/sale/order-info/reject-await-make-order', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


