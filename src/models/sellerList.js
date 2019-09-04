import { reqGetCustomerListConfig, reqGetSellerList, reqGetMingpian } from '../services/sellerList.js';
import { message } from 'antd';
export default {
  namespace: 'sellerList',
  state: {
    keywords: '',
    startDate: '',
    endDate: '',
    sellerTeam: '',
    checkStatus: '',
    sellerTeamMap: {},
    accountStatusMap: {},
    sellerList: [],
    isLoading: false,
    hidden: false,
    salesAreaMap: {},
    provinceMap: {},
    stateMap: {},
    sellerMap: {},
    areaId: '',
    provinceId: '',
    stateId: '',
    assistantProvinceId: '',
    isShowMingpianModal: false,
    clickItemImg: '',
  },

  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getConfig',
      });
    },
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetCustomerListConfig);
        yield put({
          type: 'configReducer',
          payload: {
            sellerTeamMap: res.data.sellerTeamMap,
            accountStatusMap: res.data.accountStatusMap,
            salesAreaMap: res.data.salesAreaMap,
            provinceMap: res.data.provinceMap,
            stateMap: res.data.stateMap,

          },
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        // to do
      }
    },
    *getMingpianDetail({ payload }, { put, call, select }) {
      const { userId } = payload;
      try {
        const res = yield call(reqGetMingpian, { userId });
        if (+res.code == 0) {
          yield put({
            type: 'updateConfig',
            payload: {
              isShowMingpianModal: true,
              clickItemImg: res.data.url,
            },
          });
        }

      } catch (error) {
        // to do
      }
    },
    *getList({ payload }, { put, call, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      const sellerList = yield select(state => state.sellerList);
      const {
        keywords,
        startDate,
        endDate,
        sellerTeam,
        checkStatus,
        areaId,
        provinceId,
        stateId,
        assistantProvinceId,
      } = sellerList;
      try {
        const res = yield call(reqGetSellerList, {
          keywords,
          startDate,
          endDate,
          sellerTeam,
          checkStatus,
          areaId,
          provinceId,
          stateId,
          assistantProvinceId,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            sellerList: res.data.sellerList,
            hidden: res.data.hidden,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeConfig({ payload }, { put }) {
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    updateConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    configReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        // isLoadingConfig: false,
      };
    },
    unmountReducer() {
      return {
        keywords: '',
        startDate: '',
        endDate: '',
        sellerTeam: '',
        checkStatus: '',
        sellerTeamMap: {},
        accountStatusMap: {},
        sellerList: [],
        isLoading: false,
        hidden: false,
        salesAreaMap: {},
        provinceMap: {},
        stateMap: {},
        sellerMap: {},
        areaId: '',
        provinceId: '',
        stateId: '',
        assistantProvinceId: '',
        isShowMingpianModal: false,
        clickItemImg: '',
      };
    },
  },
};
