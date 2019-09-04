import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { reqUrl } from '../services/billDetail';
import BillModel from '../common/Sale/billModel';
import { get } from 'http';
import { request } from 'https';
import { createBill } from '../common/Sale/billService';
import { notification } from 'antd/lib/index';

export default modelExtend(BillModel, {
  namespace: 'billDetail',
  state: {
    // 接口所需参数
    customerId: -1,
    expireStartTime: '',
    expireEndTime: '',
    orderStartTime: '',
    orderEndTime: '',
    orderSn: '',
    goodsKeywords: '',
    pageSize: 40,
    currentPage: 1,
    goodsInfoList: [],
    useBalance: 0,
    commitReceiveRecord: {},
    remark: '',
    // 控制样式或状态
    isLoading: false,
    selectBillIds: [],
    selectedRows: [],
    selectedRowsAmount: [],
    resetSelectedRowsAmount: [],
    selectedRowsObjArray: [],
    resetSelectedRowsObjArray: [],
    showReconciliationModal: false,
    confirmLoading: false,
    showReceiveModal: false,
    showReceiveFormModal: false,
    receiveRecord: {},
    srcArr: [],
    carouselModalTitle: '',
    showCarouselModal: false,
    // 配置项数据
    statusData: {},
    // 收款记录详情
    paymentDetailData: {},
    // 获取待客户对账列表
    awaitCustomerData: {},
    // 待财务销账列表
    awaitFinanceData: {},
    // 待财务销账列表
    creditCompleteData: {},
    // 调用改变数量街扩所取数据
    countedData: {},
    // 调用生成对账单接口
    createBillData: {},
    // 调用客户详情接口所取数据
    customerDetailData: {
      customerInfo: {
      },
    },
    // 客户销售账期分表接口所取数据
    paymentListData: {
      total: -1,
      paymentList: [

      ],
    },
    actionList:[]
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *handleOperatorRequest({ payload }, { put, call, select }) {
      const { customerId } = yield select(state => state.billDetail);
      try {
        const res = yield call(reqUrl, { url: payload.url });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '操作成功！',
          });
          yield put({
            type: 'getCreditCheckBillList',
            payload: {
              returnDataName: 'awaitCustomerData',
              customerId,
              status: 1,
            },
          });
          yield put({
            type: 'getCreditCheckBillList',
            payload: {
              returnDataName: 'awaitFinanceData',
              customerId,
              status: 2,
            },
          });
          yield put({
            type: 'getCreditCheckBillList',
            payload: {
              returnDataName: 'creditCompleteData',
              customerId,
              status: 3,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
      // do something
      }
    },
    *changeGoodsNum({ payload }, { put }) {
      yield put({
        type: 'changeGoodsCount',
        payload: {
          NAME: 'countedData',
          ...payload,
        },
      });
    },
    *getCreditCheckBillList({ payload }, { put }) {
      yield put({
        type: 'reqCreditCheckBill',
        payload: {
          NAME: payload.returnDataName,
          LOADING: 'isLoading',
          ...payload,
        },
      });
    },
    *getSalePaymentDetail({ payload }, { put }) {
      yield put({
        type: 'reqSalePaymentDetail',
        payload: {
          NAME: 'paymentDetailData',
          LOADING: 'isLoading',
          ...payload,
        },
      });
    },
    *receiveRecordAdd({ payload }, { put, call, select }) {
      const { commitReceiveRecord } = yield select(state => state.billDetail);
      const promise = yield put({
        type: 'addReceiveRecord',
        payload: {
          LOADING: 'confirmLoading',
          ...payload,
        },
      });
      const res = yield call(() => promise);
      yield put({
        type: 'getSalePaymentDetail',
        payload: {
          checkBillId: commitReceiveRecord.checkBillId,
        },
      });
    },
    *createBillOrder({ payload }, { put }) {
      yield put({
        type: 'createBill',
        payload: {
          NAME: 'createBillData',
          LOADING: 'confirmLoading',
          ...payload,
        },
      });
    },
    *changeSelectBillIds({ payload }, { put }) {
      yield put({
        type: 'updateStateReducer',
        payload,
      });
    },
    *requestPaymentList({ payload }, { put, select }) {
      const {
        customerId,
        expireStartTime,
        expireEndTime,
        orderStartTime,
        orderEndTime,
        orderSn,
        goodsKeywords,
        pageSize,
        currentPage,
      } = yield select(state => state.billDetail);
      yield put({
        type: 'getPaymentList',
        payload: {
          customerId,
          expireStartTime,
          expireEndTime,
          orderStartTime,
          orderEndTime,
          orderSn,
          goodsKeywords,
          pageSize,
          currentPage,
          NAME: 'paymentListData',
          LOADING: 'isLoading',
          ...payload,
        },
      });
    },
    *mount({ payload }, { put }) {
      yield put({
        type: 'reqSaleStatusMap',
        payload: {
          NAME: 'statusData',
        },
      });
      yield put({
        type: 'getCustomerDetail',
        payload: {
          NAME: 'customerDetailData',
          ...payload,
        },
      });
      yield put({
        type: 'requestPaymentList',
        payload: {
          customerId: payload.customerId,
        },
      });
      yield put({
        type: 'changeGoodsCount',
        payload: {
          goodsInfoList: [],
          useBalance: 0,
          customerId: payload.customerId,
          NAME: 'countedData',
        },
      });
      yield put({
        type: 'getCreditCheckBillList',
        payload: {
          returnDataName: 'awaitCustomerData',
          customerId: payload.customerId,
          status: 1,
        },
      });
      yield put({
        type: 'getCreditCheckBillList',
        payload: {
          returnDataName: 'awaitFinanceData',
          customerId: payload.customerId,
          status: 2,
        },
      });
      yield put({
        type: 'getCreditCheckBillList',
        payload: {
          returnDataName: 'creditCompleteData',
          customerId: payload.customerId,
          status: 3,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 接口所需参数
        customerId: -1,
        expireStartTime: '',
        expireEndTime: '',
        orderStartTime: '',
        orderEndTime: '',
        orderSn: '',
        goodsKeywords: '',
        pageSize: 40,
        currentPage: 1,
        goodsInfoList: [],
        useBalance: 0,
        commitReceiveRecord: {},
        remark: '',
        // 控制样式或状态
        isLoading: false,
        selectBillIds: [],
        selectedRows: [],
        selectedRowsAmount: [],
        resetSelectedRowsAmount: [],
        selectedRowsObjArray: [],
        resetSelectedRowsObjArray: [],
        showReconciliationModal: false,
        confirmLoading: false,
        showReceiveModal: false,
        showReceiveFormModal: false,
        receiveRecord: {},
        srcArr: [],
        carouselModalTitle: '',
        showCarouselModal: false,
        // 配置项数据
        statusData: {},
        // 收款记录详情
        paymentDetailData: {},
        // 获取待客户对账列表
        awaitCustomerData: {},
        // 待财务销账列表
        awaitFinanceData: {},
        // 待财务销账列表
        creditCompleteData: {},
        // 调用改变数量街扩所取数据
        countedData: {},
        // 调用生成对账单接口
        createBillData: {},
        // 调用客户详情接口所取数据
        customerDetailData: {
          customerInfo: {
          },
        },
        // 客户销售账期分表接口所取数据
        paymentListData: {
          total: -1,
          paymentList: [
          ],
        },
        actionList:[]
      };
    },
  },
});
