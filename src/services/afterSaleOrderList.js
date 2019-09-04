import { stringify } from 'qs';
import request from '../utils/request';

export async function reqAfterSaleOrderListConfig() {
  return request('/sale/back-order/config');
}

export async function reqAfterSaleOrderList(params) {
  return request(`/sale/back-order/list?${stringify({
    ...params,
    // startDate: params.date[0],
    // endDate: params.date[1],
  })}`);
}

// /afterSaleOrderList/export-all-list
// /afterSaleOrderList/export-selected-list
