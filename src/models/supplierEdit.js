import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
  reqAddSupplier,
  reqEditSupplier,
  reqGetSupplierInfo,
} from '../services/supplierEdit';

export default {
  namespace: 'supplierEdit',

  state: {
    id: null,
    supplierName: '',
    address: [],
    sn: '',
    contractExpire: '',
    supplierLevel: 1,
    status: 1,
    linkmanQQ: '',
    linkmanName: '',
    linkmanMobile: '',
    linkmanEmail: '',
    linkmanJob: '',
    depositBank: '',
    depositName: '',
    // 财务备注
    financeRemarks: [''],
    bankNum: '',
    invoiceTitle: '',
    remark: '',
    isLoading: false,
  },

  effects: {
    *getSupplierInfo({ payload }, { put, call }) {
      yield put({
        type: 'getSupplierInfoPending',
      });
      try {
        const res = yield call(reqGetSupplierInfo, { ...payload });
        yield put({
          type: 'getSupplierInfoResolved',
          payload: {
            ...res.data,
          },
        });
        console.log("res",res)
      } catch (error) {
        yield put({
          type: 'getSupplierInfoRejected',
        });
      }
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeFinanceRemark({ payload }, { put, select }) {
      const { index, value } = payload;
      const {
        financeRemarks,
      } = yield select(state => state.supplierEdit);
      financeRemarks[index] = value;
      yield put({
        type: 'changeFinanceRemarkReducer',
        payload: {
          financeRemarks,
        },
      });
    },
    *reduceFinanceMark({ payload }, { put, select }) {
      const { index } = payload;
      const {
        financeRemarks,
      } = yield select(state => state.supplierEdit);
      financeRemarks.splice(index, 1);
      yield put({
        type: 'reduceFinanceMarkReducer',
        payload: {
          financeRemarks,
        },
      });
    },
    *plusFinanceMark(_, { put, select }) {
      const {
        financeRemarks,
      } = yield select(state => state.supplierEdit);
      financeRemarks.push('');
      yield put({
        type: 'plusFinanceMarkReducer',
        payload: {
          financeRemarks,
        },
      });
    },

    *saveSupplier(_, { call, put, select }) {
      try {
        const supplierEdit = yield select(state => state.supplierEdit);
        if (!supplierEdit.supplierName) {
          message.error('请填写供应商名称');
          return;
        }
        if (!supplierEdit.linkmanName) {
          message.error('请填写联系人姓名');
          return;
        }
        if (!supplierEdit.linkmanMobile) {
          message.error('请填写联系人手机号');
          return;
        }
        if (supplierEdit.id) {
          yield call(reqEditSupplier, { ...supplierEdit });
        } else {
          yield call(reqAddSupplier, { ...supplierEdit });
        }
        yield put(routerRedux.push('/purchase/supplier-list'));
        notification.success({
          message: '成功',
          description: supplierEdit.id ? '修改供应商成功' : '新增供应商成功',
        });
      } catch (error) {
        // do
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    getSupplierInfoPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getSupplierInfoResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getSupplierInfoRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    changeFinanceRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    plusFinanceMarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reduceFinanceMarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        id: null,
        supplierName: '',
        address: [],
        sn: '',
        contractExpire: '',
        supplierLevel: 1,
        status: 1,
        linkmanQQ: '',
        linkmanName: '',
        linkmanMobile: '',
        linkmanEmail: '',
        linkmanJob: '',
        depositBank: '',
        depositName: '',
        financeRemarks: [''],
        bankNum: '',
        invoiceTitle: '',
        remark: '',
        isLoading: false,
      };
    },
  },
};
