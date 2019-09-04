import moment from 'moment';
import { reqGetConfig, reqGetOrderList, reqGetSupplierSuggests, reqCheck } from '../services/purchaseAfterSaleOrderReceive.js';
import { notification } from 'antd';

export default {
  namespace: 'purchaseAfterSaleOrderReceive',

  state: {
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    orderTypeMap: {},
    orderType: -1,
    curPage: 1,
    invoicedCurPage: 1,
    pageSize: 40,
    invoicedPageSize: 40,
    keywords: '',
    backOrderList: [],
    total: 0,
    invoicedTotal: 0,
    isLoading: false,
    supplierKeywords: '',
    supplierId: null,
    supplierSuggests: [],
    payTypeMap: {},
    purchaserMap: {},
    receiveAmountTimeEnd:'',
    receiveAmountTimeStart:'',
    orderStatus:[2, 5],
    activeKey:'1',
    payType:'',
    purchaser:'',
    invoicedOrderStatus:[2, 5],
    invoicedPayType:'',
    invoicedKeywords:'',
    invoicedSupplierId:'',
    invoicedOrderType:'',
    invoicedPurchaser:'',
    invoicedReceiveAmountTimeStart:'',
    invoicedReceiveAmountTimeEnd:'',
    invoicedEndDate:'',
    invoicedStartDate:'',
    invoicedBackOrderList:[],
    backOrderTypeMap:{},
    invStockStatus:"",
    inInvFollowSn:'',
    reduceInvStockMap:{}
  },

  effects: {
    *getConfig(_, { call, put }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'getConfigResolved',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *getList({ payload },{ put, call, select }) {
      yield put({
        type: 'getOrderListPending',
        payload:{
          ...payload,
          isLoading:true,
        }
      });
      const { activeKey,orderStatus,invoicedOrderStatus } = yield select(state=>state.purchaseAfterSaleOrderReceive);
      if(activeKey == 1) {
        yield put({
          type:'getOrderList',
          payload:{
            orderStatus:orderStatus==undefined?[2,5]:orderStatus,
          }
        })
      }else{
        yield put({
          type:'getInvoicedOrderList',
          payload:{
            invoicedOrderStatus:invoicedOrderStatus==undefined?[2,5]:invoicedOrderStatus
          }
        })
      }
    },
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type:'getOrderListPending',
        payload:{
          ...payload,
        }
      })
      const {
        startDate,
        endDate,
        orderType,
        curPage,
        pageSize,
        keywords,
        supplierId,
        orderStatus,
        payType,
        purchaser,
        receiveAmountTimeStart,
        receiveAmountTimeEnd,
      } = yield select(state => state.purchaseAfterSaleOrderReceive);
      try {
        const res = yield call(reqGetOrderList, {
          startDate,
          endDate,
          orderType,
          curPage,
          pageSize,
          keywords,
          supplierId,
          orderStatus,
          payType,
          purchaser,
          receiveAmountTimeStart,
          receiveAmountTimeEnd,
          type:0,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *getInvoicedOrderList({ payload }, { put, call, select }) {
      yield put({
        type:'getOrderListPending',
        payload:{
          ...payload,
        }
      })
      const {
        invoicedOrderStatus,
        invoicedPayType,
        invoicedKeywords,
        invoicedSupplierId,
        invoicedOrderType,
        invoicedPurchaser,
        invoicedReceiveAmountTimeStart,
        invoicedReceiveAmountTimeEnd,
        invoicedEndDate,
        invoicedStartDate,
        invoicedCurPage,
        invoicedPageSize,
        invStockStatus,
        inInvFollowSn,
      } = yield select(state => state.purchaseAfterSaleOrderReceive);
      try {
        const res = yield call(reqGetOrderList, {
          startDate:invoicedStartDate,
          endDate:invoicedEndDate,
          orderType:invoicedOrderType,
          invoicedCurPage,
          invoicedPageSize,
          keywords:invoicedKeywords,
          supplierId:invoicedSupplierId,
          orderStatus:invoicedOrderStatus,
          payType:invoicedPayType,
          purchaser:invoicedPurchaser,
          receiveAmountTimeStart:invoicedReceiveAmountTimeStart,
          receiveAmountTimeEnd:invoicedReceiveAmountTimeEnd,
          type:1,
          invStockStatus,
          inInvFollowSn,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            invoicedBackOrderList:res.data.backOrderList,
            InvoicedTotal:res.data.total,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeSupplierKeywords({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetSupplierSuggests, { keywords: payload.supplierKeywords });
        yield put({
          type: 'changeSupplierKeywordsResolved',
          payload: {
            supplierSuggests: res.data.suppliers,
          },
        });
      } catch (error) {

      }
    },
    *confirmCheck({ payload },{ put, call, select }) {
      yield put({
        type:'getOrderListPending',
        payload:{
          ...payload
        }
      })
      const { checkId } = yield select(state=>state.purchaseAfterSaleOrderReceive);
      try{
        const res = yield call(reqCheck,{ backOrderId:checkId })
        notification.success({
          message:res.msg,
        })
        yield put({
          type:'getInvoicedOrderList',
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
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    getOrderListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSupplierKeywordsResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        orderTypeMap: {},
        orderType: -1,
        curPage: 1,
        invoicedCurPage:1,
        invoicedPageSize: 40,
        invoicedTotal:0,
        pageSize: 40,
        keywords: '',
        backOrderList: [],
        total: 0,
        isLoading: false,
        supplierKeywords: '',
        supplierId: null,
        supplierSuggests: [],
        payTypeMap: {},
        purchaserMap: {},
        receiveAmountTimeEnd:'',
        receiveAmountTimeStart:'',
        orderStatus:[2, 5],
        activeKey:'1',
        payType:'',
        purchaser:'',
        invoicedOrderStatus:[2, 5],
        invoicedPayType:'',
        invoicedKeywords:'',
        invoicedSupplierId:'',
        invoicedOrderType:'',
        invoicedPurchaser:'',
        invoicedReceiveAmountTimeStart:'',
        invoicedReceiveAmountTimeEnd:'',
        invoicedEndDate:'',
        invoicedStartDate:'',
        invoicedBackOrderList:[],
        backOrderTypeMap:{},
        invStockStatus:"",
        inInvFollowSn:'',
        reduceInvStockMap:{}
      };
    },
  },
};
