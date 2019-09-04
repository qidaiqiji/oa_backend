import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { reqGetConfig, reqEditOrder, reqDeleteGoods, reqGetSuppliers, reqGetGoods, reqSaveOrder, reqGetOrderInfo, reqSupplierSuggest } from '../services/commonPurchaseAdd';
import { stat } from 'fs';

export default {
  namespace: 'commonPurchaseAdd',

  state: {
    suppliers: [],
    payTypePartMap: {},
    payType: 0,
    financeRemarks: [],
    financeRemark: null,
    expectInvDate: '',
    expectShippingDate: '',
    expectPayTime: '',
    siftGoods: [],
    giftSiftGoods: [],
    supplierId: null,
    supplier:'',
    searchGoodsName: '',
    giftSearchGoodsName: '',
    goods: [],
    goodsInfos: [],
    modalGoodsList: [],
    otherMoney: 0,
    date: '',
    orderNo: '',
    purchaser: '',
    remark: '',
    isSaving: 0,
    addressIds: [],
    province: '',
    city: '',
    region: '',
    detailAddress: '',
    addressOptions: [],
    isShowDeleteConfirm: false,
    isDeleting: false,
    deleteRowId: null,
    deleteGoodsId: null,
    isGoodsLoading: false,
    isLoading: true,
    isShowGoodsListModal: false,
    curPage: 1,
    keyword: '',
    selectedGoodsKeys: [],
    shippingMethod:'',

    // 关于赠品的
    selectedGiftsKeys: [],
    gifts: [],
    isShowGifts: false,
    isShowRemoveGiftsConfirm: false,

    // 运费
    isHaveFreight: false,
    freight: 0,
    // 时间
    isShowDate: false,
    // 是否显示预计付款时间
    isShowPaymentDate: false,
    // 判断是否勾选了挂账抵扣
    isDeduction: false,
    // 挂账抵扣金额
    balanceBillAmount: 0,
    // 挂账抵扣金额是否开票
    isOutInv: 0,
    balanceBillOutInvAmount: 0,
    isChange: false,
    //修改后抵扣金额需开票金额
    realBalanceBillOutInvAmount:0,
    isRealBalanceBillOutInvAmount:false,
    payCondition: "",
    supplierType: "",
    payConditionMap: {},
    orderRemark:"",
    itemId: "",
    isShowEditRemarkModal:false,
    type:"",
    bankInfo: [],
    bankInfoId: "",
    showConfirmModal:false,
    isCheck:false,
    isTax:1,
    finalBankInfos: [],
    bankInfoDetail: [],
    shippingMethodMap:{},
    supplierStatus:1,
    size:999,
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
    *searchGoods({ payload }, { put }) {
      const { goods, value, isGift } = payload;
      if (value === '') {
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: [],
            searchGoodsName: value,
          },
        });
        return;
      }
      const values = value.split(' ');
      function match(matchValue, matchs) {
        return matchs.every((oneMatch) => {
          return matchValue.indexOf(oneMatch) >= 0;
        });
      }
      const siftGoods = goods.filter((oneGoods) => {
        return match(oneGoods.no, values) || match(oneGoods.goodsName, values);
      });
      yield put({
        type: 'searchGoodsReducer',
        payload: {
          siftGoods,
          searchGoodsName: value,
          isGift,
        },
      });
    },
    *mount({ payload }, { call, put, all }) {
      yield put({
        type: 'mountPending',
        payload:{
          ...payload,
        }
      });
      try {
        const dataConfig = yield call(reqGetConfig);
        yield put({
          type: 'updatePage',
          payload: {
            payTypePartMap: dataConfig.data.payTypePartMap,
            payConditionMap: dataConfig.data.payConditionMap,
            shippingMethodMap:dataConfig.data.shippingMethodMap,
            isLoading:false,
          },
        });
        if (payload.id) {
          try {
            const orderData = yield call(reqGetOrderInfo, { id: +payload.id });
            // const [suppliersRes, goodsRes] = yield all([call(reqGetSuppliers), call(]);
            const goodsRes = yield call(reqGetGoods, { isZhiFa: 1, id: +orderData.data.supplierId })
            goodsRes.data.table.forEach((goods) => {
              delete goods.id;
            });
            yield put({
              type: 'getOrderInfo',
              payload: {
                ...orderData.data,
                bankType:orderData.data.bankDetail.type,
                bankInfoId:orderData.data.bankDetail.id,
                bankInfoDetail:[orderData.data.bankDetail],
                isShowGifts: orderData.data.gifts ? orderData.data.gifts.length > 0 : false,
                goods: goodsRes.data.table,
                // modalGoodsList: goodsRes.data.table.slice(0, 10),
                modalGoodsList:goodsRes.data.table,
              },
            });
            yield put({
              type:'searchSupplier',
              payload:{
                supplierSearchText:orderData.data.supplier,
                supplierId:orderData.data.supplierId
              }
            })
            yield put({
              type:'checkIsSamePayMethod',
            })
            
          } catch (error) {
            // dodo
          }
        } else {
          // const res = yield call(reqGetSuppliers);
          // yield put({
          //   type: 'getSupplier',
          //   payload: {
          //     suppliers: res.data.suppliers,
          //   },
          // });
        }
      } catch (error) {
        // to do
      }
    },
    *changeSupplier({ payload }, { call, put, select }) {
      yield put({
        type:'updatePage',
        payload:{
          ...payload,
        }
      })
      const {
        suppliers,
        id,
      } = yield select(state => state.commonPurchaseAdd);
      let financeRemarks = null;
      let balanceBillTotalAmount = 0;
      let payType = "";
      let bankInfo = [];
      let status = {};
        for (const supplier of suppliers) {
          if (+supplier.id === +payload.supplierId) {
           ({ financeRemarks, balanceBillTotalAmount, payType, bankInfo, status  } = supplier);
          }
        }
        const supplierType = payType;
        if(+status.status !== 2) {
          notification.error({
            message:"该供应商未审核通过，暂不支持建单"
          })
        }
        let finalBankInfos = [];
        bankInfo.map(item=>{
          finalBankInfos.push({type:item.type,bankInfoDetail:[]});
        })
        let hash = {};
        finalBankInfos = finalBankInfos.reduce((preVal,curVal)=>{
          hash[curVal.type] ? '' : hash[curVal.type] = true && preVal.push(curVal); 
          return preVal 
        },[])
        bankInfo.map(item=>{
          finalBankInfos.map(info=>{
            if(+item.type === +info.type) {
              info.bankInfoDetail.push(item)
            }
          })
        })
        
      yield put({
        type: 'changeSupplierReducer',
        payload: {
          supplierId: payload.supplierId,
          financeRemarks,
          bankInfo,
          balanceBillTotalAmount,
          supplierType,
          // bankInfoId:bankInfoId||bankInfoDetail[0]&&bankInfoDetail[0].id,
          finalBankInfos,
        },
      });
      if(!id) {
        try {
          const goodsRes = yield call(reqGetGoods, { isZhiFa: 1, size: 0, id: payload.supplierId });
          yield put({
            type: 'getGoodsResolved',
            payload: {
              goods: goodsRes.data.table,
              total: goodsRes.data.total,
              modalGoodsList: goodsRes.data.table.slice(0, 10),
            },
          });
        } catch (error) {
          // dodo
        }
      }
    },
    *changeGoods({ payload }, { put, select }) {
      const { goods, goodsInfos, gifts } = yield select(state => state.commonPurchaseAdd);
      const { isGift } = payload;
      let goodsInfo = null;
      if (!isGift) {
        for (let i = 0; i < goods.length; i += 1) {
          if (+goods[i].goodsId === +payload.goodsId) {
            goodsInfo = Object.assign({}, goods[i]);
            delete goodsInfo.id;
            goodsInfo.purchaseNum = 0;
            // goodsInfo.purchaseIsTax = 1;
            break;
          }
        }
      } else {
        for (let i = 0; i < goods.length; i += 1) {
          if (+goods[i].goodsId === +payload.goodsId) {
            goodsInfo = {
              ...goods[i],
            };
            goodsInfo.purchaseNum = 0;
            break;
          }
        }
      }
      yield put({
        type: 'getGoodsInfoReducer',
        payload: {
          goodsInfos: !isGift ? goodsInfos.concat([goodsInfo]) : goodsInfos,
          gifts: isGift ? gifts.concat([goodsInfo]) : gifts,
          isGift,
          isShowDate: true,
        },
      });
    },
    *changePurchaseNum({ payload }, { put, select }) {
      const { goodsInfos, gifts } = yield select(state => state.commonPurchaseAdd);
      if (!payload.isGift) {
        for (let i = 0; i < goodsInfos.length; i += 1) {
          if (goodsInfos[i].goodsId === payload.goodsId) {
            goodsInfos[i].purchaseNum = payload.number;
            break;
          }
        }
      } else {
        for (let i = 0; i < gifts.length; i += 1) {
          if (gifts[i].goodsId === payload.goodsId) {
            gifts[i].purchaseNum = payload.number;
            break;
          }
        }
      }
      yield put({
        type: 'changePurchaseNumReducer',
        payload: {
          goodsInfos,
          gifts,           
        },
      });
    },
    *deleteGoods({ payload }, { put }) {
      yield put({
        type: 'deleteGoodsReducer',
        payload: {
          ...payload,
        },
      });
      yield put({
        type:'checkIsSamePayMethod'
      })
    },

    *clickDeleteGoodsButton({ payload }, { put }) {
      yield put({
        type: 'clickDeleteGoodsButtonReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeIsTax({ payload }, { put, select }) {
      yield put({
        type:'updatePage',
        payload:{
          ...payload,
        }
      })
      const { bankType, finalBankInfos } = yield select(state=>state.commonPurchaseAdd);
      let bankInfoDetail = [];
      finalBankInfos.map(item=>{
        if(+item.type === +bankType) {
          bankInfoDetail = item.bankInfoDetail;
        }
      })
      yield put({
        type:'updatePage',
        payload:{
          bankInfoDetail,
          bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
        }
      })
    },
    *clickOkDeleteGoodsButton({ payload }, { put, call }) {
      yield put({
        type: 'clickOkDeleteGoodsButtonReducer',
      });
      try {
        yield call(reqDeleteGoods, { purchaseGoodsId: payload.rowId, purchaseOrderId: payload.orderId });
        yield put({
          type: 'deleteGoodsReducer',
          payload: {
            goodsId: payload.goodsId,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *clickSaveBtn({ payload }, { put, call, select }) {
      yield put({
        type:'updatePage',
        payload:{
          ...payload,
        }
      })
      const balanceBillOutInvAmount = realBalanceBillOutInvAmount;
      const { 
        id,
        goodsInfos,
        orderNo,
        purchaser,
        remark,
        otherMoney,
        financeRemark,
        supplierId,
        name,
        detailAddress,
        payType,
        gifts,
        freight,
        isHaveFreight,
        expectInvDate,
        expectShippingDate,
        expectPayTime,
        isOutInv,
        balanceBillAmount,
        // BalanceBillOutInvAmount,
        realBalanceBillOutInvAmount,
        payCondition,
        bankInfoId,
        showConfirmModal,
        isTax,
        shippingMethod,
        supplierType
        // balanceBillOutInvAmount
       } = yield select(state=>state.commonPurchaseAdd)
      yield put({
        type: 'clickSaveBtnPending',
      });
      if (payload.orderId) {
        try {
          yield call(reqEditOrder, { 
            orderId:id,
            goodsList:goodsInfos,
            orderNo,
            purchaser,
            remark,
            otherMoney,
            financeRemark,
            supplierId,
            name,
            detailAddress,
            payType,
            gifts,
            freight,
            isHaveFreight,
            expectInvDate:+isTax?expectInvDate:"",
            expectShippingDate,
            expectPayTime,
            isOutInv:+isTax,
            balanceBillAmount,
            // BalanceBillOutInvAmount,
            realBalanceBillOutInvAmount,
            payCondition,
            bankInfoId,
            showConfirmModal,
            balanceBillOutInvAmount:realBalanceBillOutInvAmount,
            isTax,
            shippingMethod,
            supplierType
           });
          notification.success({
            message: '操作提醒',
            description: '修改成功',
          });
          yield put(routerRedux.push('/purchase/purchase-order-management/common-purchase-list'));
        } catch (error) {
          yield put({
            type: 'clickSaveBtnRejected',
          });
        }
      } else {
        try {
          yield call(reqSaveOrder, { 
            orderId:id,
            goodsList:goodsInfos,
            orderNo,
            purchaser,
            remark,
            otherMoney,
            financeRemark,
            supplierId,
            name,
            detailAddress,
            payType,
            gifts,
            freight,
            isHaveFreight,
            expectInvDate,
            expectShippingDate,
            expectPayTime,
            isOutInv,
            balanceBillAmount,
            // BalanceBillOutInvAmount,
            realBalanceBillOutInvAmount,
            payCondition,
            bankInfoId,
            showConfirmModal,
            balanceBillOutInvAmount:realBalanceBillOutInvAmount,
            isTax,
            shippingMethod,
            supplierType
           });
          notification.success({
            message: '操作提醒',
            description: '新建成功',
          });
          yield put(routerRedux.push('/purchase/purchase-order-management/common-purchase-list'));
        } catch (error) {
          yield put({
            type: 'clickSaveBtnRejected',
          });
        }
      }
    },
    *triggerGoodsListModal({ payload }, { put }) {
      yield put({
        type: 'triggerGoodsListModalReducer',
        payload: {
          isGift: payload.isGift,
        },
      });
    },
    *searchSupplier({ payload }, { put, call, select }) {
      const { size, id } = yield select(state=>state.commonPurchaseAdd);
      try {
        const res = yield call(reqSupplierSuggest, { keywords: payload.supplierSearchText,size });
        yield put({
          type: 'updatePage',
          payload: {
            suppliers: res.data.suppliers,
          },
        });
        if(id) {
          yield put({
            type:'changeSupplier',
            payload:{
              ...payload
            }
          })
        }
      } catch (error) {
          console.log(error)
      }
    },
    *changeGoodsListModalPage({ payload }, { put, select }) {
      const {
        goods,
        keyword,
      } = yield select(state => state.commonPurchaseAdd);
      const {
        curPage,
      } = payload;
      const modalGoodsList = [];
      for (const oneGoods of goods) {
        if (oneGoods.goodsName.includes(keyword) || oneGoods.no.includes(keyword)) {
          modalGoodsList.push({ ...oneGoods });
        }
      }
      yield put({
        type: 'updatePage',
        payload: {
          ...payload,
          total: modalGoodsList.length,
          modalGoodsList: modalGoodsList.slice((curPage - 1) * 10, curPage * 10),
        },
      });
    },
    *searchGoodsModal({ payload }, { put, select }) {
      const {
        goods,
      } = yield select(state => state.commonPurchaseAdd);
      const {
        keyword,
        curPage,
      } = payload;
      const modalGoodsList = [];
      for (const oneGoods of goods) {
        if (oneGoods.goodsName.includes(keyword) || oneGoods.no.includes(keyword)) {
          modalGoodsList.push({ ...oneGoods });
        }
      }
      yield put({
        type: 'updatePage',
        payload: {
          ...payload,
          total: modalGoodsList.length,
          modalGoodsList: modalGoodsList.slice((curPage - 1) * 10, curPage * 10),
        },
      });
    },
    *clickOkGoodsListModal({ payload }, { put, select }) {
      const {
        selectedGoodsKeys,
        selectedGiftsKeys,
        goods,
        goodsInfos,
        gifts,
        isGift,
        finalBankInfos,
        isTax,
        bankInfo,
      } = yield select(state => state.commonPurchaseAdd);
      const localGoodsInfos = [];
      if (!isGift) {
        for (const oneGoods of goods) {
          if (selectedGoodsKeys.includes(oneGoods.goodsId)) {
            const localOneGoods = {
              ...oneGoods,
            };
            localOneGoods.purchaseNum = 0;
            localGoodsInfos.push(localOneGoods);
          }
        }
        // const isAllTax = goodsInfos.concat(localGoodsInfos).every(item=>{
        //   return +item.purchaseIsTax
        // })
        let bankType = "";
        let bankInfoId = "";
        let bankInfoDetail = [];
        if(bankInfo.length>0) {
          const hasPublic = bankInfo.some(item=>item.type==1);
          const hasPrivate = bankInfo.some(item=>item.type==2);
          bankType = hasPublic&&+isTax?1:(hasPrivate&&!+isTax?2:'');
          finalBankInfos.map(item=>{
            if(+item.type === +bankType) {
              bankInfoDetail = item.bankInfoDetail;
            }
          })
          bankInfoId = bankInfoDetail[0]&&bankInfoDetail[0].id;
        }
        const isCheck = goodsInfos.concat(localGoodsInfos).some(item=>{
          return !item.isCheck;
        })
        yield put({
          type: 'clickOkGoodsListModalReducer',
          payload: {
            goodsInfos: goodsInfos.concat(localGoodsInfos),
            isShowDate: true,
            isCheck,
            bankType,
            bankInfoDetail,
            bankInfoId,
            isAllCash:false,
            isAllDirect:false,
            isAllAgency:false
          },
        });
      } else {
        for (const oneGoods of goods) {
          if (selectedGiftsKeys.includes(oneGoods.goodsId)) {
            const localOneGoods = {
              ...oneGoods,
            };
            localOneGoods.purchaseNum = 0;
            // localOneGoods.purchaseIsTax = 1;
            localGoodsInfos.push(localOneGoods);
          }
        }
        yield put({
          type: 'clickOkGoodsListModalReducer',
          payload: {
            gifts: gifts.concat(localGoodsInfos),
          },
        });
      }
      yield put({
        type:'checkIsSamePayMethod'
      })
    },
    *changePayType({ payload }, { put }) {
        const { payType} = payload;
        if(payType == "2" || payType == "4") {
          yield put({
            type: 'changePayTypeReducer',
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
            type: 'changePayTypeReducer',
            payload: {
              isShowPaymentDate:false,
              payType,
            },
          });
        }
        yield put({
          type:'checkIsSamePayMethod'
        })
        
    },
    *triggerEditRemarkModal({ payload }, { put,select }) {
      const { itemId, type } = payload;
      const { goodsInfos,isShowEditRemarkModal,gifts } = yield select(state=>state.commonPurchaseAdd);
      let orderRemark = "";
      if(type=="goods") {
        goodsInfos.map(item=>{
          if(+item.id === +itemId) {
            if(!item.isChange) {
              orderRemark = item.remark;
            }
          }
        })
      }else if(type=="gifts") {
        gifts.map(item=>{
          if(+item.id === +itemId) {
            if(!item.isChange) {
              orderRemark = item.remark;
            }
          }
        })
      }
      yield put({
        type: 'updatePage',
        payload:{
          orderRemark,
          goodsInfos,
          itemId,
          type,
          isShowEditRemarkModal:!isShowEditRemarkModal
        },
      });
    },
    *showGifts(_, { put }) {
      yield put({
        type: 'showGiftsReducer',
      });
    },
    *toggleRemoveGiftsConfirm(_, { put }) {
      yield put({
        type: 'toggleRemoveGiftsConfirmReducer',
      });
    },
    *okRemoveGifts(_, { put }) {
      yield put({
        type: 'okRemoveGiftsReducer',
      });
    },
    *changeHaveFreight(_, { put }) {
      yield put({
        type: 'changeHaveFreightReducer',
      });
    },
    *changeFreight({ payload }, { put }) {
      yield put({
        type: 'changeFreightReducer',
        payload: {
          freight: payload.freight,
        },
      });
    },
    *checkIsSamePayMethod({ payload },{ put, select }) {
      const { goodsInfos, payByDirect, payByCash, payByAgency } = yield select(state=>state.commonPurchaseAdd);
      let cashResult = goodsInfos.map(item=>{
        if(Object.keys(payByCash).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let directResult = goodsInfos.map(item=>{
        if(Object.keys(payByDirect).indexOf(""+item.payMethodId)>-1) {
          return true;
        }else{
          return false
        }
      })
      let agencyResult = goodsInfos.map(item=>{
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
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    updatePage(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePayTypeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    deleteGoodsReducer(state, action) {
      const { payload } = action;
      const { isGift } = payload;
      const newState = Object.assign({}, state);
      const { goodsInfos, gifts } = newState;
      if (!isGift) {
        for (let i = 0; i < goodsInfos.length; i += 1) {
          if (goodsInfos[i].goodsId === payload.goodsId) {
            goodsInfos.splice(i, 1);
            break;
          }
        }
      } else {
        for (let i = 0; i < gifts.length; i += 1) {
          if (gifts[i].goodsId === payload.goodsId) {
            gifts.splice(i, 1);
            break;
          }
        }
      }
      return {
        ...newState,
        isDeleting: false,
        isShowDeleteConfirm: false,
      };
    },
    changePurchaseNumReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    mountPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getOrderInfo(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGoodsLoading: false,
        isLoading: false,
      };
    },
    getSupplier(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGoodsLoading: false,
        isLoading: false,
      };
    },
    changeSupplierReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        financeRemark: null,
        // isGoodsLoading: true,

      };
    },
    getGoodsResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        goodsInfos: [],
        gifts: [],
        searchGoodsName: '',
        giftSearchGoodsName: '',
        otherMoney: 0,
        freight: 0,
        date: '',
        orderNo: '',
        purchaser: '',
        remark: '',
        expectInvDate: '',
        expectShippingDate: '',
        expectPayTime: '',
        province: '',
        city: '',
        region: '',
        detailAddress: '',
        isGoodsLoading: false,
        isShowGifts: false,
      };
    },
    getGoodsInfoReducer(state, { payload }) {
      const { isGift } = payload;
      return {
        ...state,
        ...payload,
        searchGoodsName: !isGift ? '' : state.searchGoodsName,
        siftGoods: !isGift ? [] : state.siftGoods,
        giftSearchGoodsName: isGift ? '' : state.giftSearchGoodsName,
        giftSiftGoods: isGift ? [] : state.giftSiftGoods,
      };
    },
    clickSaveBtnPending(state) {
      return {
        ...state,
        isSaving: 1,
      };
    },
    clickSaveBtnRejected(state) {
      return {
        ...state,
        isSaving: 0,
      };
    },
    clickDeleteGoodsButtonReducer(state, { payload }) {
      return {
        ...state,
        deleteRowId: payload.rowId,
        deleteGoodsId: payload.goodsId,
        isGiftsMode: payload.isGift,
        isShowDeleteConfirm: true,
      };
    },
    clickOkDeleteGoodsButtonReducer(state) {
      return {
        ...state,
        isDeleting: true,
      };
    },
    searchGoodsReducer(state, { payload }) {
      if (!payload.isGift) {
        return {
          ...state,
          ...payload,
          giftSiftGoods: [],
        };
      } else {
        return {
          ...state,
          giftSiftGoods: payload.siftGoods,
          giftSearchGoodsName: payload.searchGoodsName,
          siftGoods: [],
        };
      }
    },
    triggerGoodsListModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGiftsMode: payload.isGift,
        isShowGoodsListModal: !state.isShowGoodsListModal,
      };
    },
    clickOkGoodsListModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowGoodsListModal: false,
        selectedGoodsKeys: [],
      };
    },
    showGiftsReducer(state) {
      return {
        ...state,
        isShowGifts: true,
      };
    },
    toggleRemoveGiftsConfirmReducer(state) {
      return {
        ...state,
        isShowRemoveGiftsConfirm: !state.isShowRemoveGiftsConfirm,
      };
    },
    okRemoveGiftsReducer(state) {
      return {
        ...state,
        isShowGifts: false,
        isShowRemoveGiftsConfirm: false,
        gifts: [],
      };
    },
    // 是否有运费
    changeHaveFreightReducer(state) {
      return {
        ...state,
        isHaveFreight: !state.isHaveFreight,
      };
    },
    // 修改运费
    changeFreightReducer(state, { payload }) {
      return {
        ...state,
        freight: payload.freight,
      };
    },
    unmountReducer() {
      return {
        suppliers: [],
        payTypePartMap: {},
        payType: 0,
        financeRemarks: [],
        financeRemark: null,
        siftGoods: [],
        giftSiftGoods: [],
        supplierId: null,
        supplier:'',
        searchGoodsName: '',
        giftSearchGoodsName: '',
        goods: [],
        goodsInfos: [],
        modalGoodsList: [],
        otherMoney: 0,
        date: '',
        orderNo: '',
        purchaser: '',
        remark: '',
        expectInvDate: '',
        expectShippingDate: '',
        expectPayTime: '',
        isSaving: 0,
        addressIds: [],
        province: '',
        city: '',
        region: '',
        detailAddress: '',
        addressOptions: [],
        isShowDeleteConfirm: false,
        isDeleting: false,
        deleteRowId: null,
        deleteGoodsId: null,
        isGoodsLoading: false,
        isLoading: true,
        isShowGoodsListModal: false,
        curPage: 1,
        keyword: '',
        selectedGoodsKeys: [],

        // 关于赠品的
        selectedGiftsKeys: [],
        gifts: [],
        isShowGifts: false,
        isShowRemoveGiftsConfirm: false,

        // 运费
        isHaveFreight: false,
        freight: 0,
        // 时间
        isShowDate: false,
        // 是否显示预计付款时间
        isShowPaymentDate: false,
        // 判断是否勾选了挂账抵扣
        isDeduction: false,
        // 挂账抵扣金额
        balanceBillTotalAmount: 0,
        balanceBillAmount: 0,
         // 挂账抵扣金额是否开票
         isOutInv: 0,
        balanceBillOutInvAmount: 0,
        isChange: false,
            //修改后抵扣金额需开票金额
        realBalanceBillOutInvAmount:0,
        isRealBalanceBillOutInvAmount:false,
        payCondition: "",
        supplierType: "",
        payConditionMap: {},
        orderRemark: "",
        itemId: "",
        isShowEditRemarkModal:false,
        type: "",
        bankInfo: [],
        bankInfoId: "",
        showConfirmModal:false,
        isCheck: false,
        isTax:1,
        finalBankInfos: [],
        bankInfoDetail: [],
        shippingMethodMap:{},
        shippingMethod:'',
        showModal:false,
        isAllCash:false,
        isAllDirect:false,
        isAllAgency:false,
        supplierStatus:1,
        size:999,
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
      };
    },
  },
};
