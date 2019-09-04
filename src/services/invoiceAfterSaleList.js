import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
    return request(`/finance/invoice-bill/back-list?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/finance/invoice-bill/config?${stringify(params)}`);
}

// /afterSaleOrderList/export-all-list
// /afterSaleOrderList/export-selected-list
