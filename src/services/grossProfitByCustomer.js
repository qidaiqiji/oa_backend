import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetList(params) {
  return request(`/finance/profit-manage/customer-list?${stringify(params)}`);
}

