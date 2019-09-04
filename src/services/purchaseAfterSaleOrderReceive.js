import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig() {
  return request('/purchase/purchase-back-order/config');
}
export async function reqCheck(params) {
  return request('/purchase/purchase-back-order/reduce-inv-stock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
} 

export async function reqGetOrderList(params) {
  return request(`/purchase/purchase-back-order/list?${stringify({...params,})}`);
}

export async function reqGetSupplierSuggests(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
