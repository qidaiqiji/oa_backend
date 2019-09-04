import moment from 'moment';
import { reqGetOrderList, reqGetConfig, reqCombin, reqCancel } from '../services/saleOrderList';
import { notification } from 'antd';
import { stat } from 'fs';
export default {
  namespace: 'saleOrderList',

  state: {
    orderList: [],
    checkMap: {},
    statusMap: {},
    originMap: {},
    payMethodMap: {},
    isGetOrderListing: true,
    // 筛选项
    checkStatus: -1,
    orderStatus: -1,
    orderOrigin: -1,
    orderStartTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
    orderEndTime: moment().format('YYYY-MM-DD'),
    payTimeStart:"",
    payTimeEnd:"",
    customer: '',
    consignee: '',
    curPage: 1,
    pageSize: 40,
    selectedRows: [],
    total: '',
    orderId: "",
    isMerchant: 0,
    buttonLoading:false,
    showModal:false,
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getConfig({ payload }, { all, call, put, select }) {
      const token = localStorage.getItem('token');
      yield put({
        type: 'changeSyncItemReducer',
        payload:{
          ...payload,
          token,
        }
      })
      const {
        checkStatus,
        orderStatus,
        orderOrigin,
        orderStartTime,
        orderEndTime,
        payTimeStart,
        payTimeEnd,
        customer,
        consignee,
        selectedRows,
        curPage,
        pageSize,
        orderId,
        isMerchant,
      } = yield select(state => state.saleOrderList);
      try {
        const res = yield all([call(reqGetConfig), call(reqGetOrderList, {
          checkStatus,
          orderStatus,
          orderOrigin,
          orderStartTime,
          orderEndTime,
          customer,
          consignee,
          selectedRows,
          curPage,
          orderId,
          pageSize,
          payTimeStart,
          payTimeEnd,
          isMerchant,
        })]);
        yield put({
          type: 'getConfigResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
          },
        });
      } catch (error) {
        yield put({
          type: 'getConfigRejected',
        });
      }
    },
    *getOrderList({ payload }, { call, put, select }) {
      yield put({
        type: 'getOrderListPending',
        payload: {
          ...payload,
        }
      });
      const {
        checkStatus,
        orderStatus,
        orderOrigin,
        orderStartTime,
        orderEndTime,
        customer,
        consignee,
        selectedRows,
        curPage,
        pageSize,
        orderId,
        payTimeStart,
        payTimeEnd,
        isMerchant,
        token,
      } = yield select(state => state.saleOrderList);
      try {
        const orderListRes = yield call(reqGetOrderList, {
          checkStatus,
          orderStatus,
          orderOrigin,
          orderStartTime,
          orderEndTime,
          customer,
          consignee,
          selectedRows,
          curPage,
          pageSize,
          orderId,
          payTimeStart,
          payTimeEnd,
          isMerchant,
          token,
          ...payload,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            orderList: orderListRes.data.orderList,
            total: orderListRes.data.total,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
    *changeSyncItem({ payload }, { put }) {
      yield put({
        type: 'changeSyncItemReducer',
        payload: {
          ...payload,
        },
      });
    },
    *fastCombin({ payload },{ put, call }) {
      yield put({
        type:'changeSyncItemReducer',
        payload:{
          buttonLoading:true,
        }
      })
      try{
        const res = yield call(reqCombin);
        notification.success({
          message:res.msg,
          description: <div>
            {
              Object.keys(res.data).length>0?`应合成数量:${res.data.shouldCombineNum},实际合成数量:${res.data.actualCombineNum}`:''
            }
          </div>,
          duration:null
        })
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            buttonLoading:false,
          }
        })
      }catch(err){
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            buttonLoading:false,
          }
        })
        console.log("err")

      }
    },
    *confirmCancel({payload},{ put, call, select }) {
      const { cancelId } = yield select(state=>state.saleOrderList)
      try{
        const res = yield call(reqCancel,{ orderGroupId:cancelId })
        notification.success({
          message:res.msg
        })
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            showModal:false,
          }
        })
      }catch(err){
        console.log(err)
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            showModal:false,
          }
        })
      }
    }
  },

  reducers: {
    unmountReducer() {
      return {
        orderList: [],
        checkMap: {},
        statusMap: {},
        originMap: {},
        payMethodMap: {},
        isGetOrderListing: true,

        // 筛选项
        checkStatus: -1,
        orderStatus: -1,
        orderOrigin: -1,
        orderStartTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
        orderEndTime: moment().format('YYYY-MM-DD'),
        payTimeStart:"",
        payTimeEnd:"",
        customer: '',
        consignee: '',
        curPage: 1,
        pageSize: 40,

        selectedRows: [],
        total: '',
        orderId: "",
        isMerchant: 0,
        buttonLoading:false,
        showModal:false,
      };
    },
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetOrderListing: false,
      };
    },
    getConfigRejected(state) {
      return {
        ...state,
        isGetOrderListing: false,
      };
    },
    getOrderListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetOrderListing: true,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetOrderListing: false,
      };
    },
    getOrderListRejected(state) {
      return {
        ...state,
        isGetOrderListing: false,
      };
    },
    changeSyncItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
