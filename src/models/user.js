import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent, reqAuth, reqLogout, reqLogin, reqInfo, reqConfig } from '../services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    isLogin: false,
    isLogining: false,
    avatar: '',
    name: '匿名',
    businessList: [],
    departmentMap: {},
    headImgUrl: '',
    mobilePhone:''
  },

  effects: {
    /*
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    */
    *auth(_, { call, put }) {
      yield put({
        type: 'authPending',
      });
      try {
        const user = yield call(reqAuth);
    
        yield put({
          type: 'authResolved',
          payload: {
            ...user.data,
          },
        });
      } catch (error) {
        yield put(routerRedux.push('/user/login'));
      }
    },
    *clickLoginButton({ payload }, { call, put }) {
      yield put({
        type: 'loginPending',
      });
      try {
        const user = yield call(reqLogin, { ...payload });
        // 设置 token 值还有当前时间，到时判断是否是过期了
        // const token = {
        //   time: Date.now(),
        //   token: user.data.access_token,
        // };
        localStorage.setItem('token', user.data.access_token);
        yield put({
          type: 'loginResolved',
          payload: {
            ...user.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'loginRejected',
        });
      }
    },

    *clickLogoutButton(_, { put }) {
      localStorage.removeItem('token');
      yield put(routerRedux.push('/user/login'));
      yield put({
        type: 'logout',
      });
    },
    
    
  },
  

  reducers: {
    updatePage(state,{ payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    /*
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    */
    logout(state) {
      return {
        ...state,
        isLogin: false,
        isLogining: false,
      };
    },
    authPending(state) {
      return {
        ...state,
        // isLogining: true,
      };
    },
    authRejected(state) {
      return {
        ...state,
        isLogin: false,
        isLogining: false,
      };
    },
    authResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        name: payload.nickname,
        isLogin: true,
        isLogining: false,
      };
    },
    loginPending(state) {
      return {
        ...state,
        isLogining: true,
      };
    },
    loginRejected(state) {
      return {
        ...state,
        isLogining: false,
      };
    },
    loginResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        name: payload.nickname,
        isLogining: false,
        isLogin: true,
        
      };
    },
  },

};
