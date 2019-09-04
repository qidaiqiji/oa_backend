import { routerRedux } from 'dva/router';
import { reqAuth } from '../services/tpl';
import { reqGetCreditCustomerList, reqGetCreditBusinessOwner, reqGetCreditSum } from '../services/creditList';
import { notification } from 'antd/lib/index';

export default {
  namespace: 'creditCustomerList',

  state: {
    customerKeywords: '',
    customerInfo: [],
    actionList: [],
    pageSize: 50,
    currentPage: 1,
    keywords: '',
    orderSn: '',
    crdID: '',
    customerId: '',
    customerName: '',
    mobile: '',
    seller: '',
    creditType: '',
    total: 1,
    overview: {},
    sellerId: 0,
    loading: true,
  },

  effects: {
    *mount(_, { all, call, put }) {
      try {
        const [customerListRsp, sellerListRsp, creditSumRsp] = yield all([
          call(reqGetCreditCustomerList),
          call(reqGetCreditBusinessOwner),
          call(reqGetCreditSum),
        ]);

        yield put({
          type: 'updatePageReducer',
          payload: {
            total: customerListRsp.data.total,
            customerInfo: customerListRsp.data.creditCustomerList,
            overview: creditSumRsp.data,
            actionList: customerListRsp.data.actionList,
            seller: sellerListRsp.data.sellerMap,
            loading: false,
          },
        });
        console.log(customerListRsp);
      } catch (error) {
        notification.error({
          message: '操作失败',
        });
      }
    },
    *getList({ payload }, { put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          loading:true,
        }
      })
      const creditCustomerList = yield select(state => state.creditCustomerList);

      const {
        currentPage,
        sellerId,
        customerId,
        orderSn,
        pageSize,
        customerKeywords,
        
      } = creditCustomerList;

      try {
        const rsp = yield call(reqGetCreditCustomerList, {
          currentPage,
          seller: sellerId,
          customerId,
          orderSn,
          pageSize,
          customerKeywords,
        });

        yield put({
          type: 'updatePageReducer',
          payload: {
            total: rsp.data.total,
            customerInfo: rsp.data.creditCustomerList,
            actionList: rsp.data.actionList,
            loading: false,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    unmountReducer() {
      return {
        customerInfo: [],
        actionList: [],
        pageSize: 50,
        currentPage: 1,
        salesman: [],
        keywords: '',
        crdID: '',
        orderSn: '',
        sellerId: '',
        seller: '',
        Overview: {},
        customerId: '',
        customerName: '',
        mobile: '',
        customerKeywords: '',
        creditType: '',
        total: 1,
        loading: true,
      };
    },
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

  },
};
