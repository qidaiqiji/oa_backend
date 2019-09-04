import { reqGetTotalCustomerFunds, reqGetCustomerList, reqGetAccountFinanceList } from '../services/customerFundsList';

export default {
  namespace: 'customerFundsList',

  state: {
    balanceCustomerNum: '',
    balanceTotalAmount: '',
    creditCustomerNum: '',
    creditTotalAmount: '',
    siftCustomers: [],
    customerInfos: [],
    customerName: '',
    isLoading: false,
    actionList: [],
  },

  effects: {
    // 拉取总用户资金
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetTotalCustomerFunds);
        yield put({
          type: 'configReducer',
          payload: {
            ...res.data,
          },
        });
        yield put({
          type: 'changeCustomer',
          payload: {
            userId: '',
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 搜索客户
    *searchCustomerList({ payload }, { put, call }) {
      const { keywords } = payload;
      if (keywords === '') {
        yield put({
          type: 'searchCustomerListReducer',
          payload: {
            siftCustomers: [],
          },
        });
        return;
      }
      try {
        const res = yield call(reqGetCustomerList, { keywords, currentPage: 1 });
        yield put({
          type: 'searchCustomerListReducer',
          payload: {
            siftCustomers: res.data.users,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 选择客户
    *changeCustomer({ payload }, { put, call }) {
      yield put({
        type: 'changeCustomerLoading',
      });
      try {
        const res = yield call(reqGetAccountFinanceList, { userId: payload.userId });
        yield put({
          type: 'getAccountFinanceListReducer',
          payload: {
            customerInfos: res.data.accountList,
            actionList: res.data.actionList,
          },
        });
      } catch (error) {
        // to do
      }
    },

    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    getAccountFinanceListReducer(state, { payload }) {
      const { customerInfos } = payload;
      let customerName = '';
      if (customerInfos.length === 1) {
        customerName = customerInfos[0].customer;
      }
      return {
        ...state,
        ...payload,
        customerName,
        isLoading: false,
      };
    },
    changeCustomerLoading(state) {
      return {
        ...state,
        isLoading: true,
        siftCustomers: [],
      };
    },
    searchCustomerListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
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
        balanceCustomerNum: '',
        balanceTotalAmount: '',
        creditCustomerNum: '',
        creditTotalAmount: '',
        siftCustomers: [],
        customerInfos: [],
        customerName: '',
        isLoading: false,
        actionList: [],
      };
    },
  },
};
