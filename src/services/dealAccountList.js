import { stringify } from 'qs';
import request from '../utils/request';

  export async function reqWaitList(params) {
    return request(`/purchase/purchase-supplier-info/credit-order-list?${stringify(params)}`);
  }
 
  export async function selectList(params) {
    return request('/purchase/purchase-order/config');
  }
  export async function pushList(params) {
    return request('/finance/purchase-outcome-application/create-credit-bill', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  export async function reqSearch(params) {
    return request('/purchase/purchase-goods/get-sales-total-num', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }