import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import { reqGetsellerDetail, reqGetCustomerList, reqAction, reqGetSellerData, reqConfig } from '../services/sellerDetail.js';

export default {
  namespace: 'sellerDetail',

  state: {
    id: '',
    actionList: [],
    checkStatus: '',
    entryTime: '',
    mobile: '',
    sellerName: '',
    duty: '',
    sellerLeader: '',
    operateRecord: [],

    total: '',
    customerList: [],
    currentPage: 1,
    pageSize: 40,
    isLoading: false,
    isLoadingMount: false,

    actiontUrl: '',
    actionRemark: '',
    isShowActionModal: false,
    isActing: false,
    days: '7',
    dateStart: '',
    dateEnd: '',
    regStartDate: '',
    regEndDate: '',
    customerKeywords: '',
    goodsSn: '',
    sellerData: {},
    totalType:'all',
    salesAreaMap:{},
    provinceMap:{},
    stateMap:{},
    sellerMap:{},
    assistantProvinceId:'',
    areaId:'',
    provinceId:'',
    stateId:'',
    areaMap:{},
    salerProvinceMap:{}
  },

  effects: {
    *mount({ payload }, { put, call, all, select }) {
      yield put({
        type: 'mountPending',
        payload:{
          ...payload,
        }
      });
      const { pageSize, currentPage, userId, days, dateStart, dateEnd, totalType, provinceId,  assistantProvinceId, areaId } = yield yield select(state => state.sellerDetail);
      try {
        const res = yield all([
          call(reqGetsellerDetail, { userId }), call(reqGetCustomerList, { seller: userId, currentPage, pageSize, days, dateStart, dateEnd, totalType, provinceId, assistantProvinceId, areaId }),
        ]);
        yield put({
          type: 'getSellerData',
          // payload: {
          //   userId,
          // },
        });
        yield put({
          type: 'getDetailReducer',
          payload: {
            ...payload,
            ...res[0].data,
            ...res[1].data,
          },
        });
      } catch (error) {
        yield put({
          type:'changeReducer',
          payload:{
            isLoadingMount: false,
          }
        })
        // to do
      }
    },
    *getConfig({ payload },{ put, call, select }){
      const { userId } = yield select(state=>state.sellerDetail);
      try{
        const res = yield call(reqConfig,{ seller:userId });
        yield put({
          type:'changeReducer',
          payload:{
            salesAreaMap:res.data.salesAreaMap,
            provinceMap:res.data.provinceMap,
            stateMap:res.data.stateMap,
            sellerMap:res.data.sellerMap,
            areaMap:res.data.areaMap,
            salerProvinceMap:res.data.salerProvinceMap,
          }
        })
      }catch(err){

      }

    },
    *getSellerData({ payload }, { put, call, select }) {
      yield put({
        type: 'sellerDataPending',
        payload:{
          ...payload
        }
      });
      const { userId, days, dateStart, dateEnd, provinceId, assistantProvinceId, areaId , totalType } = yield yield select(state => state.sellerDetail);
      // const { userId, salesAreaId } = yield select(state => state.sellerDetail);
      try {
        const res = yield call(reqGetSellerData, {
          userId, 
          days, 
          dateStart, 
          dateEnd, 
          provinceId, 
          assistantProvinceId, 
          areaId,
          totalType,
        });
        yield put({
          type: 'sellerDataReducer',
          payload: {
            sellerData: res.data,
            // ...payload,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *getCustomerList({ payload }, { put, call, select }) {
      yield put({
        type:'changeReducer',
        payload:{
          ...payload,
        }
      })
      const { pageSize, regStartDate, regEndDate, customerKeywords, totalType, goodsSn, provinceId, assistantProvinceId, areaId } = yield select(state => state.sellerDetail);
      yield put({
        type: 'customerListPending',
      });
      try {
        const res = yield call(reqGetCustomerList, {
          pageSize,
          regStartDate,
          regEndDate,
          customerKeywords,
          goodsSn,
          provinceId, 
          assistantProvinceId, 
          areaId,
          totalType,
          // ...payload,
        });
        yield put({
          type: 'customerListReducer',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 操作相关
    // 弹出/关闭 action modal
    *change({ payload }, { put }) {
      yield put({
        type: 'changeReducer',
        payload,
      });
    },
    *triggerActionModal({ payload }, { put }) {
      yield put({
        type: 'triggerActionModalReducer',
        payload,
      });
    },
    *okActionModal({ payload }, { call, put, select }) {
      yield put({
        type: 'okActionModalPending',
      });
      const {
        actionUrl,
        actionRemark,
        backUrl,
      } = yield select(state => state.sellerDetail);
      try {
        yield call(reqAction, actionUrl, {
          // id: payload.id,
          remark: actionRemark,
        });
        yield put({
          type: 'okActionModalResolved',
        });
        message.success('申请成功');
        if (backUrl) {
          yield put(routerRedux.push(backUrl));
          // return;
        }
        yield put({
          type: 'mount',
          payload: {
            userId: payload.id,
          },
        });
      } catch (error) {
        yield put({
          type: 'okActionModalRejected',
        });
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    mountPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingMount: true,
      };
    },
    okActionModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: false,
        isActing: false,
      };
    },
    okActionModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: true,
      };
    },
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    triggerActionModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: !state.isShowActionModal,
      };
    },
    customerListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    customerListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    sellerDataPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    sellerDataReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingMount: false,
      };
    },
    unmountReducer() {
      return {
        id: '',
        actionList: [],
        checkStatus: '',
        entryTime: '',
        mobile: '',
        sellerName: '',
        duty: '',
        sellerLeader: '',
        operateRecord: [],

        total: '',
        customerList: [],
        currentPage: 1,
        pageSize: 40,
        isLoading: false,
        isLoadingMount: false,

        actiontUrl: '',
        actionRemark: '',
        isShowActionModal: false,
        isActing: false,
        days: '7',
        dateStart: '',
        dateEnd: '',
        regStartDate: '',
        regEndDate: '',
        customerKeywords: '',
        goodsSn: '',
        sellerData: {},
        totalType:'all',
        salesAreaMap:{},
        provinceMap:{},
        stateMap:{},
        sellerMap:{},
        assistantProvinceId:'',
        areaId:'',
        provinceId:'',
        stateId:'',
        assistantAreaId:'',
        areaMap:{},
        salerProvinceMap:{}
      };
    },
  },
};
