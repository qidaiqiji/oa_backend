import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig() {
  return request('/purchase/purchase-back-order/config');
}
export async function reqPurchaseOrderSuggests(params) {
  return request(`/purchaseAfterSaleOrderEdit/purchase-order-suggest?${stringify(params)}`);
}

export async function reqPurchaseOrderInfo(params) {
  return request(`/purchase/purchase-order/purchase-goods-list?${stringify(params)}`);
}

export async function reqAddPurchaseAfterSaleOrder(params) {
  return request('/purchase/purchase-back-order/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
