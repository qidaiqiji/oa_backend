import { routerRedux } from 'dva/router';
import { reqOrderList } from '../services/saleOrderReceive';

export default {
  namespace: 'saleOrderReceive',

  state: {
    customer: null,
    orderStartTime: null,
    orderEndTime: null,
    curPage: 1,
    pageSize: 40,
    total: 0,
    orderList: [],

    isTableLoading: true,
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount(_, { put, call, select }) {
      const saleOrderReceive = yield select(state => state.saleOrderReceive);
      const {
        customer,
        orderStartTime,
        orderEndTime,
        curPage,
        pageSize,
      } = saleOrderReceive;
      try {
        const res = yield call(reqOrderList, {
          customer,
          orderStartTime,
          orderEndTime,
          curPage,
          pageSize,
        });
        yield put({
          type: 'mountResolved',
          payload: {
            ...res.data,
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
      const saleOrderReceive = yield select(state => state.saleOrderReceive);
      const {
        customer,
        orderStartTime,
        orderEndTime,
        curPage,
        pageSize,
      } = saleOrderReceive;
      try {
        const res = yield call(reqOrderList, {
          customer,
          orderStartTime,
          orderEndTime,
          curPage,
          pageSize,
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
        customer: null,
        orderStartTime: null,
        orderEndTime: null,
        curPage: 1,
        pageSize: 40,
        total: 0,
        orderList: [],

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
