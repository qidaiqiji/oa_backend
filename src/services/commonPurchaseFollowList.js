import { stringify } from 'qs';
import request from '../utils/request';

export async function reqCommonList(params) {
  return request(`/purchase/purchase-order/purchase-follow-list?${stringify(params)}`)
}
export async function reqPurchaseList(params) {
  return request(`/purchase/purchase-order/daifa-follow-list?${stringify(params)}`)
}
export async function reqConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`)
}
export async function addLogisInfo(params) {
  return request('/purchase/purchase-shipping/add', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function reqDeleteInfo(params) {
  return request('/purchase/purchase-shipping/delete', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function reqAllSign(params) {
  return request('/purchase/purchase-shipping/sign-all-shipping', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function changeSign(params) {
  return request('/purchase/purchase-shipping/sign-shipping', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function reqCancelSign(params) {
  return request('/purchase/purchase-shipping/cancel-sign-shipping', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function editLogisInfo(params) {
  return request('/purchase/purchase-shipping/edit', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}
export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
export async function editRemark(params) {
  return request('/purchase/purchase-goods/add-remark', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}


