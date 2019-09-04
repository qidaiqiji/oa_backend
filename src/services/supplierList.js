import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetSupplierSuggests(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqGetSuppliers(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqStartupSupplier(params) {
  return request('/purchase/purchase-supplier-info/enable', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqForbiddenSupplier(params) {
  return request('/purchase/purchase-supplier-info/disable', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
