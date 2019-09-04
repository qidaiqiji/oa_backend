import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig() {
  return request('/customer/customer/config');
}

export async function reqCustomerList(params) {
  return request(`/customer/customer/list?${stringify(params)}`);
}

export async function reqMsg(params) {
  return request('/customer/customer/send-customer-message', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}