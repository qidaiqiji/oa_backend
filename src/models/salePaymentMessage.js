import moment from 'moment';
import { reqGetSalePaymentDetail, reqAddReceipt, reqBusinessOwner } from '../services/salePaymentMessage';

export default {
  namespace: 'salePaymentMessage',
  state: {
    isLoading: false,
    paymentDetail: [],
    detail: [],
    shouldReceiveAmount: '',
    realShouldReceiveAmount: '',
    sellerRemark: '',
    seller: '',
    companyName: '',
    customerName: '',
    checkBillSn: '',
    receivedAmount: '',
    saleAmount: '',
    balanceAmount: '',
    afterSaleAmount: '',
    isShowReceipt: false,
    collectAccountMap: [],
    actionList: [],
    checkBillId: '',
    receiveImg: '',
    reqMessage: {},
  },
  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getList',
      });
    },
    *getList({ payload }, { put, select, call, all }) {
      yield put({
        type: 'getListPending',
      });
      try {
        const stateConfig = yield select(state => state.salePaymentMessage);
        const { checkBillId } = stateConfig;
        const res = yield all([call(reqGetSalePaymentDetail, { checkBillId }), call(reqBusinessOwner)]);
        const collectAccountMap = res[1].data.collectAccountMap;
        yield put({
          type: 'getListResolved',
          payload: {
            ...res[0].data,
            collectAccountMap,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *updatePage({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
        },
      });
    },
    *addReceiptVoucher({ payload }, { put, call }) {
      try {
        const reqMessage = yield call(reqAddReceipt, payload);
        yield put({
          type: 'getListResolved',
          payload: {
            reqMessage,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *handleOk({ payload }, { put, call }) {
      yield put({
        type: 'handleOk',
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },
  reducers: {
    getListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getListResolved(state, { payload } = {}) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addReceiptVoucher(state, { payload }) {
      return {
        ...state,
      };
    },
    handleOk(state) {
      return {
        ...state,
        isShowReceipt: false,
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
        paymentDetail: [],
        detail: [],
        shouldReceiveAmount: '',
        realShouldReceiveAmount: '',
        sellerRemark: '',
        seller: '',
        companyName: '',
        customerName: '',
        checkBillSn: '',
        receivedAmount: '',
        saleAmount: '',
        balanceAmount: '',
        afterSaleAmount: '',
        isShowReceipt: true,
        collectAccountMap: [],
        actionList: [],
        checkBillId: '',
        receiveImg: '',
        reqMessage: {},
      };
    },
  },
  subscriptions: {


  },

  // 底部
};
