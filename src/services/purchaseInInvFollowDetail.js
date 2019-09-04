import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInInvFollowDetail(params) {
  return request(`/purchase/in-inv-follow/detail?${stringify(params)}`);
}

export async function reqInvBillCreate(params) {
  return request('/finance/invoice-bill/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvBillUpdate(params) {
  return request('/finance/invoice-bill/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvBillDelete(params) {
  return request('/finance/invoice-bill/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdateShippingNo(params) {
  return request('/purchase/in-inv-follow/update-shipping-no', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdatePurchaseRemark(params) {
  return request('/purchase/in-inv-follow/update-purchase-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdateSuitDetail(params) {
  return request('/purchase/in-inv-follow/update-suit-detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}  
export async function reqInInvFollowUpdateRemark(params) {
  return request('/purchase/in-inv-follow/update-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqAction(url, params) {
  return request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}