import { routerRedux } from 'dva/router';
import { reqOrderList } from '../services/paymentRecord';

export default {
  namespace: 'paymentRecord',

  state: {
    keywords: null,
    startDate: null,
    endDate: null,
    curPage: 1,
    pageSize: 40,
    total: 0,
    paymentOrderList: [],

    isTableLoading: true,
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount(_, { put, call, select }) {
      const paymentRecord = yield select(state => state.paymentRecord);
      const {
        keywords,
        startDate,
        endDate,
        curPage,
        pageSize,
      } = paymentRecord;
      try {
        const res = yield call(reqOrderList, {
          keywords,
          startDate,
          endDate,
          curPage,
          pageSize,
          payType: 2,
          checkStatus: 2,
        });
        yield put({
          type: 'mountResolved',
          payload: {
            ...res.data,
            paymentOrderList: res.data.orderList,
          },
        });
      } catch (error) {
        yield put({
          type: 'mountRejected',
        });
      }
    },
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        },
      });
      const paymentRecord = yield select(state => state.paymentRecord);
      const {
        keywords,
        startDate,
        endDate,
        curPage,
        pageSize,
      } = paymentRecord;
      try {
        const res = yield call(reqOrderList, {
          keywords,
          startDate,
          endDate,
          curPage,
          pageSize,
          payType: 2,
          checkStatus: 2,
          ...payload,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
    *changeSiftItem({ payload }, { put }) {
      yield put({
        type: 'changeSiftItemReducer',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        keywords: null,
        startDate: null,
        endDate: null,
        curPage: 1,
        pageSize: 40,
        total: 0,
        paymentOrderList: [],

        isTableLoading: true,
      };
    },
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: false,
      };
    },
    getOrderListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: true,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: false,
      };
    },
    changeSiftItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
