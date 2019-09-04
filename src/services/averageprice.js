import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig() {
  return request('/sale/goods/config');
}
export async function reqGetGoodsList(params) {
  return request(`/sale/goods/goods-list?${stringify(params)}`);
}
export async function reqChangeGoodsFloorPrice(params) {
  return request('/sale/goods/change-lowest-price', {
    method: 'POST',
    body: {
      ...params,
    },
  }, true);
}
export async function reqChangeGoodsTaxFloorPrice(params) {
  return request('/sale/goods/change-tax-lowest-price', {
    method: 'POST',
    body: {
      ...params,
    },
  }, true);
}
