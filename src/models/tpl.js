import { routerRedux } from 'dva/router';
import { reqAuth } from '../services/tpl';

export default {
  namespace: 'tpl',

  state: {
    data: 'xxx',
  },

  effects: {
    *clickLogoutButton({ payload }, { put, call, select, all }) {
      const data = yield select(state => state.tpl);
      try {
        const res = yield all([call(reqAuth), call(reqAuth, { ...payload })]);
        yield put(routerRedux.put('path'));
        yield put({
          type: 'clickLogoutButtonReducer',
          payload: {
            ...payload,
            ...res.data,
            ...data,
          },
        });
      } catch (error) {
        console.log('bbb');
      }
    },
  },

  reducers: {
    clickLogoutButtonReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
