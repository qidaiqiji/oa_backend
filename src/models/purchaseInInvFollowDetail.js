import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { reqInvBillCreate, reqInvBillUpdate, reqInvBillDelete,
  reqInInvFollowDetail, reqInInvFollowUpdateShippingNo,
  reqInInvFollowUpdatePurchaseRemark, reqInInvFollowUpdateSuitDetail, reqInInvFollowUpdateRemark, reqAction } from '../services/purchaseInInvFollowDetail';


export default {
  namespace: 'purchaseInInvFollowDetail',
  state: {
    incomeInvOrderId: '',
    isLoading: false,
    isAllLoading: false,
    // 作废操作
    isShowActionModal: false,
    url: '',
    backUrl: '',

    incomeInvoiceList: [],
    detail: [],
    awaitStorageInvList: [],
    storageInvList: [],
    invAmount: '',
    invSn: '',
    invDate: moment().format('YYYY-MM-DD'),
    actionList: [],
    isSuitDetail: 1,
    diferentPage: '',
  },
  effects: {
    *mount({ payload }, { put }) {
      console.log("payload",payload)
      yield put({
        type: 'getList',
        payload: {
          ...payload,
        },
      });
    },
    *getId({ payload }, { put }) {
      yield put({
        type: 'getId',
        payload: {
          ...payload,
        },
      });
    },
    *getList({ payload }, { put, call, all, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      try {
        const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
        const { incomeInvOrderId } = purchaseInInvFollowDetail;
        const res = yield all([call(reqInInvFollowDetail, { ...payload })]);
        yield put({
          type: 'getListResolved',
          payload: {
            ...res[0].data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *changeConfig({ payload }, { put }) {
      console.log(payload);
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    *editorShippingOk({ payload }, { put, call, select }) {
      const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
      const { incomeInvOrderId } = purchaseInInvFollowDetail;
      try {
        const res = yield call(reqInInvFollowUpdateShippingNo, { incomeInvOrderId, ...payload });
        if (res.code === 0) {
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *editorRemarkOk({ payload }, { put, call, select }) {
      console.log('执行了修改备注');
      const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
      const { incomeInvOrderId } = purchaseInInvFollowDetail;
      try {
        const res = yield call(reqInInvFollowUpdateRemark, { incomeInvOrderId, ...payload });
        if (res.code === 0) {
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *editorPurchaseOk({ payload }, { put, call, select }) {
      console.log('执行了修改采购备注');
      const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
      const { incomeInvOrderId } = purchaseInInvFollowDetail;
      try {
        const res = yield call(reqInInvFollowUpdatePurchaseRemark, { incomeInvOrderId, ...payload });
        if (res.code === 0) {
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *onChangeIsSuitDetail({ payload }, { put, call, select }) {
      console.log('执行了修改明细');
      const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
      const { incomeInvOrderId } = purchaseInInvFollowDetail;
      try {
        const res = yield call(reqInInvFollowUpdateSuitDetail, { incomeInvOrderId, ...payload });
        if (res.code === 0) {
          yield put({
            type: 'updateConfig',
            payload: {
              ...payload,
            },
          });
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *invInputOk({ payload }, { put, call, all, select }) {
      try {
        const res = yield call(reqInvBillCreate, { ...payload });
        if (res.code === 0) {
          console.log('执行了');
          yield put({
            type: 'updateConfig',
            payload: {
              isAllLoading: true,
            },
          });
          const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
          const { incomeInvOrderId } = purchaseInInvFollowDetail;
          const Res = yield all([call(reqInInvFollowDetail, { incomeInvOrderId })]);
          yield put({
            type: 'getListResolved',
            payload: {
              ...Res[0].data,
              isAllLoading: false,
            },
          });
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
        yield put({
          type: 'updateConfig',
          payload: {
            invAmount: '',
            invSn: '',
            invDate: moment().format('YYYY-MM-DD'),
            isAllLoading: false,
          },
        });
        // 重新拉一遍数据请求
      } catch (err) {
        console.log(err);
      }
    },
    *editorOk({ payload }, { put, call }) {
      try {
        const res = yield call(reqInvBillUpdate, { ...payload });
        if (res.code === 0) {
          message.success(res.msg);
        } else {
          message.warning('修改失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *delete({ payload }, { put, call, all, select }) {
      try {
        const res = yield call(reqInvBillDelete, { ...payload });
        if (res.code === 0) {
          console.log('执行了');
          yield put({
            type: 'updateConfig',
            payload: {
              isAllLoading: true,
            },
          });
          const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
          const { incomeInvOrderId } = purchaseInInvFollowDetail;
          const Res = yield all([call(reqInInvFollowDetail, { incomeInvOrderId })]);
          yield put({
            type: 'getListResolved',
            payload: {
              ...Res[0].data,
              isAllLoading: false,
            },
          });
          message.success(res.msg);
        } else {
          message.warning('添加失败');
        }
      } catch (err) {
        console.log(err);
      }
    },
    *aboutActionList({ payload }, { put, call, all, select }) {
      try {
        const purchaseInInvFollowDetail = yield select(state => state.purchaseInInvFollowDetail);
        const { incomeInvOrderId } = purchaseInInvFollowDetail;
        const { url, backUrl } = payload;
        yield call(reqAction, url, { incomeInvOrderId });
        if (backUrl) {
          yield put(routerRedux.push(`/${backUrl}`));
          return false;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  reducers: {
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getId(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getDiferentPage(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    unmountReducer() {
      return {
        incomeInvOrderId: '',
        isLoading: false,
        incomeInvoiceList: [],
        detail: [],
        awaitStorageInvList: [],
        storageInvList: [],
        invAmount: '',
        invSn: '',
        invDate: moment().format('YYYY-MM-DD'),
        actionList: [],
        isSuitDetail: -1,
        diferentPage: '',
      };
    },
  },
};
