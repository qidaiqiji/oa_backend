import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  reqWaitList, selectList, pushList,reqSearch
} from '../services/dealAccountList';
import {
  message, notification,
} from 'antd';
import Item from 'antd/lib/list/Item';

export default {
  namespace: 'dealAccountList',
  state: {
    startDate:moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    expectPayTimeStart: '',
    expectPayTimeEnd: '',
    purchaseTimeStart: '',
    purchaseTimeEnd: '',
    awaitPayTotalMoney: '',
    purchaseGoodsList: [],
    orderIds: '',
    isShowList: false,
    inputNum: '',
    isEidet: false,
    purchaseTotalSure: 0,
    inputRealPriceTotal: '',
    isShowSureExpire: false,
    isShowSureService: false,
    accountRemark: '',
    goodsList: [],
    noChangeShouldPayTotal: '',
    pageSize: 100,
    currentPage: 1,
    total: '',
    orderSn: '',
    goodsKeywords: '',
    consignee: '',
    purchaseType: '',
    supplierId: '',
    supplierName: '',
    selectedRowIds: [],
    selectedRows: [],
    payCreditTypeMap: {},
    purchaseTypeMap: '',
    payMethod: "",
    financeRemark: '',
    choseAllRealShouldPay: 0,
    actionList: [],
    activeKey:'1',
    agencyAwaitPayTotalMoney:'',
    agencyActionList:[],
    agencyPurchaseGoodsList: [],
    agencyTotal: 0,
    agencySupplierName: '',
    agencyPageSize:100,
    agencyOrderSn:'',
    agencyGoodsKeywords:'',
    agencyCurrentPage:1,
    agencyConsignee:'',
    agencyPurchaseType:'',
    agencyExpectPayTimeStart:'',
    agencyExpectPayTimeEnd:'',
    agencyPurchaseTimeStart:'',
    agencyPurchaseTimeEnd:'',
    agencySupplierId:'',
    agencyPayType:"",
    editRow:{},
    balanceBillTotalAmount:0,
    isDeduction:false,
    balanceBillAmount:0,
    balanceBillOutInvAmount:0,
    isOutInv:true,
    bankType:'',
    bankInfoId:'',
    selectTotalAmount:0,
    notApplyAmount:0,
    appliedNotPayMoney:0,
    agencyNotApplyAmount:0,
    agencyAppliedAmount:0
  },
  effects: {
    *getList({ payload },{ put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload:{
          ...payload,
        }
      });
      const { activeKey } = yield select(state=>state.dealAccountList);
      if(activeKey == 1) {
        yield put({
          type:'getDirectList',
        })
      }else{
        yield put({
          type:'getAgencyList',
        })
      }
    },
    *getDirectList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload:{
          ...payload,
          isTableLoadingOrd:true,
        }
      });
      const {
        pageSize,
        orderSn,
        goodsKeywords,
        currentPage,
        consignee,
        purchaseType,
        expectPayTimeStart,
        expectPayTimeEnd,
        purchaseTimeStart,
        purchaseTimeEnd,
        supplierId,
        payMethod,
      } = yield select(state => state.dealAccountList);
      try {
        const waitList = yield call(reqWaitList, {
          pageSize,
          orderSn,
          goodsKeywords,
          consignee,
          currentPage,
          purchaseType,
          expectPayTimeStart,
          expectPayTimeEnd,
          purchaseTimeStart,
          purchaseTimeEnd,
          supplierId,
          payMethod,
          payType:2,
        });
        // waitList.data.purchaseGoodsList.map((item) => {
        //   item.editNum = item.realNum;
        //   item.realPayNow = item.realAmount;
        // });
        yield put({
          type: 'getListResolved',
          payload: {
            awaitPayTotalMoney: waitList.data.awaitPayTotalMoney,
            actionList:waitList.data.actionList,
            purchaseGoodsList: waitList.data.purchaseGoodsList,
            total: waitList.data.total,
            supplierName: waitList.data.supplierName,
            balanceBillTotalAmount:waitList.data.balanceBillTotalAmount,
            notApplyAmount:waitList.data.notApplyAmount,
            appliedNotPayMoney:waitList.data.appliedNotPayMoney,
          },
        });
        yield put({
          type: 'getListResolved',
          payload:{
            isTableLoadingOrd:false,
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getAgencyList({ payload },{ put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload:{
          ...payload,
          // isTableLoadingOrd:true,
        }
      });
      const {
        agencyPageSize,
        agencyOrderSn,
        agencyGoodsKeywords,
        agencyCurrentPage,
        agencyConsignee,
        agencyPurchaseType,
        agencyExpectPayTimeStart,
        agencyExpectPayTimeEnd,
        agencyPurchaseTimeStart,
        agencyPurchaseTimeEnd,
        agencyPayCreditType,
        agencyPayType,
        supplierId
      } = yield select(state => state.dealAccountList);
      try {
        const waitList = yield call(reqWaitList, {
          pageSize:agencyPageSize,
          orderSn:agencyOrderSn,
          goodsKeywords:agencyGoodsKeywords,
          consignee:agencyConsignee,
          currentPage:agencyCurrentPage,
          purchaseType:agencyPurchaseType,
          expectPayTimeStart:agencyExpectPayTimeStart,
          expectPayTimeEnd:agencyExpectPayTimeEnd,
          purchaseTimeStart:agencyPurchaseTimeStart,
          purchaseTimeEnd:agencyPurchaseTimeEnd,
          supplierId,
          payCreditType:agencyPayCreditType,
          payMethod:agencyPayType,
          payType:4,
        });
        // waitList.data.purchaseGoodsList.map((item) => {
        //   item.editNum = item.realNum;
        //   item.realPayNow = item.realAmount;
        // });
        yield put({
          type: 'getListResolved',
          payload: {
            agencyAwaitPayTotalMoney: waitList.data.awaitPayTotalMoney,
            agencyActionList:waitList.data.actionList,
            agencyPurchaseGoodsList: waitList.data.purchaseGoodsList,
            agencyTotal: waitList.data.total,
            agencySupplierName: waitList.data.supplierName,
            agencyNotApplyAmount:waitList.data.notApplyAmount,
            agencyAppliedAmount:waitList.data.appliedNotPayMoney,
          },
        });
        yield put({
          type: 'getListResolved',
          // payload:{
          //   isTableLoadingOrd:false,
          // }
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getSelectList({ payload }, { put, call }) {
      try {
        const selectData = yield call(selectList, {
        });
        yield put({
          type: 'getListResolved',
          payload: {
            payCreditTypeMap: selectData.data.payCreditTypeMap,
            purchaseTypeMap: selectData.data.purchaseTypeMap,
            ...payload,

          },
        });
      } catch (error) {
      }
    },
    *searchList({ payload }, { put }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,

        },
      });
      yield put({
        type: 'getList',
        payload: {
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    // 对账单弹窗
    *checkAccountList({ payload }, { put }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
    },
    // 点击生成对账单的时候发请求
    *searchSelectedRows({ payload },{ put, call, select }) {
        yield put({
          type:'getListResolved',
          payload:{
            ...payload,
          }
        })
        const { selectedRows, startDate, endDate  } = yield select(state=>state.dealAccountList);
        let selectedGoods = [];
        selectedRows.map(item=>{
          selectedGoods.push({id:item.goodsId})
          item.editNum = item.realNum;
          item.realAmount = (item.editNum * item.purchasePrice).toFixed(2);
        })
        let purchaseTotalSure = selectedRows.reduce((pre,next)=>{
            return pre + (+next.realAmount)
        },0)
        try{
          const res = yield call(reqSearch,{ startDate,endDate, goodsList: selectedGoods });
          const searchedGoodsList = JSON.parse(JSON.stringify(res.data.goodsList));
          searchedGoodsList.map(item=>{
            item.goodsId = item.id;
            delete item.id
          })
          
          selectedRows.map(item=>{
            searchedGoodsList.map(goodsItem=>{
              if(item.goodsId == goodsItem.goodsId) {
                item = Object.assign(item,goodsItem);
              }
            })
          })
          yield put({
            type:'getListResolved',
            payload:{
              backList:res.data.goodsList,
              selectedRows,
              purchaseTotalSure,
            }
          })
        }catch(err){
          console.log(err)
        }
    },
    // 提交对账单
    *changeConfirmAccount({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
         ...payload,
        },
      });
      const {
        accountRemark,
        goodsList,
        supplierId,
        financeRemark,
        activeKey,
        startDate,
        endDate,
        isDeduction,
        balanceBillAmount,
        isOutInv,
        balanceBillOutInvAmount,
        bankType,
        bankInfoId
      } = yield select(state => state.dealAccountList);
      const isSubmit = goodsList.some((item) => {
        return item.applyNumber == undefined;
      });
      try {
        if (isSubmit != true) {
          const res = yield call(pushList, {
            accountRemark,
            supplierId,
            goodsList,
            financeRemark,
            payType:activeKey==1?2:4,
            salePeriodDateStart:startDate,
            salePeriodDateEnd:endDate,
            balanceBillAmount:isDeduction?balanceBillAmount:'',
            isOutInv:isDeduction?isOutInv:false,
            balanceBillOutInvAmount:isOutInv?balanceBillOutInvAmount:'',
            bankType,
            bankInfoId
          });
          if (res.code === 0) {
            notification.success({
              message: '成功提示',
              description: '生成对账单成功！',
            });
            yield put(
              routerRedux.push('/purchase/purchase-order-management/purchase-apply-for-payment-list'))
          }
        } else {
          message.warn('数量不能为空，请输入数量');
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 取消对账单
    *changeCancelAccount({ payload }, { put }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
    },
  },
  reducers: {
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListPending(state) {
      return {
        ...state,
        isTableLoadingOrd: true,
      };
    },
    unmountReducer() {
      return {
        expectPayTimeStart: '',
        expectPayTimeEnd: '',
        purchaseTimeStart: '',
        purchaseTimeEnd: '',
        awaitPayTotalMoney: '',
        purchaseGoodsList: [],
        orderIds: '',
        isShowList: false,
        inputNum: '',
        isEidet: false,
        inputRealPriceTotal: '',
        isShowSureExpire: false,
        isShowSureService: false,
        accountRemark: '',
        goodsList: [],
        noChangeShouldPayTotal: '',
        pageSize: 100,
        currentPage: 1,
        total: '',
        orderSn: '',
        goodsKeywords: '',
        consignee: '',
        purchaseType: '',
        supplierId: '',
        supplierName: '',
        // orderIdLists: [],
        selectedRowIds: [],
        selectedRows: [],
        payCreditTypeMap: {},
        purchaseTypeMap: '',
        payMethod: "",
        financeRemark: '',
        choseAllRealShouldPay: 0,
        actionList: [],
        activeKey:'1',
        agencyAwaitPayTotalMoney:'',
        agencyActionList:[],
        agencyPurchaseGoodsList: [],
        agencyTotal: 0,
        agencySupplierName: '',
        agencyPageSize:100,
        agencyOrderSn:'',
        agencyGoodsKeywords:'',
        agencyCurrentPage:1,
        agencyConsignee:'',
        agencyPurchaseType:'',
        agencyExpectPayTimeStart:'',
        agencyExpectPayTimeEnd:'',
        agencyPurchaseTimeStart:'',
        agencyPurchaseTimeEnd:'',
        agencySupplierId:'',
        agencyPayCreditType:'',
        agencyPayType:"",
        startDate:moment().add(-30, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        editRow:{},
        balanceBillTotalAmount:0,
        isDeduction:false,
        balanceBillAmount:0,
        balanceBillOutInvAmount:0,
        isOutInv:true,
        bankType:'',
        bankInfoId:'',
        purchaseTotalSure:0,
        selectTotalAmount:0,
        notApplyAmount:0,
        agencyNotApplyAmount:0,
        agencyAppliedAmount:0
      };
    },
    getListOver(state) {
      return {
        ...state,
        isTableLoadingOrd: false,
      };
    },
  },
};
