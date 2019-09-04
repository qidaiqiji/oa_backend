import { message } from 'antd';
import {
  reqGetSupplyGoods,
  reqUpdateSupplyGoodsList,
  reqDeleteSupplyGoodsList,
  reqExportSupplyGoodsList,
  reqGetGoods,
  reqAddSupplyGoodsList,
} from '../services/supplierGoodsList';

export default {
  namespace: 'supplierGoodsList',

  state: {
    supplierId: '',
    currentPage: 1,
    keywords: '',
    supplyKeywords: '',
    supplyGoodsId: '',
    total: '',
    goodsTotal: '',
    curPage: 1,
    size: 10,
    siftSupplyGoodsList: [],
    supplyGoodsList: [],
    initSupplyGoodsList: [],
    supplyGoodsCheckboxIds: [],
    goodsCheckboxIds: [],
    siftGoods: [],
    isLoading: false,
    isShowMoreGoodsConfirm: false,
    isGoodsLoading: false,
    isMoreGoodsLoading: false,
  },

  effects: {
    *getSupplyGoodsList({ payload }, { put, call }) {
      yield put({
        type: 'getSupplyGoodsPending',
      });
      try {
        const res = yield call(reqGetSupplyGoods, { ...payload, size: 10000 });
        console.log("000",res.data.table)
        if (!payload.keywords && !payload.goodsId) {
          yield put({
            type: 'getSupplyGoodsListReducer',
            payload: {
              total: res.data.total,
              supplyGoodsList: res.data.table,
              supplyKeywords: payload.keywords,
              initSupplyGoodsList: res.data.table,
              supplyGoodsId: payload.goodsId,
              supplierId: payload.id,
              curPage: payload.curPage,
            },
          });
        } else {
          yield put({
            type: 'getSupplyGoodsListReducer',
            payload: {
              total: res.data.total,
              supplyGoodsList: res.data.table,
              supplyKeywords: payload.keywords,
              supplyGoodsId: payload.goodsId,
              supplierId: payload.id,
              curPage: payload.curPage,
            },
          });
        }
      } catch (error) {
        // to do
      }
    },
    *getSiftSupplyGoodsList({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetSupplyGoods, { ...payload });
        yield put({
          type: 'getSiftSupplyGoodsListReducer',
          payload: {
            siftSupplyGoodsList: res.data.table,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeTaxPrice({ payload }, { put }) {
      yield put({
        type: 'changeTaxPriceReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeSupplyPrice({ payload }, { put }) {
      yield put({
        type: 'changeSupplyPriceReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeMoreGoodsSupplyPrice({ payload }, { put }) {
      yield put({
        type: 'changeMoreGoodsSupplyPriceReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeSupplyRemark({ payload }, { put }) {
      yield put({
        type: 'changeSupplyRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *updateSupplyGoods({ payload }, { put, call, select }) {
      try {
        const { supplyGoodsList } = yield select(state => state.supplierGoodsList);
        const { goodsId } = payload.goodsInfos[0];
        const res = yield call(reqUpdateSupplyGoodsList, { ...payload });
        const changeGoods = res.data;
        for (let i = 0; i < supplyGoodsList.length; i += 1) {
          const goods = supplyGoodsList[i];
          if (goods.id === goodsId) {
            supplyGoodsList[i].purchaseDiscount = changeGoods.purchaseDiscount;
            supplyGoodsList[i].purchaseTaxDiscount = changeGoods.purchaseTaxDiscount;
            break;
          }
        }
        yield put({
          type: 'updateSupplyGoodsReducer',
          payload: {
            supplyGoodsList,
          },
        });
        message.success('修改成功！');
      } catch (error) {
        // to do
        message.error('修改失败！');
      }
    },
    *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
      yield put({
        type: 'supplyGoodsCheckboxIdsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeGoodsCheckboxIds({ payload }, { put }) {
      yield put({
        type: 'goodsCheckboxIdsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *deleteSupplyGoods({ payload }, { put, call }) {
      try {
        const res = yield call(reqDeleteSupplyGoodsList, { ...payload });
        yield put({
          type: 'deleteSupplyGoodsReducer',
        });
        yield put({
          type: 'getSupplyGoodsList',
          payload: {
            id: payload.id,
            curPage: payload.curPage,
            goodsId: payload.supplyGoodsId,
            keywords: payload.keywords,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *exportSupplyList({ payload }, { put, call }) {
      try {
        const res = yield call(reqExportSupplyGoodsList, { ...payload });
      } catch (error) {
        // to do
      }
    },
    // 取消查看更多商品
    *clickCancelMoreGoodsInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelMoreGoodsInfoButtonReducer',
      });
    },
    // 查看更多商品
    *showMoreGoods({ payload }, { put, call }) {
      yield put({
        type: 'openMoreGoodsReducer',
      });
      try {
        const goodsData = yield call(reqGetGoods, {
          currentPage: payload.currentPage,
          keywords: '',
        });
        for (let i = 0; i < goodsData.data.goods.length; i += 1) {
          goodsData.data.goods[i].supplyPrice = 0;
        }
        yield put({
          type: 'changeMoreGoodsReducer',
          payload: {
            ...payload,
            siftGoods: goodsData.data.goods,
            goodsTotal: goodsData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *moreSearchGoods({ payload }, { put, call }) {
      yield put({
        type: 'searchMoreGoodsReducer',
      });
      try {
        const goodsData = yield call(reqGetGoods, {
          currentPage: payload.currentPage,
          keywords: payload.keywords,
        });
        for (let i = 0; i < goodsData.data.goods.length; i += 1) {
          goodsData.data.goods[i].supplyPrice = 0;
        }
        yield put({
          type: 'changeMoreGoodsReducer',
          payload: {
            keywords: payload.keywords,
            siftGoods: goodsData.data.goods,
            goodsTotal: goodsData.data.total,
            currentPage: payload.currentPage,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeGoods({ payload }, { put, call }) {
      yield put({
        type: 'changeGoodsPending',
      });
      try {
        const res = yield call(reqGetGoods, { keywords: '', currentPage: 1, goodsIds: payload.goodsIds, pageSize: 0 });
        const goodsList = res.data.goods;
        const siftGoodsList = goodsList.filter((oneGoods) => {
          return payload.goodsIds.indexOf(oneGoods.goodsId) > -1;
        });
        const goodsInfos = [];
        for (let i = 0; i < siftGoodsList.length; i += 1) {
          const obj = {};
          obj.goodsId = siftGoodsList[i].goodsId;
          obj.supplyPrice = 0;
          goodsInfos.push(obj);
        }
        yield call(reqAddSupplyGoodsList, { id: payload.id, goodsInfos });
        yield put({
          type: 'getGoodsInfos',
        });
        yield put({
          type: 'getSupplyGoodsList',
          payload: {
            id: payload.id,
            keywords: '',
            goodsId: '',
            curPage: 1,
          },
        });
      } catch (error) {
        // to do
        yield put({
          type: 'cancleOkButtonReducer',
        });
      }
    },

    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    cancleOkButtonReducer(state) {
      return {
        ...state,
        isMoreGoodsLoading: false,
      };
    },
    getGoodsInfos(state) {
      return {
        ...state,
        goodsCheckboxIds: [],
        isShowMoreGoodsConfirm: false,
        isMoreGoodsLoading: false,
      };
    },
    changeGoodsPending(state) {
      return {
        ...state,
        isMoreGoodsLoading: true,
      };
    },
    searchMoreGoodsReducer(state) {
      return {
        ...state,
        isGoodsLoading: true,
      };
    },
    changeMoreGoodsReducer(state, { payload }) {
      return {
        ...state,
        isGoodsLoading: false,
        ...payload,
      };
    },
    openMoreGoodsReducer(state) {
      return {
        ...state,
        isShowMoreGoodsConfirm: true,
        isGoodsLoading: true,
      };
    },
    clickCancelMoreGoodsInfoButtonReducer(state) {
      return {
        ...state,
        isShowMoreGoodsConfirm: false,
      };
    },
    deleteSupplyGoodsReducer(state) {
      return {
        ...state,
        supplyGoodsCheckboxIds: [],
      };
    },
    goodsCheckboxIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    supplyGoodsCheckboxIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateSupplyGoodsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSupplyRemarkReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { supplyGoodsList } = newState;
      for (let i = 0; i < supplyGoodsList.length; i += 1) {
        if (supplyGoodsList[i].id === payload.goodsId) {
          supplyGoodsList[i].remark = payload.remark;
          break;
        }
      }
      return newState;
    },
    changeMoreGoodsSupplyPriceReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { siftGoods } = newState;
      for (let i = 0; i < siftGoods.length; i += 1) {
        if (siftGoods[i].goodsId === payload.goodsId) {
          siftGoods[i].supplyPrice = payload.number;
          break;
        }
      }
      return newState;
    },
    changeSupplyPriceReducer(state, { payload }) {
      console.log(payload);
      const newState = Object.assign({}, state);
      const { supplyGoodsList } = newState;
      for (let i = 0; i < supplyGoodsList.length; i += 1) {
        if (supplyGoodsList[i].id === payload.goodsId) {
          supplyGoodsList[i].supplyPrice = payload.number;
          break;
        }
      }
      return newState;
    },
    changeTaxPriceReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { supplyGoodsList } = newState;
      for (let i = 0; i < supplyGoodsList.length; i += 1) {
        if (supplyGoodsList[i].id === payload.goodsId) {
          supplyGoodsList[i].purchaseTaxPrice = payload.number;
          break;
        }
      }
      return newState;
    },
    getSiftSupplyGoodsListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getSupplyGoodsListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        siftSupplyGoodsList: [],
        isLoading: false,
      };
    },
    getSupplyGoodsPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    unmountReducer() {
      return {
        supplierId: '',
        currentPage: 1,
        keywords: '',
        supplyKeywords: '',
        supplyGoodsId: '',
        total: '',
        goodsTotal: '',
        curPage: 1,
        size: 10,
        siftSupplyGoodsList: [],
        supplyGoodsList: [],
        initSupplyGoodsList: [],
        supplyGoodsCheckboxIds: [],
        goodsCheckboxIds: [],
        siftGoods: [],
        isLoading: false,
        isShowMoreGoodsConfirm: false,
        isGoodsLoading: false,
        isMoreGoodsLoading: false,
      };
    },
  },
};
