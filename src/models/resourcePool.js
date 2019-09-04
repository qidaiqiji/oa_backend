import { message } from 'antd';
import { reqGetList, reqGetConfig, reqGetVideoList } from '../services/resourcePool';

export default {
  namespace: 'resourcePool',
  state: {
    isSelect: false,
    imgGalleries: {},
    galleryId: 1,
    imgList: [],
    selectedPictureList: [],
    title: '',
    videoList: [],
    selectedVideo: [],
    imgTitle: '',
    page: 1,
    pageSize: 24,
    pageSizeVideo: 8,
    totalImg: 0,
    totalVideo: 0,
    isfirst:'',
    isFirstImg:'',
    
  },

  effects: {
    *getConfig({ }, { put, call }) {
      try {
        const config = yield call(reqGetConfig);
        yield put({
          type: 'updatePageReducer',
          payload: {
            imgGalleries: config.data.imgGalleries,


          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    *getImgList({ payload }, { select, put, call }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload
        }
      });
      try {
        const { galleryId, imgTitle, pageSize, page } = yield select(state => state.resourcePool);
        const res = yield call(reqGetList, { galleryId, title: imgTitle, page, pageSize });
        let imgList = res.data.imgList;
        imgList.map(item => {
          item.isSelect = false;
        })
        yield put({
          type: 'updatePageReducer',
          payload: {
            imgList,
            totalImg: res.data.totalCount,
          }
        });
      } catch (err) {
        console.log(err)
      }
    },
    *clearChosedList({ payload }, { select, put }) {
      const { imgList } = yield select(state => state.resourcePool);
      imgList.map(item => {
        item.isSelect = false;
      })
      yield put({
        type: 'updatePageReducer',
        payload: {
          imgList,
          selectedPictureList: [],
        }
      });
    },
    *clearChosedVideoList({ payload }, { put,select }) {
      const { videoList } = yield select(state => state.resourcePool);
      videoList.map(item => {
        item.isSelect = false;
      })
      yield put({
        type: 'updatePageReducer',
        payload: {
          videoList,
          selectedVideo: [],
        }
      });
    },
    *getVideoList({ payload }, { select, put, call }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
        }
      });
      try {
        const { title, pageSizeVideo, page } = yield select(state => state.resourcePool);
        const res = yield call(reqGetVideoList, {
          title,
          page,
          pageSize: pageSizeVideo,
        });
        let videoList = res.data.videoList;
        videoList.map(item => {
          item.isSelect = false;
        })
        yield put({
          type: 'updatePageReducer',
          payload: {
            videoList,
            totalVideo: res.data.totalCount,
          }
        });
      } catch (err) {
        console.log(err)
      }
    }
  },

  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    unmountReducer(state, { payload }) {
      return {
        isSelect: false,
        imgGalleries: {},
        galleryId: 1,
        imgList: [],
        selectedPictureList: [],
        title: '',
        videoList: [],
        selectedVideo: [],
        imgTitle: '',
        page: 1,
        pageSizeVideo: 8,
        pageSize: 24,
        totalImg: 0,
        isfirst:'',
        isFirstImg:'',
      }
    }

  },
};
