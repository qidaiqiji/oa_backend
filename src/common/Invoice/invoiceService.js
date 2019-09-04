import { stringify } from 'qs';
import request from '../../utils/request';

export async function reqInvoiceConfig() {
  return request('/finance/invoice-bill/config');
}
export async function reqInvoiceList(params) {
  return request(`/finance/invoice-item/list?${stringify(params)}`);
}
export async function reqInvoiceStockList(params) {
  return request(`/finance/invoice-item/storage-list?${stringify(params)}`);
}
export async function reqInvGoodsNameList(params) {
  return request(`/finance/invoice-item/invoice-goods-list?${stringify(params)}`);
}
export async function reqAwaitInvoiceList(params) {
  return request(`/sale/out-inv-follow/list?${stringify(params)}`);
}
export async function reqAwaitInvoiceDetail(params) {
  return request(`/sale/out-inv-follow/detail?${stringify(params)}`);
}
export async function createInvoiceDetail(params) {
  return request('/finance/invoice-bill/create-detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function createInvoiceGoodsName(params) {
  return request('/finance/inv-goods/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updateInvoiceInfo(params) {
  return request('/finance/invoice-bill/update-outcome-inv-info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function invoiceOutStorage(params) {
  return request('/finance/invoice-bill/out-storage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
