import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetSupplierInfo(params) {
  return request(`/purchase/purchase-supplier-info/info?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
}

export async function reqAddSupplier(params) {
  return request('/purchase/purchase-supplier-info/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqEditSupplier(params) {
  return request('/purchase/purchase-supplier-info/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addBrandInfo(params) {
  return request('/purchase/purchase-supplier-brand/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function deleteBrandInfo(params) {
  return request('/purchase/purchase-supplier-brand/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addPaymentMethods(params) {
  return request('/purchase/purchase-supplier-goods/add-pay-type', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqGetGoods(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}
export async function reqUpdateSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/edit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function reqAddSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/add', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function reqEditSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-brand/edit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function reqDeleteSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/delete-by-user', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function reqUpload(params) {
  return request('/purchase/purchase-supplier-info/update-contract-file', {
    method: 'POST',
    body: params.formData,
  });
}

export async function reqCheckBrandInfo(params) {
  return request('/purchase/purchase-supplier-brand/submit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqDeleteContract(params) {
  return request('/purchase/purchase-supplier-info/delete-contract', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqCancelDelete(params) {
  return request('/purchase/purchase-supplier-info/cancel-delete-contract', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqCancelRemoveBrand(params) {
  return request('/purchase/purchase-supplier-brand/cancel-delete', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqDeleteGoods(params) {
  return request('/purchase/purchase-supplier-goods/cancel-delete', {
    method: 'POST',
    body: {
      ...params
    },
  });
}



