import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetConfig() {
  return request('/sale/order-group/get-status-map');
}
export async function reqGetOrderDetail(params) {
  return request(`/sale/order-group/info?${stringify(params)}`);
}
export async function reqObsoleteCollection(params) {
  return request('/finance/financial-common/cancel-sales-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqDeleteCollection(params) {
  return request('/finance/financial-common/delete-sales-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqCancelReject(params) {
  return request('/sale/order-info/change-reject-status', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqObsoleteTotalOrder(params) {
  return request(`/sale/order-group/cancel?${stringify({
    ...params,
  })}`);
}
export async function reqDeleteTotalOrder(params) {
  return request(`/sale/order-group/delete?${stringify({
    ...params,
  })}`);
}
export async function reqFinanceRejectTotalOrder(params) {
  return request(`/sale/order-group/finance-check?${stringify({
    ...params,
    pass: 0,
  })}`);
}
export async function reqFinanceCheckTotalOrder(params) {
  return request(`/sale/order-group/finance-check?${stringify({
    ...params,
    pass: 1,
  })}`);
}
export async function reqBossRejectTotalOrder(params) {
  return request(`/sale/order-group/manager-check?${stringify({
    ...params,
    pass: 0,
  })}`);
}
export async function reqBossCheckTotalOrder(params) {
  return request(`/sale/order-group/manager-check?${stringify({
    ...params,
    pass: 1,
  })}`);
}

export async function reqGenBalanceBillCollection(params) {
  return request('/finance/sales-balance-bill/insert-from-order-group', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqGenCashBillCollection(params) {
  return request('/finance/sales-cash-bill/insert-from-order-group', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqGenCreditBillCollection(params) {
  return request('/finance/sales-credit-bill/insert-from-order-group', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqChangeLogistics(params) {
  return request('/sale/order-info/change-shipping', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqEditSubOrderRemark(params) {
  return request('/sale/order-info/update-order-info-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqDelay(params) {
  return request('/sale/order-info/delay-shipping', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqCancelDelay(params) {
  return request('/sale/order-info/cancel-delay-shipping', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

