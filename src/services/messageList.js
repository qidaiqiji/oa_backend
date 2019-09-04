import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
    return request(`/info/info/list?${stringify(params)}`);
}
export async function reqConfig(params) {
    return request(`/info/info/config?${stringify(params)}`);
}

// export async function confirmNewOrder(params) {
//   return request('/finance/invoice-bill/confirm-back-invoice-bill', {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }
