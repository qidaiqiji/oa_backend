import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetConfig() {
  return request('/sale/refund/get-config');
}
export async function reqGetAfterSaleOrderDetail(params) {
  return request(`/sale/back-order/info?${stringify({ backOrderId: params.id || params.backOrderId })}`);
}

export async function reqBossOpera(params) {
  return request(`/sale/back-order/manage-check?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqFinanceOpera(params) {
  return request(`/sale/back-order/finance-check?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqDepotOpera(params) {
  return request(`/sale/back-order/depot-check?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqAddRefundRecord(params) {
  return request('/sale/refund/add', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}

export async function reqDeleteOrder(params) {
  return request(`/sale/back-order/delete?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqCancelOrder(params) {
  return request(`/sale/back-order/cancel?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqDeleteStream(params) {
  return request(`/sale/refund/delete?${stringify(params)}`);
}

export async function reqCancelStream(params) {
  return request(`/sale/refund/cancel?${stringify(params)}`);
}

export async function reqAction(url, params) {
  return request(`${url}?${stringify({
    ...params
  })}`);
}
