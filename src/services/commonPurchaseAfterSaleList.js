import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig() {
  return request('/sale/back-order/config');
}

export async function reqList(params) {
  return request(`/sale/back-order/list?${stringify({
    ...params,
  })}`);
}

export async function reqAssignPurchaser(params) {
  return request('/sale/back-order/assign-purchaser', {
    method: 'POST',
    body: {
        ...params,
    },
  });
}

