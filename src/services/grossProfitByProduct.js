import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';
export async function reqGetConfig() {
  return request('/finance/profit-manage/config');
}
export async function reqGetList(params) {
  return request(`/finance/profit-manage/order-goods-list?${stringify(params)}`);
}

