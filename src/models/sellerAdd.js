import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { reqGetCustomerListConfig, reqSaveSellerInfo, reqGetsellerDetail } from '../services/sellerAdd.js';

export default {
  namespace: 'sellerAdd',

  state: {
    id: '',
    userId: '',
    salePhone: '',
    password: '',
    sellerName: '',
    entryTime: '',
    englishName: '',
    email: '',
    duty: '',
    sellerLeader: '',
    isLoading: false,
    sellerDutyMap: {},
    sellerLeaderMap: {},
    sellerPhoneMap: {},
    red: 'rgb(193, 188, 188)',
  },

  effects: {
    *mount({ payload }, { put }) {
      yield put({
        type: 'getConfig',
        payload: {
          ...payload,
        },
      });
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetCustomerListConfig);
        yield put({
          type: 'configReducer',
          payload: {
            ...payload,
            sellerDutyMap: res.data.sellerDutyMap,
            sellerLeaderMap: res.data.sellerLeaderMap,
            sellerPhoneMap: res.data.sellerPhoneMap,
          },
        });
        if (payload.userId) {
          yield put({
            type: 'getDetail',
            payload: {
              ...payload,
            },
          });
        }
      } catch (error) {
        // to do
      }
    },
    *getDetail({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetsellerDetail, { ...payload });
        yield put({
          type: 'detailReducer',
          payload: {
            salePhone: res.data.mobile,
            duty: res.data.dutyId,
            sellerLeader: res.data.sellerLeaderId,
            sellerName: res.data.sellerName,
            entryTime: res.data.entryTime,
            englishName: res.data.englishName,
            email: res.data.email,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeItem({ payload }, { put, select }) {
      const sellerAdd = yield select(state => state.sellerAdd);
      const {
        sellerDutyMap,
        duty,
      } = sellerAdd;
      if (sellerDutyMap[duty] === '销售主管' || sellerDutyMap[payload.duty] === '销售主管') {
        yield put({
          type: 'changeItemReducer',
          payload: {
            sellerLeader: '',
          },
        });
      }
      yield put({
        type: 'changeItemReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeItemEmail({ payload }, { put }) {
      var regEmail = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
      // var regEmail =  /@/;
      if (regEmail.test(payload.email)) {
        yield put({
          type: 'changeItemReducer',
          payload: {
            ...payload,
            red: 'rgb(193, 188, 188)',
          },
        });
      } else {
        yield put({
          type: 'changeItemReducer',
          payload: {
            ...payload,
            red: '#f00',
          },
        });
      }
    },
    *saveSubmit(_, { put, call, select }) {
      const sellerAdd = yield select(state => state.sellerAdd);
      const {
        userId,
        salePhone,
        password,
        sellerName,
        entryTime,
        duty,
        sellerLeader,
        englishName,
        email,
      } = sellerAdd;
      yield put({
        type: 'savePending',
      });
      try {
        yield call(reqSaveSellerInfo, {
          sellerId: userId,
          salePhone,
          password,
          sellerName,
          entryTime,
          duty,
          sellerLeader,
          englishName,
          email,
        });
        notification.success({
          message: '提示',
          description: userId ? '修改资料成功' : '新建销售员成功',
        });
        yield put({
          type: 'saveResolved',
        });
        yield put(routerRedux.push(userId ? `/customer/seller-list/seller-detail/${userId}` : '/customer/seller-list'));
      } catch (error) {
        // to do
        yield put({
          type: 'saveResolved',
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
    saveResolved(state) {
      return {
        ...state,
        isLoading: false,
      };
    },
    savePending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    changeItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    detailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    configReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        id: '',
        userId: '',
        salePhone: '',
        password: '',
        sellerName: '',
        entryTime: '',
        duty: '',
        sellerLeader: '',
        isLoading: false,
        sellerDutyMap: {},
        sellerLeaderMap: {},
        sellerPhoneMap: {},
        englishName: '',
        email: '',
      };
    },
  },
};
