import moment from 'moment';
import { reqGetConfig, reqGetSupplierInfo, reqGetFinanceDetail, reqAddReceivedRecord, reqAddPayRecord } from '../services/supplierFundsDetail';

export default {
  namespace: 'supplierFundsDetail',

  state: {
    supplierId: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    fundsType: '-1',
    supplierCompany: '',
    contacts: '',
    payableTotalAmount: '',
    receivableTotalAmount: '',
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
        const { configData, supplierData } = yield all({
          configData: call(reqGetConfig),
          supplierData: call(reqGetSupplierInfo, { supplierId: payload.supplierId }),
        });
        yield put({
          type: 'configReducer',
          payload: {
            ...payload,
            ...configData.data,
            ...supplierData.data,
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
        type: 'getListPending',
      });
      try {
        const res = yield call(reqGetFinanceDetail, { ...payload });
        yield put({
          type: 'getListResolved',
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
        type: 'cancelChangeRecordReducer',
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
      const { fundsType, startDate, endDate } = yield select(state => state.supplierFundsDetail);
      try {
        if (payload.recordType) {
          yield call(reqAddPayRecord, { ...payload });
        } else {
          yield call(reqAddReceivedRecord, { ...payload });
        }
        yield put({
          type: 'clickOkChangeRecordResolved',
        });
        try {
          const supplierData = yield call(reqGetSupplierInfo, { supplierId: payload.supplierId });
          yield put({
            type: 'configReducer',
            payload: {
              ...supplierData.data,
            },
          });
        } catch (error) {
          //
        }
        yield put({
          type: 'getList',
          payload: {
            supplierId: payload.supplierId,
            fundsType,
            startDate,
            endDate,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkChangeRecordRejected',
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
    clickOkChangeRecordRejected(state) {
      return {
        ...state,
        isRecordLoading: false,
      };
    },
    clickOkChangeRecordResolved(state) {
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
    cancelChangeRecordReducer(state) {
      return {
        ...state,
        amount: '',
        remark: '',
        receivableAccount: '',
        isShowRecordConfirm: false,
        isRecordLoading: false,
      };
    },
    addRecordReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRecordConfirm: true,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        amount: '',
        remark: '',
        receivableAccount: '',
        isLoading: false,
      };
    },
    getListPending(state) {
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
        supplierId: '',
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        fundsType: '-1',
        supplierCompany: '',
        contacts: '',
        payableTotalAmount: '',
        receivableTotalAmount: '',
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
