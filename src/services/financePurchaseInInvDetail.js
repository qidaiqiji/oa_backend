import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInInvFollowDetail(params) {
  return request(`/purchase/in-inv-follow/detail?${stringify(params)}`);
}

export async function reqGoodsNameList(params) {
  return request(`/finance/inv-goods-name/goods-name-list?${stringify(params)}`);
}

export async function reqInvGoodsNameList(params) {
  return request(`/finance/inv-goods-name/list?${stringify(params)}`);
}

export async function reqInvGoodsAddName(params) {
  return request('/finance/inv-goods/add-name', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvBillAddDetail(params) {
  return request('/finance/invoice-bill/add-detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvGoodsCreate(params) {
  return request('/finance/inv-goods/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
} 
// 每天信息的保存
export async function reqInvoiceItemAdd(params) {
  return request('/finance/invoice-item/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// ////////头部
export async function reqInvBillCreate(params) {
  return request('/finance/invoice-bill/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvBillUpdate(params) {
  return request('/finance/invoice-bill/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInvBillDelete(params) {
  return request('/finance/invoice-bill/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdateShippingNo(params) {
  return request('/purchase/in-inv-follow/update-shipping-no', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdatePurchaseRemark(params) {
  return request('/purchase/in-inv-follow/update-purchase-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdateSuitDetail(params) {
  return request('/purchase/in-inv-follow/update-suit-detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvFollowUpdateRemark(params) {
  return request('/purchase/in-inv-follow/update-remark', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqInInvGoodsDeleteName(params) {
  return request('/finance/inv-goods/delete-name', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqAction(url, params) {
  return request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//作废按钮

export async function reqincomeInvDelete(params) {
  return request('/finance/invoice-item/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 入库 全部入库 按钮

export async function reqInvBillInStorage(params) {
  return request('/finance/invoice-bill/in-storage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}