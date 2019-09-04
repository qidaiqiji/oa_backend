import { stringify } from 'qs';
import request from '../utils/request';

export async function reqPurchaseSuggests(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

