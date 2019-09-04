import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqGetOrderInfo(params) {
  const data = {
    purchaseOrderId: params.id,
  };
  return request(`/purchase/purchase-order/detail?${stringify(data)}`);
}
// export async function reqGetSuppliers() {
//   return request('/purchase/purchase-supplier-info/list?size=999');
// }
export async function reqGetGoods(params) {
  return request(`/purchase/purchase-supplier-goods/list?${stringify(params)}`);
}

export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqEditOrder(params) {
  return request('/purchase/purchase-order/edit', {
    method: 'POST',
    body: {
      data: {
        goodsList: params.goodsInfos,
        purchaseOrderId: params.orderId,
        ...params,
      },
    },
  });
}

export async function reqSaveOrder(params) {
  return request('/purchase/purchase-order/create-by-buyer', {
    method: 'POST',
    body: {
      data: {
        // goodsList: params.goodsInfos,
        ...params,
      },
    },
  });
}
export async function reqDeleteGoods(params) {
  return request('/purchase/purchase-order/delete-goods', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
// export async function reqGetGoodsInfo(params) {
//   return request(`/api/getGoodsInfo?${stringify(params)}`);
// }
