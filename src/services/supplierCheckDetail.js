import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetSupplierInfo(params) {
  return request(`/purchase/purchase-supplier-info/info?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}

export async function reqRecord(params) {
  return request(`/purchase/purchase-supplier-info/change-record-list?${stringify(params)}`);
}

export async function reqOperation(actionUrl,params) {
  return request(`${actionUrl}&${stringify(params)}`);
}

export async function reqBrnadInfo(params) {
  return request(`/purchase/purchase-supplier-goods/change-goods-record-list?${stringify(params)}`);
}

export async function reqGoodsSn(params) {
  return request(`/purchase/purchase-supplier-goods/get-supplier-goods-by-brand?${stringify(params)}`);
}




