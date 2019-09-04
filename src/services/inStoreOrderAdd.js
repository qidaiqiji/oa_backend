import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/depot/purchase-import-depot-order/config?${stringify(params)}`);
}

export async function reqGetGoods(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}

export async function reqSaveOrder(params) {
  return request('/depot/purchase-import-depot-order/create-by-user', {
    method: 'POST',
    body: {
     ...params
    },
  });
}
