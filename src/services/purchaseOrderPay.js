import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetOrderList(params) {
  // const cloneParams = params;
  // const { status } = cloneParams;
  // if (status === '') {
  //   cloneParams.status = JSON.stringify(['4', '8']);
  // }
  return request(`/finance/purchase-outcome-application/list?${stringify(params)}`);
}

export async function reqGetConfig() {
  return request('/finance/purchase-outcome-application/config');
}

