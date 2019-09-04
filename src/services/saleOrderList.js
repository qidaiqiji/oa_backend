import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetOrderList(params) {
  return request(`/sale/order-group/list?${stringify(params)}`);
}

export async function reqGetConfig() {
  return request('/sale/order-group/get-status-map');
}
export async function reqCombin() {
  return request('/depot/sales-export-depot-order/batch-create-order');
}

export async function reqCancel(params) {
  return request(`/depot/sales-export-depot-order/cancel-to-client-order?${stringify(params)}`);
}
  