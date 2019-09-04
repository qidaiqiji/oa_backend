import { queryNotices, reqInfo, reqClear } from '../services/api';
import { notification } from 'antd';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    businessList: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    //获取消息中心的消息
    *requestInfoList({ payload },{ call, put }) {
      yield put({
        type:'updatePage',
        payload:{
          fetchingNotices: true,
        }
      })
      try{
        const res = yield call(reqInfo)
        yield put({
          type:'updatePage',
          payload:{
            businessList:res.data,
            fetchingNotices: false,
          }
        })
      }catch(err) {
        yield put({
          type:'updatePage',
          payload:{
            fetchingNotices: false,
          }
        })
        console.log(err)

      }
    },
    *clearMemory({ _ },{ call }) {
      try{
        const res = yield call(reqClear);
        notification.success({
          message:res.msg,
        })

      }catch(err) {

      }
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    updatePage(state,{ payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        // fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
