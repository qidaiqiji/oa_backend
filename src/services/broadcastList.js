import { stringify } from 'qs';
import request from '../utils/request';
// 直播间列表
export async function liveRoomList(params) {
  return request(`/live/live-room/list?${stringify(params)}`, {
  });
}
// 创建直播间
export async function liveRoomCreate(params) {
  return request('/live/live-room/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除直播间
export async function liveRoomDelete(params) {
  return request('/live/live-room/del', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//   编辑直播间
export async function liveRoomEdit(params) {
  return request('/live/live-room/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
