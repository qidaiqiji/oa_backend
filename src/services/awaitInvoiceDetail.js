import { stringify } from 'qs';
import request from '../utils/request';

export async function reqUrl(params) {
  return request(`${params.url}&${stringify({ remark: params.remark })}`);
}
export async function reqUrlDirect(params) {
  return request(`${params.url}`);
}
export async function reqUrlPost(params) {
  return request(`${params.url}`, {
    method: 'POST',
    body: {
      id: params.id,
    },
  });
}
