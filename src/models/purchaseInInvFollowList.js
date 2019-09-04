import moment from 'moment';
import { message } from 'antd';
import { reqInInvFollowList, reqInvoiceShippingNo, reqInvoiceRemark, reqInvoicePurchaseRemark, reqInvoiceBillConfig, reqPurchaseSupplierInfoList } from '../services/purchaseInInvFollowList.js';

export default {
  namespace: 'purchaseInInvFollowList',
  state: {
    status: [],
    supplierId: '',
    orderSn: '',
    goodsKeywords: '',
    purchaserId: '',
    createDateStart: '',
    createDateEnd: '',
    purchaseDateStart: '',
    purchaseDateEnd: '',
    payDateStart: '',
    payDateEnd: '',
    currentPage: 1,
    pageSize: 40,
    incomeInvOrderSn: '',
    onlyDebtOrder: '',
    purchaserMap: {},
    supplierMap: {},
    incomeInvOrderStatusMap: {},
    incomeInvOrderStoreStatusMap: {},
    InvSuitDetailMap: {},
    pageChange: '',
    suppliers: [],
    totalActionList: [],
    supplierSearchText: '',
    isSuitDetail: '',
    orderIds:[],

  },
  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getList',
      });
    },
    *changeConfig({ payload }, { put }) {
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    *postShippingNo({ payload }, { call }) {
      try {
        const res = yield call(reqInvoiceShippingNo, { ...payload });
        if (res) message.success(res.msg);
        else message.warning('添加物流单号失败');
      } catch (err) {
        console.log(err);
      }
    },
    *remarkOk({ payload }, { call, put, select }) {
      const { pageChange } = yield select(state => state.purchaseInInvFollowList);
      try {
        if (pageChange === '3') {
          yield call(reqInvoiceRemark, { ...payload });
        } else {
          yield call(reqInvoicePurchaseRemark, { ...payload });
        }
        yield put({
          type: 'getList',
        });
      } catch (err) {
        console.log(err);
      }

    },
    *getList({ payload }, { put, call, all, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      try {
        const purchaseInInvFollowList = yield select(state => state.purchaseInInvFollowList);
        const {
          status,
          supplierId,
          orderSn,
          goodsKeywords,
          purchaserId,
          createDateStart,
          createDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
          incomeInvOrderSn,
          onlyDebtOrder,
          pageChange,
          supplierSearchText,
          isSuitDetail,
          orderIds,
        } = purchaseInInvFollowList;
        const Status = (status.length === 0 && (pageChange === '3' ? ['4', '6'] : ['1', '2', '3', '4', '5', '6', '7'])) || status;
        const OnlyDebtOrder = pageChange === '2' ? 1 : null;
        const res = yield all([call(reqInInvFollowList, {
          status: Status,
          supplierId,
          orderSn,
          goodsKeywords,
          purchaserId,
          createDateStart,
          createDateEnd,
          purchaseDateStart,
          purchaseDateEnd,
          payDateStart,
          payDateEnd,
          currentPage,
          pageSize,
          incomeInvOrderSn,
          onlyDebtOrder: OnlyDebtOrder,
          isSuitDetail,
        }), call(reqInvoiceBillConfig)]);
        yield put({
          type: 'getListResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
            orderIds,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *changeSupplier({ payload }, { put, call, select }) {
      const { supplierSearchText, supplierId } = yield select(state => state.purchaseInInvFollowList);
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
        status: [],
        supplierId: '',
        orderSn: '',
        goodsKeywords: '',
        purchaserId: '',
        createDateStart: '',
        createDateEnd: '',
        purchaseDateStart: '',
        purchaseDateEnd: '',
        payDateStart: '',
        payDateEnd: '',
        currentPage: 1,
        pageSize: 40,
        incomeInvOrderSn: '',
        onlyDebtOrder: '',
        purchaserMap: {},
        supplierMap: {},
        incomeInvOrderStatusMap: {},
        incomeInvOrderStoreStatusMap: {},
        InvSuitDetailMap: {},
        pageChange: '',
        suppliers: [],
        totalActionList: [],
        supplierSearchText: '',
        isSuitDetail: '',
        orderIds:[],
      };
    },
  },
};
