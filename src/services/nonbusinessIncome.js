import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig() {
  return request('/finance/non-business-income/config');
}
export async function reqList(params) {
  return request(`/finance/non-business-income/list?${stringify(params)}`);
}
export async function reqCommit(params) {
  return request('/finance/non-business-income/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqConfirm(actionUrl,params) {
    return request(actionUrl, {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  export async function reqEdit(params) {
    return request('/finance/non-business-income/edit', {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
export async function reqCertificate(params) {
  return request('/finance/non-business-income/add-receive-proof', {
    method: 'POST',
    body:params.formData
  });
}

export async function reqAccountList(params) {
  return request(`/finance/non-business-income/bill-list?${stringify(params)}`);
}

  export async function reqSupplierSuggest(params) {
    return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
  }
export async function reqSearch(params) {
  return request('/customer/customer/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqDelete(params) {
  return request('/finance/non-business-income/delete-receive-proof', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
