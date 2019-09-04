import { message } from 'antd';
import { reqGetConfig, reqChangeGoodsFloorPrice, reqGetGoodsList, reqChangeGoodsTaxFloorPrice } from '../services/averageprice';

export default {
  namespace: 'averageprice',

  state: {
    keywords: '',
    goodsType: -1,
    goodsStatus: -1,
    total: null,
    curPage: 1,
    pageSize: 40,
    goodsList: [],

    goodsStatusMap: {},
    goodsTypeMap: {},

    isPageLoading: true,
    isGoodsListLoading: true,
  },

  effects: {
    *mount(_, { put, call, all, select }) {
      const {
        keywords,
        goodsType,
        goodsStatus,
        curPage,
        pageSize,
      } = yield select(state => state.averageprice);

      try {
        const [map, goodsList] = yield all([call(reqGetConfig), call(reqGetGoodsList, { keywords, goodsType, goodsStatus, curPage, pageSize })]);
        yield put({
          type: 'mountResolved',
          payload: {
            ...map.data,
            ...goodsList.data,
          },
        });
      } catch (error) {
        console.log('bbb');
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getGoodsList({ payload }, { put, select, call }) {
      yield put({
        type: 'getGoodsListPending',
      });
      const {
        keywords,
        goodsType,
        goodsStatus,
        curPage,
        pageSize,
      } = yield select(state => state.averageprice);
      const data = {
        keywords,
        goodsType,
        goodsStatus,
        curPage,
        pageSize,
      };
      try {
        const res = yield call(reqGetGoodsList, {
          ...data,
          ...payload });
        yield put({
          type: 'getGoodsListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getGoodsListRejected',
        });
      }
    },
    *changeKeywords({ payload }, { put }) {
      yield put({
        type: 'changeKeywordsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeGoodsFloorPrice({ payload }, { put, select }) {
      const {
        goodsFloorPrice,
        goodsIndex,
      } = payload;
      const {
        goodsList,
      } = yield select(state => state.averageprice);
      goodsList[goodsIndex].goodsFloorPrice = goodsFloorPrice;
      yield put({
        type: 'changeGoodsFloorPriceReducer',
        payload: {
          goodsList,
        },
      });
    },
    *blurGoodsFloorPrice({ payload }, { put, call, select }) {
      const {
        goodsId,
        goodsFloorPrice,
        goodsIndex,
      } = payload;
      const {
        goodsList,
      } = yield select(state => state.averageprice);
      try {
        const res = yield call(reqChangeGoodsFloorPrice, { goodsId, goodsFloorPrice });
        if (res.code !== 0) {
          goodsList[goodsIndex].goodsFloorPrice = res.data.goodsFloorPrice;
          message.error(res.msg);
          yield put({
            type: 'blurGoodsFloorPriceRejected',
            payload: {
              goodsList,
            },
          });
        } else {
          yield put({
            type: 'blurGoodsFloorPriceResolved',
          });
          message.success('修改成功');
        }
      } catch (error) {
        message.error('修改失败');
        yield put({
          type: 'blurGoodsFloorPriceRejected',
        });
      }
    },
    *changeGoodsTaxFloorPrice({ payload }, { put, select }) {
      const {
        goodsTaxFloorPrice,
        goodsIndex,
      } = payload;
      const {
        goodsList,
      } = yield select(state => state.averageprice);
      goodsList[goodsIndex].goodsTaxFloorPrice = goodsTaxFloorPrice;
      yield put({
        type: 'changeGoodsFloorPriceReducer',
        payload: {
          goodsList,
        },
      });
    },
    *blurGoodsTaxFloorPrice({ payload }, { put, call, select }) {
      const {
        goodsId,
        goodsTaxFloorPrice,
        goodsIndex,
      } = payload;
      const {
        goodsList,
      } = yield select(state => state.averageprice);
      try {
        const res = yield call(reqChangeGoodsTaxFloorPrice, { goodsId, goodsTaxFloorPrice });
        if (res.code !== 0) {
          goodsList[goodsIndex].goodsTaxFloorPrice = res.data.goodsTaxFloorPrice;
          message.error(res.msg);
          yield put({
            type: 'blurGoodsFloorPriceRejected',
            payload: {
              goodsList,
            },
          });
        } else {
          yield put({
            type: 'blurGoodsFloorPriceResolved',
          });
          message.success('修改成功');
        }
      } catch (error) {
        message.error('修改失败');
        yield put({
          type: 'blurGoodsFloorPriceRejected',
        });
      }
    },
  },

  reducers: {
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isPageLoading: false,
        isGoodsListLoading: false,
      };
    },
    getGoodsListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGoodsListLoading: true,
      };
    },
    getGoodsListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGoodsListLoading: false,
      };
    },
    getGoodsListRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGoodsListLoading: false,
      };
    },
    changeKeywordsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeGoodsFloorPriceReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    blurGoodsFloorPriceResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    blurGoodsFloorPriceRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer(state,{ payload }) {
      return {
        keywords: '',
        goodsType: -1,
        goodsStatus: -1,
        total: null,
        curPage: 1,
        pageSize: 40,
        goodsList: [],

        goodsStatusMap: {},
        goodsTypeMap: {},

        isPageLoading: true,
        isGoodsListLoading: true,
      }
    }
  },
};
