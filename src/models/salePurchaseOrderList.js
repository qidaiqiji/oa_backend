import moment from 'moment';
import {
  reqGetConfig,
  reqGetPurchaserConfig,
  reqGetOrderList,
  reqGetSupplierList,
  reqMergePayment,
  reqOkEditRemarkModal,
} from '../services/salePurchaseOrderList';

export default {
  namespace: 'salePurchaseOrderList',

  state: {
    total: 0,
    curPage: 1,
    pageSize: 40,
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
    keywords: '',
    supplierId: '',
    siftSupplierList: [],
    orderInfos: [],
    isLoading: true,
    supplyGoodsCheckboxIds: [],
    purchaserMap: {},
    purchaserId: '',
    purchaseOrderTypeMap: {},
    payTypeMap: {},
    status: '',
    payType: '',
    orderLoading: false,
    totalPurchaseAmount: 0,
    sellerMap: [],
    sellerId: '',
    isShowEditRemarkModal: false,
    orderId: "",
    orderRemark: "",
    purchaseOrderStatusMap: {},
    purchaseOrderShippingStatusMap: {},
    shippingStatus: -1,
    purchaseOrderStatusListMap:{},
    isBack:"",
    purchaseShippingStatus:{},
    brandListMap: {},
    brandId:"",
    goodsSn:"",
    payTimeStart:'',
    payTimeEnd:'',
  },

  effects: {
    *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
      let totalPurchaseAmount = 0;
      for (let i = 0; i < payload.rows.length; i += 1) {
        totalPurchaseAmount += +payload.rows[i].money;
      }
      yield put({
        type: 'supplyGoodsCheckboxIdsReducer',
        payload: {
          supplyGoodsCheckboxIds: payload.supplyGoodsCheckboxIds,
          totalPurchaseAmount,
        },
      });
    },
    // 拉取配置项
    *getConfig(_, { put, call, select }) {
      try {
        const res = yield call(reqGetConfig);
        const purchaserRes = yield call(reqGetPurchaserConfig);
        yield put({
          type: 'getConfigReducer',
          payload: {
            purchaserMap: purchaserRes.data.purchaserMap,
            purchaseOrderTypeMap: res.data.purchaseOrderTypeMap,
            payTypeMap: res.data.payTypeMap,
            sellerMap:res.data.sellerMap,
            purchaseOrderStatusListMap: res.data.purchaseOrderStatusListMap,
            purchaseShippingStatus:res.data.purchaseShippingStatus,
            brandListMap: res.data.brandListMap,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 获取待销售采购订单列表
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderPending',
        payload:{
          isLoading:true,
          ...payload,
        }
      });
      const {
        keywords,
        supplierId,
        startDate,
        endDate,
        purchaserId,
        status,
        pageSize,
        curPage,
        payType,
        sellerId,
        shippingStatus,
        isBack,
        brandId,
        goodsSn,
        payTimeStart,
        payTimeEnd,
        orderInfoSn
      } = yield select(state => state.salePurchaseOrderList);
      try {
        const res = yield call(reqGetOrderList, {
          keywords,
          supplierId,
          startDate,
          endDate,
          purchaserId,
          status,
          pageSize,
          curPage,
          payType,
          sellerId,
          shippingStatus,
          type: 2,
          isBack,
          brandId,
          goodsSn,
          payTimeStart,
          payTimeEnd,
          orderInfoSn
        });
        res.data.table.map(item=>{
          item.isChange=false;
        })
        yield put({
          type: 'getOrderListReducer',
          payload: {
            orderInfos: res.data.table,
            purchaseOrderShippingStatusMap: res.data.purchaseOrderShippingStatusMap,
            purchaseOrderStatusMap: res.data.purchaseOrderStatusMap,
            total: res.data.total,
            ...payload,
            isLoading: false,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 生成采购单
    *mergePayment(_, { put, call, select }) {
      const { supplyGoodsCheckboxIds } = yield select(state => state.salePurchaseOrderList);
      yield put({
        type: 'mergePaymentPending',
      });
      try {
        yield call(reqMergePayment, { ids: supplyGoodsCheckboxIds });
        yield put({
          type: 'mergePaymentResolved',
        });
        yield put({
          type: 'getOrderList',
          payload: {
            curPage: 1,
          },
        });
      } catch (error) {
        yield put({
          type: 'mergePaymentRejected',
        });
      }
    },
    // 拉取供应商列表
    *getSiftSupplierList({ payload }, { put, call }) {
      if (payload.keywords === '') {
        yield put({
          type: 'siftSupplierListReducer',
          payload: {
            siftSupplierList: [],
          },
        });
        return;
      }
      try {
        const res = yield call(reqGetSupplierList, { ...payload });
        yield put({
          type: 'siftSupplierListReducer',
          payload: {
            siftSupplierList: res.data.suppliers,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 更改采购员
    *changePurchaser({ payload }, { put }) {
      yield put({
        type: 'changePurchaserReducer',
        payload: {
          ...payload,
        },
      });
      yield put({
        type: 'getOrderList',
        payload: {
          ...payload,
        },
      });
    },
    // 更改付款方式
    *changePayment({ payload }, { put }) {
      yield put({
        type: 'changePaymentMethod',
        payload: {
          ...payload,
        },
      });
      yield put({
        type: 'getOrderList',
        payload: {
          ...payload,
        },
      });
    },
    *changeSeller({ payload }, { put }) {
      yield put({
        type: 'changePaymentMethod',
        payload: {
          ...payload,
        },
      });
      yield put({
        type: 'getOrderList',
        payload: {
          ...payload,
        },
      });
    },
    *triggerEditRemarkModal({ payload }, { put,select }) {
      const { orderId } = payload;
      const { orderInfos, isShowEditRemarkModal } = yield select(state=>state.salePurchaseOrderList);
      let orderRemark = "";
      orderInfos.map(item=>{
        if(+item.id === +orderId) {
          if(!item.isChange) {
            orderRemark = item.remark;
          }
        }
      })
      yield put({
        type: 'getConfigReducer',
        payload:{
          orderRemark,
          orderId,
          isShowEditRemarkModal: !isShowEditRemarkModal,
        },
      });
    },
    // 编辑备注的弹窗点击确定提交
    *okEditRemarkModal({ payload }, { put, select, call }) {
      yield put({
        type: 'getOrderPending',
        payload:{
          isEditingRemark:true,
        }
      });
      const {
        orderId,
        orderRemark,
      } = yield select(state => state.salePurchaseOrderList);
      try {
        yield call(reqOkEditRemarkModal, { orderId, remark: orderRemark });
        yield put({
          type: 'getOrderPending',
          payload:{
            isShowEditRemarkModal: false,
            isEditingRemark: false,
            orderRemark: '',
          }
        });
        yield put({
          type: 'getOrderList',
        });
      } catch (error) {
        console.log(error)
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    assignPurchaserOrderReducer(state) {
      return {
        ...state,
        orderLoading: false,
      };
    },
    changePaymentMethod(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    mergePaymentResolved(state) {
      return {
        ...state,
        orderLoading: false,
        supplyGoodsCheckboxIds: [],
      };
    },
    assignPurchaserOrderPending(state) {
      return {
        ...state,
        orderLoading: true,
      };
    },
    mergePaymentPending(state) {
      return {
        ...state,
        orderLoading: true,
      };
    },
    mergePaymentRejected(state) {
      return {
        ...state,
        orderLoading: false,
      };
    },
    changePurchaserReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    siftSupplierListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getConfigReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    goodsCheckboxIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    supplyGoodsCheckboxIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        total: 0,
        curPage: 1,
        pageSize: 40,
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
        keywords: '',
        supplierId: '',
        siftSupplierList: [],
        orderInfos: [],
        isLoading: true,
        supplyGoodsCheckboxIds: [],
        purchaserMap: {},
        purchaserId: '',
        purchaseOrderTypeMap: {},
        payTypeMap: {},
        status: '',
        payType: '',
        orderLoading: false,
        totalPurchaseAmount: 0,
        sellerMap: [],
        sellerId: '',
        isShowEditRemarkModal: false,
        orderId: "",
        orderRemark: "",
        purchaseOrderStatusMap: {},
        purchaseOrderShippingStatusMap: {},
        shippingStatus: -1,
        purchaseOrderStatusListMap:{},
        isBack:"",
        purchaseShippingStatus:{},
        brandListMap: {},
        brandId:"",
        goodsSn:"",
        payTimeStart:'',
        payTimeEnd:'',
      };
    },
  },
};
