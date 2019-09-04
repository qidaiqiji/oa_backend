import { notification } from 'antd';
import { reqGetGroupInfo, reqSaveGroupInfo } from '../services/sellerTeam.js';

export default {
  namespace: 'sellerTeam',

  state: {
    areaMap: {},
    groupList: [],
    isLoading: false,
    hidden: false,
  },

  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getGroupInfo',
      });
    },
    *getGroupInfo(_, { put, call }) {
      try {
        const res = yield call(reqGetGroupInfo);
        yield put({
          type: 'groupInfoReducer',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeAreaItem({ payload }, { put, select }) {
      const sellerTeam = yield select(state => state.sellerTeam);
      const { groupList } = sellerTeam;
      for (let i = 0; i < groupList.length; i += 1) {
        if (groupList[i].groupId === payload.groupId) {
          groupList[i].areaId = payload.areaId;
        }
        if (!payload.groupId) {
          groupList[i].areaId = '';
        }
      }
      yield put({
        type: 'areaItemReducer',
        payload: {
          groupList,
        },
      });
    },
    *saveItem(_, { put, call, select }) {
      const sellerTeam = yield select(state => state.sellerTeam);
      const { groupList } = sellerTeam;
      const ids = [];
      yield put({
        type: 'saveItemPending',
      });
      for (let i = 0; i < groupList.length; i += 1) {
        const obj = {};
        obj.groupId = groupList[i].groupId;
        obj.areaId = groupList[i].areaId;
        ids.push(obj);
      }
      try {
        const res = yield call(reqSaveGroupInfo, { ids });
        yield put({
          type: 'saveItemReducer',
          payload: {
            ...res.data,
          },
        });
        notification.success({
          message: '提示',
          description: '保存成功',
        });
      } catch (error) {
        // to do
        yield put({
          type: 'saveItemReducer',
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
    saveItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    saveItemPending(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    areaItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    groupInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        areaMap: {},
        groupList: [],
        isLoading: false,
        hidden: false,
      };
    },
  },
};
