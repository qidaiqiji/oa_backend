import moment from 'moment';
import { reqGetOrderList, reqGetConfig } from '../services/purchaseApplyForPaymentList.js';

export default {
  namespace: 'purchaseApplyForPaymentList',

  state: {
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    curPage: 1,
    pageSize: 40,
    keywords: '',
    total: '',
    isLoading: false,
    orderInfos: [],
    statusMap: {},
    status:"",
    reviewStatus: '',
    purchaseTypeMap: [],
    purchasePayOrderType: "",
    purchaseType: -1,
    applicationTypeMap: {},
    payTimeStart: "",
    payTimeEnd: "",
    actionList: [],
    purchaserMap: {},
    goodsKeywords:"",
    goodsSn:"",
    purchaser:"",
    selectStatusMap: {}
  },

  effects: {
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        // const statusArr = Object.keys(res.data.statusMap);
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

            // status: '',
            // purchaseType: '',
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
        purchasePayOrderType,
        payTimeStart,
        payTimeEnd,
        goodsKeywords,
        goodsSn,
        purchaser,

      } = yield select(state => state.purchaseApplyForPaymentList);
      try {
        const res = yield call(reqGetOrderList, {
          curPage,
          pageSize,
          status,
          purchaseType,
          startDate,
          endDate,
          keywords,
          purchasePayOrderType,
          payTimeStart,
          payTimeEnd,
          goodsKeywords,
          goodsSn,
          purchaser,
        });
        const orderInfos = res.data.purchaseOrderPayList;
        yield put({
          type: 'getOrderListReducer',
          payload: {
            orderInfos,
            total: res.data.total,
            actionList:res.data.actionList,
            ...payload,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changePurchaseType({ payload }, { put, select }) {
      const purchaseApplyForPaymentList = yield select(state => state.purchaseApplyForPaymentList);
      const {
        reviewStatus,
      } = purchaseApplyForPaymentList;
      yield put({
        type: 'getOrderList',
        payload: {
          status: reviewStatus,
          ...payload,
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
        statusMap: {},
        status:"",
        purchasePayOrderType: "",
        reviewStatus: '',
        purchaseTypeMap: [],
        purchaseType: -1,
        applicationTypeMap: {},
        payTimeStart: "",
        payTimeEnd: "",
        actionList: [],
        purchaserMap: {},
        goodsKeywords:"",
        goodsSn:"",
        purchaser:"",
        selectStatusMap: {}
      };
    },
  },
};
