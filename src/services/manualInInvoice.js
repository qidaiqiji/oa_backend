import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInGoodsList(params) {
    return request(`/finance/inv-goods-name/list?${stringify(params)}`);
}
export async function reqGoodsList(params) {
  return request(`/finance/invoice-item/invoice-goods-list?${stringify(params)}`);
}
export async function reqGoodsDetail(params) {
  return request(`/finance/invoice-bill/detail?${stringify(params)}`);
}
export async function handleDelete(params) {
  return request('/finance/invoice-bill/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addOutInvoiceBill(params) {
  return request('/finance/invoice-bill/add-out-invoice-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addInInvoiceBill(params) {
  return request('/finance/invoice-bill/add-in-invoice-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function confirmInInvoiceBill(params) {
  return request('/finance/invoice-bill/confirm-in-invoice-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function confirmOutInvoiceBill(params) {
  return request('/finance/invoice-bill/confirm-invoice', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


// /afterSaleOrderList/export-all-list
// /afterSaleOrderList/export-selected-list
