import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reqAction, reqGetConfig, reqGetAfterSaleOrderDetail, reqDeleteOrder, reqCancelOrder, reqAddRefundRecord, reqBossOpera, reqDepotOpera, reqFinanceOpera, reqDeleteStream, reqCancelStream } from '../services/afterSaleOrderDetail';

export default {
  namespace: 'afterSaleOrderDetail',

  state: {
    // orderStatusMap: {},
    // 退款账户 map
    withholdAccountMap: [],

    // 退款到某地 map
    refundToMap: {},

    // 以下为是否可操作某项
    canBossCheck: false,
    canFinanceCheck: false,
    canDepotCheck: false,
    canBossReject: false,
    canFinanceReject: false,
    canDepotReject: false,
    canCancel: false,
    canDelete: false,
    canEdit: false,
    canAddRefundStream: false,
    // 是否退货
    isReturn: false,
    // 是否驳回
    isReject: false,
    // 以下为订单相关信息
    checkStatus: 0,
    backOrderSn: '',
    orderSn: {
      id: 0,
      sn: '',
    },
    customer: '',
    orderStatus: 0,
    type: '',
    mobile: '',
    isSpecial: false,
    specialPrice: '',
    refundType: 0,
    saler: '',
    refundInfoContent: '',
    remark: '',
    refundInfo: {},
    goodsList: [],
    operationList: [],
    refundStream: [{}],
    // 操作相关
    actionList: [],
    isShowActionModal: false,
    isActing: false,
    actionRemark: '',
    actionUrl: '',
    actionId: null,

    // ui
    isLoading: true,
    isShowGenModal: false,
    isShowOperaRecord: false,
    isOperaing: false,
    isShowRefundModal: false,
    isShowRefundDetailModal: false,
    isShowCancelStreamModal: false,
    isShowDeleteStreamModal: false,

    withholdAccount: -1,
    refundTo: '',
    payAmount: '',
    payDate: '',
    receivableName: '',
    receivableBank: '',
    receivableCard: '',
    refundRemark: '',

    operaRole: '',
    operaType: '',
    refundStreamId: '',
    refundStreamType: '',
    streamIndex: 0,
    purchaseOrderSn: [],
    isShowNoticeModal: false,
    noticeText: '',
    noticeOrderList: [],
    isPurchaseOrder: 0,
    actionRemark: "",
    managerCheckRemark: "",
    depotCheckRemark: "",
    purchaserCheckRemark: "",
    financeCheckRemark: ""
  },

  effects: {
    *mount({ payload }, { call, put, all }) {
      try {
        const res = yield all([
          call(reqGetConfig), call(reqGetAfterSaleOrderDetail, { ...payload }),
        ]);
        yield put({
          type: 'mountResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
            ...payload,
          },
        });
      } catch (error) {
        // do rejected
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getOrderDetail({ payload }, { call, put }) {
      try {
        const res = yield call(reqGetAfterSaleOrderDetail, { ...payload });
        yield put({
          type: 'getOrderDetailResolved',
          payload: {
            ...payload,
            ...res.data,
          },
        });
      } catch (error) {
        // do something
      }
    },
    *clickTriggerCancelStreamModal({ payload }, { put }) {
      yield put({
        type: 'clickTriggerCancelStreamModalReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkCancelStreamModal({ payload }, { put, call }) {
      yield put({
        type: 'clickOkOperaPending',
      });
      try {
        yield call(reqCancelStream, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkOperaRejected',
        });
      }
    },
    *clickTriggerDeleteStreamModal({ payload }, { put }) {
      yield put({
        type: 'clickTriggerDeleteStreamModalReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkDeleteStreamModal({ payload }, { put, call }) {
      yield put({
        type: 'clickOkOperaPending',
      });
      try {
        yield call(reqDeleteStream, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            ...payload,
          },
        });
      } catch (error) {
        // dodo
        yield put({
          type: 'clickOkOperaRejected',
        });
      }
    },
    *clickTriggerRefundDetailModal({ payload }, { put }) {
      yield put({
        type: 'clickTriggerRefundDetailModalReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickTriggerOperaRecord(_, { put }) {
      yield put({
        type: 'clickTriggerOperaRecordReducer',
      });
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickTriggerRefundModal(_, { put }) {
      yield put({
        type: 'clickTriggerRefundModalReducer',
      });
    },
    *clickOkRefundModal({ payload }, { put, call }) {
      yield put({
        type: 'clickOkOperaPending',
      });
      try {
        yield call(reqAddRefundRecord, { ...payload });
        yield put({
          type: 'afterSaleOrderDetail/getOrderDetail',
          payload: {
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkOperaRejected',
        });
      }
    },
    *triggerActionModal({ payload }, { put }) {
      yield put({
        type: 'triggerActionModalReducer',
        payload,
      });
    },
    *okActionModal(_, { put, call, select }) {
      yield put({
        type: 'okActionModalPending',
      });
      const {
        actionRemark,
        actionUrl,
        actionId,
        actionText,
      } = yield select(state => state.afterSaleOrderDetail);
      let payload = {};
      payload = actionText.indexOf("审核") > -1 ? { id: actionId, checkRemark: actionRemark } : { id: actionId, remark: actionRemark }
      try {
        const res = yield call(reqAction, actionUrl, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: actionId,
            actionRemark: ""
          },
        });
        if (res.data.length > 0) {
          yield put({
            type: 'changeReducer',
            payload: {
              isShowNoticeModal: true,
              noticeText: res.msg,
              noticeOrderList: res.data,
              isPurchaseOrder: res.isPurchaseOrder,
            },
          });
        } else {
          notification.success({
            message: res.msg,
          });
        }
        yield put({
          type: 'okActionModalResolved',
        });
      } catch (error) {
        yield put({
          type: 'okActionModalResolved',
        });
      }
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
    clickTriggerCancelStreamModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowCancelStreamModal: !state.isShowCancelStreamModal,
      };
    },
    clickTriggerDeleteStreamModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowDeleteStreamModal: !state.isShowDeleteStreamModal,
      };
    },
    clickTriggerRefundDetailModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRefundDetailModal: !state.isShowRefundDetailModal,
      };
    },
    clickTriggerOperaRecordReducer(state) {
      return {
        ...state,
        isShowOperaRecord: !state.isShowOperaRecord,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickTriggerRefundModalReducer(state) {
      return {
        ...state,
        isShowRefundModal: !state.isShowRefundModal,
      };
    },
    triggerActionModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: !state.isShowActionModal,
      };
    },
    okActionModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: true,
      };
    },
    okActionModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: false,
        isShowActionModal: false,
      };
    },
    okActionModalRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: false,
      };
    },
    getOrderDetailResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
        isShowGenModal: false,
        isShowOperaRecord: false,
        isOperaing: false,
        isShowRefundModal: false,
        isShowRefundDetailModal: false,
        isShowCancelStreamModal: false,
        isShowDeleteStreamModal: false,
        withholdAccount: -1,
        refundTo: '',
        payAmount: '',
        payDate: '',
        receivableName: '',
        receivableBank: '',
        receivableCard: '',
        refundRemark: '',
        operaRole: '',
        operaType: '',
        refundId: '',
        streamIndex: 0,
        transactionSn: '',
        receivableCard: '',
      };
    },
    unmountReducer() {
      return {
        // orderStatusMap: {},
        // 退款账户 map
        withholdAccountMap: [],

        // 退款到某地 map
        refundToMap: {},

        // 以下为是否可操作某项
        canBossCheck: false,
        canFinanceCheck: false,
        canDepotCheck: false,
        canBossReject: false,
        canFinanceReject: false,
        canDepotReject: false,
        canCancel: false,
        canDelete: false,
        canEdit: false,
        canAddRefundStream: false,
        // 是否退货
        isReturn: false,
        // 是否驳回
        isReject: false,
        // 以下为订单相关信息
        checkStatus: 0,
        backOrderSn: '',
        orderSn: {
          id: 0,
          sn: '',
        },
        customer: '',
        orderStatus: 0,
        type: '',
        mobile: '',
        isSpecial: false,
        specialPrice: '',
        refundType: 0,
        saler: '',
        refundInfoContent: '',
        remark: '',
        refundInfo: {},
        goodsList: [],
        operationList: [],
        refundStream: [{}],
        // 操作相关
        actionList: [],
        isShowActionModal: false,
        isActing: false,
        actionUrl: '',
        actionId: null,

        // ui
        isLoading: true,
        isShowGenModal: false,
        isShowOperaRecord: false,
        isOperaing: false,
        isShowRefundModal: false,
        isShowRefundDetailModal: false,
        isShowCancelStreamModal: false,
        isShowDeleteStreamModal: false,

        withholdAccount: -1,
        refundTo: '',
        payAmount: '',
        payDate: '',
        receivableName: '',
        receivableBank: '',
        receivableCard: '',
        refundRemark: '',

        operaRole: '',
        operaType: '',
        refundId: '',
        streamIndex: 0,
        purchaseOrderSn: [],
        isShowNoticeModal: false,
        noticeText: '',
        noticeOrderList: [],
        isPurchaseOrder: 0,
        actionRemark: "",
        managerCheckRemark: "",
        depotCheckRemark: "",
        purchaserCheckRemark: "",
        financeCheckRemark: ""
      };
    },
  },
};
