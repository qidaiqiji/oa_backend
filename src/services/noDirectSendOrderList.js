import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderInfo(params) {
  return request(`/sale/order-info/daifa-list?${stringify(params)}`);
}

export async function reqPostRemark(params) {
  return request('/sale/order-info/update-order-goods-remark', {
    method: 'POST',
    body: params,
  });
}

export async function reqPostOrderRemark(params) {
  return request('/sale/order-info/update-order-info-remark', {
    method: 'POST',
    body: params,
  });
}
