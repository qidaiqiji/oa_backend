import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetCreditCustomerList(params) {
  return request(`/sale/credit/list?${stringify(params)}`);
}

export async function reqGetCreditBusinessOwner(params) {
  return request(`/customer/customer/config?${stringify(params)}`);
}
export async function reqGetCreditSum(params) {
  return request(`/sale/credit/sum-list?${stringify(params)}`);
}
