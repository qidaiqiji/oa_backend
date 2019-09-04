import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
    return request(`/live/live/list?${stringify(params)}`);
}

export async function reqConfig(params) {
    return request(`/live/live/config?${stringify(params)}`);
}
// export async function reqAction(url) {
//     return request(`${url}`);
// }
export async function reqAction(params) {
  return request(`${params.url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// export async function reqUpload(params) {
//   return request('/info/info/upload-img', {
//     method: 'POST',
//     body: params.braftFormData,
//   });
// }

