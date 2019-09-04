import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/content/default/config?${stringify(params)}`);
}
export async function reqaddContent(params) {
  return request('/content/found-article/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqDetailContent(params) {
  return request(`/content/found-article/view?${stringify(params)}`);
}
export async function reqBrandList(params) {
  return request(`/content/brand/index?${stringify(params)}`);
}

export async function reqReviseContent(params) {
  return request('/content/found-article/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqUpload(params) {
  return request('/info/info/upload-img', {
    method: 'POST',
    body: params.braftFormData,
  });
}

