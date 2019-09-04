import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetsellerDetail(params) {
  return request(`/seller/seller/detail?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/customer/customer/config?${stringify(params)}`);
}

export async function reqGetCustomerList(params) {
  return request(`/customer/customer/list?${stringify(params)}`);
}
export async function reqGetSellerData(params) {
  return request(`/seller/seller/data?${stringify(params)}`);
}

export async function reqAction(url, params) {
  return request(`${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
