import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetList(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
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
  return request('/sale/goods/lock-stock', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
export async function reqSearch(params) {
  return request('/customer/customer/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
