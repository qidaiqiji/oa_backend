import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/sale/goods/man-made-occupy-list?${stringify(params)}`);
}

export async function reqSave(params) {
  return request(`/sale/goods/man-made-occupy-list?${stringify(params)}`);
}

export async function reqGenOutStoreOrder(params) {
  return request('/depot/sales-export-depot-order/create-from-order-info-list', {
    method: 'POST',
    body: params,
  });
}

export async function reqRelease(params) {
  return request('/sale/goods/unlock-stock', {
    method: 'POST',
    body: params,
  });
}
export async function reqSearch(params) {
  return request('/customer/customer/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
