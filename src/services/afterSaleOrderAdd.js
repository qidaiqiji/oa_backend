import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetConfig(params) {
  return request(`/sale/back-order/config?${stringify(params)}`);
}

export async function reqGetOrderList(params) {
  return request(`/sale/order-group/suggest-by-group-sn?${stringify(params)}`);
}

export async function reqGetGoodsList(params) {
  console.log("params",params)
  return request(`/sale/order-group/goods-list?${stringify(params)}`);
}

export async function reqGetRefundInfo(params) {
  return request(`/sale/user/refund-info?${stringify(params)}`);
}

export async function reqSaveList(params) {
  return request('/sale/back-order/create-by-user', {
    method: 'POST',
    body: {
      data: {
        ...params
      },
    },
  });
}

export async function reqGetUpdateOrderList(params) {
  return request(`/sale/back-order/detail?${stringify(params)}`);
}

export async function reqSaveUpdateList(params) {
  return request('/sale/back-order/update-by-user', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
