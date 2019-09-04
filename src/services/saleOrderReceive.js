import { stringify } from 'qs';
import request from '../utils/request';

// 获取销售订单列表
export async function reqOrderList(params) {
  return request(`/sale/order-group/list?${stringify({
    ...params,
    checkStatus: 2,
    orderStatus: 0,
    orderOrigin: 2, 
  })}`);
}
