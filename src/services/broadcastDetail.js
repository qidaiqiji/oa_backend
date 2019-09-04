import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGoodsList(params) {
    return request(`/sale/goods/list?${stringify(params)}`);
  }
export async function reqBrandList(params) {
  return request(`/content/brand/index?${stringify(params)}`);
}
export async function reqDetailContent(params) {
  return request(`/live/live/detail?${stringify(params)}`);
}

export async function reqCreatUser(params) {
  return request('/customer/customer/quick-add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqConfig(params) {
  return request(`/live/live/config?${stringify(params)}`);
}
export async function reqZhiboConfig(params) {
  return request('/customer/customer/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqSubmit(params) {
  return request('/live/live/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqSubmitChange(params) {
  return request('/live/live/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

