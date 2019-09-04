import { stringify } from 'qs';
import request from '../utils/request';

  export async function reqPurList(params) {
    return request(`/purchase/purchase-supplier-info/credit-supplier-list?${stringify(params)}`);
  }
  export async function selectList(params) {
    return request('/purchase/purchase-order/config', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }