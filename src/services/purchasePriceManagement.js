import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';


  export async function reqList(params) {
    return request(`/purchase/purchase-supplier-goods/price-manage-list?${stringify(params)}`);
  }
  export async function reqUpdatePurchaser(params) {
    return request('/purchase/purchase-supplier-goods/assign-purchaser', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  export async function reqSupplierSuggest(params) {
    return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
  }

  export async function reqConfig(params) {
    return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
  }
