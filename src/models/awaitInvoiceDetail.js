import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { notification } from 'antd/lib/index';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { reqUrl, reqUrlDirect, reqUrlPost } from '../services/awaitInvoiceDetail';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'awaitInvoiceDetail',
  state: {
    // 数据
    configData: {},
    awaitInvDetailData: {
      suitInvGoodsList: [],
      notSuitInvGoodsList: [],
      awaitInvList: [],
      storageInvList: [],
    },

    // 参数
    id: -1,

    // 控制样式
    isLoading: false,
    isShowActionConfirm: false,
    url: '',
    actionRemark: '',
    actionText: '',
    backUrl: '',
    isSale: false,
    updateInvList: {},
  },

  effects: {
    // 确认action弹窗
    *clickOkAction({ payload }, { put, call, select }) {
      const { actionRemark, backUrl } = yield select(state => state.awaitInvoiceDetail);
      try {
        const res = yield call(reqUrl, { url: payload.url, remark: actionRemark });
        if (res.code === 0) {
          message.success('操作成功');
          yield put({
            type: 'updateState',
            payload: {
              isShowActionConfirm: false,
            },
          });
          if (backUrl) {
            yield put(routerRedux.push(backUrl));
            return;
          }
          yield put({
            type: 'getAwaitInvoiceDetailData',
            payload: {
              id: payload.id,
            },
          });
        }
      } catch (error) {
        // to do
      }
    },
    *handleOperatorRequest({ payload }, { put, call, select }) {
      const { id, backUrl } = yield select(state => state.awaitInvoiceDetail);
      try {
        const res = yield call(reqUrlDirect, { url: payload.url });
        if (res.code === 0) {
          message.success('操作成功');
          if (backUrl) {
            yield put(routerRedux.push(backUrl));
            return;
          }
          yield put({
            type: 'getAwaitInvoiceDetailData',
            payload: {
              id,
            },
          });
        }
      } catch (error) {
        // do something
      }
    },
    *handlePostRequest({ payload }, { put, call, select }) {
 
      const { id } = yield select(state => state.awaitInvoiceDetail);
      try {
        console.log("handlePostRequest",payload.url,id)
        const res = yield call(reqUrlPost, { url: payload.url, id });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '操作成功！',
          });
          yield put({
            type: 'getAwaitInvoiceDetailData',
            payload: {
              id,
              ...payload,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        // do something
      }
    },
    *getAwaitInvoiceDetailData({ payload }, { put, select }) {
      const {
        id,
      } = yield select(state => state.awaitInvoiceDetail);
      console.log("---",id)
      yield put({
        type: 'reqAwaitInvoiceDetail',
        payload: {
          NAME: 'awaitInvDetailData',
          LOADING: 'isLoading',
          id,
          ...payload,
        },
      });
      console.log("zhixingl")
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *mount({ payload }, { put }) {
      yield put({
        type: 'getAwaitInvoiceDetailData',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        // 数据
        configData: {},
        awaitInvDetailData: {
          suitInvGoodsList: [],
          notSuitInvGoodsList: [],
          awaitInvList: [],
          storageInvList: [],
        },

        // 参数
        id: -1,

        // 控制样式
        isLoading: false,
        isShowActionConfirm: false,
        url: '',
        actionRemark: '',
        actionText: '',
        backUrl: '',
        isSale: false,
        updateInvList: {},
      };
    },
  },
});
