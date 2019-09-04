import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetSupplierInfo(params) {
  return request(`/purchase/purchase-supplier-info/info?${stringify(params)}`);
}

export async function reqAddSupplier(params) {
  return request('/purchase/purchase-supplier-info/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqEditSupplier(params) {
  return request('/purchase/purchase-supplier-info/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
