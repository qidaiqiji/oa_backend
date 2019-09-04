import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetSalePaymentList(params) {
  return request(`/sale/sales-credit-check-bill/list?${stringify(params)}`);
}
