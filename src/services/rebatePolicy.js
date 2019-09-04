import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/purchase/purchase-supplier-goods/brand-policy-list?${stringify(params)}`);
}

export async function reqGetConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}


export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}