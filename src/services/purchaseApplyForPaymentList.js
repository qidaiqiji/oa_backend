import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderList(params) {
  return request(`/finance/purchase-outcome-application/list?${stringify(params)}`);
}

export async function reqGetConfig() {
  return request('/finance/purchase-outcome-application/config');
}
