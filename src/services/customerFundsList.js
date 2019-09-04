import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetTotalCustomerFunds(params) {
  return request(`/finance/sales-credit-bill/get-all-account-finance?${stringify(params)}`);
}

export async function reqGetCustomerList(params) {
  return request(`/sale/user/list?${stringify(params)}`);
}

export async function reqGetAccountFinanceList(params) {
  return request(`/finance/sales-credit-bill/get-account-finance-list?${stringify(params)}`);
}
