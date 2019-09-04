import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/depot/purchase-import-depot-order/config?${stringify(params)}`);
}
export async function reqGetInStoreOrderList(params) {
  const data = {
    ...params,
  };
  if (data.inStoreType === undefined) {
    data.inStoreType = -1;
  }
  return request(`/depot/purchase-import-depot-order/list?${stringify(data)}`);
}
export async function reqPushInStoreOrder(params) {
  const data = {
    purchase_import_depot_order_id: params.inStoreOrderId,
    depot: params.depot,
  };
  return request('/depot/purchase-import-depot-order/push-to-depot', {
    method: 'POST',
    body: {
      data: {
        ...data,
      },
    },
  });
}
