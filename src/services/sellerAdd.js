import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetCustomerListConfig() {
  return request('/customer/customer/config');
}

export async function reqSaveSellerInfo(params) {
  return request('/seller/seller/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqGetsellerDetail(params) {
  return request(`/seller/seller/detail?${stringify(params)}`);
}
