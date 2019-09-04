import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetConfig(params) {
  return request(`/sale/funds-detail/get-config?${stringify(params)}`);
}

export async function reqGetCustomerInfo(params) {
  return request(`/sale/funds-detail/get-customer-info?${stringify(params)}`);
}

export async function reqGetFinanceDetail(params) {
  return request(`/sale/funds-detail/get-finance-detail?${stringify(params)}`);
}

export async function reqAddReceivedRecord(params) {
  return request('/sale/funds-detail/add-received-record', {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        amount: params.amount,
        receivableAccount: params.receivableAccount,
        remark: params.remark,
      },
    },
  });
}

export async function reqAddPayRecord(params) {
  return request('/sale/funds-detail/add-pay-record', {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        amount: params.amount,
        receivableAccount: params.receivableAccount,
        remark: params.remark,
      },
    },
  });
}
