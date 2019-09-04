
import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { reqGoodsNameList, reqInvGoodsAddName, reqInvBillAddDetail,
  reqInvGoodsNameList, reqInvGoodsCreate, reqInInvFollowDetail,
  reqInvoiceItemAdd, reqInvBillCreate, reqInvBillUpdate, reqInvBillDelete,
  reqInInvFollowUpdateShippingNo,
  reqInInvFollowUpdatePurchaseRemark, reqInInvFollowUpdateSuitDetail,
  reqInInvFollowUpdateRemark, reqInInvGoodsDeleteName,
  reqAction, reqincomeInvDelete, reqInvBillInStorage,
} from '../services/financePurchaseInInvDetail';


export default {
  namespace: 'financePurchaseInInvDetail',
  state: {
    incomeInvOrderId: '',
    isLoading: false,
    incomeInvoiceList: [],
    awaitInvoiceBillSn: [],
    detail: [],
    awaitStorageInvList: [],
    storageInvList: [],
    isSuitDetailMask: false,
    notSuitDetailMask: false,
    iseditGoodsMask: false,
    isMoneyMask: false,
    isShowInvGoodsNameModal: false,
    isShowAddInvoiceGoodsNameModal: false,
    invNameList: [],
    goodsSn: '',
    list: [],
    nSuitDetailList: [],
    goodsCheckboxIds: [],
    invoiceGoodsObj: {
      total: '',
      invoiceGoodsList: [],
    },
    isInvGoodsNameLoading: true,
    selectedIds: [],
    selectedRows: [],
    addInvoiceGoodsNameList: [],
    currentPage: 1,
    pageSize: 40,
    total: '',
    goodsKeywords: '',
    taxRate: 0.13,
    actionList: [],
    // 作废操作
    isShowActionModal: false,
    url: '',
    backUrl: '',
    invAmount: '',
    invSn: '',
    invDate: moment(new Date()).format('YYYY-MM-DD'),
    isSuitDetail: -1,
    diferentPage: '',
    // 按钮
    isOkloading: false,
    newId: null,
    invGoodsNameList: [],
    everyID: [],
    // 二次确认
    actionListOperationMask: false,
    pageChange: '',
    // 编辑发票商品id
    itemId: '',
    saveSuccess: false,
    // 备注信息
    financeRemark: ''
  },
  effects: {
    *mount({ payload }, { put }) {
      yield put({
        type: 'getList',
        payload: {
          ...payload,
        },
      });
    },
    *updateState({ payload }, { put }) {
      yield put({
        type: 'updateStateReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getInvGoodsNameListData({ payload }, { put, call }) {
      yield put({
        type: 'updateStateReducer',
        payload: {
          isShowInvGoodsNameModal: true,
          ...payload,
        },
      });
      try {
        const res = yield call(reqInvGoodsNameList, { ...payload });
        yield put({
          type: 'updateStateReducer',
          payload: {
            invoiceGoodsObj: res.data,
            isInvGoodsNameLoading: false,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    // --增加备注信息
    *addRemarks({payload},{put}) {
      yield put({
        type: 'addRemarksValue',
        payload: {
          ...payload,
        },
      });
    },
    *getCheckRowMX({ payload }, { put, call, select }) {
      console.log("选择的",payload)
      const { isSuitDetailMask, goodsCheckboxIds, invGoodsList, invId, notSuitDetailMask, isSuitDetail, financeRemark } = payload;
      yield put({
        type: 'updateStateReducer',
        payload: {
          isSuitDetailMask,
          goodsCheckboxIds,
          notSuitDetailMask,
          nSuitDetailList: [],
          financeRemark
        },
      });
      try {
        const res = yield call(reqInvBillAddDetail, { invGoodsList, invId, isSuitDetail, financeRemark });
        message.success(res.msg);
        yield put({ type: 'getAllData' });
      } catch (err) {
        console.log(err);
      }
    },
    *saveItemList({ payload }, { put, call, select }) {
      // console.log('保存', payload);
      // const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqInvoiceItemAdd, { ...payload });
        message.success(res.msg);
        yield put({
          type: 'updateStateReducer',
          payload: {
            saveSuccess: true,
          },
        });
        yield put({ type: 'getAllData' });
      } catch (err) {
        console.log(err);
      }
    },
    *editableOpen({ payload }, { put, call }) {
      try {
        const { goodsSn, iseditGoodsMask, itemId } = payload;
        const res = yield call(reqGoodsNameList, { goodsSn });
        yield put({
          type: 'updateStateReducer',
          payload: {
            iseditGoodsMask,
            ...res.data,
            goodsSn,
            itemId,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    // 作废按钮
    *incomeInvDelete({ payload }, { put, call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const Res = yield call(reqincomeInvDelete, { ...payload });
        message.success(Res.msg);
        yield put({
          type: 'getList',
          payload: {
            incomeInvOrderId,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    // 入库按钮
    *invBillInStorage({ payload }, { put, call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const Res = yield call(reqInvBillInStorage, { ...payload });
        message.success(Res.msg);
        yield put({
          type: 'getList',
          payload: {
            incomeInvOrderId,
          },
        });
      } catch (err) { console.log(err); }
    },
    *editGoodsOk({ payload }, { put, call, select }) {
      try {
        const { everyID } = yield select(state => state.financePurchaseInInvDetail);
        const { goodsSn, iseditGoodsMask, invGoodsName } = payload;
        const res = yield call(reqInvGoodsAddName, { goodsSn, invGoodsName });
        everyID.length > 0 ? (everyID.map((item) => {
          if (item.goodsSn === goodsSn) {
            item.newId = res.data.newId;
          } else {
            everyID.push({ goodsSn, newId: res.data.newId });
          }
        }))
          : everyID.push({ goodsSn, newId: res.data.newId });
        yield put({
          type: 'updateStateReducer',
          payload: {
            iseditGoodsMask,
            everyID,
            goodsSn,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *handleAddInvoiceGoodsNameModalOk({ payload }, { put, call, select }) {
      try {
        const { addInvoiceGoodsNameList, goodsKeywords, currentPage } = yield select(state => state.financePurchaseInInvDetail);
        const realAddInvoiceGoodsNameList = addInvoiceGoodsNameList.map((item) => {
          return (({ goodsName, goodsSn, invGoodsName, size, unit }) =>
            ({ goodsName, goodsSn, invGoodsName, size, unit })
          )(item);
        });
        const res = yield call(reqInvGoodsCreate, { ...realAddInvoiceGoodsNameList[0] });
        // 可能需要再次调用下一级的数组
        message.success(res.msg);
        const Res = yield call(reqInvGoodsNameList, { goodsKeywords, currentPage });
        yield put({
          type: 'updateStateReducer',
          payload: {
            ...payload,
            addInvoiceGoodsNameList: [],
            ...Res.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *actionListOperationMaskOk({ payload }, { put, call, all, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqAction, payload.url, { remark: payload.remark, id: incomeInvOrderId });
        message.success(res.msg);
        yield put({
          type: 'updateStateReducer',
          payload: {
            actionListOperationMask: payload.actionListOperationMask,
          },
        });
        if (payload.backUrl) {
          yield put(routerRedux.push(payload.backUrl));
        } else {
          yield put({
            type: 'getList',
            payload: {
              incomeInvOrderId,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *getList({ payload }, { put, call, all, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      try {
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
    //  头部
    *editorShippingOk({ payload }, { put, call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqInInvFollowUpdateShippingNo, { incomeInvOrderId, ...payload });
        message.success(res.msg);
        yield put({ type: 'getAllData' });
      } catch (err) {
        console.log(err);
      }
    },
    *editorRemarkOk({ payload }, { call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqInInvFollowUpdatePurchaseRemark, { incomeInvOrderId, ...payload });
        message.success(res.msg);
      } catch (err) {
        console.log(err);
      }
    },
    *editorOk({ payload }, { put, call }) {
      try {
        const res = yield call(reqInvBillUpdate, { ...payload });
        yield put({ type: 'getAllData' });
        message.success(res.msg);
      } catch (err) {
        console.log(err);
      }
    },
    *delete({ payload }, { put, call }) {
      try {
        const res = yield call(reqInvBillDelete, { ...payload });
        yield put({ type: 'getAllData' });
        message.success(res.msg);
      } catch (err) {
        console.log(err);
      }
    },

    *invInputOk({ payload }, { put, call }) {
      try {
        const res = yield call(reqInvBillCreate, { ...payload });
        message.success(res.msg);
        yield put({
          type: 'getListPending',
          payload: {
            isOkloading: true,
          },
        });
        yield put({ type: 'getAllData' });
        yield put({
          type: 'updateStateReducer',
          payload: {
            invAmount: '',
            invSn: '',
            invDate: moment(new Date()).format('YYYY-MM-DD'),
            isOkloading: false,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *getAllData(_, { select, all, call, put }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      yield put({
        type: 'getListPending',
      });
      const Res = yield all([call(reqInInvFollowDetail, { incomeInvOrderId })]);
      yield put({
        type: 'getListResolved',
        payload: {
          ...Res[0].data,
        },
      });
    },
    *editorPurchaseOk({ payload }, { call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqInInvFollowUpdateRemark, { incomeInvOrderId, ...payload });
        message.success(res.msg);
      } catch (err) {
        console.log(err);
      }
    },
    *hideEditGoodsDelete({ payload }, { put, call, select }) {
      try {
        const { goodsSn } = yield select(state => state.financePurchaseInInvDetail);
        const res = yield call(reqInInvGoodsDeleteName, { ...payload });
        message.success(res.msg);
        const Res = yield call(reqGoodsNameList, { goodsSn });
        yield put({
          type: 'updateStateReducer',
          payload: {
            ...Res.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *onChangeIsSuitDetail({ payload }, { put, call, select }) {
      const { incomeInvOrderId } = yield select(state => state.financePurchaseInInvDetail);
      try {
        const res = yield call(reqInInvFollowUpdateSuitDetail, { incomeInvOrderId, ...payload });
        if (res.code === 0) {
          yield put({
            type: 'updateStateReducer',
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
    // 头部
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
        isLoading: true,
      };
    },
    hideEditGoodsOk(state, { payload }) {
      return {
        ...state,
        ...payload,
        iseditGoodsMask: false,
        newId: null,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    updateStateReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addRemarksValue(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        incomeInvOrderId: '',
        isLoading: false,
        incomeInvoiceList: [],
        awaitInvoiceBillSn: [],
        detail: [],
        awaitStorageInvList: [],
        storageInvList: [],
        isSuitDetailMask: false,
        notSuitDetailMask: false,
        iseditGoodsMask: false,
        isMoneyMask: false,
        isShowInvGoodsNameModal: false,
        isInvGoodsNameLoading: true,
        isShowAddInvoiceGoodsNameModal: false,
        invNameList: [],
        goodsSn: '',
        list: [],
        nSuitDetailList: [],
        goodsCheckboxIds: [],
        invoiceGoodsObj: {
          total: '',
          invoiceGoodsList: [],
        },
        selectedIds: [],
        selectedRows: [],
        addInvoiceGoodsNameList: [],
        currentPage: 1,
        pageSize: 40,
        total: '',
        goodsKeywords: '',
        taxRate: 0.13,
        actionList: [],
        // 作废操作
        isShowActionModal: false,
        url: '',
        backUrl: '',
        invAmount: '',
        invSn: '',
        invDate: moment(new Date()).format('YYYY-MM-DD'),
        isSuitDetail: -1,
        // 按钮
        isOkloading: false,
        newId: null,
        invGoodsNameList: [],
        everyID: [],
        // 二次确认
        actionListOperationMask: false,
        pageChange: '',
        // 编辑发票商品id
        itemId: '',
        saveSuccess: false,
        // 备注信息
        financeRemark: ''

      };
    },
  },
};
