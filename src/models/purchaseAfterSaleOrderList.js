import moment from 'moment';
import { routerRedux } from 'dva/router';
import { reqConfig, reqOrderList } from '../services/purchaseAfterSaleOrderList';
import { reqPurchaseSuggests } from '../services/common';

export default {
  namespace: 'purchaseAfterSaleOrderList',

  state: {
    // 配置项
    orderStatusMap: {},
    orderTypeMap: {},

    // --- ui 数据
    // 筛选项
    curPage: 1,
    pageSize: 40,
    orderStatus: -1,
    orderType: -1,
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
    keywords: '',
    supplierId: null,
    // 供应商 suggest 的 keywords
    supplierKeywords: '',

    // 其他
    selectOrderIds: [],
    isLoading: true,

    // --- 其他
    total: 0,
    backOrderList: [],
    supplierSuggests: [],
    payTypeMap: {},
    purchaserMap: {},
    payType: -1,
    purchaser: -1,
    actionList:[],
    receiveAmountTimeStart:'',
    receiveAmountTimeEnd:'',
    backOrderTypeMap:{},
    backOrderType:'-1'
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount(_, { put, call }) {
      try {
        const res = yield call(reqConfig);
        yield put({
          type: 'mountResolve',
          payload: res.data,
        });
        yield put({
          type: 'getOrderList',
        });
      } catch (error) {

      }
    },
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        },
      });
      const purchaseAfterSaleOrderList = yield select(state => state.purchaseAfterSaleOrderList);
      const {
        curPage,
        pageSize,
        orderStatus,
        orderType,
        startDate,
        endDate,
        keywords,
        supplierId,
        payType,
        purchaser,
        receiveAmountTimeStart,
        receiveAmountTimeEnd,
        backOrderType,
      } = purchaseAfterSaleOrderList;

      const data = {
        curPage,
        pageSize,
        orderStatus,
        orderType,
        startDate,
        endDate,
        keywords,
        supplierId,
        payType,
        purchaser,  
        receiveAmountTimeStart,
        receiveAmountTimeEnd,
        backOrderType,
      };
      try {
        const res = yield call(reqOrderList, { ...data, ...payload });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListReject',
        });
      }
    },
    *changeSiftItem({ payload }, { put }) {
      yield put({
        type: 'changeSiftItemReducer',
        payload,
      });
    },
    *changeSelectOrderIds({ payload }, { put }) {
      yield put({
        type: 'changeSelectOrderIdsReducer',
        payload,
      });
    },
    *changeSupplierKeywords({ payload }, { put, call }) {
      try {
        const res = yield call(reqPurchaseSuggests, { keywords: payload.supplierKeywords });
        yield put({
          type: 'changeSupplierKeywordsResolve',
          payload: {
            supplierSuggests: res.data.suppliers,
          },
        });
      } catch (error) {

      }
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 配置项
        orderStatusMap: {},
        orderTypeMap: {},

        // --- ui 数据
        // 筛选项
        curPage: 1,
        pageSize: 40,
        orderStatus: -1,
        orderType: -1,
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
        keywords: '',
        supplierId: null,
        // 供应商 suggest 的 keywords
        supplierKeywords: '',

        // 其他
        selectOrderIds: [],
        isLoading: true,

        // --- 其他
        total: 0,
        backOrderList: [],
        supplierSuggests: [],
        payTypeMap: {},
        purchaserMap: {},
        payType: -1,
        purchaser: -1,
        actionList:[],
        receiveAmountTimeStart:'',
        receiveAmountTimeEnd:'',
        backOrderTypeMap:{},
        backOrderType:'-1'
      };
    },
    mountResolve(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    changeSiftItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSelectOrderIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSupplierKeywordsResolve(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
