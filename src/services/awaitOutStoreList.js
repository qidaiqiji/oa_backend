import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderInfo(params) {
  return request(`/sale/order-info/await-export-depot-order-list?${stringify(params)}`);
}

export async function reqGenOutStoreOrder(params) {
  return request('/depot/sales-export-depot-order/create-from-order-info-list', {
    method: 'POST',
    body: params,
  });
}
export async function reqGetConfig() {
  return request('/sale/order-group/get-status-map');
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
export async function reqCancelDelay(params) {
  return request('/sale/order-info/cancel-delay-shipping', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
