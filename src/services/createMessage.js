import { stringify } from 'qs';
import request from '../utils/request';

export async function reqConfig(params) {
  return request(`/info/info/config?${stringify(params)}`);
}


export async function reqCommit(params) {
  return request('/info/info/create-info', {
    method: 'POST',
    body: params.formData,
  });
}

export async function reqUpload(params) {
  return request('/info/info/upload-img', {
    method: 'POST',
    body: params.braftFormData,
  });
}


