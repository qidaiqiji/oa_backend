import { notification } from 'antd';
import moment from 'moment';
import {
  reqGetConfig,
  reqGetOrderList,
  reqUpdateSupplier,
  reqGetSupplierList,
  reqUpdatePurchaser,
  reqProducedPurchaserOrder,
  reqGetSupplierInfo,
  reqRejectList,
  reqPurchaseRemark,
} from '../services/awaitSalePurchaseOrderList';

export default {
  namespace: 'awaitSalePurchaseOrderList',

  state: {
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    keywords: '',
    supplierId: '',
    siftSupplierList: [],
    orderInfos: [],
    isLoading: false,
    purchaserMap: {},
    purchaserFollowStatusMap: {},
    sellerMap: {},
    purchaserId: '',
    siftPurchaserId: '',
    purchaseOrderLoading: false,
    orderLoading: false,
    orderIds: [],
    selectedRows: [],
    isShowGoodsListModal: false,
    financeRemarks: [],
    financeRemarksIndex: '',
    remark: '',
    predictInvDate: '',
    expectShippingDate: '',
    expectPayTime: '',
    paymentMethod: {},
    paymentId: '',
    isSubmitLoading: false,
    isShowTime: true,
    isShowPaymentDate: false,
    // 判断是否勾选了挂账抵扣
    isDeduction: false,
    // 挂账抵扣金额
    balanceBillAmount: 0,
    // 采购跟进备注
    purchaseRemark: "",
    // 点击驳回时显示弹窗
    isShowRejectModal: false,
    // 驳回的备注信息
    remark: "",
    // 选中的子单号
    goodsIdList: [],
    goodsIdList: [],
    siftSellerId: "",
    siftStatusId: "",
    balanceBillOutInvAmount: 0,
    isOutInv:0,
    isChange: false,
    balanceBillTotalAmount: 0,
    payCondition: "",
    payType: "",
    payConditionMap: {},
    isCheck:false,
    showConfirmModal:false,
    payInfoList: [],
    bankType: "",
    bankInfoId: "",
    isTax:0,
    finalBankInfos:[],
    bankInfoDetail:[],
    shippingMethodMap:{},
    shippingMethod:'',
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
    showModal:false,
  },

  effects: {
    *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
      yield put({
        type: 'updatePage',
        payload: {
          orderIds: payload.supplyGoodsCheckboxIds,
          selectedRows: payload.selectedRows,
          orderSn: payload.orderSn,
          goodsIdLists: payload.goodsIdLists,
        },
      });
    },
    // 拉取配置项
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'updatePage',
          payload: {
            purchaserMap: res.data.purchaserMap,
            paymentMethod: res.data.paymentMethod,
            sellerMap: res.data.sellerMap,
            payConditionMap: res.data.payConditionMap,
            purchaserFollowStatusMap: res.data.purchaserFollowStatusMap,
            shippingMethodMap: res.data.shippingMethodMap,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *handelsaveRejectRemark({ payload },{ put }) {
      yield put({
        type: 'updatePage',
        payload: {
          ...payload,
        }
      });
    }, 
    // 筛选销售员
    *handleSiftSeller({ payload }, { put, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId } = awaitSalePurchaseOrderList;
      try {
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            seller: payload.siftSellerId,
          },
        });
      } catch (error) {
        // to do
      }
      yield put({
        type: 'updatePage',
        payload: {
          ...payload
        },
      });
    },
    // 增加采购跟进备注
    *addPurchaseRemark({ payload }, { put, call}) {
      const {purchaseRemark} = payload;
      try {
        yield call(reqPurchaseRemark, { ...payload });
      } catch (error) {
        // to do
      }
      yield put({
        type: 'updatePage',
        payload: {
          purchaseRemark,
        }
      });
    },
    // 获取待销售采购订单列表
    *getOrderList({ payload }, { put, call, select }) {
      yield put({
        type: 'getOrderPending',
        payload:{
          ...payload,
        }
      });
      const { startDate, endDate, supplierId, siftPurchaserId, keywords } = yield select(state=>state.awaitSalePurchaseOrderList);
      try {
        const res = yield call(reqGetOrderList, { startDate, endDate, supplierId, siftPurchaserId, keywords });
        const orderInfos = [];
        const orderList = res.data.awaitSalePurchaseOrderList;
        for (let i = 0; i < orderList.length; i += 1) {
          for (let j = 0; j < orderList[i].goodsList.length; j += 1) {
            if (j === 0) {
              orderList[i].goodsList[j].isEndIndex = true;
            } else {
              orderList[i].goodsList[j].isEndIndex = false;
            }
            orderList[i].goodsList[j].consignee = orderList[i].consignee;
            orderList[i].goodsList[j].hasBackOrder = orderList[i].hasBackOrder;
            orderList[i].goodsList[j].orderSn = orderList[i].orderSn;
            orderList[i].goodsList[j].goodsLength = orderList[i].goodsList.length;
            orderInfos.push(orderList[i].goodsList[j]);
          }
        }
        yield put({
          type: 'updatePage',
          payload: {
            orderInfos,
            ...payload,
            siftPurchaserId: payload.purchaser,
            isLoading: false,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 更改供应商
    *updateGoodsSupplier({ payload }, { put, call, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId, siftPurchaserId } = awaitSalePurchaseOrderList;
      try {
        yield call(reqUpdateSupplier, { ...payload });
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            purchaser: siftPurchaserId,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 分配采购员
    *assignPurchaserOrder({ payload }, { put, call, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId, siftPurchaserId, orderInfos, purchaserMap } = awaitSalePurchaseOrderList;
      yield put({
        type: 'assignPurchaserOrderPending',
      });
      try {
        yield call(reqUpdatePurchaser, { ...payload });
        // for (let i = 0; i < orderInfos.length; i += 1) {
        //   for (let j = 0; j < payload.goodsIdList; j += 1) {
        //     if (orderInfos[i].id === payload.goodsIdList[j]) {
        //       orderInfos[i].purchaser = purchaserMap[payload.purchaserId];
        //     }
        //   }
        // }
        yield put({
          type: 'assignPurchaserOrderReducer',
        });
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            purchaser: siftPurchaserId,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 提交主管审核
    *clickSubmitReview({payload}, { put, call, select }) { 
      yield put({
        type:'updatePage',
        payload:{
          ...payload,
        }
      })
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);  
      const { startDate, endDate, shippingMethod ,keywords, supplierId, bankType, siftPurchaserId, selectedRows, payCondition,paymentId, financeRemarksIndex, remark, expectShippingDate, expectPayTime, predictInvDate, balanceBillAmount, balanceBillOutInvAmount, isTax, bankInfoId } = awaitSalePurchaseOrderList;
      const goodsIdList = [];
      yield put({
        type: 'clickSubmitPending',
      });
      for (let i = 0; i < selectedRows.length; i += 1) {
        goodsIdList.push({
          id: selectedRows[i].id,
          // purchaseIsTax: selectedRows[i].purchaseIsTax,
          payMethodId:selectedRows[i].payMethodId,
        });
      }
      try {
        yield call(reqProducedPurchaserOrder, {
          financeRemark: financeRemarksIndex,
          remark,
          paymentId,
          goodsIdList,
          expectShippingDate,
          expectPayTime,
          predictInvDate:isTax?predictInvDate:'',
          balanceBillAmount,
          balanceBillOutInvAmount,
          payCondition,
          bankInfoId,
          shippingMethod,
          isTax,
          bankType
        });
        yield put({
          type: 'clickSubmitReviewReducer',
        });
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            purchaser: siftPurchaserId,
            expectShippingDate,
            expectPayTime,
            predictInvDate,
            bankInfoId:"",
            bankType:"",
          },
        });
      } catch (error) {
        yield put({
          type: 'clickSubmitReviewReducer',
        });
      }
    },
    // 生成采购单
    *producedPurchaserOrder({ payload }, { put, call, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { selectedRows } = awaitSalePurchaseOrderList;
      selectedRows.map(item=>{
        item.purchaseIsTax = 1;
      })
      yield put({
        type: 'producedPurchaserOrderPending',
      });
      const supplierIds = [];
      for (let i = 0; i < selectedRows.length; i += 1) {
        // selectedRows[i].purchaseIsTax = 1;
        const supplierList = selectedRows[i].supplierList;
        for (let j = 0; j < supplierList.length; j += 1) {
          if (supplierList[j].isSelect) {
            supplierIds.push(supplierList[j].id);
          }
        }
      }
      if (supplierIds.length < selectedRows.length) {
        notification.warning({
          message: '警告提示',
          description: '缺少供应商.',
        });
        yield put({
          type: 'producedPurchaserOrderReducer',
        });
        return;
      } else if (supplierIds.length > 0) {
        for (let m = 0; m < supplierIds.length; m += 1) {
          if (supplierIds[0] !== supplierIds[m]) {
            notification.warning({
              message: '警告提示',
              description: '不同供应商的商品不允许合成为同一个采购单，请修改供应商后再合并.',
            });
            yield put({
              type: 'producedPurchaserOrderReducer',
            });
            return;
          }
        }
      }
      const isCheck = selectedRows.some(item=>{
        return !item.isCheck;
      })
      try {
        const res = yield call(reqGetSupplierInfo, { id: supplierIds[0] });
        const payInfoList = res.data.payInfoList;
        // 默认是含税的，账户类型默认是对公账户
        let isTax = "1";
        let bankType = 1;
        let finalBankInfos = [];
        payInfoList.map(item=>{
          finalBankInfos.push({type:item.type,bankInfoDetail:[]});
        })
        let hash = {};
        finalBankInfos = finalBankInfos.reduce((preVal,curVal)=>{
          hash[curVal.type] ? '' : hash[curVal.type] = true && preVal.push(curVal); 
          return preVal 
        },[])
        payInfoList.map(item=>{
          finalBankInfos.map(info=>{
            if(+item.type === +info.type) {
              info.bankInfoDetail.push(item)
            }
          })
        })
        let bankInfoDetail = [];
        finalBankInfos.map(item=>{
          if(+item.type === +bankType) {
            bankInfoDetail = item.bankInfoDetail;
          }
        })
        yield put({
          type: 'handleShowOrderListReducer',
          payload: {
            financeRemarks: res.data.financeRemarks,
            balanceBillTotalAmount: res.data.balanceBillTotalAmount,
            payType:res.data.payType,
            selectedRows,
            isCheck,
            // payInfoList: res.data.payInfoList,
            isTax,
            bankType,
            finalBankInfos,
            bankInfoDetail,
            bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 取消弹窗
    *cancleTriggerGoodsListModal(_, { put }) {
      yield put({
        type: 'cancleTriggerGoodsListModalReducer',
      });
    },
    *changeDeductionValue({ payload }, { put }) {
      yield put({
        type: 'updatePage',
        payload:{
          ...payload
        },
      });
    },
    *handleConfirmReject({ payload }, { put, call, select }) {
      
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId, orderIds } = awaitSalePurchaseOrderList;
      const {isShowRejectModal, remark, goodsIdLists} = payload   
      try{
        const res  = yield call(reqRejectList,{remark, goodsIdLists})  
        yield put({
          type: 'getOrderList',
          payload:{
            startDate,
            endDate,
            keywords,
            supplierId,
          }
        });
        if(res.code === 0){
          notification.success({
            message: res.msg
          })
          yield put({
            type: 'updatePage',
            payload:{
              isShowRejectModal,
              orderIds: [],
            },
          });
        }
      }catch (error) {
        // to do
      }
    
    },
    *checkIsSamePayMethod({ payload },{ put, select }) {
      const { selectedRows, payByDirect, payByCash, payByAgency } = yield select(state=>state.awaitSalePurchaseOrderList);
      let cashResult = selectedRows.map(item=>{
        if(Object.keys(payByCash).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let directResult = selectedRows.map(item=>{
        if(Object.keys(payByDirect).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let agencyResult = selectedRows.map(item=>{
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
    *changeIsTax({ payload }, { put, select }) {
      yield put({
        type: 'updatePage',
        payload: {
          ...payload,
        },
      });
      const { selectedRows, isTax, finalBankInfos, bankType } = yield select(state=>state.awaitSalePurchaseOrderList);
      selectedRows.map(item=>{
        item.purchaseIsTax = isTax;
      })
      let bankInfoDetail = [];
      finalBankInfos.map(item=>{
        if(+item.type === +bankType) {
          bankInfoDetail = item.bankInfoDetail;
        }
      })
      yield put({
        type:"updatePage",
        payload:{
          selectedRows,
          bankInfoDetail,
          bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
        }
      })
    },
    // 拉取供应商列表
    *getSiftSupplierList({ payload }, { put, call }) {
      try {
        const res = yield call(reqGetSupplierList, { ...payload });
        yield put({
          type: 'updatePage',
          payload: {
            siftSupplierList: res.data.suppliers,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 更改跟进状态
    *handleSiftStatus({ payload }, { put, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId } = awaitSalePurchaseOrderList;
      try {
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            followStatus: payload.siftStatusId,
          },
        });
      } catch (error) {
        // to do
      }
      yield put({
        type: 'updatePage',
        payload: {
          ...payload,
        },
      });
    },
    // 选择支付方式
    *handlePaymentMethod({ payload }, { put }) {
      const { paymentId } = payload;
      if(+paymentId === 2 || +paymentId === 4) {
        yield put({
          type: 'updatePage',
          payload: {
            isShowPaymentDate:true,
            balanceBillOutInvAmount:0,
            isOutInv:0,
            balanceBillTotalAmount:0,
            isDeduction:false,
            paymentId,
          },
        });
      }else{
        yield put({
          type: 'updatePage',
          payload: {
            isShowPaymentDate:false,
            paymentId,
          },
        });
      }
      yield put({
        type:'checkIsSamePayMethod'
      })
    },
    // 筛选采购员
    *handleSiftPurchaser({ payload }, { put, select }) {
      const awaitSalePurchaseOrderList = yield select(state => state.awaitSalePurchaseOrderList);
      const { startDate, endDate, keywords, supplierId } = awaitSalePurchaseOrderList;
      try {
        yield put({
          type: 'getOrderList',
          payload: {
            startDate,
            endDate,
            keywords,
            supplierId,
            purchaser: payload.siftPurchaserId,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    updatePage(state, { payload } ) {
      return {
        ...state,
        ...payload,
      }; 
    },
    // changeIsTaxReducer(state, action) {
    //   const { payload } = action;
    //   const { selectedRow } = payload;
    //   const newState = Object.assign({}, state);
    //   const { selectedRows } = newState;
    //   // selectedRows[payload.index].purchaseIsTax = payload.purchaseIsTax;
    //   if (selectedRow.length < 1) {
    //     newState.isShowTime = false;
    //   }
    //   selectedRows.map((item) => {
    //     item.purchaseIsTax = 0;

    //     selectedRow.map((items, index) => {
    //       if (+item.id === +items.id) {
    //         item.purchaseIsTax = 1;
    //         newState.isShowTime = true;
    //       }
    //     });
    //   });
    //   return newState;
    // },
    cancleTriggerGoodsListModalReducer(state) {
      return {
        ...state,
        isShowGoodsListModal: false,
      };
    },
    handleShowOrderListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowGoodsListModal: true,
        purchaseOrderLoading: false,
      };
    },
    assignPurchaserOrderReducer(state) {
      return {
        ...state,
        orderLoading: false,
      };
    },
    clickSubmitPending(state) {
      return {
        ...state,
        isSubmitLoading: true,
      };
    },
    clickSubmitReviewReducer(state) {
      return {
        ...state,
        purchaseOrderLoading: false,
        isSubmitLoading: false,
        isShowGoodsListModal: false,
        orderIds: [],
        selectedRows: [],
      };
    },
    producedPurchaserOrderReducer(state) {
      return {
        ...state,
        purchaseOrderLoading: false,
      };
    },
    assignPurchaserOrderPending(state) {
      return {
        ...state,
        orderLoading: true,
      };
    },
    producedPurchaserOrderPending(state) {
      return {
        ...state,
        purchaseOrderLoading: true,
      };
    },
    getOrderPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    unmountReducer() {
      return {
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        keywords: '',
        supplierId: '',
        siftSupplierList: [],
        orderInfos: [],
        isLoading: false,
        purchaserMap: {},
        purchaserFollowStatusMap: {},
        sellerMap: {},
        purchaserId: '',
        siftPurchaserId: '',
        purchaseOrderLoading: false,
        orderLoading: false,
        orderIds: [],
        selectedRows: [],
        isShowGoodsListModal: false,
        financeRemarks: [],
        financeRemarksIndex: '',
        remark: '',
        predictInvDate: '',
        expectShippingDate: '',
        expectPayTime: '',
        paymentMethod: {},
        paymentId: '',
        isSubmitLoading: false,
        isShowTime: true,
        // 采购跟进备注
        purchaseRemark: "",
        isShowPaymentDate: false,
         // 判断是否勾选了挂账抵扣
        isDeduction: false,
        // 挂账抵扣金额
        balanceBillAmount: 0,
        // 点击驳回时显示弹窗
        isShowRejectModal: false,
        // 驳回的备注信息
        remark: "",
        // 选中的子单号
        goodsIdList: [],
        goodsIdLists: [],
        siftSellerId: "",
        siftStatusId: "",
        balanceBillOutInvAmount: 0,
        isOutInv:0,
        isChange: false,
        balanceBillTotalAmount: 0,
        payCondition: "",
        payType: "",
        payConditionMap: {},
        isCheck: false,
        showConfirmModal:false,
        payInfoList: [],
        bankType: "",
        bankInfoId: "",
        isTax:0,
        finalBankInfos:[],
        bankInfoDetail:[],
        shippingMethodMap:{},
        shippingMethod:'',
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
        showModal:false,
      };
    },
  },
};
