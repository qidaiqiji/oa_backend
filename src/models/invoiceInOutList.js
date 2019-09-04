import modelExtend from 'dva-model-extend';
import moment from 'moment';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'invoiceInOutList',
  state: {
    // 数据
    configData: {},
    invoiceListData: {
      invoiceList: [],
    },

    // 参数
    invoiceKeywords: '',
    companyKeywords: '',
    goodsKeywords: '',
    invoiceDateStart: '',
    invoiceDateEnd: '',
    invoiceSourceType: '',
    isSuitDetail: '',
    currentPage: 1,
    pageSize: 40,
    inStorageDateStart: '',
    inStorageDateEnd: '',

    // 控制样式
    isLoading: false,
  },

  effects: {
    *getInvoiceListData({ payload }, { put, select }) {
      const {
        invoiceKeywords,
        companyKeywords,
        goodsKeywords,
        invoiceDateStart,
        invoiceDateEnd,
        invoiceSourceType,
        isSuitDetail,
        currentPage,
        pageSize,
        inStorageDateStart,
        inStorageDateEnd,
      } = yield select(state => state.invoiceInOutList);
      yield put({
        type: 'getInvoiceList',
        payload: {
          NAME: 'invoiceListData',
          LOADING: 'isLoading',
          invoiceKeywords,
          companyKeywords,
          goodsKeywords,
          invoiceDateStart,
          invoiceDateEnd,
          invoiceSourceType,
          isSuitDetail,
          currentPage,
          pageSize,
          inStorageDateStart,
          inStorageDateEnd,
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount(_, { put }) {
      yield put({
        type: 'getConfig',
        payload: {
          NAME: 'configData',
        },
      });
      yield put({
        type: 'getInvoiceListData',
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 数据
        configData: {},
        invoiceListData: {
          invoiceList: [],
        },

        // 参数
        invoiceKeywords: '',
        companyKeywords: '',
        goodsKeywords: '',
        invoiceDateStart: '',
        invoiceDateEnd: '',
        invoiceSourceType: '',
        isSuitDetail: '',
        currentPage: 1,
        pageSize: 40,

        // 控制样式
        isLoading: false,
        inStorageDateStart: '',
        inStorageDateEnd: '',
      };
    },
  },
});
