// import { routerRedux } from 'dva/router';
// import { message } from 'antd';
import moment from 'moment';
import { reqGetGoodsStatisticsListConfig, reqGetGoodsStatisticsListGoodsList } from '../services/goodsStatisticsList';

export default {
  namespace: 'goodsStatisticsList',

  state: {
    checkStatusMap: {},
    payStatusMap: {},
    goodsTypeMap: {},
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    goods: '',
    userKeywords: '',
    orderSn:'',
    page: 1,
    pageSize: 40,
    selectCheckStatus: [-1],
    selectPayStatus: [-1],
    selectGoodsType: [-1],

    total: 0,
    orderTotalNumber: 0,
    goodsTotalNumber: 0,
    totalAmount: 0,
    goodsList: [],
    isLoading: true,
    isLoadingConfig: true,
    sellerMap:{},
    saler:"",
    showSaler:false,
    payStartDate:moment().add(-30, 'days').format('YYYY-MM-DD'),
    payEndDate:moment().format('YYYY-MM-DD'),

  },

  effects: {
    *mount({ payload }, { call, put }) {
      try {
        const configRes = yield call(reqGetGoodsStatisticsListConfig);
        yield put({
          type: 'getConfigResolved',
          payload: {
            ...configRes.data,
          },
        });
        const goodsListRes = yield call(reqGetGoodsStatisticsListGoodsList, { ...payload });
        yield put({
          type: 'getGoodsListResolved',
          payload: {
            ...goodsListRes.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'mountRejected',
        });
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *changePage({ payload }, { call, put }) {
      yield put({
        type: 'goodsStatisticsList/getGoodsList',
        payload: {
          ...payload,
        },
      });
    },
    *search({ payload }, { call, put }) {
      yield put({
        type: 'goodsStatisticsList/getGoodsList',
        payload: {
          ...payload,
        },
      });
    },
    *reset(_, { put }) {
      yield put({
        type: 'resetSync',
      });
    },
    *changeInput({ payload }, { put }) {
      yield put({
        type: 'changeInputSync',
        payload: {
          ...payload,
        },
      });
    },
    *changeCheckbox({ payload }, { put, select }) {
      const { type, id } = payload;
      let ids = payload[type];
      // const isSelectAll = ids.indexOf(-1) > -1;
      // if (isSelectAll) {

      // }
      if (id === -1) {
        ids = [-1];
      } else if (ids.indexOf(id) > -1) {
        if (ids.indexOf(-1) > -1) {
          ids.splice(ids.indexOf(-1), 1);
        }
        ids.splice(ids.indexOf(id), 1);
      } else {
        if (ids.indexOf(-1) > -1) {
          ids.splice(ids.indexOf(-1), 1);
        }
        ids.push(id);
      }
      const state = yield select(state => state.goodsStatisticsList);
      const params = {
        curPage: 1,
        startDate: state.startDate,
        endDate: state.endDate,
        goods: state.goods,
        userKeywords: state.userKeywords,
        orderSn: state.orderSn,
        selectOrderType: state.selectOrderType,
        selectPayStatus: state.selectPayStatus,
        selectCheckStatus: state.selectCheckStatus,
        [type]: ids,
      }
      yield put({
        type: 'goodsStatisticsList/getGoodsList',
        payload: {
          ...params,
        },
      });
      // yield put({
      //   type: 'changeCheckboxSync',
      //   payload: {
      //     [type]: ids,
      //   },
      // });
    },
    *getGoodsList({ payload }, { call, put }) {
      yield put({
        type: 'getGoodsListPending',
      });
      try {
        const res = yield call(reqGetGoodsStatisticsListGoodsList, { ...payload });
        yield put({
          type: 'getGoodsListResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getGoodsListRejected',
        });
      }
    },
  },

  reducers: {
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingConfig: false,
      };
    },
    // getGoodsListResolved(state, { payload }) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // },
    getGoodsListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getGoodsListRejected(state) {
      return {
        ...state,
        isLoading: false,
      };
    },
    getGoodsListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    resetSync(state) {
      return {
        ...state,
        startDate: "",
        endDate: "",
        goods: '',
        userKeywords: '',
        orderSn:'',
        page: 1,
        selectCheckStatus: [-1],
        selectPayStatus: [-1],
        selectGoodsType: [-1],
        saler:'',
        payStartDate:"",
        payEndDate:"",
      };
    },
    changeInputSync(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeCheckboxSync(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        checkStatusMap: {},
        payStatusMap: {},
        goodsTypeMap: {},
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        goods: '',
        userKeywords: '',
        orderSn:'',
        page: 1,
        selectCheckStatus: [-1],
        selectPayStatus: [-1],
        selectGoodsType: [-1],

        total: 0,
        orderTotalNumber: 0,
        goodsTotalNumber: 0,
        totalAmount: 0,
        goodsList: [],
        isLoading: true,
        isLoadingConfig: true,
        pageSize: 40,
        sellerMap:{},
        saler:"",
        showSaler:false,
        payStartDate:moment().add(-30, 'days').format('YYYY-MM-DD'),
        payEndDate:moment().format('YYYY-MM-DD'),
      };
    },
  },
};
