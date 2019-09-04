import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetCustomerConfig() {
  return request('/customer/customer/config');
}
export async function reqGetCustomerInfo(params) {
  return request(`/customer/customer/detail?${stringify(params)}`);
}
export async function reqChangeDefault(params) {
  return request(`/customer/customer/default-manager?${stringify(params)}`);
}
export async function reqCreateUser(params) {
  return request('/customer/customer/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqEditUser(params) {
  console.log(params);
  return request('/customer/customer/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqCreateSystem(params) {
  console.log(params);
  return request('/customer/customer-system/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqGetSystemList(params) {
  console.log(params);

}

export async function reqCreateCondition(params) {
  console.log(params);
  return request('/sale/credit/credit-type-create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqAccounttermcondition(params) {
  console.log(params);
  return request('accounttermcondition', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

