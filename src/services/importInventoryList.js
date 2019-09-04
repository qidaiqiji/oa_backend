import { stringify } from 'qs';
import request from '../utils/request';

export async function reqReviseGoodsInventory(params) {
  return request('/depot/goods-depot/confirm-depot-data', {
    method: 'POST',
    body: {
      goodsList: {
        ...params,
      },
    },
  });
}
