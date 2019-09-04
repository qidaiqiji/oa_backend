import { stringify } from 'qs';
import request from '../utils/request';

// 获取配置项
export async function reqConfig() {
  return request('/purchase/purchase-back-order/config');
}

// 获取订单列表
export async function reqOrderList(params) {
  return request(`/purchase/purchase-back-order/list?${stringify(params)}`);
}

