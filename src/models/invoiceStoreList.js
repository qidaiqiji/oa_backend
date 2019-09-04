import modelExtend from 'dva-model-extend';
import moment from 'moment';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'invoiceStoreList',
  state: {
    // 数据
    invoiceStockData: {
      invoiceStockList: [],
    },

    // 参数
    goodsSn: '',
    invSn: '',
    goodsKeywords: '',
    invoiceDateStart: '',
    invoiceDateEnd: '',
    currentPage: 1,
    pageSize: 40,
    type: '',

    // 控制样式
    isLoading: false,
    detail: false,
  },

  effects: {
    *getInvoiceStockListData({ payload }, { put, select }) {
      const {
        goodsKeywords,
        goodsSn,
        invSn,
        invoiceDateStart,
        invoiceDateEnd,
        currentPage,
        pageSize,
        type,
      } = yield select(state => state.invoiceStoreList);
      yield put({
        type: 'getInvoiceStockList',
        payload: {
          NAME: 'invoiceStockData',
          LOADING: 'isLoading',
          goodsKeywords,
          goodsSn,
          invSn,
          invoiceDateStart,
          invoiceDateEnd,
          currentPage,
          pageSize,
          type,
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
        type: 'getInvoiceStockListData',
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
        invoiceStockData: {
          invoiceStockList: [],
        },

        // 参数
        goodsSn: '',
        invSn: '',
        goodsKeywords: '',
        invoiceDateStart: '',
        invoiceDateEnd: '',
        currentPage: 1,
        pageSize: 40,
        type: '',

        // 控制样式
        isLoading: false,
        detail: false,
      };
    },
  },
});
