import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig() {
  return request('/customer/customer/config ');
}

export async function getCustomerList(params) {
  return request(`/customer/customer/list?${stringify(params)}`);
}

export async function getServiceList(params) {
  return request('/seller/seller-duty-log/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function newServiceRecord(params) {
  return request('/seller/seller-duty-log/add-log', {
    method: 'POST',
    body: {
      customerId: params.payload.customerId,
      serviceContent: params.payload.serviceContent,
      serviceType: params.payload.serviceType,
    },
  });
}

export async function updateServiceRecord(params) {
  return request('/seller/seller-duty-log/update-log', {
    method: 'POST',
    body: {
      serviceId: params.payload.serviceId,
      content: params.payload.serviceContent,
      serviceType: params.payload.serviceType,
    },
  });
}

export async function createServiceTypeReq(params) {
  return request('/seller/seller-duty-log/add-log-type', {
    method: 'POST',
    body: {
      serviceTypeName: params.payload.serviceTypeName,
    },
  });
}

export async function deleteRecordReq(params) {
  return request('/seller/seller-duty-log/delete-log', {
    method: 'POST',
    body: {
      recordId: params.payload.recordId,
    },
  });
}
