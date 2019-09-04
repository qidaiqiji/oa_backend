import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGoodsList(params) {
    return request(`/finance/invoice-bill/invoice-info?${stringify(params)}`);
}
export async function addNewOrder(params) {
  return request('/finance/invoice-bill/back-add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqGetList(params) {
  return request(`/finance/invoice-bill/back-detail?${stringify(params)}`);
}
export async function handleDelete(params) {
  return request(`/finance/invoice-bill/back-delete?${stringify(params)}`);
}
export async function confirmNewOrder(params) {
  return request('/finance/invoice-bill/confirm-back-invoice-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
