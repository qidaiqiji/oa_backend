import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetSupplyGoods(params) {
  return request(`/purchase/purchase-supplier-goods/list?${stringify(params)}`);
}

export async function reqUpdateSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/edit', {
    method: 'POST',
    body: {
      id: params.id,
      goodsInfos: params.goodsInfos,
    },
  });
}

export async function reqDeleteSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/delete-by-user', {
    method: 'POST',
    body: {
      id: params.id,
      goodsId: params.goodsId,
    },
  });
}

export async function reqAddSupplyGoodsList(params) {
  return request('/purchase/purchase-supplier-goods/add', {
    method: 'POST',
    body: {
      id: params.id,
      goodsInfos: params.goodsInfos,
    },
  });
}

export async function reqExportSupplyGoodsList(params) {
  return request('/common/export-supplier-goods-list', {
    method: 'POST',
    body: {
      id: params.id,
    },
  });
}

export async function reqGetGoods(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}
