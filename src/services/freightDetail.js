import { stringify } from 'qs';
import request from '../utils/request';

  export async function reqInfo(params) {
    return request(`/purchase/purchase-shipping-fee/detail?${stringify(params)}`);
  }
  export async function reqConfig(params) {
    return request(`/purchase/purchase-shipping-fee/config?${stringify(params)}`);
  }
  export async function reqAction(url,params) {
    return request(`${url}&${stringify(params)}`);
  }
  export async function reqCommit(params) {
    return request('/purchase/purchase-shipping-fee/add-pay-proof', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  export async function reqDelete(params) {
    return request('/purchase/purchase-shipping-fee/delete-pay-proof', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  
 
 