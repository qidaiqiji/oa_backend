import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reqEditSubOrderRemark, reqGetOrderDetail, reqGetConfig, reqChangeLogistics, reqBossCheckTotalOrder, reqFinanceCheckTotalOrder, reqObsoleteTotalOrder, reqBossRejectTotalOrder, reqFinanceRejectTotalOrder, reqGenCashBillCollection, reqGenCreditBillCollection, reqGenBalanceBillCollection, reqDeleteCollection, reqObsoleteCollection, reqDeleteTotalOrder, reqDelay, reqCancelDelay, reqCancelReject } from '../services/saleOrderDetail';
import SaleOrderDetail from '../routes/Sale/SaleOrderDetail';

export default {
  namespace: 'saleOrderDetail',

  state: {
    tabStatus: '1',
    isLoading: true,
    isChecking: false,
    isRejecting: false,
    isObsoleteing: false,
    isDeleting: false,
    isShowObsoleteConfirm: false,
    isShowRejectConfirm: false,
    isShowCheckConfirm: false,
    isShowGenConfirm: false,
    isShowDeleteConfirm: false,
    isShowDeleteCollectionConfirm: false,
    isShowObsoleteCollectionConfirm: false,
    isDeletingCollection: false,
    isObsoleteingCollection: false,
    isGening: false,
    isShowEditSubOrderRemarkModal: false,
    isEditingSubOrderRemark: false,
    subOrderRemark: '',
    payMethod: -1,
    payId: -1,
    checkType: '',
    amount: '',
    payAmount: 0,
    payTime: '',
    transactionSn: '',
    backTime: '',
    remark: '',
    collectAccount: -1,
    collectionId: null,
    resendRemark: '',
    isShowRePushModel: false,
    orderId: '',
    merchantOrderNo: "",
    merchantName: '',
    payMethodMap: {

    },
    collectAccountMap: [],
    statusMap: {

    },
    totalOrder: {
      invoiceInfo: {

      },
    },
    subOrders: [

    ],
    collections: [

    ],
    operaRecord: [

    ],
    actionList:[]
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *didMount({ payload }, { call, put, all }) {
      yield put({
        type: 'getOrderDetailInit',
        payload: {
          ...payload,
        },
      });
      try {
        const res = yield all([call(reqGetConfig), call(reqGetOrderDetail, { ...payload })]);
        yield put({
          type: 'didMountResolved',
          payload: {
            ...payload,
            ...res[0].data,
            ...res[1].data,
          },
        });
      } catch (error) {
        yield put({
          type: 'didMountRejected',
        });
      }
    },
    *delay({ payload }, { call, put }) {
      try {
        const res = yield call(reqDelay, { ...payload });
        if (res.code === 0) {
          yield put({
            type: 'getOrderInfo',
          });
        }
      } catch (error) {
        // do something
      }
    },
    *cancelDelay({ payload }, { call, put }) {
      try {
        const res = yield call(reqCancelDelay, { ...payload });
        if (res.code === 0) {
          yield put({
            type: 'getOrderInfo',
          });
        }
      } catch (error) {
        // do something
      }
    },
    *triggerEditSubOrderRemarkModal({ payload }, { put }) {
      yield put({
        type: 'triggerEditSubOrderRemarkModalReducer',
        payload,
      });
    },
    // 修改子单备注
    *okEditSubOrderRemarkModal(_, { put, call, select }) {
      yield put({
        type: 'okEditSubOrderRemarkModalPending',
      });
      const {
        selectedSubOrderId,
        subOrderRemark,
      } = yield select(state => state.saleOrderDetail);
      try {
        yield call(reqEditSubOrderRemark, { orderId: selectedSubOrderId, remark: subOrderRemark });
        yield put({
          type: 'okEditSubOrderRemarkModalResolved',
        });
        yield put({
          type: 'getOrderInfo',
        });
      } catch (error) {
        yield put({
          type: 'okEditSubOrderRemarkModalRejected',
        });
      }
    },
    // 保存重新推送的备注信息
    *saveRePushRemark({ payload }, { put }) {
      yield put({
        type: 'saveRePushRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *handleRePush({ payload }, { put }) {
      yield put({
        type: 'handleRePushReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 重新推送
    *handleCancelReject({ payload }, { put, call }) {
      const { orderId, resendRemark, isShowRePushModel } = payload;
      try {
        yield call(reqCancelReject, { orderId, resendRemark });
        yield put({
          type: 'getOrderInfo',
        });
      } catch (error) {
        console.log(error);
        // TO DO
      }
      yield put({
        type: 'handleCancelRejectReducer',
        payload: {
          isShowRePushModel,
        },
      });
    },
    *changeSubOrderRemark({ payload }, { put }) {
      yield put({
        type: 'changeSubOrderRemarkReducer',
        payload,
      });
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getOrderInfo({ payload }, { call, put, select }) {
      yield put({
        type: 'getOrderInfoPending',
      });
      const {
        id,
      } = yield select(state => state.saleOrderDetail);
      try {
        const res = yield call(reqGetOrderDetail, { id, ...payload });
        yield put({
          type: 'getOrderInfoResolved',
          payload: {
            ...res.data,
            rejectRemark: '',
            payMethod: -1,
            collectAccount: -1,
            payId: -1,
            collectionType: 0,
            checkType: '',
            amount: 0,
            payAmount: 0,
            payTime: '',
            transactionSn: '',
            backTime: '',
            remark: '',
            collectionId: null,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderInfoRejected',
        });
      }
    },
    *triggerGenConfirm(_, { put }) {
      yield put({
        type: 'triggerGenConfirmReducer',
      });
    },
    *clickChangeLogistics({ payload }, { put }) {
      yield put({
        type: 'clickChangeLogisticsReducer',
        payload,
      });
    },
    *okChangeLogistics({ payload }, { call, put, select }) {
      yield put({
        type: 'okChangeLogisticsPending',
      });
      const {
        subOrderId,
        fareInfo,
      } = yield select(state => state.saleOrderDetail);
      try {
        yield call(reqChangeLogistics, { subOrderId, fareInfo: +fareInfo === 2 ? '3' : '2' });
        yield put({
          type: 'getOrderInfo',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'okChangeLogisticsRejected',
        });
      }
    },
    *clickOkGenConfirm({ payload }, { call, put }) {
      yield put({
        type: 'clickOkGenConfirmPending',
      });
      const { payMethod } = payload;
      try {
        // 现付现结
        if (payMethod === 0) {
          yield call(reqGenCashBillCollection, { ...payload });
        }
        // 账期预付
        if (payMethod === 1) {
          yield call(reqGenCreditBillCollection, { ...payload });
        }
        // 挂账对冲
        if (payMethod === 2) {
          yield call(reqGenBalanceBillCollection, { ...payload });
        }
        yield put({
          type: 'getOrderInfo',
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
    *clickOkCheckConfirmButton({ payload }, { call, put }) {
      const { checkType } = payload;
      yield put({
        type: 'clickOkConfirmPending',
      });
      try {
        if (checkType === 'Boss') {
          yield call(reqBossCheckTotalOrder, { ...payload });
        }
        if (checkType === 'Finance') {
          yield call(reqFinanceCheckTotalOrder, { ...payload });
        }
        yield put({
          type: 'getOrderInfo',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkConfirmRejected',
        });
      }
    },
    *clickOkDeleteConfirmButton({ payload }, { call, put }) {
      yield put({
        type: 'clickOkConfirmPending',
      });
      try {
        yield call(reqDeleteTotalOrder, { ...payload });
        notification.success({
          message: '提示',
          description: '删除成功',
        });
        yield put(routerRedux.push('/sale/sale-list'));
      } catch (error) {
        yield put({
          type: 'clickOkConfirmRejected',
        });
      }
    },
    *clickOkObsoleteConfirmButton({ payload }, { call, put }) {
      yield put({
        type: 'clickOkConfirmPending',
      });
      try {
        yield call(reqObsoleteTotalOrder, { ...payload });
        yield put({
          type: 'getOrderInfo',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkConfirmRejected',
        });
      }
    },
    *changeRejectRemark({ payload }, { put }) {
      yield put({
        type: 'changeRejectRemarkReducer',
        payload,
      });
    },
    *clickOkRejectConfirmButton({ payload }, { call, put, select }) {
      const { checkType } = payload;
      const { rejectRemark } = yield select(state => state.saleOrderDetail);
      yield put({
        type: 'clickOkConfirmPending',
      });
      try {
        if (checkType === 'Boss') {
          yield call(reqBossRejectTotalOrder, { remark: rejectRemark, ...payload });
        }
        if (checkType === 'Finance') {
          yield call(reqFinanceRejectTotalOrder, { remark: rejectRemark, ...payload });
        }
        yield put({
          type: 'getOrderInfo',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkConfirmRejected',
        });
      }
    },
    *clickTriggerConfirmButton({ payload }, { put }) {
      yield put({
        type: 'clickTriggerConfirmButtonReducer',
        payload: {
          ...payload,
        },
      });
    },
    *triggerObsoleteCollection({ payload }, { put }) {
      yield put({
        type: 'triggerObsoleteCollectionReducer',
        payload: {
          ...payload,
        },
      });
    },
    *triggerDeleteCollection({ payload }, { put }) {
      yield put({
        type: 'triggerDeleteCollectionReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkDeleteCollection({ payload }, { call, put }) {
      yield put({
        type: 'clickOkDeleteCollectionPending',
      });
      try {
        yield call(reqDeleteCollection, { ...payload });
        yield put({
          type: 'getOrderInfo',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkDeleteCollectionRejected',
        });
      }
    },
    *clickOkObsoleteCollection({ payload }, { call, put }) {
      yield put({
        type: 'clickOkObsoleteCollectionPending',
      });
      try {
        yield call(reqObsoleteCollection, { ...payload });
        yield put({
          type: 'getOrderInfo',
          payload: {
            id: payload.totalOrderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'clickOkObsoleteCollectionRejected',
        });
      }
    },
    *changeActiveKey({ payload }, { put }) {
      yield put({
        type: 'changeActiveKeyReducer',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        tabStatus: '1',
        isLoading: true,
        isChecking: false,
        isRejecting: false,
        isObsoleteing: false,
        isDeleting: false,
        isShowObsoleteConfirm: false,
        isShowRejectConfirm: false,
        isShowCheckConfirm: false,
        isShowGenConfirm: false,
        isShowDeleteConfirm: false,
        isShowDeleteCollectionConfirm: false,
        isShowObsoleteCollectionConfirm: false,
        isDeletingCollection: false,
        isObsoleteingCollection: false,
        isGening: false,
        isShowEditSubOrderRemarkModal: false,
        isEditingSubOrderRemark: false,
        subOrderRemark: '',
        payMethod: -1,
        collectAccount: -1,
        payId: -1,
        collectionType: 0,
        checkType: '',
        amount: 0,
        payAmount: 0,
        payTime: '',
        transactionSn: '',
        backTime: '',
        remark: '',
        collectionId: null,
        resendRemark: '',
        isShowRePushModel: false,
        orderId: '',
        merchantOrderNo: "",
        merchantName: '',
        payMethodMap: {

        },
        collectAccountMap: [],
        statusMap: {

        },
        totalOrder: {
          invoiceInfo: {

          },
        },
        subOrders: [

        ],
        collections: [

        ],
        operaRecord: [

        ],
        actionList:[]
      };
    },
    changeActiveKeyReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderDetailInit(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    didMountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    didMountRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    changeRejectRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickOkConfirmPending(state) {
      return {
        ...state,
        isChecking: true,
        isObsoleteing: true,
        isRejecting: true,
        isDeleting: true,
      };
    },
    saveRePushRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleCancelRejectReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleRePushReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickOkConfirmRejected(state) {
      return {
        ...state,
        isDeleting: false,
        isChecking: false,
        isObsoleteing: false,
        isRejecting: false,
      };
    },
    clickTriggerConfirmButtonReducer(state, { payload }) {
      const { key } = payload;
      if (key) {
        return {
          ...state,
          [key]: !state[key],
        };
      } else {
        return {
          ...state,
          isShowRejectConfirm: false,
          isShowCheckConfirm: false,
          isShowObsoleteConfirm: false,
          isShowDeleteConfirm: false,
        };
      }
    },
    triggerGenConfirmReducer(state) {
      return {
        ...state,
        isShowGenConfirm: !state.isShowGenConfirm,
      };
    },
    clickOkGenConfirmPending(state) {
      return {
        ...state,
        isGening: true,
      };
    },
    clickOkGenConfirmRejected(state) {
      return {
        ...state,
        isGening: false,
      };
    },
    triggerObsoleteCollectionReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowObsoleteCollectionConfirm: !state.isShowObsoleteCollectionConfirm,
      };
    },
    triggerDeleteCollectionReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowDeleteCollectionConfirm: !state.isShowDeleteCollectionConfirm,
      };
    },
    clickOkDeleteCollectionPending(state) {
      return {
        ...state,
        isDeletingCollection: true,
      };
    },
    clickOkDeleteCollectionRejected(state) {
      return {
        ...state,
        isDeletingCollection: false,
        isShowDeleteCollectionConfirm: false,
      };
    },
    clickOkObsoleteCollectionPending(state) {
      return {
        ...state,
        isObsoleteingCollection: true,
      };
    },
    clickOkObsoleteCollectionRejected(state) {
      return {
        ...state,
        isObsoleteingCollection: false,
        isShowObsoleteCollectionConfirm: false,
      };
    },
    getOrderInfoPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getOrderInfoResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
        isChecking: false,
        isRejecting: false,
        isObsoleteing: false,
        isDeleting: false,
        isShowObsoleteConfirm: false,
        isShowRejectConfirm: false,
        isShowCheckConfirm: false,
        isShowGenConfirm: false,
        isShowDeleteConfirm: false,
        isShowDeleteCollectionConfirm: false,
        isShowObsoleteCollectionConfirm: false,
        isDeletingCollection: false,
        isObsoleteingCollection: false,
        isGening: false,
      };
    },
    clickChangeLogisticsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderInfoRejected(state) {
      return {
        ...state,
        isLoading: false,
      };
    },

    // 修改子单的备注
    triggerEditSubOrderRemarkModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowEditSubOrderRemarkModal: !state.isShowEditSubOrderRemarkModal,
      };
    },
    okEditSubOrderRemarkModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isEditingSubOrderRemark: true,
      };
    },
    okEditSubOrderRemarkModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isEditingSubOrderRemark: false,
        isShowEditSubOrderRemarkModal: false,
        subOrderRemark: '',
      };
    },
    okEditSubOrderRemarkModalRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isEditingSubOrderRemark: false,
      };
    },
    changeSubOrderRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
