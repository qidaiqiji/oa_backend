import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqGetStoreOrderInfo(params) {
  const data = {
    data: {
      purchaseOrderId: params.id,
    },
  };
  return request('/purchase/purchase-order/import-depot-order-list', {
    method: 'POST',
    body: data,
  });
}

export async function reqGenStoreOrder(params) {
  return request('/depot/purchase-import-depot-order/add', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
export async function reqPushStoreOrder(params) {
  return request('/depot/purchase-import-depot-order/push-to-depot', {
    method: 'POST',
    body: {
      data: {
        purchase_import_depot_order_id: params.orderId,
        depot: params.depot,
      },
    },
  });
}
export async function reqObsoleteStoreOrder(params) {
  return request('/depot/purchase-import-depot-order/cancel', {
    method: 'POST',
    body: {
      data: {
        id: params.orderId,
      },
    },
  });
}


export async function reqAction(url, params) {
  return request(`${url}?${stringify(params)}`);
}

export async function requestChangeTax(params) {
  return request('/purchase/purchase-goods/change-tax', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
