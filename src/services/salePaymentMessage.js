
import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetSalePaymentDetail(params = {}) {
  return request(`/sale/sales-credit-check-bill/detail?${stringify(params)}`);
}
export async function reqAddReceipt(params) {
  return request('/sale/credit-check-pay-record/add-receive-proof', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqBusinessOwner(params = {}) {
  return request(`/customer/customer/config?${stringify(params)}`);
}
