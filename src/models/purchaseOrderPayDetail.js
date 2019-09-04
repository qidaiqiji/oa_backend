import cloneDeep from 'lodash/cloneDeep';
import { message } from 'antd';
import {
  reqGetConfig,
  reqGetOrderDetail,
  reqGenCashBillCollection,
  reqStartupOrderAction,
  reqGetSupplierInfo,
} from '../services/purchaseOrderPayDetail';

export default {
  namespace: 'purchaseOrderPayDetail',

  state: {
    purchaseSn: '',
    supplier: '',
    isLoading: true,
    collectAccountMap: [],
    // 付款信息--
    purchaseAmount: 0,
    alreadyPay: 0,
    awaitConfirm: 0,
    awaitPay: 0,
    payList: [],
    payInfo: {},
    detail: {
      goodsList: [],
    },
    purchaseOrderList: [

    ],
    isShowPayInfoConfirm: false,
    isShowGenConfirm: false,
    isGening: false,
    remark: '',
    payMethod: -1,
    transactionSn: '',
    collectAccount: -1,
    amount: 0,
    backTime: '',
    payId: -1,
    collectionType: 0,
    checkType: '',
    payAmount: 0,
    payTime: '',
    collectionId: null,

    actionList: [],
    isShowActionConfirm: false,
    isActioning: false,
    actionRemark: '',
    actionText: '',
    isNeedRemark: false,
    url: '',

    payItems: {},
    payMethodMap: {},

    payableTotalAmount: 0,
    receivableTotalAmount: 0,
    receivableTotal: 0,
  },

  effects: {
    // 拉取订单详情
    *getOrderDetail({ payload }, { put, call, all }) {
      yield ({
        type: 'getOrderDetailPending',
      });
      try {
        const [config, res] = yield all([call(reqGetConfig), call(reqGetOrderDetail, { ...payload })]);
        yield put({
          type: 'getOrderDetailResolved',
          payload: {
            detailType: res.data.status,
            ...config.data,
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *showPayInfoConfirm({ payload }, { put }) {
      let obj = {};
      for (let i = 0; i < payload.payInfo.payList.length; i += 1) {
        if (payload.id === payload.payInfo.payList[i].id) {
          obj = cloneDeep(payload.payInfo.payList[i]);
        }
      }
      yield put({
        type: 'showPayInfoConfirmReducer',
        payload: {
          payItems: obj,
        },
      });
    },
    *clickOkPayInfoButto(_, { put }) {
      yield put({
        type: 'clickOkPayInfoButtoReducer',
      });
    },
    *triggerGenConfirm(_, { put, call, select }) {
      const purchaseOrderPayDetail = yield select(state => state.purchaseOrderPayDetail);
      const { payInfo } = purchaseOrderPayDetail;
      yield put({
        type: 'triggerGenConfirmReducer',
      });
      try {
        const res = yield call(reqGetSupplierInfo, { supplierId: payInfo.supplierId });
        yield put({
          type: 'getSupplierInfoReducer',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkGenConfirm({ payload }, { call, put }) {
      yield put({
        type: 'clickOkGenConfirmPending',
      });
      try {
        yield call(reqGenCashBillCollection, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkGenConfirmRejected',
        });
      }
    },
    // 弹窗action
    *clickActionPopUp({ payload }, { put }) {
      yield put({
        type: 'clickActionPopUpReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 取消action弹窗
    *cancelActionConfirm(_, { put }) {
      yield put({
        type: 'cancelActionConfirmReducer',
      });
    },
    // 修改action备注
    *changeActionRemark({ payload }, { put }) {
      yield put({
        type: 'changeActionRemarkReducer',
        payload: {
          actionRemark: payload.value,
        },
      });
    },
    // 确认action弹窗
    *clickOkAction({ payload }, { put, call, select }) {
      const purchaseOrderPayDetail = yield select(state => state.purchaseOrderPayDetail);
      const { actionRemark } = purchaseOrderPayDetail;
      try {
        yield call(reqStartupOrderAction, { ...payload, remark: actionRemark });
        message.success('申请成功');
        yield put({
          type: 'cancelActionConfirm',
        });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.id,
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
    getSupplierInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeActionRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    cancelActionConfirmReducer(state) {
      return {
        ...state,
        isShowActionConfirm: false,
        isActioning: false,
        actionRemark: '',
        actionText: '',
        isNeedRemark: false,
        url: '',
      };
    },
    clickActionPopUpReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionConfirm: true,
      };
    },
    clickOkGenConfirmRejected(state) {
      return {
        ...state,
        isGening: false,
      };
    },
    clickOkGenConfirmPending(state) {
      return {
        ...state,
        isGening: true,
      };
    },
    triggerGenConfirmReducer(state) {
      return {
        ...state,
        isShowGenConfirm: !state.isShowGenConfirm,
      };
    },
    clickOkPayInfoButtoReducer(state) {
      return {
        ...state,
        isShowPayInfoConfirm: false,
      };
    },
    showPayInfoConfirmReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowPayInfoConfirm: true,
      };
    },
    getOrderDetailPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getOrderDetailResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowGenConfirm: false,
        isGening: false,
        isLoading: false,
      };
    },
    changReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        purchaseSn: '',
        supplier: '',
        isLoading: true,
        // 付款信息--
        purchaseAmount: 0,
        alreadyPay: 0,
        awaitConfirm: 0,
        awaitPay: 0,
        payList: [],
        payInfo: {},
        detail: {
          goodsList: [],
        },
        purchaseOrderList: [

        ],
        isShowPayInfoConfirm: false,
        isShowGenConfirm: false,
        isGening: false,
        remark: '',
        payMethod: -1,
        transactionSn: '',
        collectAccount: -1,
        collectAccountMap: [],
        amount: '',
        backTime: '',
        payId: '',
        collectionType: '',
        checkType: '',
        payAmount: '',
        payTime: '',
        collectionId: null,

        actionList: [],
        isShowActionConfirm: false,
        isActioning: false,
        actionRemark: '',
        actionText: '',
        isNeedRemark: false,
        url: '',

        payItems: {},
        payMethodMap: {},

        payableTotalAmount: 0,
        receivableTotalAmount: 0,
        receivableTotal: 0,
      };
    },
  },
};
