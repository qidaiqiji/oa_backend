import moment from 'moment';
import {
  reqList, reqConfig, reqAction,
} from '../services/broadcastRecordList';
import {
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'broadcastRecordList',
  state: {
    currentPage: 1,
    pageSize: 40,
    totalCount: 200,
    isTableLoading: true,
    statusMap: '',
    roomId: '',
    title: '',
    keywords: '',
    csStatus: '',
    startTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    sortType: '',
    orderBy: '',
    list: [],
    actionText: '',
    BroadcastActivityList: false,
    addTypeMap: '',
    id: '',
  },
  effects: {
    *getList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        }
      })
      const {
        currentPage, pageSize, sortType, orderBy, startTime, endTime,
      } = yield select(state => state.broadcastRecordList);
      try {
        const res = yield call(reqList, {
          currentPage, pageSize, sortType, orderBy, startTime, endTime,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            list: res.data.list,
            isTableLoading: false,
            totalCount: res.data.count,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const config = yield call(reqConfig);
        yield put({
          type: 'getListResolved',
          payload: {
            statusMap: config.data.statusMap,
            addTypeMap: config.data.addTypeMap,

          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *confirmAction({ payload }, { put, select, call }) {
      const { actionUrl, id } = yield select(state => state.broadcastRecordList);
      try {
        const res = yield call(reqAction, { url: actionUrl, id: id, });
        if (+res.code === 0) {
          yield put({
            type: 'getList'
          })
          yield put({
            type: 'getListResolved',
            payload: {
              ...payload,
            }
          })
          message.success(res.msg)
        }
      } catch (err) {
        yield put({
          type: 'getListResolved',
          payload: {
            ...payload,
          }
        })
        console.log(err);
      }
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

      };
    },

    unmountReducer() {
      return {
        currentPage: 1,
        pageSize: 40,
        totalCount: 200,
        isTableLoading: true,
        statusMap: '',
        roomId: '',
        title: '',
        keywords: '',
        csStatus: '',
        startTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        sortType: '',
        orderBy: '',
        list: [],
        actionText: '',
        BroadcastActivityList: false,
        addTypeMap: '',
        id: '',
      };
    },
  },
};

