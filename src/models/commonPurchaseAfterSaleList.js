import moment from 'moment';
import { reqConfig, reqList, reqAssignPurchaser } from '../services/commonPurchaseAfterSaleList';
import { message, notification } from 'antd';

export default {
  namespace: 'commonPurchaseAfterSaleList',

  state: {
    purchaserCheckMap: {},
    orderTypeMap: {},
    orderList: [],
    checkStatus: 2,
    orderType: -1,
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    payTimeStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
    payTimeEnd: moment().format('YYYY-MM-DD'),
    orderSn: '',
    isLoading: true,
    curPage: 1,
    pageSize: 40,
    selectedRowKeys: [],
    refundTypeMap: {},
    sellerMap: {},
    refundType: -1,
    sellerId:-1,
    customer: '',
    goodsSn: '',
    purchaserMap: {},
    purchaserId: '',
    selectedId: '',
    salesOrderType: 2,
    purchaseOrderSn: '',
  },

  effects: {
    *getConfig({ payload }, { call, put, all }) {
      try {
        const res = yield call(reqConfig);
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        // do something
      }
    },
    *getOrderList({ payload }, { call, put , select}) {
      yield put({
        type: 'updatePageReducer',
        payload:{
            ...payload,
            isLoading: true,
        }
      });
      try {
          const {
            checkStatus,
            orderType,
            startDate,
            endDate,
            orderSn,
            pageSize,
            curPage,
            refundType,
            sellerId,
            customer,
            goodsSn,
            salesOrderType,
            purchaseOrderSn,
         } = yield select(state=>state.commonPurchaseAfterSaleList);
        const res = yield call(reqList, { 
            checkStatus,
            orderType,
            startDate,
            endDate,
            orderSn,
            pageSize,
            curPage,
            refundType,
            sellerId,
            customer,
            goodsSn,
            salesOrderType,
            purchaseOrderSn,
         });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...res.data,
            isLoading: false,
            selectedRowKeys: [],
          },
        });
      } catch (error) {
        // do something
      }
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload,
      });
    },
    *selectPurchaser({ payload },{ put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload:{
          ...payload,
        }
      });
      const { purchaserId, selectedId, orderList } = yield select(state=>state.commonPurchaseAfterSaleList);
      orderList.map(item=>{
        if(+item.id === +selectedId) {
          item.purchaserId = purchaserId;
        }
      })
      try{ 
        const reslut = yield call(reqAssignPurchaser,{ id: selectedId, purchaserId });
        if(+reslut.code === 0) {
          notification.success({
            message:result.msg
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              orderList,
            }
          })
        }
      }catch(err) {

      }
    }
  },

  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmount() {
      return {
        purchaserCheckMap: {},
        orderTypeMap: {},
        orderList: [],
        checkStatus: 2,
        orderType: -1,
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        payTimeStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
        payTimeEnd: moment().format('YYYY-MM-DD'),
        orderSn: '',
        isLoading: true,
        curPage: 1,
        pageSize: 40,
        selectedRowKeys: [],
        refundTypeMap: {},
        sellerMap: {},
        refundType: -1,
        sellerId:-1,
        customer: '',
        goodsSn: '',
        purchaserMap: {},
        purchaserId: '',
        selectedId: '',
        salesOrderType: 2,
        purchaseOrderSn: '',
      };
    },
  },
};
