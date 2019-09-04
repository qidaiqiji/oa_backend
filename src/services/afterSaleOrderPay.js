import { stringify } from 'qs';
import request from '../utils/request';

export async function reqOrderList(params) {
  return request(`/sale/back-order/financial-list?${stringify({
    ...params,
    // orderType: -1,
  })}`);
}

export async function reqConfig() {
  return request('/sale/back-order/config');
}

export async function reqCheck(params) {
  return request('/sale/back-order/return-inv-stock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
