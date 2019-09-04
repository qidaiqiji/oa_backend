import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/depot/sales-export-depot-order/config?${stringify(params)}`);
}

export async function reqGetGoods(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}

export async function reqSaveOrder(params) {
  return request('/depot/sales-export-depot-order/create-by-user', {
    method: 'POST',
    body: {
      outStoreType: params.outStoreType,
      remark: params.remark,
      consignee: params.consignee,
      mobile: params.mobile,
      address: params.address,
      addressDetail: params.addressDetail,
      goodsList: params.goodsList,
    },
  });
}
