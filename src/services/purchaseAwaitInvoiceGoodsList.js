import { stringify } from 'qs';
import request from '../utils/request';

export async function reqAwaitInvoiceGoodsList(params) {
  return request(`/purchase/purchase-goods/await-inv-list?${stringify(params)}`);
}
export async function reqInvoiceBillConfig(params) {
  return request(`/finance/invoice-bill/config?${stringify(params)}`);
}
export async function reqPurchaseSupplierInfoList(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}
export async function reqMaskList(params) {
  return request('/purchase/in-inv-follow/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
} 
