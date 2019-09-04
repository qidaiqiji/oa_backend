import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetCustomerListConfig() {
  return request('/customer/customer/config');
}
export async function reqGetMingpian(params) {
  return request(`/seller/seller/create-seller-card?${stringify(params)}`);
}
export async function reqGetSellerList(params) {
  return request('/seller/seller/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
