import { stringify } from 'qs';
import request from '../utils/request';

  export async function reqList(params) {
    return request(`/purchase/purchase-order/purchase-shipping-list?${stringify(params)}`);
  }
  export async function reqConfig(params) {
    return request(`/purchase/purchase-order/config?${stringify(params)}`);
  }
 
  export async function reqApply(params) {
    return request('/purchase/purchase-shipping-fee/add', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  export async function reqChangeAmount(params) {
    return request('/purchase/purchase-shipping/get-belong-fee', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  export async function reqAddNew(params) {
    return request('/purchase/purchase-order-shipping-info/add-shipping-info', {
      method: 'POST',
      body: params.formData
    });
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

  export async function reqUpload(params) {
    return request('/purchase/purchase-order-shipping-info/add', {
      method: 'POST',
      body: params.formData
    });
  }
  export async function reqEdit(params) {
    return request('/purchase/purchase-order-shipping-info/edit', {
      method: 'POST',
      body: params.formData
    });
  }
  export async function reqSupplierSuggest(params) {
    return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
  }

  export async function reqDelete(params) {
    return request('/purchase/purchase-order-shipping-info/delete',{
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  export async function reqDeleteImg(params) {
    return request('/purchase/purchase-order-shipping-info/delete-shipping-img',{
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  export async function reqChangeRemark(params) {
    return request('/purchase/purchase-order/add-follow-remark',{
      method: 'POST',
      body: {
        ...params,
      },
    });
  }