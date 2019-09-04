import moment from 'moment';
import { message } from 'antd';
import { reqAwaitInvoiceGoodsList, reqInvoiceBillConfig, reqMaskList, reqPurchaseSupplierInfoList } from '../services/purchaseAwaitInvoiceGoodsList.js';

export default {
  namespace: 'purchaseAwaitInvoiceGoodsList',

  state: {
    supplierId: '',
    purchaseId: '',
    goodsKeywords: '',
    purchaserId: '',
    predictInvDateStart: '',
    predictInvDateEnd: '',
    purchaseDateStart: '',
    purchaseDateEnd: '',
    payDateStart: '',
    payDateEnd: '',
    currentPage: 1,
    pageSize: 40,
    purchaserMap: {},
    orderIds: [],
    selectedRows: [],
    isShowMask: false,
    InputNumList: [],
    remark: '',
    CheckboxIds: true,
    suppliers: [],
    awaitInvoiceGoodsList: [],
    totalActionList: [],
    supplierSearchText: '',
    historyInvAmount: [],
    total: '',
    payTypeMap: {},

  },
  effects: {
    *changeConfig({ payload }, { put }) {
      //   console.log(payload)
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    // 选中
    *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
      yield put({
        type: 'supplyGoodsCheckboxIdsReducer',
        payload: {
          orderIds: payload.supplyGoodsCheckboxIds,
          selectedRows: payload.selectedRows,
        },
      });
    },
    // 显示弹出框
    *showMask({ payload }, { put }) {
      yield put({
        type: 'isShowMask',
        payload: {
          ...payload,
        },
      });
    },
    *cancelMask({ payload }, { put }) {
      yield put({
        type: 'isShowMask',
        payload: {
          ...payload,
        },
      });
    },
    // 弹窗数字改变
    *handleInputNum({ payload }, { put }) {
      yield put({
        type: 'handleInputNum',
        payload: {
          payload,
        },
      });
    },
    *getList({ payload }, { put, call, all, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      try {
        const purchaseAwaitInvoiceGoodsList = yield select(state => state.purchaseAwaitInvoiceGoodsList);
        const {
          supplierId,
          purchaseId,
          goodsKeywords,
          purchaserId,
          predictInvDateStart,
          predictInvDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
          payType
        } = purchaseAwaitInvoiceGoodsList;
        const res = yield all([call(reqAwaitInvoiceGoodsList, {
          supplierId,
          purchaseId,
          goodsKeywords,
          purchaserId,
          predictInvDateStart,
          predictInvDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
          payType,
        }), call(reqInvoiceBillConfig)]);
        yield put({
          type: 'getListResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *changeMaskList({ payload }, { put, call, all, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          isShowMask: false,
          remark: '',
        },
      });
      try {
        const response = yield call(reqMaskList, { ...payload });
        message.success(response.msg);
        yield put({
          type: 'getList',
          payload: {
            selectedRows:[],
            orderIds:[],
          },
        });
      } catch (err) {
        console.log(err);
        yield put({
          type: 'getListResolved',
          payload: {
            selectedRows:[],
            orderIds:[],
          },
        });
      }

    },
    // 搜索供应商
    *changeSupplier({ payload }, { put, call, select }) {

      // const res = yield call(reqPurchaseSupplierInfoList, { ...payload });
      // yield put({
      //   type: 'getListResolved',
      //   payload: {
      //     suppliers: res.data.suppliers,
      //   },
      // });
      const { supplierId } = yield select(state => state.purchaseAwaitInvoiceGoodsList);
      const res = yield call(reqPurchaseSupplierInfoList, { keywords: payload.supplierSearchText });
      yield put({
        type: 'getListResolved',
        payload: {
          suppliers: res.data.suppliers,
          ...payload,
        },
      });
      if (!payload.supplierSearchText && supplierId) {
        yield put({
          type: 'getList',
          payload: {
            ...payload,
          },
        });
        yield put({
          type: 'getListResolved',
          payload: {
            supplierId: '',
          },
        });
      }
    },
    *getSupplier({ payload }, { put, select, call }) {
      yield put({
        type: 'getListPending',
      });
      try {
        const purchaseAwaitInvoiceGoodsList = yield select(state => state.purchaseAwaitInvoiceGoodsList);
        const {
          supplierId,
          purchaseId,
          goodsKeywords,
          purchaserId,
          predictInvDateStart,
          predictInvDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
        } = purchaseAwaitInvoiceGoodsList;
        const res = yield call(reqAwaitInvoiceGoodsList, {
          supplierId,
          purchaseId,
          goodsKeywords,
          purchaserId,
          predictInvDateStart,
          predictInvDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            ...res.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },
  reducers: {
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    updateConfig(state, { payload }) {
      console.log(24342);
      return {
        ...state,
        ...payload,
      };
    },
    supplyGoodsCheckboxIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 弹出框
    isShowMask(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 备注
    changeRemark(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 选中项
    saveSelectSupplier(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    unmountReducer() {
      return {
        supplierId: '',
        purchaseId: '',
        goodsKeywords: '',
        purchaserId: '',
        predictInvDateStart: '',
        predictInvDateEnd: '',
        purchaseDateStart: '',
        purchaseDateEnd: '',
        payDateStart: '',
        payDateEnd: '',
        currentPage: 1,
        pageSize: 40,
        purchaserMap: {},
        orderIds: [],
        selectedRows: [],
        InputNumList: [],
        remark: '',
        CheckboxIds: true,
        suppliers: [],
        awaitInvoiceGoodsList: [],
        totalActionList: [],
        supplierSearchText: '',
        historyInvAmount: [],
        total: '',
        payTypeMap: {},
      };
    },
  },

};
