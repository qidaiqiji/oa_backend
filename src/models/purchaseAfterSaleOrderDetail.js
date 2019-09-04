import { routerRedux } from 'dva/router';
import { reqAddRefund, reqOrderInfo, reqStartupOrderAction, reqConfig, requestDelete } from '../services/purchaseAfterSaleOrderDetail';
import { notification } from 'antd';

export default {
  namespace: 'purchaseAfterSaleOrderDetail',

  state: {

    status: null,
    sn: null,
    relatedPurchaseOrderSn: null,
    relatedPurchaseOrderStatus: null,
    supplierName: null,
    purchaserName: null,
    isReturnGoods: null,
    isSpecial: null,
    specialPrice: null,
    receiptMethod: null,
    totalMoney: null,
    receiptedMoney: null,
    receivable: null,
    awaitReceiptMoney: null,
    remark: null,
    address: null,
    consigneeName: null,
    mobile: null,
    actionList: [],
    rejectRemark: '',
    payRemark: '',
    operaRecordList: [],
    goodsList: [],
    refundOrderList: [],

    isOrderLoading: true,
    isShowRefundOrderDetail: false,
    selectRefundOrder: {},

    // 付款凭证相关
    collectAccountMap: [],
    collectAccount: -1,
    payMethod: -1,
    collectMoney: 0,
    collectDate: '',
    payAccount: '',
    isShowAddRefundModal: false,
    isAddingRefund: false,
    financeRemark: '',
    transactionSn: '',
    isDelete: false,
    isShowPayInfoConfirm: false,
    relateInInvFollowList:[],
    backOrderType:''
  },

  effects: {
    *mount({ payload }, { put, call, all }) {
      yield put({
        type:'changeReducer',
        payload:{
          ...payload,
        }
      })
      try {
        const [orderInfo, config] = yield all([call(reqOrderInfo, { ...payload }), call(reqConfig)]);
        // const num1 = orderInfo.data.receiptedMoney;
        // const num2 = orderInfo.data.awaitReceiptMoney;
        let receivable = 0;
        // let a1 = 0;
        // let a2 = 0;
        // let m = 0;
        // if (+num1 % 1 !== 0) {
        //   a1 = (num1.toString()).split('.')[1].length;
        // }
        // if (+num2 % 1 !== 0) {
        //   a2 = (num2.toString()).split('.')[1].length;
        // }
        // // m = Math.pow(10, Math.max(a1, a2));
        // if (a1 >= a2) {
        //   m = 10 ** a1;
        // } else {
        //   m = 10 ** a2;
        // }
        // receivable = ((+num1 * m) + (+num2 * m)) / m;
        yield put({
          type: 'mountResolved',
          payload: {  
            ...orderInfo.data,
            ...config.data,
            receivable,
          },
        });
      } catch (error) {
        yield put({
          type: 'mountRejected',
        });
      }
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *triggerAddRefundModal(_, { put }) {
      yield put({
        type: 'triggerAddRefundModalReducer',
      });
    },
    *addRefund({ payload }, { put, call, select }) {
      yield put({
        type: 'addRefundPending',
      });
      const {
        collectAccount,
        collectDate,
        collectMoney,
        payAccount,
        transactionSn,
        financeRemark,
      } = yield select(state => state.purchaseAfterSaleOrderDetail);
      try {
        yield call(reqAddRefund, {
          collectAccount,
          collectDate,
          collectMoney,
          payAccount,
          transactionSn,
          remark: financeRemark,
          purchaseBackOrderId: payload.purchaseBackOrderId,
        });
        const res = yield call(reqOrderInfo, { ...payload });
        yield put({
          type: 'addRefundResolved',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'addRefundRejected',
        });
      }
    },
    *triggerRefundOrderDetail({ payload }, { put, select }) {
      const {
        refundOrderList,
      } = yield select(state => state.purchaseAfterSaleOrderDetail);
      let selectRefundOrder = {};
      refundOrderList.forEach((refundOrder) => {
        if (refundOrder.id === payload.id) {
          selectRefundOrder = refundOrder;
        }
      });
      yield put({
        type: 'triggerRefundOrderDetailReducer',
        payload: {
          selectRefundOrder,
          ...payload,
        },
      });
    },
    *triggerOrderAction({ payload }, { put }) {
      yield put({
        type: 'triggerOrderActionReducer',
        payload: {
          ...payload,
        },
      });
    },
    *confirmDelete({ payload },{ put, call }) {
      try{
        const res = yield call(requestDelete,{ id:payload.deleteId,totalOrderId: payload.id, type:payload.type})
        if(+res.code === 0) {
          notification.success({
            message:res.msg,
          })
        }
        yield put({
          type:'changeReducer',
          payload:{
            ...payload,
            isDelete:false,
          }
        })
        yield put({
          type: 'mount',
          payload: {
            purchaseBackOrderId: payload.id,
          },
        })
      }catch(err) {
        yield put({
          type:'changeReducer',
          payload:{
            isDelete:false,
          }
        })

      }
    },
    *startupOrderAction({payload}, { put, select, call }) {
      yield put({
        type: 'startupOrderActionPending',
        payload:{
          ...payload,
        }
      });
      const {
        orderId,
        actionUrl,
        backUrl,
        text,
        rejectRemark,
      } = yield select(state => state.purchaseAfterSaleOrderDetail);
      try {
        yield call(reqStartupOrderAction, orderId, actionUrl, rejectRemark);
        if (text === '删除') {
          yield put(routerRedux.push(backUrl));
          return false;
        }
        yield put({
          type: 'mount',
          payload: {
            purchaseBackOrderId: orderId,
          },
        });
      } catch (error) {
        yield put({
          type: 'startupOrderActionRejected',
          payload:{
            isLoadingActionModal:false,
          }
        });
      }
    },
  },

  reducers: {
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isOrderLoading: false,
        isLoadingActionModal: false,
        isShowActionModal: false,
        rejectRemark: '',
      };
    },
    triggerAddRefundModalReducer(state) {
      return {
        ...state,
        isShowAddRefundModal: !state.isShowAddRefundModal,
      };
    },
    addRefundPending(state) {
      return {
        ...state,
        isAddingRefund: true,
      };
    },
    addRefundResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isAddingRefund: false,
        isShowAddRefundModal: false,
        collectAccount: -1,
        collectMoney: 0,
        collectDate: '',
        payAccount: '',
      };
    },
    addRefundRejected(state) {
      return {
        ...state,
        isAddingRefund: false,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    startupOrderActionRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    triggerRefundOrderDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRefundOrderDetail: !state.isShowRefundOrderDetail,
      };
    },
    triggerOrderActionReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: !state.isShowActionModal,
      };
    },
    startupOrderActionPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingActionModal: true,
      };
    },
    startupOrderActionResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingActionModal: false,
        isShowActionModal: false,
      };
    },
    unmountReducer() {
      return {
        status: null,
        sn: null,
        relatedPurchaseOrderSn: null,
        relatedPurchaseOrderStatus: null,
        supplierName: null,
        purchaserName: null,
        isReturnGoods: null,
        isSpecial: null,
        specialPrice: null,
        receiptMethod: null,
        totalMoney: null,
        receiptedMoney: null,
        receivable: null,
        awaitReceiptMoney: null,
        remark: null,
        address: null,
        consigneeName: null,
        mobile: null,
        actionList: [],
        rejectRemark: '',
        payRemark: '',
        operaRecordList: [],
        goodsList: [],
        refundOrderList: [],

        isOrderLoading: true,
        isShowRefundOrderDetail: false,
        selectRefundOrder: {},

        // 付款凭证相关
        collectAccountMap: [],
        collectAccount: -1,
        payMethod: -1,
        collectMoney: 0,
        collectDate: '',
        payAccount: '',
        isShowAddRefundModal: false,
        isAddingRefund: false,
        financeRemark: '',
        transactionSn: '',
        isDelete: false,
        isShowPayInfoConfirm: false,
        relateInInvFollowList:[],
        backOrderType:''
      };
    },
  },
};