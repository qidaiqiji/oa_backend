import moment from 'moment';
import { reqGetConfig, reqCustomerList, reqMsg } from '../services/customerCertification';
import { notification } from 'antd';
export default {
  namespace: 'customerCertification',
  state: {
    customerKeywords: '',
    regStartDate: '',
    regEndDate: '',
    seller: '',
    sellerTeam: '',
    checkStatus: '',
    currentPage: 1,
    pageSize: 40,
    isCheckedStatusMap: {},
    sellerMap: {},
    sellerTeamMap: {},
    total: '',
    isGetCustomerListing: true,
    customerList: [],
    modalImg: '',
    isShowImg: false,
    inviter: '',
    areaManagerId:'',
    provinceManagerId:'',
    stateManagerId:'',
    areaManagerList:{},
    provinceManagerList:{},
    stateManagerList:{},
    salerList:{},
    sendMessageModal:false,
    btnLoading:false,
    mobilePhone:'',
    isChange:false,
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *handleInputChange({ payload }, { put }) {
      yield put({
        type: 'handleInputChangeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getConfig({ payload }, { all, call, put, select }) {
      yield put({
        type: 'getConfigPending',
        payload:{
          ...payload
        }
      });
      const {
        customerKeywords,
        regStartDate,
        regEndDate,
        seller,
        sellerTeam,
        currentPage,
        pageSize,
        areaManagerId,
        provinceManagerId,
        stateManagerId,
      } = yield select(state => state.customerCertification);
      try {
        const res = yield all([
          call(reqGetConfig),
          call(reqCustomerList, {
            customerKeywords,
            regStartDate,
            regEndDate,
            seller,
            sellerTeam,
            checkStatus: '0',
            currentPage,
            pageSize,
            areaManagerId,
            provinceManagerId,
            stateManagerId,
          }),
        ]);
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
    *getCustomerList({ payload }, { call, put, select }) {
      yield put({
        type: 'getCustomerListPending',
        payload:{
          ...payload
        }
      });
      const {
        customerKeywords,
        regStartDate,
        regEndDate,
        seller,
        sellerTeam,
        checkStatus,
        currentPage,
        pageSize,
        inviter,
        areaManagerId,
        provinceManagerId,
        stateManagerId,
      } = yield select(state => state.customerCertification);
      try {
        const customerListRes = yield call(reqCustomerList, {
          customerKeywords,
          regStartDate,
          regEndDate,
          seller,
          sellerTeam,
          checkStatus,
          currentPage,
          pageSize,
          inviter,
          areaManagerId,
          provinceManagerId,
          stateManagerId,
        });
        yield put({
          type: 'getCustomerListResolved',
          payload: {
            customerList: customerListRes.data.customerList,
            total: customerListRes.data.total,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getCustomerListRejected',
        });
      }
    },
    *showDetailImage({ payload }, { put }) {
      yield put({
        type: 'showDetailImageReducer',
        payload: {
          ...payload,
        },
      });
    },
    *hideDetailImage(_, { put }) {
      yield put({
        type: 'hideDetailImageReducer',
      });
    },
    *sendMsg({ payload },{ put, call, select }) {
      yield put({
        type:'changeReducer',
        payload:{
          ...payload
        }
      })
      const { customerId, salerPhone, mobilePhone, isChange } = yield select(state=>state.customerCertification);
      try{
        const res = yield call(reqMsg,{ customerId, salerPhone:isChange?salerPhone:mobilePhone });
        notification.success({
          message:res.msg,
        })
        yield put({
          type:'changeReducer',
          payload:{
            sendMessageModal:false,
            btnLoading:false,
          }
        })
      }catch(err) {
        yield put({
          type:'changeReducer',
          payload:{
            sendMessageModal:false,
            btnLoading:false,
            isChange:false
          }
        })
        console.log(err)

      }
    }
  },

  reducers: {
    unmountReducer() {
      return {
        customerKeywords: '',
        regStartDate: '',
        regEndDate: '',
        seller: '',
        sellerTeam: '',
        checkStatus: '',
        currentPage: 1,
        pageSize: 40,
        isCheckedStatusMap: {},
        sellerMap: {},
        sellerTeamMap: {},
        total: '',
        isGetCustomerListing: true,
        customerList: [],
        modalImg: '',
        isShowImg: false,
        inviter: '',
        areaManagerId:'',
        provinceManagerId:'',
        stateManagerId:'',
        areaManagerList:{},
        provinceManagerList:{},
        stateManagerList:{},
        salerList:{},
        sendMessageModal:false,
        btnLoading:false,
        mobilePhone:'',
        isChange:false,
      };
    },
    handleInputChangeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getConfigPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isGetCustomerListing: true,
      };
    },
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetCustomerListing: false,
      };
    },
    getConfigRejected(state) {
      return {
        ...state,
        isGetCustomerListing: false,
      };
    },
    getCustomerListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isGetCustomerListing: true,
      };
    },
    getCustomerListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetCustomerListing: false,
      };
    },
    getCustomerListRejected(state) {
      return {
        ...state,
        isGetCustomerListing: false,
      };
    },
    showDetailImageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowImg: true,
      };
    },
    hideDetailImageReducer(state) {
      return {
        ...state,
        isShowImg: false,
      };
    },
    changeReducer(state,{ payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
};
