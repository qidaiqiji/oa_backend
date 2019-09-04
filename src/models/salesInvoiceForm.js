import { routerRedux } from 'dva/router';
import { notification } from 'antd/lib/index';

import { salesInvoiceForm, createInvoiceGoodsName, reqgetlist, reqInvGoodsNameList, salesInvoiceInvoiceConfig, reqUpdateInvoice, reqAddInvoice, reqDeleteInvoice, reqGetinvoiceInfo, reqSaleOutInvCreate } from '../services/salesInvoiceForm';
import { message } from 'antd';

export default {
  namespace: 'salesInvoiceFormList',

  state: {
    isDefault: '',
    address: '',
    phoneNumber: '',
    companyTaxID: '',
    bank: '',
    bankAccount: '',
    list: [],
    total: 500,
    id: 1,
    userId: 1,
    groupSn: '',
    createTime: '',
    customerName: '',
    invType: 0,
    invInfo: '',
    goodsName: '',
    goodsSn: '',
    tag: [],
    saleNum: '',
    salePrice: '',
    saleAmount: '',
    payTime: '',
    seller: '',
    orderSn: '',
    numColor: '',
    amountColor: '',
    numRemark: [],
    amountRemark: [],
    invCanUseNum: 10,
    priceWarning: 0,
    pageSize: 100,
    currentPage: 1,
    loading: true,
    sellermap: [],
    sellerId: 0,
    invInfoType: [],
    goodsKeywords: '',
    createDateStart: '',
    createDateEnd: '',
    payDateStart: '',
    payDateEnd: '',
    actionlist: [],
    mendianname: '',
    visible: false,
    showinv: false,
    invoiceInfo: [],
    visibletwo: false,
    isnewinvoice: false,
    Invoiceform: [],
    invoiceKey: 1,
    isDefault: 1,
    companyName: '',
    address: '',
    phoneNumber: '',
    companyTaxID: '',
    bank: '',
    bankAccount: '',
    checkinvoiceinformation: {},
    ismodifytheinvoice: false,
    invGoodsList: [],
    invGoodsName: '',
    invPrice: 1,
    isShowInvGoodsNameModal: false,
    isInvGoodsNameLoading: false,
    selectedIds: [],
    invGoodsNameListData: {
      invoiceGoodsList: [],
    },
    invDate: '',
    relativeInvSn: '',
    invSn: '',
    edit: false,
    addInvoiceGoodsNameList: [{
      goodsName: '',
      goodsSn: '',
      invGoodsName: '',
      size: '',
      unit: '',
      id: '新增发票名称',
      isAdd: true,
    }],
    selectedRowstwo: {},
    isdisabled: true,
    correspondingSchedule: [],
    visible: false,
    wrongSchedule: [],
    invInfoId: 100, // 发票信息ID
    suitGoodsList: [], // 对应明细开票列表
    noSuitGoodsList: [], // 不对应明细列表
    sellerRemark: '', // 销售备注
    confirmCheck: 0, // 0 保存   1提交
    invGoodsNameId: 0,
    totalInvoicePayable: 0,
    wrongScheduleIndex: 0,
    invoiceId: 1,
    invNum: 1,
    MoreId: 1,
    selectOrderIds: [],
    invData: {},
    isinvData: false,
    openTicketPrice: '',
    availableStock: '',
    invTypeId: 1,
    numWarning: false,
    invItemId: 1,
    openTicketWindow: [],
    openTicketWindowId: [],
    invInfoKeywords: '',
  },

  effects: {
    *mount(_, { all, call, put, select }) {
      try {
        const {
          goodsKeywords,
          currentPage,
          pageSize,
        } = yield select(state => state.salesInvoiceFormList);
        const [listone, listtwo, listthree] = yield all([
          call(salesInvoiceForm, {
            pageSize,
            goodsKeywords,
            currentPage,
          }),
          call(salesInvoiceInvoiceConfig),
          call(reqInvGoodsNameList),
        ]);
        yield put({
          type: 'updatePageReducer',
          payload: {
            list: listone.data.list,
            sellermap: listtwo.data.sellerMap,
            invInfoType: listtwo.data.invInfoType,
            actionlist: listone.data.actionlist,
            loading: false,
            listthree,
            total: listone.data.total,
          },
        });
      } catch (error) {
        notification.error({
          message: '操作失败',
        });
      }
    },
    *getUserId({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);
      const {
        userId,
      } = salesInvoiceFormList;
      try {
        const req = yield call(reqGetinvoiceInfo, {
          userId,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            Invoiceform: req.data.invoiceInfo,
            loading: false,
          },
        });
      }
      catch (err) {
        console.log(err);
      }
    },
    *preservation({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);
      console.log(salesInvoiceFormList)
      const {
        suitGoodsList,
        noSuitGoodsList,
        sellerRemark,
        confirmCheck,
        invInfoId,
        invType,
      } = salesInvoiceFormList;
      try {
        const req = yield call(reqSaleOutInvCreate, {
          suitGoodsList,
          noSuitGoodsList,
          sellerRemark,
          confirmCheck,
          invInfoId,
          invType,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {


          },
        });
        if (req.code === 0) {
          message.success('保存成功');
        }
        yield put({
          type: 'mount',
        });
      } catch (err) {
        console.log(err);
      }

    },
    *getList({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);

      const {
        currentPage,
        Id,
        sellerId,
        orderSn,
        pageSize,
        customerKeywords,
        goodsKeywords,
        invType,
        createDateStart,
        createDateEnd,
        payDateStart,
        payDateEnd,
        invInfoKeywords,
      } = salesInvoiceFormList;
      try {
        const rsp = yield call(salesInvoiceForm, {
          currentPage,
          Id,
          sellerId,
          orderSn,
          pageSize,
          customerKeywords,
          goodsKeywords,
          invType,
          createDateStart,
          createDateEnd,
          payDateStart,
          payDateEnd,
          invInfoKeywords,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            total: rsp.data.total,
            loading: false,
            list: rsp.data.list,
            actionlist: rsp.data.actionlist,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *getinvoicecreate({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);
      const {
        userId,
        companyName,
        address,
        phoneNumber,
        companyTaxID,
        bank,
        bankAccount,
      } = salesInvoiceFormList;
      try {
        const req = yield call(reqAddInvoice, {
          userId,
          companyName,
          address,
          phoneNumber,
          companyTaxID,
          bank,
          bankAccount,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            isnewinvoice: false,
            companyName: '',
            address: '',
            phoneNumber: '',
            companyTaxID: '',
            bank: '',
            bankAccount: '',
          },
        });
        yield put({
          type: 'getUserId',
          payload: {
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    // 修改发票
    *getreqUpdateInvoice({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);
      const {
        invoiceId,
        companyName,
        address,
        phoneNumber,
        companyTaxID,
        bank,
        bankAccount,
      } = salesInvoiceFormList;
      try {
        const req = yield call(reqUpdateInvoice, {
          invoiceId,
          companyName,
          address,
          phoneNumber,
          companyTaxID,
          bank,
          bankAccount,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ismodifytheinvoice: false,
            companyName: '',
            address: '',
            phoneNumber: '',
            companyTaxID: '',
            bank: '',
            bankAccount: '',
          },
        });
        yield put({
          type: 'getUserId',
          payload: {
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    *getreqDeleteInvoice({ payload }, { put, call, select }) {
      const salesInvoiceFormList = yield select(state => state.salesInvoiceFormList);
      const {
        invoiceId,
        companyName,
        address,
        phoneNumber,
        companyTaxID,
        bankAccount,
        bank,
      } = salesInvoiceFormList;
      try {
        const req = yield call(reqDeleteInvoice, {
          invoiceId,
          companyName,
          address,
          phoneNumber,
          companyTaxID,
          bankAccount,
          bank,
        });
        yield put({
          type: 'getUserId',
          payload: {
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    // 选中
    *changerowselection({ payload }, { put }) {
      yield put({
        type: 'changerowselectionmod',
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
    *reqInvGoodsNameList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          goodsKeywords,
          currentPage,
          pageSize,
        } = payload;
        const res = yield call(reqInvGoodsNameList, {
          goodsKeywords,
          currentPage,
          pageSize,
        });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
              [payload.LOADING]: false,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },
    *getInvGoodsNameListData({ payload }, { put, select }) {
      const {
        goodsKeywords,
        currentPage,
        pageSize,
      } = yield select(state => state.salesInvoiceFormList);
      yield put({
        type: 'reqInvGoodsNameList',
        payload: {
          NAME: 'invGoodsNameListData',
          LOADING: 'isLoading',
          goodsKeywords,
          currentPage,
          pageSize,
          ...payload,
        },
      });
    },
    *createInvoiceGoodsName({ payload }, { put, call }) {
      console.log('one');
      try {
        const res = yield call(createInvoiceGoodsName, { ...payload });
        console.log('res', res);
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新增发票商品名称成功！',
          });
        }
        yield put({
          type: 'getInvGoodsNameListData',
        });
      } catch (error) {
        yield put({
          type: 'getInvGoodsNameListData',
        });
      }
    },
    // *changeSelectOrderIds({ payload }, { put }) {
    //   yield put({
    //     type: 'changeSelectOrderIdsReducer',
    //     payload,
    //   });
    // },

  },

  reducers: {

    unmountReducer() {
      return {
        isDefault: '',
        companyName: '',
        address: '',
        phoneNumber: '',
        companyTaxID: '',
        bank: '',
        bankAccount: '',
        list: [],
        total: 500,
        id: 1,
        userId: 1,
        groupSn: '',
        createTime: '',
        customerName: '',
        invInfo: '',
        goodsName: '',
        goodsSn: '',
        tag: [],
        saleNum: '',
        salePrice: '',
        saleAmount: '',
        payTime: '',
        seller: '',
        orderSn: '',
        numColor: '',
        amountColor: '',
        numRemark: [],
        amountRemark: [],
        invCanUseNum: 10,
        priceWarning: 0,
        invGoodsList: [],
        pageSize: 100,
        currentPage: 1,
        loading: false,
        sellermap: [],
        sellerId: 0,
        invInfoType: [],
        invType: 0,
        goodsKeywords: '',
        createDateStart: '',
        createDateEnd: '',
        payDateStart: '',
        payDateEnd: '',
        actionlist: [],
        mendianname: '',
        visible: false,
        showinv: false,
        invoiceInfo: [],
        visibletwo: false,
        isnewinvoice: false,
        Invoiceform: [],
        invoiceKey: 1,
        isDefault: 1,
        companyName: '',
        address: '',
        phoneNumber: '',
        companyTaxID: '',
        bank: '',
        bankAccount: '',
        checkinvoiceinformation: {},
        ismodifytheinvoice: false,
        invGoodsName: '',
        invPrice: 1,
        isShowInvGoodsNameModal: false,
        isInvGoodsNameLoading: false,
        selectedIds: [],
        invGoodsNameListData: {
          invoiceGoodsList: [],
        },
        invDate: '',
        relativeInvSn: '',
        invSn: '',
        edit: false,
        addInvoiceGoodsNameList: [{
          goodsName: '',
          goodsSn: '',
          invGoodsName: '',
          size: '',
          unit: '',
          id: '新增发票名称',
          isAdd: true,
        }],
        selectedRowstwo: {},
        isdisabled: true,
        correspondingSchedule: [],
        visible: false,
        wrongSchedule: [],
        invInfoId: 100, // 发票信息ID
        suitGoodsList: [], // 对应明细开票列表
        noSuitGoodsList: [], // 不对应明细列表
        sellerRemark: '', // 销售备注
        confirmCheck: 0, // 0 保存   1提交
        invGoodsNameId: 0,
        totalInvoicePayable: 0,
        wrongScheduleIndex: 0,
        invoiceId: 1,
        invNum: 1,
        MoreId: 1,
        selectOrderIds: [],
        invData: {},
        isinvData: false,
        openTicketPrice: '',
        availableStock: '',
        invTypeId: 1,
        numWarning: false,
        invItemId: 1,
        openTicketWindow: [],
        openTicketWindowId: [],
        invInfoKeywords: '',
      };
    },
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changerowselectionmod(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleRequestRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateStateReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleRequestResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSelectOrderIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
