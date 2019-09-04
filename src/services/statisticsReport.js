import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}

export async function reqGetConfig(params) {
  return request(`/finance/profit-manage/config?${stringify(params)}`);
}