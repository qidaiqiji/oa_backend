import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetList(params) {
  return request(`/depot/goods-depot/stock-change-record-list?${stringify(params)}`);
}

export async function reqGetConfig(params) {
    return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqUnlockStock(params) {
  return request('/sale/goods/unlock-stock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqAddNewStock(params) {
  return request('/sale/goods/add-occupy-stock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
