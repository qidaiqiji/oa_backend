import { routerRedux } from 'dva/router';
import { salesInvoiceInvoiceConfig, saleOutInvFollowList, salesRemark } from '../services/pendingFollowUpForm';
import { notification } from 'antd/lib/index';
import { message } from 'antd';

export default {
  namespace: 'pendingFollowUpForm',

  state: {
    actionList: [],
    total: 500,
    outcomeInvOrderList: [],
    id: '',
    status: 0,
    invSn: '',
    createTime: '',
    customerName: '',
    companyName: '',
    invAmount: '',
    isSuitDetail: '',
    seller: '',
    sellerRemark: '',
    invOrderGoodsList: [],
    groupSn: '',
    orderCreateTime: '',
    goodsName: '',
    goodsSn: '',
    num: '',
    salePrice: '',
    saleAmount: '',
    payTime: '',
    orderSn: '',
    customerKeywords: '',
    sellerMap: [],
    outInvOrderSn: '',
    sellerId: 0,
    createDateStart: '',
    createDateEnd: '',
    orderCreateDateStart: '',
    orderCreateDateEnd: '',
    orderPayDateStart: '',
    orderPayDateEnd: '',
    list: [],
    currentPage: 1,
    pageSize: 40,
    outInvOrderId: '',
    outcomeInvOrderStatusMap: {},
    InvSuitDetailMap: {},
    loading: true,
    consignee: '',
  },

  effects: {
    *mount(_, { all, call, put }) {
      try {
        const [listone, listtwo] = yield all([
          call(saleOutInvFollowList),
          call(salesInvoiceInvoiceConfig),
        ]);
        yield put({
          type: 'updatePageReducer',
          payload: {
            list: listone.data.outcomeInvOrderList,
            sellerMap: listtwo.data.sellerMap,
            invOrderGoodsList: listone.data.outcomeInvOrderList.invOrderGoodsList,
            actionList: listone.data.actionList,
            outcomeInvOrderStatusMap: listtwo.data.outcomeInvOrderStatusMap,
            InvSuitDetailMap: listtwo.data.InvSuitDetailMap,
            loading: false,
            total: listone.data.total,
          },
        });
        console.log(listone.data.actionList);
        // console.log(listone.data.outcomeInvOrderList.invOrderGoodsList);
      } catch (error) {
        notification.error({
          message: '操作失败',
        });
      }
    },
    *remarks({ payload }, { put, call, select }) {
      const pendingFollowUpForm = yield select(state => state.pendingFollowUpForm);
      const {
        outInvOrderId,
        remark,
      } = pendingFollowUpForm;
      try {
        const req = yield call(salesRemark, {
          outInvOrderId,
          remark,
        });
        if (req.code === 0) {
          message.success('保存成功');
        }
      } catch (err) {
        console.log(err);
      }
    },

    *getList({ payload }, { put, call, select }) {
      const pendingFollowUpForm = yield select(state => state.pendingFollowUpForm);
      const {
        currentPage,
        pageSize,
        outInvOrderSn,
        orderSn,
        goodsSn,
        sellerId,
        customerKeywords,
        createDateStart,
        createDateEnd,
        orderCreateDateStart,
        orderCreateDateEnd,
        orderPayDateStart,
        orderPayDateEnd,
        sellerRemark,
        status,
        isSuitDetail,
        consignee,
      } = pendingFollowUpForm;
      try {
        const rsp = yield call(saleOutInvFollowList, {
          currentPage,
          pageSize,
          outInvOrderSn,
          orderSn,
          goodsSn,
          sellerId,
          customerKeywords,
          createDateStart,
          createDateEnd,
          orderCreateDateStart,
          orderCreateDateEnd,
          orderPayDateStart,
          orderPayDateEnd,
          sellerRemark,
          status,
          isSuitDetail,
          consignee,
          ...payload,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            // total: rsp.data.total,
            loading: false,
            list: rsp.data.outcomeInvOrderList,
            actionList: rsp.data.actionList,
            ...payload,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    unmountReducer() {
      return {
        actionList: [],
        total: 500,
        outcomeInvOrderList: [],
        id: '',
        status: 0,
        invSn: '',
        createTime: '',
        customerName: '',
        companyName: '',
        invAmount: '',
        isSuitDetail: '',
        seller: '',
        sellerRemark: '',
        invOrderGoodsList: [],
        groupSn: '',
        orderCreateTime: '',
        goodsName: '',
        goodsSn: '',
        num: '',
        salePrice: '',
        saleAmount: '',
        payTime: '',
        orderSn: '',
        customerKeywords: '',
        sellerMap: [],
        outInvOrderSn: '',
        sellerId: 0,
        createDateStart: '',
        createDateEnd: '',
        orderCreateDateStart: '',
        orderCreateDateEnd: '',
        orderPayDateStart: '',
        orderPayDateEnd: '',
        list: [],
        currentPage: 1,
        pageSize: 40,
        outInvOrderId: '',
        outcomeInvOrderStatusMap: {},
        InvSuitDetailMap: {},
        loading: true,
        consignee: '',
      };
    },
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
