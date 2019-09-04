import { stringify } from 'qs';
import request from '../utils/request';

  export async function reqList(params) {
    return request(`/purchase/purchase-shipping-fee/list?${stringify(params)}`);
  }
  export async function reqConfig(params) {
    return request(`/purchase/purchase-shipping-fee/config?${stringify(params)}`);
  }
 
 
  export async function reqPurchaseOrder(params) {
    // return request('/purchase/purchase-order/config', {
    //   method: 'POST',
    //   body: {
    //     ...params,
    //   },
    // });
  }
  export async function pushList(params) {
    return request('/finance/purchase-outcome-application/create-credit-bill', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  export async function reqSupplierSuggest(params) {
    return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
  }