import cloneDeep from 'lodash/cloneDeep';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import { reqGetStoreOrderInfo, reqGenStoreOrder, reqPushStoreOrder, reqObsoleteStoreOrder, reqAction, reqGetConfig, requestChangeTax } from '../services/commonPurchaseDetail';
import { reqGetOrderInfo } from '../services/commonPurchaseAdd';
import area from '../area.json';

export default {
  namespace: 'commonPurchaseDetail',

  state: {
    allPrice: 0,
    paidPrice: 0,
    goods: [],
    gifts: [],
    waitInStoreOrder: [],
    freight: 0,
    storeOrders: [],
    waitPushOrders: [],
    storageTypeMap:{},
    isShowPushConfirm: false,
    isPushing: false,
    isShowGenConfirm: false,
    isGening: false,
    isShowObsoleteConfirm: false,
    isObsoleting: false,
    followInfoDetail: {},

    // 地址 省市区
    addressOptions: area.data,
    // 详细地址
    province: null,
    city: null,
    district: null,
    address: '',
    consignee: '',
    mobile: '',
    genInfo: {
      date: '',
      handler: '',
      storeNo: '',
      remark: '',
      goods: [],
      gifts: [],
    },
    bankInfo:"",
    isLoading: true,
    pushOrObsoleteOrderId: null,
    logisticsFare: '',
    logisticsSn: '',

    payInfos: [],
    backOrderList: [],

    // 操作相关
    actionList: [],
    actiontUrl: '',
    actionRemark: '',
    isShowActionModal: false,
    isActing: false,

    payTypeMap: {},
    payType: '',
    // 是否编辑含税
    isEditTax: false,
    isChangeStore: false,
    selectedInfo: {},
    depot:"hxlDepot",
    depotMap: {},
    payByCash:{
      12: "现款现结",
      13: "现款-货到票到付款",
    },
    payByDirect: {
      14: "购销7天",
      15: "购销15天",
      16: "购销月结",
      17: "购销60天"
    },
    payByAgency: {
      18: "代销7天",
      19: "代销15天",
      20: "代销月结",
      21: "代销60天"
    },
    isAllCash:false,
    isAllDirect:false,
    isAllAgency:false,
    shippingMethodMap:{},
    shippingMethod:'',
    isTax:0,
    shippingInfoDetail:{
      shippingFeeId:[],
      detail:{
        purchaseShippingList:[],
        shippingImgList:[]
      }
    }
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *changeMobile({ payload }, { put }) {
      yield put({
        type: 'changeMobileReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeConsignee({ payload }, { put }) {
      yield put({
        type: 'changeConsigneeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getConfig({ payload }, { put, call, all }) {
      try {
        const config = yield call(reqGetConfig);
        const [orderInfo, storeOrderInfo] = yield all([call(reqGetOrderInfo, { id: payload.orderId }), call(reqGetStoreOrderInfo, { id: payload.orderId })]);
        const waitPushOrders = storeOrderInfo.data.filter((order) => {
          return order.status === 11;
        });
        const storeOrders = storeOrderInfo.data.filter((order) => {
          return order.status === 12 || order.status === 6;
        });
        const waitInStoreOrder = cloneDeep(orderInfo.data.goodsInfos);
        waitInStoreOrder.map(item=>{
          item.isChangeStore = false;
        })
        const giftClone = cloneDeep(orderInfo.data.gifts);
        const followInfo = orderInfo.data.followInfo;
        const shippingInfoDetail = orderInfo.data.shippingInfoDetail;
        yield put({
          type: 'getOrderInfoReducer',
          payload: {
            ...orderInfo.data,
            goods: orderInfo.data.goodsInfos,
            gifts: orderInfo.data.gifts,
            remark: orderInfo.data.remark,
            waitPushOrders,
            waitInStoreOrder: waitInStoreOrder.concat(giftClone),
            storeOrders,
            payTypeMap: config.data.payTypeMap,
            depotMap: config.data.depotMap,
            storageTypeMap:config.data.storageTypeMap,
            shippingMethodMap:config.data.shippingMethodMap,
            shippingInfoDetail,
          },
        });
        const followInfoDetail = {};
        followInfo.map((item,index)=>{
          followInfoDetail[index] = item.shippingNo;
          return followInfoDetail;
        })
        yield put({
          type: 'getOrderInfoReducer',
          payload:{
            followInfoDetail,
          }
        })
      } catch (error) {
        // dodo
      }
    },
    // 生成按钮
    *clickGenButton(_, { put, select}) {
      const { waitInStoreOrder } = yield select(state=>state.commonPurchaseDetail);
      // waitInStoreOrder.map(item=>{
      //   if(!item.isChangeStore) {
      //     item.nowStoreNum = item.waitStoreNum;
      //   }
      // })
      yield put({
        type: 'showGenConfirm',
        payload: {
          waitInStoreOrder
        }
      });
    },
    *clickCancelGenButton(_, { put }) {
      yield put({
        type: 'cancelGenConfirm',
      });
    },
    *clickOkGenButton({ payload }, { call, put, all }) {
      yield put({
        type: 'okGenConfirm',
      });
      const waitGoodsList = payload.waitInStoreOrder;
      const goodsList = [];
      for (let i = 0; i < waitGoodsList.length; i += 1) {
        goodsList[i] = {};
        goodsList[i].purchase_goods_id = waitGoodsList[i].id;
        // goodsList[i].purchase_goods_id = goods[i].goodsId;
        // goodsList[i].goods_sn = goods[i].goodsNo;
        goodsList[i].goods_number = waitGoodsList[i].nowStoreNum;
      }
      const data = {
        remark: payload.remark,
        purchase_order_id: payload.orderId,
        goodsList,
        consignee: payload.consignee,
        mobile: payload.mobile,
        province: payload.province,
        city: payload.city,
        district: payload.district,
        address: payload.address,
        logisticsFare: payload.logisticsFare,
        logisticsSn: payload.logisticsSn,
        logisticsCompany: payload.logisticsCompany,
        unloadFare: payload.unloadFare,
      };
      try {
        yield call(reqGenStoreOrder, data);
        const res = yield all([call(reqGetOrderInfo, { id: payload.orderId }), call(reqGetStoreOrderInfo, { id: payload.orderId })]);
        const waitPushOrders = res[1].data.filter((order) => {
          return order.status === 11;
        });
        const storeOrders = res[1].data.filter((order) => {
          return order.status === 12;
        });
        const waitInStoreOrder = cloneDeep(res[0].data.goodsInfos);
        waitInStoreOrder.map(item=>{
          item.isChangeStore = false;
        })
        const giftClone = cloneDeep(res[0].data.gifts);
        yield put({
          type: 'getOrderInfoReducer',
          payload: {
            ...res[0].data,
            goods: res[0].data.goodsInfos,
            gifts: res[0].data.gifts,
            remark: res[0].data.remark,
            waitPushOrders,
            storeOrders,
            waitInStoreOrder: waitInStoreOrder.concat(giftClone),
          },
        });
        yield put({
          type: 'okGenConfirmResolved',
        });
      } catch (error) {
        yield put({
          type: 'okGenConfirmRejected',
        });
      }
    },

    // 推送按钮
    *clickPushButton({ payload }, { put }) {
      yield put({
        type: 'showPushConfirm',
        payload: {
          pushOrObsoleteOrderId: payload.orderId,
        },
      });
    },
    *clickCancelPushButton(_, { put }) {
      yield put({
        type: 'cancelPushConfirm',
      });
    },
    *clickOkPushButton({ payload }, { put, call, all }) {
      yield put({
        type: 'okPushConfirm',
      });
      try {
        try {
          const result = yield call(reqPushStoreOrder, { ...payload });
          if(+result.code === 0) {
            notification.success({
              message: result.msg
            })
          }
          const res = yield all([call(reqGetOrderInfo, { id: payload.allOrderId }), call(reqGetStoreOrderInfo, { id: payload.allOrderId })]);
          const waitPushOrders = res[1].data.filter((order) => {
            return order.status === 11;
          });
          const storeOrders = res[1].data.filter((order) => {
            return order.status === 12;
          });
          const waitInStoreOrder = cloneDeep(res[0].data.goodsInfos);
          waitInStoreOrder.map(item=>{
            item.isChangeStore = false;
          })
          const giftClone = cloneDeep(res[0].data.gifts);
          yield put({
            type: 'getOrderInfoReducer',
            payload: {
              ...res[0].data,
              goods: res[0].data.goodsInfos,
              gifts: res[0].data.gifts,
              remark: res[0].data.remark,
              waitPushOrders,
              storeOrders,
              waitInStoreOrder: waitInStoreOrder.concat(giftClone),
            },
          });
          yield put({
            type: 'okPushConfirmResolved',
          });
        } catch (error) {
          yield put({
            type: 'okPushConfirmReject',
          });
        }
      } catch (error) {
        yield put({
          type: 'okPushConfirmReject',
        });
      }
    },
    // 作废按钮
    *clickObsoleteButton({ payload }, { put }) {
      yield put({
        type: 'showObsoleteConfirm',
        payload: {
          pushOrObsoleteOrderId: payload.orderId,
        },
      });
    },
    *clickCancelObsoleteButton(_, { put }) {
      yield put({
        type: 'cancelObsoleteConfirm',
      });
    },
    *clickOkObsoleteButton({ payload }, { put, call, all }) {
      yield put({
        type: 'okObsoleteConfirm',
      });
      try {
        yield call(reqObsoleteStoreOrder, { orderId: payload.orderId });
        try {
          const res = yield all([call(reqGetOrderInfo, { id: payload.allOrderId }), call(reqGetStoreOrderInfo, { id: payload.allOrderId })]);
          const waitPushOrders = res[1].data.filter((order) => {
            return order.status === 11;
          });
          const storeOrders = res[1].data.filter((order) => {
            return order.status === 12;
          });
          const waitInStoreOrder = cloneDeep(res[0].data.goodsInfos);
          waitInStoreOrder.map(item=>{
            item.isChangeStore = false;
          });
          const giftClone = cloneDeep(res[0].data.gifts);
          yield put({
            type: 'getOrderInfoReducer',
            payload: {
              ...res[0].data,
              goods: res[0].data.goodsInfos,
              gifts: res[0].data.gifts,
              remark: res[0].data.remark,
              waitPushOrders,
              storeOrders,
              waitInStoreOrder: waitInStoreOrder.concat(giftClone),
            },
          });
          yield put({
            type: 'okObsoleteConfirmResolved',
          });
        } catch (error) {
          yield put({
            type: 'okPushConfirmRejected',
          });
        }
      } catch (error) {
        yield put({
          type: 'okObsoleteConfirmRejected',
        });
      }
    },
    *checkIsSamePayMethod({ payload },{ put, select }) {
      const { goods, payByDirect, payByCash, payByAgency } = yield select(state=>state.commonPurchaseDetail);
      let cashResult = goods.map(item=>{
        if(Object.keys(payByCash).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let directResult = goods.map(item=>{
        if(Object.keys(payByDirect).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let agencyResult = goods.map(item=>{
        if(Object.keys(payByAgency).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let isAllCash = cashResult.every(item=>{
        return item;
      })
      let isAllDirect = directResult.every(item=>{
        return item;
      })
      let isAllAgency = agencyResult.every(item=>{
        return item;
      })
      yield put({
        type:'updatePage',
        payload:{
          isAllCash,
          isAllDirect,
          isAllAgency,
        }
      })
    },
    // 修改日期
    *changeDate({ payload }, { put }) {
      yield put({
        type: 'changeDateReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改入库单号
    *changeStoreNo({ payload }, { put }) {
      yield put({
        type: 'changeStoreNoReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改经办人
    *changeHandler({ payload }, { put }) {
      yield put({
        type: 'changeHandlerReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeStoreRemark({ payload }, { put }) {
      yield put({
        type: 'changeStoreRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改本次入库数
    *changeNowStoreNum({ payload }, { put }) {
      yield put({
        type: 'changeNowStoreNumReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeAddress({ payload }, { put }) {
      yield put({
        type: 'changeAddressReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeLogisticsFare({ payload }, { put }) {
      yield put({
        type: 'changeLogisticsFareReducer',
        payload: {
          logisticsFare: payload.value,
        },
      });
    },
    *changeLogisticsSn({ payload }, { put }) {
      yield put({
        type: 'changeLogisticsSnReducer',
        payload: {
          logisticsSn: payload.value,
        },
      });
    },
    *fillLogisticInfo({ payload }, { put }) {
      const { selectedInfo } = payload;
      yield put({
        type: 'changeReducer',
        payload: {
          logisticsSn: selectedInfo.shippingNo,
          logisticsCompany: selectedInfo.shippingCompany,
        },
      });
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'changeReducer',
        payload,
      });
    },

    // 操作相关
    // 弹出/关闭 action modal
    *triggerActionModal({ payload }, { put }) {
      yield put({
        type: 'triggerActionModalReducer',
        payload:{
          ...payload,
        },
      });
    },
    *okActionModal({ payload }, { call, put, select }) {
      yield put({
        type: 'okActionModalPending',
      });
      const {
        actionUrl,
        actionRemark,
        backUrl,
      } = yield select(state => state.commonPurchaseDetail);
      try {
        yield call(reqAction, actionUrl, {
          id: payload.id,
          remark: actionRemark,
        });
        message.success('申请成功');
        if (backUrl) {
          yield put(routerRedux.push(backUrl));
          return;
        }
        yield put({
          type: 'getConfig',
          payload: {
            orderId: payload.id,
          },
        });
        yield put({
          type: 'okActionModalResolved',
        });
      } catch (error) {
        yield put({
          type: 'okActionModalRejected',
        });
      }
    },
    *changeIsEditTax(_, { put }) {
      yield put({
        type: 'changeIsEditTaxReducer',
      });
    },
    *changeTax({ payload }, { put, call, select }) {
      const { id: goodsId, purchaseIsTax } = payload;
      try {
        yield call(requestChangeTax, { goodsId, purchaseIsTax });
        const { goods } = yield select(state => state.commonPurchaseDetail);
        for (let i = 0; i < goods.length; i += 1) {
          const element = goods[i];
          if (element.id === goodsId) {
            goods[i].purchaseIsTax = purchaseIsTax;
          }
        }
        notification.success({
          message: '成功提示',
          description: '是否含税修改成功！',
        });
        yield put({
          type: 'changeTaxResolved',
          payload: {
            goods,
          },
        });
      } catch (error) {

      }
    },
  },

  reducers: {
    // 同步 change
    changeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // 操作相关
    triggerActionModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: !state.isShowActionModal,
      };
    },
    okActionModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: true,
      };
    },
    okActionModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionModal: false,
        isActing: false,
      };
    },
    okActionModalRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isActing: false,
      };
    },
    changeLogisticsSnReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLogisticsFareReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderInfoReducer(state, { payload }) {
      const genInfo = {
        goods: payload.goods,
        gifts: payload.gifts,
        date: '',
        handler: '',
        storeNo: '',
        remark: '',
      };
      return {
        ...state,
        ...payload,
        genInfo,
        isLoading: false,
        province: null,
        city: null,
        district: null,
        address: '',
        consignee: '',
        mobile: '',
      };
    },
    // 生成入库单
    showGenConfirm(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isShowGenConfirm: true,
      };
    },
    cancelGenConfirm(state) {
      return {
        ...state,
        isShowGenConfirm: false,
        logisticsFare: '',
        logisticsSn: '',
      };
    },
    okGenConfirm(state) {
      return {
        ...state,
        isGening: true,
      };
    },
    okGenConfirmRejected(state) {
      return {
        ...state,
        isGening: false,
        isShowGenConfirm: false,
      };
    },
    okGenConfirmResolved(state) {
      return {
        ...state,
        isGening: false,
        isShowGenConfirm: false,
      };
    },

    // 推送入库单
    showPushConfirm(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowPushConfirm: true,
        // pushOrderId: payload.orderId,
      };
    },
    cancelPushConfirm(state) {
      return {
        ...state,
        isShowPushConfirm: false,
      };
    },
    okPushConfirm(state) {
      return {
        ...state,
        isPushing: true,
      };
    },
    okPushConfirmReject(state) {
      return {
        ...state,
        isPushing: false,
        isShowPushConfirm: false,
      };
    },
    okPushConfirmResolved(state) {
      return {
        ...state,
        isPushing: false,
        isShowPushConfirm: false,
      };
    },

    // 作废入库单
    showObsoleteConfirm(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowObsoleteConfirm: true,
      };
    },
    cancelObsoleteConfirm(state) {
      return {
        ...state,
        isShowObsoleteConfirm: false,
      };
    },
    okObsoleteConfirm(state) {
      return {
        ...state,
        isObsoleting: true,
      };
    },
    okObsoleteConfirmRejected(state) {
      return {
        ...state,
        isObsoleting: false,
        isShowObsoleteConfirm: false,
      };
    },
    okPushConfirmRejected(state) {
      return {
        ...state,
        isObsoleting: false,
        isShowObsoleteConfirm: false,
      };
    },
    okObsoleteConfirmResolved(state) {
      return {
        ...state,
        isObsoleting: false,
        isShowObsoleteConfirm: false,
      };
    },

    changeNowStoreNumReducer(state, { payload }) {
      const { id, number } = payload;
      const newState = Object.assign({}, state);
      const { waitInStoreOrder } = newState;
      for (let index = 0; index < waitInStoreOrder.length; index += 1) {
        if (+waitInStoreOrder[index].id === +id) {
          waitInStoreOrder[index].nowStoreNum = number;
        }
      }
      return {
        ...newState,
      };
    },
    changeDateReducer(state, { payload }) {
      return {
        ...state,
        genInfo: {
          ...state.genInfo,
          date: payload.date,
        },
      };
    },
    changeStoreNoReducer(state, { payload }) {
      return {
        ...state,
        genInfo: {
          ...state.genInfo,
          storeNo: payload.storeNo,
        },
      };
    },
    changeHandlerReducer(state, { payload }) {
      return {
        ...state,
        genInfo: {
          ...state.genInfo,
          handler: payload.handler,
        },
      };
    },
    changeStoreRemarkReducer(state, { payload }) {
      return {
        ...state,
        genInfo: {
          ...state.genInfo,
          remark: payload.storeRemark,
        },
      };
    },
    changeAddressReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeConsigneeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeMobileReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeIsEditTaxReducer(state) {
      return {
        ...state,
        isEditTax: !state.isEditTax,
      };
    },
    changeTaxResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // // 添加主管审核 状态按钮
    // clickCheckOk(state) {
    //   return {
    //     ...state,
    //     isShowOkConfirm: true,
    //   };
    // },
    // cancelConfirmReducer(state) {
    //   return {
    //     ...state,
    //     isShowOkConfirm: false,
    //   };
    // },
    unmountReducer() {
      return {
        allPrice: 0,
        paidPrice: 0,
        goods: [],
        gifts: [],
        waitInStoreOrder: [],
        freight: 0,
        storeOrders: [],
        waitPushOrders: [],

        isShowPushConfirm: false,
        isPushing: false,
        isShowGenConfirm: false,
        isGening: false,
        isShowObsoleteConfirm: false,
        isObsoleting: false,

        // 地址 省市区
        addressOptions: area.data,
        // 详细地址
        province: null,
        city: null,
        district: null,
        address: '',
        consignee: '',
        mobile: '',
        genInfo: {
          date: '',
          handler: '',
          storeNo: '',
          remark: '',
          goods: [
          ],
        },
        isLoading: true,
        pushOrObsoleteOrderId: null,
        logisticsFare: '',
        logisticsSn: '',

        payInfos: [],
        backOrderList: [],

        // 操作相关
        actionList: [],
        actiontUrl: '',
        actionRemark: '',
        isShowActionModal: false,
        isActing: false,

        payTypeMap: {},
        payType: '',
        // 是否编辑含税
        isEditTax: false,
        isChangeStore: false,
        followInfoDetail: {},
        selectedInfo: {},
        depot: "hxlDepot",
        depotMap: {},
        bankInfo:"",
        payByCash:{
          12: "现款现结",
          13: "现款-货到票到付款",
        },
        payByDirect: {
          14: "购销7天",
          15: "购销15天",
          16: "购销月结",
          17: "购销60天"
        },
        payByAgency: {
          18: "代销7天",
          19: "代销15天",
          20: "代销月结",
          21: "代销60天"
        },
        isAllCash:false,
        isAllDirect:false,
        isAllAgency:false,
        shippingMethodMap:{},
        shippingMethod:'',
        isTax:0,
        storageTypeMap:{},
        shippingInfoDetail:{
          shippingFeeId:[],
          detail:{
            purchaseShippingList:[],
            shippingImgList:[]
          }
        }
      };
      
    },
  },
};
