import { notification, message } from 'antd';
import { reqGetConfig, reqGetList, reqAction } from '../services/contentManage';
import { stat } from 'fs';

export default {
  namespace: 'contentManage',

  state: {
    isTableLoading: false,
    articleId: '',
    type: '',
    status: '',
    title: '',
    createTimeStart: '',
    foundId: '',
    createTimeEnd: '',
    foundArticleType: {},
    foundArticleStatus: {},
    foundCategories: {},
    pageSize: 40,
    articleList: [],
    isShowConfirmModal: false,
    actionUrl: '',
    actionText: '',
    page: 1,
    pageSize: 40,
    totalCount: '',
    sortType: '',
    orderBy: '',
  },

  effects: {
    *getList({ payload }, { put, call, select }) {
      yield put({
        type: 'updataPageReducer',
        payload: {
          ...payload,
          isTableLoading: true,
        }
      })
      const { orderBy, sortType, page, pageSize, articleId, type, status, title, createTimeStart, createTimeEnd, foundId } = yield select(state => state.contentManage);
      try {
        const res = yield call(reqGetList, { articleId, orderBy, sortType, type, status, title, createTimeStart, createTimeEnd, foundId, page, pageSize });
        yield put({
          type: 'updataPageReducer',
          payload: {
            ...res.data,
            isTableLoading: false,
          }
        })

      } catch (err) {
        yield put({
          type: 'updataPageReducer',
          paylaod: {
            isTableLoading: false,
          }
        })
        console.log(err);
      }
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'updataPageReducer',
          payload: {
            ...res.data,
          }
        })
      } catch (err) {
        yield put({
          type: 'updataPageReducer',
          paylaod: {
            isTableLoading: false,
          }
        })
        console.log(err);

      }

    },
    *confirmAction({ payload }, { put, select, call }) {
      const { actionUrl } = yield select(state => state.contentManage);
      try {
        const res = yield call(reqAction, actionUrl);
        if (+res.code === 0) {
          notification.success({
            message: res.msg,
          })
        }
        yield put({
          type: 'getList'
        })
        yield put({
          type: 'updataPageReducer',
          payload: {
            ...payload,
          }
        })
      } catch (err) {
        yield put({
          type: 'updataPageReducer',
          payload: {
            ...payload,
          }
        })
        console.log(err);
      }
    }

  },

  reducers: {
    updataPageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    unmountReducer(state, { payload }) {
      return {
        isTableLoading: false,
        articleId: '',
        type: '',
        status: '',
        title: '',
        createTimeStart: '',
        foundId: '',
        createTimeEnd: '',
        foundArticleType: {},
        foundArticleStatus: {},
        foundCategories: {},
        pageSize: 40,
        articleList: [],
        isShowConfirmModal: false,
        actionUrl: '',
        actionText: '',
        page: 1,
        pageSize: 40,
        totalCount: '',
        sortType: '',
        orderBy: '',
      }
    }

  },
};
