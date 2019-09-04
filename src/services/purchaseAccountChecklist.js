import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig(params) {
    return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqList(params) {
    return request(`/purchase/purchase-order/credit-order-list?${stringify(params)}`);
}


