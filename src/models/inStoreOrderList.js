// import { routerRedux } from 'dva/router';
import moment from 'moment';
import { reqGetConfig, reqGetInStoreOrderList, reqPushInStoreOrder, reqPush } from '../services/inStoreOrderList';
import { notification } from 'antd';

export default {
  namespace: 'inStoreOrderList',

  state: {
    inStoreSn: '',
    inStoreType: -1,
    inStoreStatus: -1,
    inStoreStartDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    inStoreEndDate: moment().format('YYYY-MM-DD'),
    curPage: 1,
    pageSize: 40,
    total: 0,
    inStoreList: [],

    isLoading: true,
    inStoreTypeMap: {},
    inStoreStatusMap: {},
    inStoreOrderId: null,
    isShowOperaPushModal: false,
    isOkingOperaPushModal: false,
    depot:"hxlDepot",
    depotMap: {},
    actionList:[],
    storageTypeMap:{},
    storageType:'',
    financeCheckTimeStart:'',
    financeCheckTimeEnd:''
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount(_, { put, call, all, select }) {
      const inStoreOrderListState = yield select(state => state.inStoreOrderList);
      const {
        inStoreSn,
        inStoreType,
        inStoreStatus,
        inStoreStartDate,
        inStoreEndDate,
        curPage,
        pageSize,
        storageType,
        financeCheckTimeStart,
        financeCheckTimeEnd
      } = inStoreOrderListState;
      try {
        const [config, inStoreOrderList] = yield all([call(reqGetConfig), call(reqGetInStoreOrderList, {
          inStoreSn,
          inStoreType,
          inStoreStatus,
          inStoreStartDate,
          inStoreEndDate,
          curPage,
          pageSize,
          storageType,
          financeCheckTimeStart,
          financeCheckTimeEnd
        })]);
        yield put({
          type: 'mountResolved',
          payload: {
            ...config.data,
            ...inStoreOrderList.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'mountRejected',
        });
      }
    },
    *getList({ payload = {} } = {}, { put, call, select }) {
      const { curPage, pageSize, inStoreSn, inStoreStartDate, inStoreEndDate, inStoreType, inStoreStatus } = yield select(state => state.inStoreOrderList);
      yield put({
        type: 'getListPending',
      });
      try {
        const inStoreOrderList = yield call(reqGetInStoreOrderList, { curPage, pageSize, inStoreSn, inStoreStartDate, inStoreStatus, inStoreEndDate, inStoreType, ...payload });
        yield put({
          type: 'getListResolved',
          payload: {
            ...inStoreOrderList.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getListRejected',
        });
      }
    },
    
    *changeSyncItem({ payload }, { put }) {
      yield put({
        type: 'changeSyncItemReducer',
        payload,
      });
    },
    *triggerOperaPushModal({ payload }, { put }) {
      yield put({
        type: 'triggerOperaPushModalReducer',
        payload,
      });
    },
    *okOperaPushModal(_, { select, put, call }) {
      yield put({
        type: 'okOperaPushModalPending',
      });
      try {
        const { inStoreOrderId, depot } = yield select(state => state.inStoreOrderList);
        const res = yield call(reqPushInStoreOrder, { inStoreOrderId, depot });
        if(+res.code === 0) {
          notification.success({
            message: res.msg,
          })
        }
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'okOperaPushModalRejected',
        });
      }
    },
  },

  reducers: {
    unmountReducer() {
      return {
        inStoreSn: '',
        inStoreType: -1,
        inStoreStatus: -1,
        inStoreStartDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        inStoreEndDate: moment().format('YYYY-MM-DD'),
        curPage: 1,
        pageSize: 40,
        total: 0,
        inStoreList: [],

        isLoading: true,
        inStoreTypeMap: {},
        inStoreStatusMap: {},
        inStoreOrderId: null,
        isShowOperaPushModal: false,
        isOkingOperaPushModal: false,
        depot: "hxlDepot",
        depotMap:{},
        actionList:[],
        storageTypeMap:{},
        financeCheckTimeStart:'',
        financeCheckTimeEnd:''
      };
    },
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getListPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
        isShowOperaPushModal: false,
        isOkingOperaPushModal: false,
      };
    },
    getListRejected(state) {
      return {
        ...state,
        isLoading: false,
        isShowOperaPushModal: false,
        isOkingOperaPushModal: false,
      };
    },
    changeSyncItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    triggerOperaPushModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowOperaPushModal: !state.isShowOperaPushModal,
      };
    },
    okOperaPushModalPending(state) {
      return {
        ...state,
        isOkingOperaPushModal: true,
      };
    },
    okOperaPushModalRejected(state) {
      return {
        ...state,
        isOkingOperaPushModal: false,
      };
    },
  },
};
