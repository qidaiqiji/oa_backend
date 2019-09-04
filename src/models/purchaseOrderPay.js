import moment from 'moment';
import { routerRedux } from 'dva/router';
import { reqGetOrderList, reqGetConfig } from '../services/purchaseOrderPay.js';

export default {
  namespace: 'purchaseOrderPay',

  state: {
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    curPage: 1,
    pageSize: 40,
    keywords: '',
    total: '',
    isLoading: false,
    orderInfos: [],
    reviewStatusMap: {},
    reviewStatus: "",
    purchaseTypeMap: {},
    purchaseType: -1,
    status: 4,
  },

  effects: {
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'getConfigReducer',
          payload: {
            ...res.data,
          },
        });
        yield put({
          type: 'getOrderList',
          payload: {
            keywords: '',
            startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            curPage: 1,
            pageSize: 40,
            status: 4,
            purchaseType: -1,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload:{
          ...payload,
        }
      });
      const {
        curPage,
        pageSize,
        status,
        purchaseType,
        startDate,
        endDate,
        keywords,
        reviewStatus,
      } = yield select(state => state.purchaseOrderPay);
      try {
        const res = yield call(reqGetOrderList, {
          curPage,
          pageSize,
          status,
          purchaseType,
          startDate,
          endDate,
          keywords,
          reviewStatus,
          // ...payload,
        });
        const orderInfos = res.data.purchaseOrderPayList;
        yield put({
          type: 'getOrderListReducer',
          payload: {
            orderInfos,
            total: res.data.total,
            ...payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // *changeReviewStatus({ payload }, { put }) {
    //   yield put({
    //     type: 'getOrderList',
    //     payload: {
    //       status: payload.status,
    //     },
    //   });
    //   yield put({
    //     type: 'changeReviewStatusReducer',
    //     payload: {
    //       reviewStatus: payload.status,
    //     },
    //   });
    // },
    *changePurchaseType({ payload }, { put, call, select }) {
      const purchaseOrderPay = yield select(state => state.purchaseOrderPay);
      const {
        status,
      } = purchaseOrderPay;
      yield put({
        type: 'getOrderList',
        payload: {
          status,
          purchaseType: payload.purchaseType,
        },
      });
      yield put({
        type: 'changePurchaseTypeReducer',
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
    getConfigReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePurchaseTypeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeReviewStatusReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getOrderListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    unmountReducer() {
      return {
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        curPage: 1,
        pageSize: 40,
        keywords: '',
        orderInfos: [],
        total: '',
        isLoading: false,
        reviewStatusMap: {
          0: '待财务审核',
          1: '待boss审核',
        },
        reviewStatus: "",
        purchaseTypeMap: {
          0: '代发采购单',
          1: '库存采购单',
        },
        purchaseType: -1,
        status: 4,
      };
    },
  },
};
