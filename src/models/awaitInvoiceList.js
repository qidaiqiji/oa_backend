import modelExtend from 'dva-model-extend';
import moment from 'moment';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'awaitInvoiceList',
  state: {
    // 数据
    configData: {},
    awaitInvListData: {
      outcomeInvOrderList: [],
    },
    // 参数
    status: [3, 6, 7],
    invStatus: '',
    customerKeywords: '',
    outInvOrderSn:'',
    createDateStart: '',
    createDateEnd: '',
    sellerId: '',
    isSuitDetail: '',
    orderSn: '',
    goodsSn: '',
    orderCreateDateStart: '',
    orderCreateDateEnd: '',
    orderPayDateStart: '',
    orderPayDateEnd: '',
    currentPage: 1,
    pageSize: 40,

    // 控制样式
    isLoading: false,
    detail: false,
    invType: '',
  },

  effects: {
    *getAwaitInvoiceListData({ payload }, { put, select }) {
      const {
        status,
        customerKeywords,
        createDateStart,
        createDateEnd,
        sellerId,
        isSuitDetail,
        outInvOrderSn,
        orderSn,
        goodsSn,
        orderCreateDateStart,
        orderCreateDateEnd,
        orderPayDateStart,
        orderPayDateEnd,
        currentPage,
        pageSize,
        invType,
      } = yield select(state => state.awaitInvoiceList);
      yield put({
        type: 'reqAwaitInvoiceList',
        payload: {
          NAME: 'awaitInvListData',
          LOADING: 'isLoading',
          status,
          customerKeywords,
          createDateStart,
          createDateEnd,
          sellerId,
          isSuitDetail,
          outInvOrderSn,
          orderSn,
          goodsSn,
          orderCreateDateStart,
          orderCreateDateEnd,
          orderPayDateStart,
          orderPayDateEnd,
          currentPage,
          pageSize,
          invType,
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount({ payload }, { put }) {
      yield put({
        type: 'getConfig',
        payload: {
          NAME: 'configData',
        },
      });
      yield put({
        type: 'getAwaitInvoiceListData',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 数据
        configData: {},
        awaitInvListData: {
          outcomeInvOrderList: [],
        },
        // 参数
        status: [3, 6, 7],
        invStatus: '',
        customerKeywords: '',
        outInvOrderSn: '',
        createDateStart: '',
        createDateEnd: '',
        sellerId: '',
        isSuitDetail: '',
        orderSn: '',
        goodsSn: '',
        orderCreateDateStart: '',
        orderCreateDateEnd: '',
        orderPayDateStart: '',
        orderPayDateEnd: '',
        currentPage: 1,
        pageSize: 40,

        // 控制样式
        isLoading: false,
        invType: '',
      };
    },
  },
});
