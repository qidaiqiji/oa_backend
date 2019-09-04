import { stringify } from 'qs';
import request from '../utils/request';

export async function reqList(params) {
    return request(`/live/vod/list?${stringify(params)}`);
}

export async function reqConfig(params) {
    return request(`/live/vod/config?${stringify(params)}`);
}
export async function reqAction(params) {
  console.log('bbb');
    return request(`${params.url}`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

