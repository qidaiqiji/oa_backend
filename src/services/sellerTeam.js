import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetGroupInfo() {
  return request('/seller/seller/seller-team-info');
}

export async function reqSaveGroupInfo(params) {
  return request('/seller/seller/update-area-group-of-seller-team', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
