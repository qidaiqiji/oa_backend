

import moment from 'moment';
import { liveRoomList, liveRoomCreate, liveRoomDelete, liveRoomEdit } from '../services/broadcastList';
import { message } from 'antd';

export default {
  namespace: 'broadcastList',

  state: {
    isLoading: false,
    startTime: moment().add(-7, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    isShowItemMsg: false,
    isShowTip: false,
    desc: '',
    name: '',
    isOk: false,
    currentPage: 1,
    pageSize: 10,
    keywords: '',
    count: 1,
    list: [],
    itemMsgUrl: '',

  },

  effects: {
    *mount({ payload }, { call, put, all }) {
      yield put({
        type: 'getList',
        payload: {
          ...payload,
        },
      });
    },
    *addMsg({ payload }, { call, put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
    },
    *deleteItem({ payload }, { call, put, select }) {
      try {
        const res =yield call(liveRoomDelete, {
          ...payload,
        });
        if(res.code==0){   
          yield put({
            type: 'getList',
            payload: {
              tipUrl: '',
              isShowTip: false,
            },
          });
          message.info('删除成功')
        }
        
      } catch (error) {
        yield put({
          type: 'getListRejected',
        });
      }
    },
    *confirmEditBroadCast({ payload }, { call, put }) {
      try {
        if (payload.id) {
          yield call(liveRoomEdit, {
            ...payload,
          });
        } else {
          yield call(liveRoomCreate, {
            ...payload,
          });
        }

        yield put({
          type: 'getList',
          payload: {
            itemMsgUrl: '',
            isShowItemMsg: false,
            name: '',
            desc: '',
            id: '',
          },
        });
      } catch (error) {
        yield put({
          type: 'getListRejected',
        });
      }
    },
    *conditionBroadCast({ payload }, { put }) {
      yield put({
        type: 'getList',
        payload: {
          ...payload,
        },
      });
    },
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
          isLoading: true,
        },
      });
      const {
        currentPage,
        pageSize,
        keywords,
        startTime,
        endTime,
      } = yield select(state => state.broadcastList);

      try {
        const list = yield call(liveRoomList, {
          currentPage,
          pageSize,
          keywords,
          startTime,
          endTime,
        });
        console.log(list);
        yield put({
          type: 'getListResolved',
          payload: {
            ...payload,
            ...list.data,
            isLoading: false,
          },
        });
      } catch (error) {
        yield put({
          type: 'getListRejected',
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
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListRejected() {
      return {
        isLoading: false,
      };
    },
    unmountReducer() {
      return {
        isLoading: false,
        startTime: moment().add(-7, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        isShowItemMsg: false,
        isShowTip: false,
        desc: '',
        name: '',
        isOk: false,
        currentPage: 1,
        pageSize: 10,
        keywords: '',
        count: 1,
        list: [],
        itemMsgUrl: '',
      };
    },
  },
  subscriptions: {},
};
