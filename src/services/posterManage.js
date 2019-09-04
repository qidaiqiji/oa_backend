import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config.js';

export async function reqGetConfig() {
  return request('/content/default/config');
}
export async function reqGetList(params) {
  return request(`/content/found-author/index?${stringify(params)}`);
}
export async function reqBrandList(params) {
  return request(`/content/brand/index?${stringify(params)}`);
}

export async function reqEditPoster(params) {
  return request('/content/found-author/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqAddPoster(params) {
  return request('/content/found-author/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqDeletePoster(params) {
  return request(`/content/found-author/delete?${stringify(params)}`);
}

