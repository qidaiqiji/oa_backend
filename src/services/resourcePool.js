import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGetConfig(params) {
  return request(`/content/default/config?${stringify(params)}`);
}
export async function reqGetList(params) {
    return request(`/content/img-resource/index?${stringify(params)}`);
}
export async function reqGetVideoList(params) {
    return request(`/content/video-resource/index?${stringify(params)}`);
}


