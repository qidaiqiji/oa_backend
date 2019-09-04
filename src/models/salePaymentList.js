import moment from 'moment';
import { reqGetSalePaymentList } from '../services/salePaymentList';
import { reqBusinessOwner } from '../services/salePaymentMessage';


export default {
  namespace: 'salePaymentList',
  state: {
    customerId: '',
    keywords: '',
    orderSn: '',
    seller: '',
    createStartTime: '',
    createEndTime: '',
    receiptStartTime: '',
    receiptEndTime: '',
    currentPage: 1,
    pageSize: 50,
    status: '',
    Status: '',
    isLoading: false,
    checkBillList: [],
    detail: [],
    resBussiness: {},
    totalActionList: [],
  },
  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getList',
      });
    },
    *changeConfig({ payload }, { put }) {
      //   console.log(payload)
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    *getList({ payload }, { put, call, select, all }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      try {
        const stateConfig = yield select(state => state.salePaymentList);
        const { customerId,
          keywords,
          orderSn,
          seller,
          createStartTime,
          createEndTime,
          currentPage,
          pageSize,
          status,
        } = stateConfig;
        const res = yield all([call(reqGetSalePaymentList, {
          status,
          customerId,
          keywords,
          orderSn,
          seller,
          createStartTime,
          createEndTime,
          currentPage,
          pageSize,
          ...payload }), call(reqBusinessOwner)]);
        const resBussiness = res[1].data.sellerMap;
        yield put({
          type: 'getListResolved',
          payload: {
            ...res[0].data,
            resBussiness,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *commonChanges({ payload }, { put }) {
      yield put({
        type: 'commonChange',
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
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    updateConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    commonChange(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        customerId: '',
        keywords: '',
        orderSn: '',
        seller: '',
        createStartTime: '',
        createEndTime: '',
        receiptStartTime: '',
        receiptEndTime: '',
        currentPage: 1,
        pageSize: 50,
        status: '',
        Status: '',
        checkBillList: [],
        detail: [],
        resBussiness: {},
        totalActionList: [],
      };
    },
  },
  subscriptions: {
  },
  // 底部
};
