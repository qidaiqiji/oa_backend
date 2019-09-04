import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderList(params) {
  return request(`/sale/order-group/list?${stringify(params)}`);
}
export async function reqGenOrder(params) {
  return request('path-to-API', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
