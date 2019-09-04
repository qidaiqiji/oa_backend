import cloneDeep from 'lodash/cloneDeep';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
  reqGetConfig,
  reqGetOrderDetail,
  reqGenCashBillCollection,
  reqStartupOrderAction,
  reqGetSupplierInfo,
  reqDelete,
} from '../services/purchaseApplyForPaymentDetail';

export default {
  namespace: 'purchaseApplyForPaymentDetail',

  state: {
    pageId: '',
    purchaseSn: '',
    supplier: '',
    isLoading: true,
    collectAccountMap: {},
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
    isCredit:false,
    isShowDeleteModal: false,
    payByCash:{
      12: "现款现结",
      13: "现款-货到票到付款",
    },
    payByDirect: {
      14: "购销7天",
      15: "购销15天",
      16: "购销月结",
      17: "购销60天"
    },
    payByAgency: {
      18: "代销7天",
      19: "代销15天",
      20: "代销月结",
      21: "代销60天"
    },
    isAllCash:false,
    isAllDirect:false,
    isAllAgency:false,
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
            pageId: payload.id,
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
      const purchaseApplyForPaymentDetail = yield select(state => state.purchaseApplyForPaymentDetail);
      const { payInfo } = purchaseApplyForPaymentDetail;
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
    *confirmDelete({ payload },{ put, call }) {
      try{
        const res = yield call(reqDelete,{ id:payload.deleteId, totalOrderId:payload.id, type:payload.type });
        if(+res.code === 0) {
          notification.success({
            message:res.msg,
          })
        }
        yield put({
          type:'changReducer',
          payload:{
            ...payload,
            isShowDeleteModal:false,
          }
        })
        yield put({
          type: 'getOrderDetail',
          payload:{
            id:payload.id,
          }
        })

      }catch(err){
        yield put({
          type:'changReducer',
          payload:{
            isShowDeleteModal:false,
          }
        })
      }
    },
    *clickOkGenConfirm({ payload }, { call, put, select }) {
      yield put({
        type: 'clickOkGenConfirmPending',
      });
      const { isCredit } = yield select(state=>state.purchaseApplyForPaymentDetail)      
      if(isCredit) {
        payload.payMethod = 2;
      }
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
      const purchaseApplyForPaymentDetail = yield select(state => state.purchaseApplyForPaymentDetail);
      const { actionRemark, backUrl } = purchaseApplyForPaymentDetail;
      try {
        yield call(reqStartupOrderAction, { ...payload, remark: actionRemark });
        message.success('申请成功');
        if (backUrl) {
          yield put(routerRedux.push(backUrl));
          return;
        }
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
    *checkIsSamePayMethod({ payload },{ put, select }) {
      const { detail, payByDirect, payByCash, payByAgency } = yield select(state=>state.commonPurchaseDetail);
      let cashResult = detail.goodsList.map(item=>{
        if(Object.keys(payByCash).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let directResult = detail.goodsList.map(item=>{
        if(Object.keys(payByDirect).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let agencyResult = detail.goodsList.map(item=>{
        if(Object.keys(payByAgency).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let isAllCash = cashResult.every(item=>{
        return item;
      })
      let isAllDirect = directResult.every(item=>{
        return item;
      })
      let isAllAgency = agencyResult.every(item=>{
        return item;
      })
      yield put({
        type:'changeActionRemarkReducer',
        payload:{
          isAllCash,
          isAllDirect,
          isAllAgency,
        }
      })
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
        pageId: '',
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
        collectAccountMap: {},
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
        isCredit:false,
        payableTotalAmount: 0,
        receivableTotalAmount: 0,
        receivableTotal: 0,
        isShowDeleteModal: false,
        payByCash:{
          12: "现款现结",
          13: "现款-货到票到付款",
        },
        payByDirect: {
          14: "购销7天",
          15: "购销15天",
          16: "购销月结",
          17: "购销60天"
        },
        payByAgency: {
          18: "代销7天",
          19: "代销15天",
          20: "代销月结",
          21: "代销60天"
        },
        isAllCash:false,
        isAllDirect:false,
        isAllAgency:false,
      };
    },
  },
};
