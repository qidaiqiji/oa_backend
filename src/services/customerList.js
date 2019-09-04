import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetCustomerListConfig() {
  return request('/customer/customer/config');
}

export async function reqInviterMap(params) {
  return request('/customer/customer/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqBind(params) {
  return request('/customer/customer/batch-modify-manager', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqGetCustomerList(params) {
  return request(`/customer/customer/list?${stringify(params)}`);
}

export async function checkType(params) {
  return request(`/customer/customer/check-batch-modify?${stringify(params)}`);
}

export async function newServiceRecord(params) {
  return request('/seller/seller-duty-log/add-log', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqCustomerDetail(params) {
  return request(`/customer/customer/detail?${stringify(params)}`);
}
export async function createServiceTypeReq(params) {
  return request('/seller/seller-duty-log/add-log-type', {
    method: 'POST',
    body: {
      ...params
    },
  });
}