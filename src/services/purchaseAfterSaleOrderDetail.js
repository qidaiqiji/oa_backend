import { stringify } from 'qs';
import request from '../utils/request';

// 获取订单详情
export async function reqOrderInfo(params) {
  return request(`/purchase/purchase-back-order/detail?${stringify(params)}`);
}

// 获取配置项
export async function reqConfig() {
  return request('/sale/order-group/get-status-map');
}

// 订单操作(审核等)
export async function reqStartupOrderAction(id, url, remark) {
  return request(`${url}?${stringify({
    id,
    remark,
  })}`);
}

// 添加支付流水
export async function reqAddRefund(params) {
  return request('/finance/purchase-cash-bill/insert', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function requestDelete(params) {
  return request('/finance/financial-common/delete-purchase-bill', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
