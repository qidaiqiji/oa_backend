import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';
export async function reqList(params) {
  return request(`/purchase/purchase-supplier-info/check-list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
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


