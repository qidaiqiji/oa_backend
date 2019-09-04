import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/sale/user/purchaser-list?${stringify(params)}`);
}

export async function reqGetSupplierInfo(params) {
  return request(`/purchase/purchase-supplier-info/info?${stringify(params)}`);
}

export async function reqGetOrderList(params) {
  return request(`/sale/order-info/daifa-order?${stringify(params)}`);
}

export async function reqGetSupplierList(params) {
  return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqRejectList(params) {
  return request('/sale/order-info/reject-await-make-order', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqPurchaseRemark(params) {
  return request('/sale/order-goods/add-purchaser-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqUpdateSupplier(params) {
  return request('/sale/order-info/assign-supplier', {
    method: 'POST',
    body: {
      supplierId: params.supplierId,
      goodsId: params.goodsId,
    },
  });
}

export async function reqUpdatePurchaser(params) {
  return request('/sale/order-info/assign-purchaser', {
    method: 'POST',
    body: {
      purchaserId: params.purchaserId,
      goodsIdList: params.goodsIdList,
    },
  });
}

export async function reqProducedPurchaserOrder(params) {
  return request('/sale/order-info/generate-purchase-order', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

