import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderDetail(params) {
  return request(`/purchase/purchase-order/sale-detail?${stringify(params)}`);
}

export async function reqGetConfig(params) {
  return request(`/purchase/purchase-order/config?${stringify(params)}`);
}

export async function reqUpdatePayType(params) {
  return request('/purchase/purchase-order/update-pay-type', {
    method: 'POST',
    body: {
      id: params.id,
      payType: params.payType,
    },
  });
}
export async function reqChangeBankInfo(params) {
  return request(`/purchase/purchase-order/update-bank-info`,{
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqLogisticsAdd(params) {
  return request('/purchase/purchase-order/add-shipping-info', {
    method: 'POST',
    body: {
      subOrderId: params.subOrderId,
      logisticsCompany: params.logisticsCompany,
      logisticsSn: params.logisticsSn,
      logisticsFare: params.logisticsFare,
      unloadFare: params.unloadFare,
      goodsList: params.goodsList,
      id: params.pageId,
    },
  });
}

export async function reqLogisticsUpdate(params) {
  return request('/purchase/purchase-order/update-shipping-info', {
    method: 'POST',
    body: {
      subOrderId: params.subOrderId,
      logisticsCompany: params.logisticsCompany,
      logisticsSn: params.logisticsSn,
      logisticsFare: params.logisticsFare,
      unloadFare: params.unloadFare,
      goodsList: params.goodsList,
      logisticsId: params.logisticsId,
    },
  });
}

// 订单操作(审核等)
export async function reqStartupOrderAction(params) {
  return request(`${params.url}?${stringify({ id: params.id, remark: params.remark })}`);
}

// 下拉列表选中
export async function reqSelectFinanceRemark(params) {
  return request(`/purchase/purchase-order/update-finance-remark?${stringify(params)}`);
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
