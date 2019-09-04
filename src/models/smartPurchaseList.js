import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import moment from 'moment';
import { reqGetList, reqGetSupplierInfo, reqProducedPurchaserOrder, reqSaveOrder, reqSupplierSuggest, reqConfig } from '../services/smartPurchaseList';

export default {
  namespace: 'smartPurchaseList',
  state: {
    purchaseHistoryDateStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
    purchaseHistoryDateEnd: moment().format('YYYY-MM-DD'),
    stockingRange: "15",
    purchaser:"",
    supplierId: "",
    goodsKeywords: "",  
    orderIds: [],  
    selectedRows: [],
    isShowGoodsListModal: false,
    purchaseOrderLoading: false,
    financeRemarks: [],
    // 判断是否勾选了挂账抵扣
    isDeduction: false,
    // 挂账抵扣金额
    balanceBillAmount: 0,
    // 采购跟进备注
    purchaseRemark: "",
    balanceBillTotalAmount: "",
    isOutInv: 0,
    isChange: false,
    purchaseNum:0,
    selectedRowKeys:[],
    selectedRow: [],
    isShowPaymentDate: false,
    expectInvDate: '',
    expectShippingDate: '',
    expectPayTime: '',
    balanceBillOutInvAmount: 0,
    isSubmitLoading:false,
    isTableLoading: true,
    stockRangeMap:[],
    total:0,
    curPage:1,
    pageSize:40,
    purchaserMap: [],
    paymentMethod: [],
    supplierPayType: "",
    supplierIds: [],
    gifts:[],
    freight: 0,
    isHaveFreight: false,
    detailAddress:"",
    supplierSearchText:'',
    supplierSuggest: [],
    size:999,
    status:1,
    payConditionMap:{},
    payCondition: "",
    sort: "",
    orderBy: "",
    payInfoList:[],
    isCheck: false,
    bankType: "",
    bankInfoId:"",
    showConfirmModal: false,
    actionList: [],
    finalBankInfos:[],
    isTax:"1",
    shippingMethod:'',
    shippingMethodMap:{},
    bankInfoDetail:[],
    payTypePartMap:{},
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
    *getList({ payload },{ put, call, select }) {
        yield put({
            type: "updatePageReducer",
             payload: {
                 ...payload,
                 isTableLoading:true,
             }
        })
        const { 
            purchaseHistoryDateStart,
            purchaseHistoryDateEnd,
            stockingRange,
            purchaser,
            supplierId,
            goodsKeywords,
            pageSize,
            curPage,
        } = yield select(state=>state.smartPurchaseList);
        try {
            const order = yield call(reqGetList, {
                purchaseHistoryDateStart,
                purchaseHistoryDateEnd,
                stockingRange,
                purchaser,
                supplierId,
                goodsKeywords,
                pageSize,
                curPage,
            })
            yield put({
                type: "updatePageReducer",
                payload: {
                    goodsList: order.data.goodsList,
                    total:order.data.total,
                    isTableLoading:false,
                    actionList:order.data.actionList,
                }
            })
            yield put({
              type:'sortGoodsList',
            })
        }catch(err) {
            console.log(err)
        }
        
    },
    *getConfig({ payload },{ put, call }) {
      try{
        const res = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            payTypePartMap:res.data.payTypePartMap,
            purchaserMap:res.data.purchaserMap,
            shippingMethodMap:res.data.shippingMethodMap,
            stockRangeMap:res.data.stockRangeMap,
            payConditionMap:res.data.payConditionMap,
          }
        })

      }catch(err){

      }

    },
    // 对拿到的数据做排序
    *sortGoodsList({ payload },{ put, select }) {  
      yield put({
        type: "updatePageReducer",
         payload: {
            ...payload,
         }
      })
      const { goodsList, sort, orderBy } = yield select(state=>state.smartPurchaseList);
      if(sort == 2) {
        goodsList.sort(function(a,b){
            return +a[orderBy] - +b[orderBy];
        })
      }else if(sort == 1) {
        goodsList.sort(function(a,b){
          return +b[orderBy] - +a[orderBy];
        })
      }
      yield put({
        type: "updatePageReducer",
         payload: {
            goodsList,
         }
      })

    },
    *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
        yield put({
            type: 'updatePageReducer',
            payload: {
              orderIds: payload.supplyGoodsCheckboxIds,
              selectedRows: payload.selectedRows,
            },
          });
    },
    /**----生成采购单---- */
    *producedPurchaserOrder({ payload },{ put, call, select }) {
        const { selectedRows } = yield select(state => state.smartPurchaseList);
        yield put({
            type: 'updatePageReducer',
            payload:{
                purchaseOrderLoading: true,
            }
        });
        
        const supplierIds = [];
        selectedRows.map(selectedRow=>{
            supplierIds.push(selectedRow.supplierId)
        })
        if(selectedRows.length > supplierIds.length) {
            notification.warning({
                message: '警告提示',
                description: '缺少供应商.',
            });
            yield put({
                type: 'producedPurchaserOrderReducer',
              });
            return;
        }else if (supplierIds.length > 0) {
            for (let m = 0; m < supplierIds.length; m += 1) {
              if (+supplierIds[0] !== +supplierIds[m]) {
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
            yield put({
              type: 'updatePageReducer',
              payload: {
                financeRemarks: res.data.financeRemarks,
                balanceBillTotalAmount: res.data.balanceBillTotalAmount,
                supplierPayType:res.data.payType,
                selectedRows,
                payInfoList: res.data.payInfoList,
                isCheck,
               
              },
            });
            let finalBankInfos = [];
            res.data.payInfoList.map(item=>{
              finalBankInfos.push({type:item.type,bankInfoDetail:[]});
            })
            let hash = {};
            finalBankInfos = finalBankInfos.reduce((preVal,curVal)=>{
              hash[curVal.type] ? '' : hash[curVal.type] = true && preVal.push(curVal); 
              return preVal 
            },[])
            res.data.payInfoList.map(item=>{
              finalBankInfos.map(info=>{
                if(+item.type === +info.type) {
                  info.bankInfoDetail.push(item)
                }
              })
            })
            yield put({
              type: "updatePageReducer",
              payload: {
                  ...payload,
                  finalBankInfos,
                  supplierIds,
              }
            })
          } catch (error) {
            // to do
          }
        
    },
    // 筛选供应商
    *changeSupplier({ payload }, { put, call, select }) {
        const { size, status } = yield select(state=>state.smartPurchaseList);
        yield put({
          type: 'changeSupplierPending',
          payload: {
            supplierSearchText: payload.supplierSearchText,
          },
        });
        if (payload.supplierSearchText === '') {
          yield put({
            type: 'changeSupplierReducer',
          });
          yield put({
            type: 'getList',
          });
          return;
        }
        try {
          const res = yield call(reqSupplierSuggest, { keywords: payload.supplierSearchText,size });
          yield put({
            type: 'updatePageReducer',
            payload: {
              supplierSearchText: payload.supplierSearchText,
              supplierSuggest: res.data.suppliers,
            },
          });
        } catch (error) {
        //   yield put({
        //     type: 'changeSupplierRejected',
        //   });
        }
      },
    // 提交主管审核
    *clickSubmitReview(_, { put, call, select }) {  
        const smartPurchaseList = yield select(state => state.smartPurchaseList);    
        const {selectedRows, payType, financeRemarksIndex, remark, expectShippingDate, expectPayTime, expectInvDate, balanceBillAmount, balanceBillOutInvAmount, isTax, shippingMethod } = smartPurchaseList;
        const { 
            isOutInv,
            supplierIds,
            freight,
            gifts,
            isHaveFreight,
            detailAddress,
            payCondition,
            bankInfoId,
            bankType,
        } = yield select(state=>state.smartPurchaseList);
        yield put({
            type: 'updatePageReducer',
            payload:{
                isSubmitLoading:true,
            }
        });
        const goodsList = [];
        selectedRows.map(item=>{
            goodsList.push(item)
        })
        try {
            yield call(reqSaveOrder, {
            financeRemark: financeRemarksIndex,
            supplierId:supplierIds[0],
            remark,
            payType,
            goodsList,
            expectShippingDate,
            expectPayTime,
            expectInvDate,
            balanceBillAmount,
            balanceBillOutInvAmount,
            isOutInv,
            freight,
            gifts,
            isHaveFreight,
            detailAddress,
            payCondition,
            bankInfoId,
            isTax, 
            shippingMethod,
            bankType,
            });
            yield put({
                type: 'updatePageReducer',
                payload:{
                    purchaseOrderLoading: false,
                    isSubmitLoading: false,
                    isShowGoodsListModal: false,
                    isShowPaymentDate:false,
                    orderIds: [],
                    selectedRows: [],   
                    payType: "",
                    payCondition: "",
                    expectShippingDate:"",
                    expectPayTime: "",
                    expectInvDate: "",
                    remark:"",
                    bankInfoId:"" ,
                    isTax:'1', 
                    shippingMethod:'',
                    bankType:'',
                    showModal:false,
                    showConfirmModal:false,
                }
            });
            yield put({
                type: 'getList',
            });
        } catch (error) {
          yield put({
            type: 'updatePageReducer',
              payload:{
                  isSubmitLoading: false,
              }
            });
           console.log(error)
        }
    },

/**----------实际采购数量------- */
    *actualPurchaseNum({ payload }, { put, select }) {
        const { selectedRows } = yield select(state=>state.smartPurchaseList);;
        selectedRows.map(selected=>{
            if(+selected.goodsId === +payload.currentId) {
                selected.isChangeNum = true;
                selected.purchaseNum = payload.purchaseNum
            }
        })
        yield put({
            type: "updatePageReducer",
            payload: {
                selectedRows,
                ...payload,
            }
        })

    },
    *changeIsTax({ payload }, { put, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { bankType, finalBankInfos } = yield select(state=>state.smartPurchaseList);
      let bankInfoDetail = [];
      finalBankInfos.map(item=>{
        if(+item.type === +bankType) {
          bankInfoDetail = item.bankInfoDetail;
        }
      })
      yield put({
        type:'updatePageReducer',
        payload:{
          bankInfoDetail,
          bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
        }
      })
    },
    // 选择支付方式
    *handlePaymentMethod({ payload }, { put, select }) {
        const { smartPurchaseList } = yield select(state => state);
        const { payType, isShowPaymentDate} = payload;
        smartPurchaseList.payType = payType;
        if(smartPurchaseList.payType === "2" || smartPurchaseList.payType === "4") {
            yield put({
                type: 'updatePageReducer',
                payload: {
                  isShowPaymentDate:true,
                  isOutInv:0,
                  balanceBillOutInvAmount:0,
                  balanceBillAmount:0,
                  isDeduction:false,
                  payType,
                },
              });
        }else{
            yield put({
                type: 'updatePageReducer',
                payload: {
                    isShowPaymentDate:false,
                },
            });
        }
        yield put({
          type:'checkIsSamePayMethod'
        })
        
      },
      *checkIsSamePayMethod({ payload },{ put, select }) {
        const { selectedRows, payByDirect, payByCash, payByAgency } = yield select(state=>state.smartPurchaseList);
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
          type:'updatePageReducer',
          payload:{
            isAllCash,
            isAllDirect,
            isAllAgency,
          }
        })
      },
    *unmount({ },{ put }) {
        yield put({
            type: "unmountReducer",
        })
    }
  },

  reducers: {
    updatePageReducer(state, {payload}) {
        return {
            ...state,
            ...payload,
            purchaseOrderLoading:false,
        };
    },
    // changeIsTaxReducer(state, action) {
    //     const { payload } = action;
    //     const { selectedRow } = payload;
    //     const newState = Object.assign({}, state);
    //     const { selectedRows } = newState;
    //     // selectedRows[payload.index].purchaseIsTax = payload.purchaseIsTax;
    //     if (selectedRow.length < 1) {
    //       newState.isShowTime = false;
    //     }
    //     selectedRows.map((item) => {
    //       item.purchaseIsTax = 0;
  
    //       selectedRow.map((items, index) => {
    //         if (+item.goodsId === +items.goodsId) {
    //           item.purchaseIsTax = 1;
    //           newState.isShowTime = true;
    //         }
    //       });
    //     });
    //     return newState;
    //   },
    producedPurchaserOrderReducer(state) {
        return {
          ...state,
          purchaseOrderLoading: false,
        };
    },
    // 改变提供商搜索文案
    changeSupplierPending(state, { payload }) {
        return {
        ...state,
        ...payload,
        };
    },
    changeSupplierReducer(state, { payload }) {
        return {
          ...state,
          ...payload,
          supplierId: 0,
          supplierSuggest: [],
        };
    },
    unmountReducer() {
       return {
            purchaseHistoryDateStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
            purchaseHistoryDateEnd: moment().format('YYYY-MM-DD'),
            stockingRange: "15",
            purchaser:"",
            supplierId: "",
            goodsKeywords: "",   
            orderIds: [], 
            selectedRows: [],
            isShowGoodsListModal: false,
            purchaseOrderLoading: false,
            financeRemarks: [],
            // 判断是否勾选了挂账抵扣
            isDeduction: false,
            // 挂账抵扣金额
            balanceBillAmount: 0,
            // 采购跟进备注
            purchaseRemark: "",
            balanceBillTotalAmount: "",
            isOutInv: 0,
            isChange: false,
            purchaseNum: 0,
            selectedRowKeys: [],
            selectedRow: [],
            isShowPaymentDate: false,
            expectInvDate: '',
            expectShippingDate: '',
            expectPayTime: '',
            balanceBillOutInvAmount: 0,
            isSubmitLoading: false,
            isTableLoading: true,
            stockRangeMap: [],
            total:0,
            curPage:1,
            pageSize:40,
            purchaserMap: [],
            paymentMethod: [],
            supplierPayType: "",
            supplierIds: [],
            gifts: [],
            freight: 0,
            isHaveFreight: false,
            detailAddress:"",
            supplierSearchText:'',
            supplierSuggest: [],
            size:999,
            status:1,
            payConditionMap: {},
            payCondition: "",
            sort: "",
            orderBy: "",
            payInfoList:[],
            isCheck: false,
            bankType: "",
            bankInfoId:"",
            showConfirmModal: false,
            actionList: [],
            finalBankInfos:[],
            isTax:"1",
            shippingMethod:'',
            shippingMethodMap:{},
            bankInfoDetail:[],
            payTypePartMap:{},
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
       }
    }
  },
}
