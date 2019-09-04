import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInInvFollowList(params) {
  return request(`/purchase/in-inv-follow/list?${stringify(params)}`);
}

export async function reqInvoiceBillConfig(params) {
  return request(`/finance/invoice-bill/config?${stringify(params)}`);
}
export async function reqPurchaseSupplierInfoList(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
export async function reqInvoiceShippingNo(params) {
  return request('/purchase/in-inv-follow/update-shipping-no', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvoicePurchaseRemark(params) {
  return request('/purchase/in-inv-follow/update-purchase-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqInvoiceRemark(params) {
  return request('/purchase/in-inv-follow/update-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}