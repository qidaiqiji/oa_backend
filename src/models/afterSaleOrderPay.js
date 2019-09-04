import { routerRedux } from 'dva/router';
import { reqOrderList, reqConfig, reqCheck } from '../services/afterSaleOrderPay';
import { times } from 'number-precision';
import { stat } from 'fs';
import { notification } from 'antd';

export default {
  namespace: 'afterSaleOrderPay',

  state: {
    orderTypeMap: {},
    orderType: -1,
    customer: null,
    startDate: null,
    endDate: null,
    curPage: 1,
    pageSize: 40,
    total: 0,
    orderList: [],
    isTableLoading: true,
    refundTypeMap: {},
    sellerMap: {},
    refundType: -1,
    sellerId:-1,
    invoicedCustomer:'',
    invoicedOrderType:-1,
    invoicedRefundType:-1,
    invoicedSellerId:-1,
    invoicedStartDate:'',
    invoicedEndDate:'',
    invoicedPayTimeStart:'',
    invoicedPayTimeEnd:'',
    payTimeStart:'',
    payTimeEnd:'',
    activeKey:'1',
    invoicedOrderList:[],
    invoicedTotal:0,
    invoicedPageSize:40,
    invoicedCurPage:1,
    showModal:false,
    checkStatus:[1,6],
    invoicedCheckStatus:[1,6],
    returnInvStockMap:{},
    invStockStatus:'',
    financialCheckStatusMap:{},
    checkStatusMap:{}
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *gwtConfig({ payload },{ put, call }) {
      try{
        const config = yield call(reqConfig);
        yield put({
          type:'mountResolved',
          payload:{
            ...config.data,
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    // *mount(_, { put, call, select, all }) {
    //   const afterSaleOrderPay = yield select(state => state.afterSaleOrderPay);
    //   const {
    //     customer,
    //     startDate,
    //     endDate,
    //     curPage,
    //     pageSize,
    //     afterSaleType,
    //     orderType,
    //     refundType,
    //     sellerId,
    //   } = afterSaleOrderPay;
    //   try {
    //     const res = yield all([
    //       call(reqOrderList, {
    //         customer,
    //         startDate,
    //         endDate,
    //         curPage,
    //         pageSize,
    //         orderType,
    //         refundType,
    //         sellerId,
    //         afterSaleType,
    //       }),
    //       call(reqConfig),
    //     ]);
    //     yield put({
    //       type: 'mountResolved',
    //       payload: {
    //         ...res[0].data,
    //         ...res[1].data,
    //       },
    //     });
    //   } catch (error) {
    //     yield put({
    //       type: 'mountRejected',
    //     });
    //   }
    // },
    *getList({ payload },{ put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        },
      });
      const { activeKey,checkStatus,invoicedCheckStatus } = yield select(state=>state.afterSaleOrderPay);
      if(activeKey == 1) {
        yield put({
          type:'getOrderList',
          payload:{
            checkStatus:checkStatus==undefined?[1,6]:checkStatus,
          }
        })
      }else{
        yield put({
          type:'getInvoicedList',
          payload:{
            invoicedCheckStatus:invoicedCheckStatus==undefined?[1,6]:invoicedCheckStatus,
          }
        })
      }
    },
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        },
      });
      const afterSaleOrderPay = yield select(state => state.afterSaleOrderPay);
      const {
        customer,
        startDate,
        endDate,
        curPage,
        pageSize,
        refundType,
        orderType,
        sellerId,
        payTimeStart,
        payTimeEnd,
        checkStatus
      } = afterSaleOrderPay;
      try {
        const res = yield call(reqOrderList, {
          customer,
          startDate,
          endDate,
          curPage,
          pageSize,
          refundType,
          orderType,
          sellerId,
          payTimeStart,
          payTimeEnd,
          checkStatus,
          type:0,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
    *getInvoicedList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        },
      });
      const afterSaleOrderPay = yield select(state => state.afterSaleOrderPay);
      const {
        invoicedCustomer,
        invoicedOrderType,
        invoicedRefundType,
        invoicedSellerId,
        invoicedStartDate,
        invoicedEndDate,
        invoicedPayTimeStart,
        invoicedPayTimeEnd,
        invoicedCurPage,
        invoicedPageSize,
        invoicedCheckStatus,
        invStockStatus,
      } = afterSaleOrderPay;
      try {
        const res = yield call(reqOrderList, {
          customer:invoicedCustomer,
          startDate:invoicedStartDate,
          endDate:invoicedEndDate,
          curPage:invoicedCurPage,
          pageSize:invoicedPageSize,
          refundType:invoicedRefundType,
          orderType:invoicedOrderType,
          sellerId:invoicedSellerId,
          payTimeStart:invoicedPayTimeStart,
          payTimeEnd:invoicedPayTimeEnd,
          checkStatus:invoicedCheckStatus,
          type:1,
          invStockStatus,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            invoicedOrderList:res.data.orderList,
            invoicedTotal:res.data.total,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
    *confirmCheck({ payload },{ put, call, select }) {
      yield put({
        type:'changeSiftItemReducer',
        payload:{
          ...payload
        }
      })
      const { checkId } = yield select(state=>state.afterSaleOrderPay);
      try{
        const res = yield call(reqCheck,{ backOrderId:checkId })
        notification.success({
          message:res.msg,
        })
        yield put({
          type:'getInvoicedList',
          payload:{
            showModal:false,
          }
        })
      }catch(err) {
        yield put({
          type:'getOrderListPending',
          payload:{
            showModal:false,
          }
        })
        console.log(err)
      }
    },
    *changeSiftItem({ payload }, { put }) {
      yield put({
        type: 'changeSiftItemReducer',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        orderTypeMap: {},
        orderType: -1,
        customer: null,
        startDate: null,
        endDate: null,
        curPage: 1,
        pageSize: 40,
        total: 0,
        orderList: [],
        isTableLoading: true,
        refundTypeMap: {},
        sellerMap: {},
        refundType: -1,
        sellerId:-1,
        invoicedCustomer:'',
        invoicedOrderType:-1,
        invoicedRefundType:-1,
        invoicedSellerId:-1,
        invoicedStartDate:'',
        invoicedEndDate:'',
        invoicedPayTimeStart:'',
        invoicedPayTimeEnd:'',
        payTimeStart:'',
        payTimeEnd:'',
        activeKey:'1',
        invoicedOrderList:[],
        invoicedTotal:0,
        invoicedPageSize:40,
        invoicedCurPage:1,
        showModal:false,
        invoicedCheckStatus:[1,6],
        checkStatus:[1,6],
        returnInvStockMap:{},
        invStockStatus:'',
        financialCheckStatusMap:{},
        checkStatusMap:{}
      };
    },
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: false,
      };
    },
    getOrderListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: false,
      };
    },
    changeSiftItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
