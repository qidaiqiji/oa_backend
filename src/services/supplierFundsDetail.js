import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetConfig(params) {
  return request(`/finance/supplier-fund/get-config?${stringify(params)}`);
}

export async function reqGetSupplierInfo(params) {
  return request(`/finance/supplier-fund/get-supplier-info?${stringify(params)}`);
}

export async function reqGetFinanceDetail(params) {
  return request(`/finance/supplier-fund/get-finance-detail?${stringify(params)}`);
}

export async function reqAddReceivedRecord(params) {
  return request('/finance/supplier-fund/add-received-record', {
    method: 'POST',
    body: {
      data: {
        supplierId: params.supplierId,
        amount: params.amount,
        receivableAccount: params.receivableAccount,
        remark: params.remark,
      },
    },
  });
}

export async function reqAddPayRecord(params) {
  return request('/finance/supplier-fund/add-pay-record', {
    method: 'POST',
    body: {
      data: {
        supplierId: params.supplierId,
        amount: params.amount,
        receivableAccount: params.receivableAccount,
        remark: params.remark,
      },
    },
  });
}
