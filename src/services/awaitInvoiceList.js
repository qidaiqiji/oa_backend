import request from '../utils/request';

export async function reqUrl(params) {
  return request(`${params.url}`);
}
