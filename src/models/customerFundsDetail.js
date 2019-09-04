import moment from 'moment';
import { reqGetConfig, reqGetCustomerInfo, reqGetFinanceDetail, reqAddReceivedRecord, reqAddPayRecord } from '../services/customerFundsDetail';

export default {
  namespace: 'customerFundsDetail',

  state: {
    userId: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    fundsType: '-1',
    customer: '',
    payableAmount: '',
    receivableAmount: '',
    fundsTypeMap: {},
    receivableAccountMap: [],
    receivableAccount: '',
    streamList: [],
    isLoading: false,
    isShowRecordConfirm: false,
    isRecordLoading: false,
    recordType: '',
    amount: '',
    remark: '',
  },

  effects: {
    // 拉取总用户资金
    *getConfig({ payload }, { put, call, all }) {
      // yield select((state) => { console.log(state); });
      try {
        const { configData, customerData } = yield all({
          configData: call(reqGetConfig),
          customerData: call(reqGetCustomerInfo, { userId: payload.userId }),
        });
        yield put({
          type: 'configReducer',
          payload: {
            ...payload,
            ...configData.data,
            ...customerData.data,
          },
        });
        yield put({
          type: 'getList',
          payload: {
            ...payload,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 筛选日期及类型
    *getList({ payload }, { put, call }) {
      yield put({
        type: 'streamListLoading',
      });
      try {
        const res = yield call(reqGetFinanceDetail, { ...payload });
        yield put({
          type: 'updateStreamList',
          payload: {
            ...payload,
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 弹窗
    *clickAddRecord({ payload }, { put }) {
      yield put({
        type: 'addRecordReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 取消弹窗
    *clickCancelChangeRecord(_, { put }) {
      yield put({
        type: 'cancelChangeRecord',
      });
    },
    // 修改amount
    *changeAmount({ payload }, { put }) {
      yield put({
        type: 'changeAmountReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改receivableAccount
    *changeReceivableAccount({ payload }, { put }) {
      yield put({
        type: 'changeReceivableAccountReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改remark
    *changeRemark({ payload }, { put }) {
      yield put({
        type: 'changeRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 添加付款或回款记录
    *clickOkChangeRecord({ payload }, { put, call, select }) {
      yield put({
        type: 'clickOkChangeRecordLoading',
      });
      const { fundsType, startDate, endDate } = yield select(state => state.customerFundsDetail);
      try {
        if (payload.recordType) {
          const res = yield call(reqAddPayRecord, { ...payload });
        } else {
          const res = yield call(reqAddReceivedRecord, { ...payload });
        }
        yield put({
          type: 'clickOkChangeRecordReducer',
        });
        try {
          const customerData = yield call(reqGetCustomerInfo, { userId: payload.userId });
          yield put({
            type: 'configReducer',
            payload: {
              ...customerData.data,
            },
          });
        } catch (error) {
          // to do
        }
        yield put({
          type: 'getList',
          payload: {
            userId: payload.userId,
            fundsType,
            startDate,
            endDate,
          },
        });
      } catch (error) {
        // to do
        yield put({
          type: 'clickOkChangeRecordErrorReducer',
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
    clickOkChangeRecordErrorReducer(state) {
      return {
        ...state,
        isRecordLoading: false,
      };
    },
    clickOkChangeRecordReducer(state) {
      return {
        ...state,
        amount: '',
        remark: '',
        receivableAccount: '',
        isRecordLoading: false,
        isShowRecordConfirm: false,
      };
    },
    clickOkChangeRecordLoading(state) {
      return {
        ...state,
        isRecordLoading: true,
      };
    },
    changeRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeReceivableAccountReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeAmountReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    cancelChangeRecord(state) {
      return {
        ...state,
        isShowRecordConfirm: false,
      };
    },
    addRecordReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRecordConfirm: true,
      };
    },
    updateStreamList(state, { payload }) {
      return {
        ...state,
        ...payload,
        amount: '',
        remark: '',
        receivableAccount: '',
        isLoading: false,
      };
    },
    streamListLoading(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    configReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        userId: '',
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        fundsType: '-1',
        customer: '',
        payableAmount: '',
        receivableAmount: '',
        fundsTypeMap: {},
        receivableAccountMap: [],
        receivableAccount: '',
        streamList: [],
        isLoading: false,
        isShowRecordConfirm: false,
        isRecordLoading: false,
        recordType: '',
        amount: '',
        remark: '',
      };
    },
  },
};
