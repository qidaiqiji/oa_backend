import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig() {
  return request('/seller/agent/config');
}

export async function reqList(params) {
    return request(`/seller/agent/list?${stringify(params)}`);
  }
