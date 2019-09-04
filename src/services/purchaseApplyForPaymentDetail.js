import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request('/finance/purchase-outcome-application/config');
}

export async function reqGetOrderDetail(params) {
  return request(`/finance/purchase-outcome-application/detail?${stringify(params)}`);
}

export async function reqGenCashBillCollection(params) {
  return request('/finance/purchase-outcome-application/pay', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqDelete(params) {
  return request('/finance/financial-common/delete-purchase-outcome-application-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


// 订单操作(审核等)
export async function reqStartupOrderAction(params) {
  return request(`${params.url}?${stringify({ id: params.id, remark: params.remark })}`);
}

export async function reqGetSupplierInfo(params) {
  return request(`/finance/supplier-fund/get-supplier-info?${stringify(params)}`);
}

