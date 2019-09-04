import { stringify } from 'qs';
import request from '../utils/request';

export async function reqGalleryList(params) {
  return request(`/content/img-gallery/index?${stringify(params)}`);
}
export async function reqVideoList(params) {
  return request(`/content/video-resource/index?${stringify(params)}`);
}
export async function reqGetConfig(params) {
  return request(`/content/default/config?${stringify(params)}`);
}

export async function reqCreateGallery(params) {
  return request('/content/img-gallery/create',{
      method: 'POST',
      body: {
        ...params
      },
  })
}


export async function reqUpdateGallery(params) {
  return request('/content/img-gallery/update',{
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqChangeTitle(params) {
  return request('/content/img-resource/update',{
      method: 'POST',
      body: {
        ...params
      },
  })
}

export async function reqDeleteGallery(params) {
  return request(`/content/img-gallery/delete?${stringify(params)}`);
}

export async function reqImgList(params) {
  return request(`/content/img-resource/index?${stringify(params)}`);
}

export async function reqUploadVideo(params) {
  return request(`/content/video-resource/create?${stringify(params)}`);
}
export async function reqUpload(params) {
  return request('/content/img-resource/create', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqDeleteImgs(params) {
  return request('/content/img-resource/delete', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function reqMoveImgs(params) {
  return request('/content/img-resource/move', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 视频部分
export async function reqDeleteVideo(params) {
  return request(`/content/video-resource/delete?${stringify(params)}`);
}
// 上传/修改视频
export async function reqUpdateVideo(params) {
  return request("/content/video-resource/update",{
    method: 'POST',
    body: {
      ...params
    },
  });
}


