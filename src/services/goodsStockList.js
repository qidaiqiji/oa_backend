import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetGoodsList(params) {
  const data = {
    ...params,
  };
  data.isZhifa = 1;
  return request(`/sale/goods/list?${stringify(data)}`);
}
