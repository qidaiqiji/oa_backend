import { routerRedux } from 'dva/router';
import { reqGetGoodsList } from '../services/goodsStockList';

export default {
  namespace: 'goodsStockList',

  state: {
    total: 0,
    curPage: 1,
    pageSize: 40,
    keywords: '',
    isZhifa: 0,
    isLoading: true,
    goods: [],
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getList({ payload = {} } = {}, { select, put, call }) {
      yield put({
        type: 'getListPending',
      });
      const goodsStockList = yield select(state => state.goodsStockList);
      const data = {
        curPage: goodsStockList.curPage,
        pageSize: goodsStockList.pageSize,
        keywords: goodsStockList.keywords,
        isZhifa: goodsStockList.isZhifa,
      };

      try {
        const res = yield call(reqGetGoodsList, { ...data, ...payload });
        yield put({
          type: 'getListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getListReject',
        });
      }
    },
    *changeKeywords({ payload }, { put }) {
      yield put({
        type: 'changeKeywordsReducer',
        payload,
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        total: 0,
        curPage: 1,
        pageSize: 40,
        keywords: '',
        isZhifa: 0,
        isLoading: true,
        goods: [],
      };
    },
    getListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getListReject(state) {
      return {
        ...state,
        isLoading: false,
      };
    },
    changeKeywordsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
