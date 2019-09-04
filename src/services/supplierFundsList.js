import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetTotalSupplierFunds(params) {
  return request(`/finance/supplier-fund/get-all-account-finance?${stringify(params)}`);
}
export async function reqGetConfig(params) {
  return request(`/sale/back-order/config?${stringify(params)}`);
}

export async function reqGetSupplierList(params) {
  return request(`/finance/supplier-fund/get-supplier-finance-list?${stringify(params)}`);
}

export async function reqGetAccountFinanceList(params) {
  return request(`/finance/supplier-fund/get-account-finance-list?${stringify(params)}`);
}

export async function reqEditRemark(params) {
  return request('/finance/supplier-fund/add-supplier-remark', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
