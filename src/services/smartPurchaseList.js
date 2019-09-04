import { stringify } from 'qs';
import request from '../utils/request';
export async function reqGetList(params) {
  return request(`/purchase/purchase-supplier-goods/smart-purchase-list?${stringify(params)}`);
}
export async function reqGetSupplierInfo(params) {
  return request(`/purchase/purchase-supplier-info/info?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqProducedPurchaserOrder(params) {
  return request('/sale/order-info/generate-purchase-order', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function reqSaveOrder(params) {
  return request('/purchase/purchase-order/create-by-buyer', {
    method: 'POST',
    body: {
      data: {
        goodsList: params.goodsInfos,
        ...params,
      },
    },
  });
}
export async function reqSupplierSuggest(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}


