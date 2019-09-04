import { stringify } from 'qs';
import request from '../utils/request';

export async function reqOrderList(params) {
  return request(`/sale/order-group/list?${stringify(params)}`);
}
