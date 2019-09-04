import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/purchase/purchase-order/receive-order-list?${stringify(params)}`);
}
export async function reqProList(params) {
  return request(`/sale/goods/stock-goods-info?${stringify(params)}`);
}
export async function reqAmount(params) {
  return request(`/depot/goods-depot/total-goods-amount?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/sale/goods/config?${stringify(params)}`);
}

export async function reqBrandList(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}

