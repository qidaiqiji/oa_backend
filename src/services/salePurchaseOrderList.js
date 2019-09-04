import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}

export async function reqGetPurchaserConfig(params) {
  return request(`/sale/user/purchaser-list?${stringify(params)}`);
}

export async function reqGetOrderList(params) {
  return request(`/purchase/purchase-order/list?${stringify(params)}`);
}

export async function reqGetSupplierList(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqMergePayment(params) {
  return request('/purchase/purchase-order/merge-pay', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqOkEditRemarkModal(params) {
  return request('/purchase/purchase-order/update-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

