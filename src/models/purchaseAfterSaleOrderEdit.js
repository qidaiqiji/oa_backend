import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import NP from 'number-precision';
import { reqConfig, reqAddPurchaseAfterSaleOrder, reqPurchaseOrderSuggests, reqPurchaseOrderInfo } from '../services/purchaseAfterSaleOrderEdit';

export default {
  namespace: 'purchaseAfterSaleOrderEdit',

  state: {
    payTypeMap: {},

    keywords: '',
    purchaseOrderListSuggests: [],

    // 获取的采购单信息
    supplier: '',
    purchaser: '',
    goodsList: [],

    // 页面的信息
    purchaseOrderId: null,
    isReturnGoods: false,
    isSpecial: false,
    specialPrice: 0,
    receiptMethod: undefined,
    remark: '',
    address: [],
    addressDetail: '',
    mobile: '',
    consigneeName: '',
    isTableLoading: false,
    isSaveLoading: false,
    orderTypeMap: {},
    type:"",
    backOrderType:'',
    isShowModal:false,
    relateInInvFollowList:[],
    isGift:false,
  },

  effects: {
    *mount({ payload }, { put, call }) {
      const { purchaseOrderId } = payload;
      try {
        const res = yield call(reqConfig);
        if (purchaseOrderId) {
          yield put({
            type: 'purchaseAfterSaleOrderEdit/getPurchaseOrderInfo',
            payload: {
              purchaseOrderId,
            },
          });
        }
        yield put({
          type: 'mountResolved',
          payload:{
            ...payload,
            ...res.data,
          }
        });
      } catch (error) {
        console.log('bbb');
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *saveOrder(_, { put, select, call }) {
      yield put({
        type: 'saveOrderPending',
      });
      const purchaseAfterSaleOrderEdit = yield select(state => state.purchaseAfterSaleOrderEdit);
      const {
        purchaseOrderId,
        isReturnGoods,
        goodsList,
        isSpecial,
        specialPrice,
        receiptMethod,
        remark,
        address,
        addressDetail,
        mobile,
        consigneeName,
        type,
        backOrderType,
      } = purchaseAfterSaleOrderEdit;
      try {
        yield call(reqAddPurchaseAfterSaleOrder, {
          purchaseOrderId,
          isReturnGoods,
          goodsList,
          isSpecial,
          specialPrice,
          receiptMethod,
          remark,
          address: (address.length > 0 && address.length > 2) ? { province: address[0], city: address[1], district: address[2] } : { province: address[0], city: address[1], district: '0' },
          addressDetail,
          mobile,
          consigneeName,
          type,
          backOrderType,
        });
        notification.success({
          description: '保存成功',
          message: '提示',
        });
        yield put(routerRedux.push('/purchase/purchase-order-management/purchase-after-sale-order-list'));
      } catch (error) {
        yield put({
          type: 'saveOrderReject',
        });
      }
    },
    *changePurchaseOrderSnKeywords({ payload }, { put, call }) {
      try {
        const res = yield call(reqPurchaseOrderSuggests, { keywords: payload.keywords });
        yield put({
          type: 'changePurchaseOrderSnKeywordsResolved',
          payload: {
            purchaseOrderListSuggests: res.data.purchaseOrderList,
          },
        });
      } catch (error) {
        yield put({
          type: 'changePurchaseOrderSnKeywordsReject',
        });
      }
    },
    *getPurchaseOrderInfo({ payload }, { put, call, select }) {
      yield put({
        type: 'getPurchaseOrderInfoPending',
      });
      const { backOrderType } = yield select(state=>state.purchaseAfterSaleOrderEdit)
      try {
        const res = yield call(reqPurchaseOrderInfo, { purchaseOrderId: payload.purchaseOrderId, backOrderType });
        res.data.goodsList.forEach((goods) => {
          const goodsRef = goods;
          goodsRef.returnNum = 0;
          goodsRef.backAmount = 0;
        });
        yield put({
          type: 'getPurchaseOrderInfoResolved',
          payload: {
            ...res.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getPurchaseOrderInfoReject',
        });
      }
    },
    // 同步改变的项, 集中在下面的 action 中
    *changeItemSync({ payload }, { put }) {
      yield put({
        type: 'changeItemSyncResolved',
        payload: {
          ...payload,
        },
      });
    },
    *changeGoodsReturnNum({ payload }, { put, select }) {
      const { goodsList } = yield select(state => state.purchaseAfterSaleOrderEdit);
      const { id, returnNum } = payload;
      goodsList.forEach((goods) => {
        if (+goods.id === +id) {
          const goodsRef = goods;
          goodsRef.returnNum = returnNum;
          goodsRef.backAmount = NP.round(NP.times(+goodsRef.price, +goodsRef.returnNum), 2);
        }
      });
      yield put({
        type: 'changeGoodsReturnNumReducer',
        payload: {
          goodsList,
        },
      });
    },
    *changeGoodsReturnMoney({payload},{ put, select }) {
      const { goodsList } = yield select(state => state.purchaseAfterSaleOrderEdit);
      const { id, backAmount } = payload;
      goodsList.forEach((goods) => {
        if (+goods.id === +id) {
          goods.backAmount = backAmount;
        }
      });
      yield put({
        type: 'changeGoodsReturnNumReducer',
        payload: {
          goodsList,
        },
      });
    }
  },

  reducers: {
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeItemSyncResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePurchaseOrderSnKeywordsResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getPurchaseOrderInfoPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: true,
      };
    },
    getPurchaseOrderInfoResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading: false,
        keywords: payload.purchaseOrderId,
      };
    },
    getPurchaseOrderInfoReject(state) {
      return {
        ...state,
        isTableLoading: false,
      };
    },
    changeGoodsReturnNumReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveOrderPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isSaveLoading: true,
      };
    },
    saveOrderReject(state, { payload }) {
      return {
        ...state,
        ...payload,
        isSaveLoading: false,
      };
    },
    unmountReducer() {
      return {
        payTypeMap: {},

        keywords: '',
        purchaseOrderListSuggests: [],

        // 获取的采购单信息
        supplier: '',
        purchaser: '',
        goodsList: [],

        // 页面的信息
        purchaseOrderId: null,
        isReturnGoods: false,
        isSpecial: false,
        specialPrice: 0,
        receiptMethod: undefined,
        remark: '',
        address: [],
        addressDetail: '',
        mobile: '',
        consigneeName: '',
        isTableLoading: false,
        isSaveLoading: false,
        orderTypeMap: {},
        type:"",
        backOrderType:'',
        isShowModal:false,
        relateInInvFollowList:[],
        isGift:false,
      };
    },
  },
};
