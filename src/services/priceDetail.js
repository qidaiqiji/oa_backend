import { stringify } from 'qs';
import request from '../utils/request';


export async function reqList(params) {
  return request(`/purchase/purchase-supplier-goods/detail?${stringify(params)}`);
}

export async function reqGetSuppliers() {
  return request('/purchase/purchase-supplier-info/list?size=999');
}

export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}