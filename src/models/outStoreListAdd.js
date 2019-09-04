import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import area from '../area.json';
import { reqGetConfig, reqGetGoods, reqSaveOrder } from '../services/outStoreListAdd';

export default {
  namespace: 'outStoreListAdd',

  state: {
    addressOptions: area.data,
    siftGoods: [],
    goodsInfos: [],
    curPage: 1,
    searchGoodsValue: '',
    isShowMoreGoodsConfirm: false,
    isGoodsLoading: false,
    isMoreGoodsLoading: false,
    size: 10,
    total: 0,
    goodsCheckboxIds: [],
    moreGoodsKeywords: '',
    outStoreTypeMap: {},
    outStoreType: '',
    consignee: '',
    mobile: '',
    address: [],
    addressDetail: '',
    remark: '',
  },
  effects: {
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'getConfigReducer',
          payload: {
            outStoreTypeMap: res.data.outStoreTypeMap,
          },
        });
      } catch (error) {
        // todo
      }
    },
    *changeOutStoreType({ payload }, { put }) {
      yield put({
        type: 'changeOutStoreTypeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *searchGoods({ payload }, { put, call }) {
      const { curPage, value } = payload;
      if (value === '') {
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: [],
            searchGoodsValue: value,
          },
        });
        return;
      }
      try {
        const goodsData = yield call(reqGetGoods, { curPage, keywords: value, isZhifa: 1 });
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: goodsData.data.goods,
            searchGoodsValue: value,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeGoods({ payload }, { put, call }) {
      if (!Array.isArray(payload.goodsId)) {
        yield put({
          type: 'getGoodsInfo',
          payload: {
            goodsId: payload.goodsId,
            searchGoodsValue: '',
          },
        });
      } else {
        try {
          if (payload.goodsId.length > 0) {
            const res = yield call(reqGetGoods, { keywords: '', curPage: 1, isZhifa: 1, goodsIds: payload.goodsId });
            yield put({
              type: 'getGoodsInfos',
              payload: {
                siftGoodsList: res.data.goods,
                goodsIds: payload.goodsId,
                searchGoodsValue: '',
              },
            });
          } else {
            yield put({
              type: 'clickCancelMoreGoodsInfoButtonReducer',
            });
          }
        } catch (error) {
          // to do
        }
      }
    },
    *changeOutStoreNum({ payload }, { put }) {
      yield put({
        type: 'changeOutStoreNumReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeGoodsRemark({ payload }, { put }) {
      yield put({
        type: 'changeGoodsRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *deleteGoods({ payload }, { put }) {
      yield put({
        type: 'deleteGoodsReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 查看更多商品
    *showMoreGoods({ payload }, { put, call }) {
      try {
        const goodsData = yield call(reqGetGoods, { curPage: payload.curPage, keywords: '', isZhifa: 1 });
        for (let i = 0; i < goodsData.data.goods.length; i += 1) {
          goodsData.data.goods[i].outStoreNum = 0;
        }
        yield put({
          type: 'changeMoreGoodsReducer',
          payload: {
            ...payload,
            moreGoodsKeywords: '',
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 取消查看更多商品
    *clickCancelMoreGoodsInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelMoreGoodsInfoButtonReducer',
      });
    },
    *checkGoods({ payload }, { put }) {
      yield put({
        type: 'checkGoodsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getGoodsPage({ payload }, { call, put }) {
      yield put({
        type: 'getGoodsPending',
      });
      try {
        const goodsData = yield call(reqGetGoods, { curPage: payload.curPage, keywords: payload.value, isZhifa: 1 });
        for (let i = 0; i < goodsData.data.goods.length; i += 1) {
          goodsData.data.goods[i].outStoreNum = 0;
        }
        yield put({
          type: 'getGoodsChangePage',
          payload: {
            ...payload,
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *moreSearchGoods({ payload }, { put, call }) {
      yield put({
        type: 'getGoodsPending',
      });
      try {
        const goodsData = yield call(reqGetGoods, { curPage: 1, keywords: payload.value, isZhifa: 1 });
        for (let i = 0; i < goodsData.data.goods.length; i += 1) {
          goodsData.data.goods[i].outStoreNum = 0;
        }
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
            curPage: 1,
            moreGoodsKeywords: payload.value,
            goodsCheckboxIds: [],
            isGoodsLoading: false,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeReceivingReceiptValue({ payload }, { put }) {
      yield put({
        type: 'changeReceivingReceiptValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickSaveBtn({ payload }, { put, call }) {
      try {
        const res = yield call(reqSaveOrder, { ...payload });
        notification.success({
          message: '提示',
          description: '提交审核成功',
        });
        yield put(routerRedux.push('/warehouse/await-push-list'));
      } catch (error) {
        // dodo
      }
    },
    *changeMoreGoodsKeywords({ payload }, { put }) {
      yield put({
        type: 'changeMoreGoodsKeywordsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    changeMoreGoodsKeywordsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeReceivingReceiptValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchGoodsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getGoodsChangePage(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isGoodsLoading: false,
      };
    },
    // 获取商品列表中
    getGoodsPending(state) {
      return {
        ...state,
        isGoodsLoading: true,
      };
    },
    clickCancelMoreGoodsInfoButtonReducer(state) {
      return {
        ...state,
        siftGoods: [],
        isShowMoreGoodsConfirm: false,
      };
    },
    checkGoodsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeMoreGoodsReducer(state, { payload }) {
      return {
        ...state,
        isShowMoreGoodsConfirm: true,
        isGoodsLoading: false,
        ...payload,
      };
    },
    deleteGoodsReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      for (let i = 0; i < goodsInfos.length; i += 1) {
        if (goodsInfos[i].goodsId === payload.goodsId) {
          goodsInfos.splice(i, 1);
          break;
        }
      }
      return {
        ...newState,
      };
    },
    changeGoodsRemarkReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      for (let i = 0; i < goodsInfos.length; i += 1) {
        if (goodsInfos[i].goodsId === payload.goodsId) {
          goodsInfos[i].goodsRemark = payload.goodsRemark;
          break;
        }
      }
      return newState;
    },
    changeOutStoreNumReducer(state, action) {
      const { payload } = action;
      const { isMoreGoods } = payload;
      const newState = Object.assign({}, state);
      const { goodsInfos, siftGoods } = newState;
      if (isMoreGoods) {
        for (let i = 0; i < siftGoods.length; i += 1) {
          if (siftGoods[i].goodsId === payload.goodsId) {
            siftGoods[i].outStoreNum = payload.number;
            break;
          }
        }
      } else {
        for (let i = 0; i < goodsInfos.length; i += 1) {
          if (goodsInfos[i].goodsId === payload.goodsId) {
            goodsInfos[i].outStoreNum = payload.number;
            break;
          }
        }
      }
      return newState;
    },
    getGoodsInfos(state, { payload }) {
      // const { goodsIds } = payload;
      // const newState = Object.assign({}, state);
      // const { siftGoods } = newState;
      // const siftGoodsList = siftGoods.filter((oneGoods) => {
      //   return goodsIds.indexOf(oneGoods.goodsId) > -1;
      // });
      payload.siftGoodsList.map((siftGoodsItem) => {
        siftGoodsItem.goodsRemark = '';
      });
      return {
        ...state,
        goodsInfos: state.goodsInfos.concat(payload.siftGoodsList),
        siftGoods: [],
        goodsCheckboxIds: [],
        isShowMoreGoodsConfirm: false,
      };
    },
    getGoodsInfo(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { siftGoods } = newState;
      let goodsInfo = {
        outStoreNum: 0,
      };
      for (let i = 0; i < siftGoods.length; i += 1) {
        if (+siftGoods[i].goodsId === +payload.goodsId) {
          goodsInfo = Object.assign({}, siftGoods[i]);
          goodsInfo.outStoreNum = 0;
          goodsInfo.goodsRemark = '';
          break;
        }
      }
      return {
        ...state,
        goodsInfos: state.goodsInfos.concat([goodsInfo]),
        siftGoods: [],
        goodsCheckboxIds: [],
        isShowMoreGoodsConfirm: false,
        searchGoodsValue: '',
      };
    },
    changeOutStoreTypeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getConfigReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        addressOptions: area.data,
        siftGoods: [],
        goodsInfos: [],
        curPage: 1,
        searchGoodsValue: '',
        isShowMoreGoodsConfirm: false,
        isGoodsLoading: false,
        isMoreGoodsLoading: false,
        size: 10,
        total: 0,
        goodsCheckboxIds: [],
        moreGoodsKeywords: '',
        outStoreTypeMap: {},
        outStoreType: '',
        consignee: '',
        mobile: '',
        address: [],
        addressDetail: '',
        remark: '',
      };
    },
  },
};
