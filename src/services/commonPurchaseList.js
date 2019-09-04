import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/purchase/purchase-order/list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}

export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
export async function reqGetConfig(params) {
  return request(`/sale/user/purchaser-list?${stringify(params)}`);
}

export async function reqDeleteOrder(params) {
  return request('/purchase/purchase-order/cancel', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
export async function reqCheckOrder(params) {
  return request('/purchase/purchase-order/verify', {
    method: 'POST',
    body: {
      data: {
        id: params.id,
        status: 3,
      },
    },
  });
}

export async function reqApplyMoney(params) {
  return request('/purchase/purchase-order/merge-pay', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqRejectOrder(params) {
  return request('/purchase/purchase-order/verify', {
    method: 'POST',
    body: {
      data: {
        id: params.id,
        status: 11,
      },
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
