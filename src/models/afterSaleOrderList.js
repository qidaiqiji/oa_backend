import moment from 'moment';
import { reqAfterSaleOrderListConfig, reqAfterSaleOrderList } from '../services/afterSaleOrderList';

export default {
  namespace: 'afterSaleOrderList',

  state: {
    checkStatusMap: {},
    orderTypeMap: {},
    orderList: [],
    checkStatus: -1,
    orderType: -1,
    date: [moment().add(-30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    // payTime: [moment().add(-30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    payTimeStart: '',
    payTimeEnd: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    // endDate: ,
    orderSn: '',
    customer: '',
    goodsSn: '',
    isLoading: true,
    curPage: 1,
    pageSize: 40,
    selectedRowKeys: [],
    refundTypeMap: {},
    sellerMap: {},
    refundType: -1,
    sellerId:-1,
    isMerchant: 0,
    actionList: [],
    backOrderTypeMap:{},
    backOrderType:-1
  },

  effects: {
    *mount({ payload }, { call, put, all }) {
      yield put({
        type: 'changeReducer',
        payload:{
          ...payload,
        }
      });
      
      try {
        const res = yield all([call(reqAfterSaleOrderListConfig), call(reqAfterSaleOrderList, { ...payload })]);
        yield put({
          type: 'mountResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
          },
        });
      } catch (error) {
        // do something
      }
    },
    *getOrderList({ payload }, { call, put }) {
      yield put({
        type: 'getOrderListPending',
      });
      try {
        const res = yield call(reqAfterSaleOrderList, { ...payload });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...res.data,
            ...payload,
            selectedRowKeys: [],
          },
        });
      } catch (error) {
        // do something
      }
    },
    *change({ payload }, { put }) {
      
      yield put({
        type: 'changeReducer',
        payload:{
          ...payload,
          
        }
      });
    },
  },

  reducers: {
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getOrderListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmount() {
      return {
        checkStatusMap: {},
        orderTypeMap: {},
        orderList: [],
        checkStatus: -1,
        orderType: -1,
        date: [moment().add(-30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        // payTime: [moment().add(-30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        payTimeStart: '',
        payTimeEnd: '',
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        // endDate: ,
        orderSn: '',
        customer: '',
        goodsSn: '',
        isLoading: true,
        curPage: 1,
        pageSize: 40,
        selectedRowKeys: [],
        refundTypeMap: {},
        sellerMap: {},
        refundType: -1,
        sellerId:-1,
        isMerchant: 0,
        actionList: [],
        backOrderTypeMap:{},
        backOrderType:-1
      };
    },
  },
};
