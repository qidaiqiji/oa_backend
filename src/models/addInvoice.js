import modelExtend from 'dva-model-extend';
import moment from 'moment';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'addInvoice',
  state: {
    // 数据
    configData: {},
    invGoodsNameListData: {
      invoiceGoodsList: [],
    },

    // 参数
    invSourceType: '',
    invDate: '',
    relativeInvSn: '',
    invSn: '',
    invGoodsList: [],
    selectedIds: [],
    selectedRows: [],
    currentPage: 1,
    pageSize: 40,
    taxRate: 0.13,
    // 控制样式
    isLoading: false,
    isShowInvGoodsNameModal: false,
    isShowAddInvoiceGoodsNameModal: false,
    addInvoiceGoodsNameList: [{
      goodsName: '',
      goodsSn: '',
      invGoodsName: '',
      size: '',
      unit: '',
      id: '新增发票名称',
      isAdd: true,
    }],
    isInvGoodsNameLoading: false,
    edit: false,
    sizeEdit: false,
    unitEdit: false,
    numEdit: false,
    priceEdit: false,
    amountEdit: false,
    taxAmountEdit: false,
    totalAmountEdit: false,
  },

  effects: {
    *getInvGoodsNameListData({ payload }, { put, select }) {
      const {
        goodsKeywords,
        currentPage,
        pageSize,
      } = yield select(state => state.addInvoice);
      yield put({
        type: 'reqInvGoodsNameList',
        payload: {
          NAME: 'invGoodsNameListData',
          LOADING: 'isLoading',
          goodsKeywords,
          currentPage,
          pageSize,
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
        type: 'getInvGoodsNameListData',
        payload: {
          NAME: 'invGoodsNameListData',
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 数据
        configData: {},
        siftGoods: [],
        invGoodsNameListData: {
          invoiceGoodsList: [],
        },
        // 参数
        invSourceType: '',
        invDate: '',
        relativeInvSn: '',
        invSn: '',
        invGoodsList: [],
        selectedIds: [],
        selectedRows: [],
        currentPage: 1,
        pageSize: 40,
        taxRate: 0.13,
        // 控制样式
        isLoading: false,
        isShowInvGoodsNameModal: false,
        isShowAddInvoiceGoodsNameModal: false,
        isInvGoodsNameLoading: false,
        addInvoiceGoodsNameList: [{
          goodsName: '',
          goodsSn: '',
          invGoodsName: '',
          size: '',
          unit: '',
          id: '新增发票名称',
          isAdd: true,
        }],
        edit: false,
        sizeEdit: false,
        unitEdit: false,
        numEdit: false,
        priceEdit: false,
        amountEdit: false,
        taxAmountEdit: false,
        totalAmountEdit: false,
      };
    },
  },
});
