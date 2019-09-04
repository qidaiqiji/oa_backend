import { stringify } from 'qs';
import request from '../utils/request';

export async function reqInfo(params) {
  return request(`/employee/employee/dash-board?${stringify(params)}`);
}
export async function reqDepart(params) {
  return request(`/employee/employee/info-box-list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/info/info/config?${stringify(params)}`);
}
// export async function reqRejectList(params) {
//   return request('/sale/order-info/reject-await-make-order', {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }


