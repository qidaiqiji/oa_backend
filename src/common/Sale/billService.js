import { stringify } from 'qs';
import request from '../../utils/request';

export async function reqCustomerDetail(params) {
  return request(`/customer/customer/detail?${stringify(params)}`);
}
export async function reqPaymentList(params) {
  return request(`/sale/credit/credit-payment-list?${stringify(params)}`);
}
export async function reqCreditCheckBill(params) {
  return request(`/sale/sales-credit-check-bill/list?${stringify(params)}`);
}
export async function reqSalePaymentDetail(params) {
  return request(`/sale/sales-credit-check-bill/detail?${stringify(params)}`);
}
export async function reqSaleStatusMap() {
  return request('/sale/order-group/get-status-map');
}
export async function changeGoodsCount(params) {
  return request('/sale/credit/amount-info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addReceiveRecord(params) {
  return request('/sale/credit-check-pay-record/add-pay-proof', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function createBill(params) {
  return request('/sale/credit/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addRemark(params) {
  return request('/sale/sales-credit-check-bill/modify-note', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function deletePayRecord(params) {
  return request('/sale/credit-check-pay-record/delete-pay-proof', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
