import cloneDeep from 'lodash/cloneDeep';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
  reqGetOrderDetail,
  reqLogisticsAdd,
  reqLogisticsUpdate,
  reqStartupOrderAction,
  reqSelectFinanceRemark,
  reqGetConfig,
  reqUpdatePayType,
  requestChangeTax,
  reqChangeBankInfo,
} from '../services/salePurchaseOrderDetail';
import { stat } from 'fs';

export default {
  namespace: 'salePurchaseOrderDetail',
  state: {
    payTypeMap: {},
    payType: '',
    detailType: '',
    purchaseSn: '',
    supplier: '',
    purchaser: '',
    date: '',
    totalOrderGoodsList: [],
    isLoading: false,
    // 子单状态记录--
    subOrderList: [],
    isGoodsLoading: false,
    subOrderInfo: {},
    subOrderInfoChange: [],
    isShowSubOrderInfoConfirm: false,
    isSubOrderInfoLoading: false,
    subOrderId: '',
    logisticsId: '',
    logisticsCompany: '',
    logisticsSn: '',
    logisticsFare: '',
    // 付款信息--
    purchaseAmount: 0,
    alreadyPay: 0,
    awaitConfirm: 0,
    awaitPay: 0,
    payList: [],
    payInfo: {},
    isShowPayInfoConfirm: false,
    isPayInfoLoading: false,

    actionList: [],
    pageId: '',
    isShowActionConfirm: false,
    isActioning: false,
    actionRemark: '',
    actionText: '',
    isNeedRemark: false,
    url: '',

    tabStatus: '',
    financeRemark: '',
    financeRemarks: [],
    isEditState: false,
    canEdit: false,
    note: "",
    followInfoDetail: {},
    isShowNoticeModal: false,
    noticeOrderList: [],
    bankInfoList: [],
    bankInfoId: "",
    bankDetailId: "",
    bankInfo: "",
    finalBankInfos: [],
    currentBankInfo: {},
    payByCash: {
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
    isAllCash: false,
    isAllDirect: false,
    isAllAgency: false,
    shippingMethodMap: {},
    orderSnMap: [],
    logisticSnId:0,
  },

  effects: {
    // 支付方式选择
    *changePayType({ payload }, { put, call }) {
      yield put({
        type: 'changePayTypeReducer',
        payload: {
          ...payload,
        },
      });
      try {
        yield call(reqUpdatePayType, { ...payload });
        message.success('修改支付方式成功！');
      } catch (error) {
        // to do
        message.error('修改支付方式失败！');
      }
    },
    // 财务下拉备注
    *selectFinanceRemark({ payload }, { put, call }) {
      // yield put({
      //   type: 'selectFinanceRemarkPending',
      // });
      try {
        yield call(reqSelectFinanceRemark, { ...payload });
        yield put({
          type: 'selectFinanceRemarkResolved',
          payload: {
            financeRemark: payload.financeRemark,
          },
        });
        message.success('修改备注成功');
      } catch (err) {
        // somethiing err
      }
    },
    // 点击填充的时候
    *fillLogisticInfo({ payload }, { put }) {
      const { selectedInfo, logisticSnId } = payload;
      yield put({
        type: 'changeReducer',
        payload: {
          logisticsSn: selectedInfo.shippingNo,
          logisticsCompany: selectedInfo.shippingCompany,
          logisticSnId,
        },
      });
    },
    // 拉取订单详情
    *getOrderDetail({ payload }, { put, call, select }) {
      const { logisticSnId } = yield select(state=>state.salePurchaseOrderDetail)

      yield put({
        type: 'getOrderDetailInit',
        payload: {
          ...payload,
        },
      });
      try {
        const dataConfig = yield call(reqGetConfig);
        yield put({
          type: 'getConfigReducer',
          payload: {
            payTypeMap: dataConfig.data.payTypeMap,
            shippingMethodMap: dataConfig.data.shippingMethodMap,
          },
        });
        const res = yield call(reqGetOrderDetail, { ...payload });
        let finalBankInfos = [];
        let bankInfoList = res.data.bankInfoList;
        let subOrderList = res.data.subOrderList;
        let orderSnMap = [];
        subOrderList.map(item => (
          orderSnMap.push({ id: item.id, subOrderSn: item.subOrderSn })
        ))
        const followInfo = res.data.followInfo;
        let followInfoDetail = {};
        let tempFollowInfo = followInfo.filter(item => item.orderId == orderSnMap[0].id);
        let logisticsSn = "";
        let logisticsCompany = "";
        tempFollowInfo.map((item, index) => {
          followInfoDetail[index] = item.shippingNo;
          return followInfoDetail;
        })
        followInfo.map(item=>{
          if(item.shippingNo == followInfoDetail[logisticSnId]){
            logisticsSn = item.shippingNo;
            logisticsCompany = item.shippingCompany;
          }
        })
        yield put({
          type: 'getOrderDetailReducer',
          payload: {
            followInfoDetail,
            orderSnMap,
            logisticsSn,
            logisticsCompany
          },
        });
        
        bankInfoList.map(item => {
          finalBankInfos.push({ type: item.type, bankInfoDetail: [] });
        })
        let hash = {};
        finalBankInfos = finalBankInfos.reduce((preVal, curVal) => {
          hash[curVal.type] ? '' : hash[curVal.type] = true && preVal.push(curVal);
          return preVal
        }, [])
        bankInfoList.map(item => {
          finalBankInfos.map(info => {
            if (+item.type === +info.type) {
              info.bankInfoDetail.push(item)
            }
          })
        })

        // 通过bankInfoId拿到当前的财务信息
        let currentBankInfo = {};
        bankInfoList.map(item => {
          if (item.id == res.data.bankInfoId) {
            currentBankInfo = item;
          }
        })
        yield put({
          type: 'getOrderDetailReducer',
          payload: {
            pageId: payload.id,
            ...res.data,
            detailType: res.data.status,
            finalBankInfos,
            currentBankInfo,
          },
        });
        
      } catch (error) {
        // to do
      }
    },
    *showOrderInfoConfirm({ payload }, { put, select }) {
      const salePurchaseOrderDetail = yield select(state => state.salePurchaseOrderDetail);
      const { subOrderList } = salePurchaseOrderDetail;
      let changeSubOrder;
      if (payload.logisticsId) {
        const logisticsCompany = [];
        const logisticsSn = [];
        const logisticsFare = [];
        const arr = [];
        for (let i = 0; i < subOrderList.length; i += 1) {
          if (+payload.id === +subOrderList[i].id) {
            changeSubOrder = cloneDeep(subOrderList[i]);
            for (let j = 0; j < changeSubOrder.logisticsInfoList.length; j += 1) {
              if (+payload.logisticsId === +changeSubOrder.logisticsInfoList[j].id) {
                logisticsCompany.push(changeSubOrder.logisticsInfoList[j].logisticsCompany);
                logisticsSn.push(changeSubOrder.logisticsInfoList[j].logisticsSn);
                logisticsFare.push(changeSubOrder.logisticsInfoList[j].logisticsFare);
                for (let m = 0; m < changeSubOrder.logisticsInfoList[j].goodsList.length; m += 1) {
                  for (let n = 0; n < changeSubOrder.goodsList.length; n += 1) {
                    if (+changeSubOrder.goodsList[n].id === +changeSubOrder.logisticsInfoList[j].goodsList[m].id) {
                      changeSubOrder.goodsList[n].outNum = changeSubOrder.logisticsInfoList[j].goodsList[m].outNum;
                      changeSubOrder.goodsList[n].limitNum = changeSubOrder.logisticsInfoList[j].goodsList[m].outNum + changeSubOrder.goodsList[n].awaitOutNum;
                      arr.push(changeSubOrder.goodsList[n]);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        changeSubOrder.goodsList = arr;
        yield put({
          type: 'showOrdrInfoConfirmReducer',
          payload: {
            subOrderId: payload.id,
            logisticsId: payload.logisticsId,
            subOrderInfo: changeSubOrder,
            logisticsCompany: logisticsCompany[0],
            logisticsSn: logisticsSn[0],
            logisticsFare: logisticsFare[0],
          },
        });
      } else {
        for (let i = 0; i < subOrderList.length; i += 1) {
          if (+payload.id === +subOrderList[i].id) {
            changeSubOrder = cloneDeep(subOrderList[i]);
            for (let j = 0; j < changeSubOrder.goodsList.length; j += 1) {
              changeSubOrder.goodsList[j].outNum = 0;
              changeSubOrder.goodsList[j].limitNum = changeSubOrder.goodsList[j].awaitOutNum + changeSubOrder.goodsList[j].outNum;
            }
          }
        }
        yield put({
          type: 'showOrdrInfoConfirmReducer',
          payload: {
            subOrderId: payload.id,
            logisticsId: payload.logisticsId,
            subOrderInfo: changeSubOrder,
          },
        });
      }
    },
    *cancelSubOrderInfoButton(_, { put }) {
      yield put({
        type: 'cancelSubOrderInfoReducer',
      });
    },
    *changeOutNum({ payload }, { put, select }) {
      const salePurchaseOrderDetail = yield select(state => state.salePurchaseOrderDetail);
      const { subOrderInfo } = salePurchaseOrderDetail;
      for (let i = 0; i < subOrderInfo.goodsList.length; i += 1) {
        if (+subOrderInfo.goodsList[i].id === +payload.rowId) {
          subOrderInfo.goodsList[i].outNum = +payload.value;
        }
      }
      yield put({
        type: 'changeOutNumReducer',
        payload: {
          subOrderInfo,
        },
      });
    },
    *changeLogisticsCompany({ payload }, { put }) {
      yield put({
        type: 'changeLogisticsCompanyReducer',
        payload: {
          logisticsCompany: payload.value,
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
    *changeLogisticsFare({ payload }, { put }) {
      yield put({
        type: 'changeLogisticsFareReducer',
        payload: {
          logisticsFare: payload.value,
        },
      });
    },
    *changeUnloadFare({ payload }, { put }) {
      yield put({
        type: 'changeUnloadFareReducer',
        payload: {
          unloadFare: payload.value,
        },
      });
    },
    *addLogistics({ payload }, { put, call }) {
      yield put({
        type: 'subOrderInfoButtonOkPending',
      });
      try {
        yield call(reqLogisticsAdd, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.pageId,
          },
        });
        yield put({
          type: 'subOrderInfoButtonOkReducer',
        });
      } catch (error) {
        // to do
        yield put({
          type: 'subOrderInfoButtonOkErrorReducer',
        });
      }
    },
    *updateLogistics({ payload }, { put, call }) {
      yield put({
        type: 'subOrderInfoButtonOkPending',
      });
      try {
        yield call(reqLogisticsUpdate, { ...payload });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.pageId,
          },
        });
        yield put({
          type: 'subOrderInfoButtonOkReducer',
        });
      } catch (error) {
        // to do
        yield put({
          type: 'subOrderInfoButtonOkErrorReducer',
        });
      }
    },
    *showPayInfoConfirm({ payload }, { put }) {
      let obj = {};
      for (let i = 0; i < payload.payList.length; i += 1) {
        if (+payload.id === +payload.payList[i].id) {
          obj = cloneDeep(payload.payList[i]);
        }
      }
      yield put({
        type: 'showPayInfoConfirmReducer',
        payload: {
          payInfo: obj,
        },
      });
    },
    *clickOkPayInfoButto(_, { put }) {
      yield put({
        type: 'clickOkPayInfoButtoReducer',
      });
    },
    *clickAction({ payload }, { put, call }) {
      try {
        yield call(reqStartupOrderAction, payload.url);
        message.success('申请成功');
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.id,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 弹窗action
    *clickActionPopUp({ payload }, { put }) {
      yield put({
        type: 'clickActionPopUpReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 取消action弹窗
    *cancelActionConfirm(_, { put }) {
      yield put({
        type: 'cancelActionConfirmReducer',
      });
    },
    // 修改action备注
    *changeActionRemark({ payload }, { put }) {
      yield put({
        type: 'changeActionRemarkReducer',
        payload: {
          actionRemark: payload.value,
        },
      });
    },
    // 确认action弹窗
    *clickOkAction({ payload }, { put, call, select }) {
      const salePurchaseOrderDetail = yield select(state => state.salePurchaseOrderDetail);
      const { actionRemark, backUrl } = salePurchaseOrderDetail;
      try {
        const res = yield call(reqStartupOrderAction, { ...payload, remark: actionRemark });
        if (res.data && res.data.length > 0) {
          yield put({
            type: 'changeReducer',
            payload: {
              isShowNoticeModal: true,
              noticeText: res.msg,
              noticeOrderList: res.data,
              isShowActionConfirm: false,
            },
          });
        } else {
          if (backUrl) {
            yield put(routerRedux.push(backUrl));
            return;
          }
        }
        yield put({
          type: 'cancelActionConfirm',
        });
        yield put({
          type: 'getOrderDetail',
          payload: {
            id: payload.id,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *changeEditState({ payload }, { put, select }) {
      yield put({
        type: 'changeEditStateReducer',
        payload: {
          ...payload,
        }
      });
      const { isEditState, currentBankInfo } = yield select(state => state.salePurchaseOrderDetail);
      if (isEditState) {
        if (Object.keys(currentBankInfo).length > 0) {
          yield put({
            type: 'changeReducer',
            payload: {
              bankType: currentBankInfo.type,
              bankDetailId: currentBankInfo.id,
            }
          })
        }
      }
    },
    *changePurchaseIsTax({ payload }, { put, call, select }) {
      const { id, isTax } = payload;
      try {
        const { totalOrderGoodsList } = yield select(state => state.salePurchaseOrderDetail);
        yield call(requestChangeTax, { id, isTax });
        for (let i = 0; i < totalOrderGoodsList.length; i += 1) {
          const element = totalOrderGoodsList[i];
          if (element.id === id) {
            totalOrderGoodsList[i].purchaseIsTax = isTax;
            break;
          }
        }
        yield put({
          type: 'changePurchaseIsTaxReducer',
          payload: {
            totalOrderGoodsList,
          },
        });
        notification.success({
          message: '成功提示',
          description: '是否含税修改成功！',
        });
      } catch (error) {
        console.log(error);
      }
    },
    *changeBankInfoId({ payload }, { put, call, select }) {
      yield put({
        type: 'changePayTypeReducer',
        payload: {
          ...payload,
        }
      })
      const { id, bankDetailId } = yield select(state => state.salePurchaseOrderDetail);
      try {
        const res = yield call(reqChangeBankInfo, { id, bankInfoId: bankDetailId })
        notification.success({
          message: res.msg,
        })

      } catch (err) {
        console.log(err)

      }
    },
    *checkIsSamePayMethod({ payload }, { put, select }) {
      const { totalOrderGoodsList, payByDirect, payByCash, payByAgency } = yield select(state => state.salePurchaseOrderDetail);
      let cashResult = totalOrderGoodsList.map(item => {
        if (Object.keys(payByCash).indexOf("" + item.payMethodId) > -1) {
          return true;
        } else {
          return false
        }
      })
      let directResult = totalOrderGoodsList.map(item => {
        if (Object.keys(payByDirect).indexOf("" + item.payMethodId) > -1) {
          return true;
        } else {
          return false
        }
      })
      let agencyResult = totalOrderGoodsList.map(item => {
        if (Object.keys(payByAgency).indexOf("" + item.payMethodId) > -1) {
          return true;
        } else {
          return false
        }
      })
      let isAllCash = cashResult.every(item => {
        return item;
      })
      let isAllDirect = directResult.every(item => {
        return item;
      })
      let isAllAgency = agencyResult.every(item => {
        return item;
      })
      yield put({
        type: 'changeReducer',
        payload: {
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

    changePayTypeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // 下拉备注
    selectFinanceRemarkResolved(state, { payload }) {
      return {
        ...state,
        ...payload,

      };
    },
    changeReducer(state, { payload }) {
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
    changeActionRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    cancelActionConfirmReducer(state) {
      return {
        ...state,
        isShowActionConfirm: false,
        isActioning: false,
        actionRemark: '',
        actionText: '',
        isNeedRemark: false,
        url: '',
      };
    },
    clickActionPopUpReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowActionConfirm: true,
      };
    },
    getOrderDetailInit(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickOkPayInfoButtoReducer(state) {
      return {
        ...state,
        isShowPayInfoConfirm: false,
      };
    },
    showPayInfoConfirmReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowPayInfoConfirm: true,
      };
    },
    subOrderInfoButtonOkPending(state) {
      return {
        ...state,
        isSubOrderInfoLoading: true,
      };
    },
    subOrderInfoButtonOkReducer(state) {
      return {
        ...state,
        subOrderId: '',
        logisticsId: '',
        logisticsCompany: '',
        logisticsSn: '',
        logisticsFare: '',
        subOrderInfo: {},
        isSubOrderInfoLoading: false,
        isShowSubOrderInfoConfirm: false,
      };
    },
    subOrderInfoButtonOkErrorReducer(state) {
      return {
        ...state,
        isSubOrderInfoLoading: false,
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
    changeUnloadFareReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLogisticsCompanyReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeOutNumReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    cancelSubOrderInfoReducer(state) {
      return {
        ...state,
        subOrderId: '',
        logisticsId: '',
        logisticsCompany: '',
        logisticsSn: '',
        logisticsFare: '',
        subOrderInfo: {},
        isShowSubOrderInfoConfirm: false,
      };
    },
    showOrdrInfoConfirmReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowSubOrderInfoConfirm: true,
      };
    },
    getOrderDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePurchaseIsTaxReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeEditStateReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        // isEditState: !state.isEditState,
      };
    },
    unmountReducer() {
      return {
        payTypeMap: {},
        payType: '',
        detailType: '',
        purchaseSn: '',
        supplier: '',
        purchaser: '',
        date: '',
        totalOrderGoodsList: [],
        isLoading: false,
        // 子单状态记录--
        subOrderList: [],
        subOrderInfoChange: [],
        isGoodsLoading: false,
        subOrderInfo: {},
        isShowSubOrderInfoConfirm: false,
        isSubOrderInfoLoading: false,
        subOrderId: '',
        logisticsId: '',
        logisticsCompany: '',
        logisticsSn: '',
        logisticsFare: '',
        // 付款信息
        purchaseAmount: 0,
        alreadyPay: 0,
        awaitConfirm: 0,
        awaitPay: 0,
        payList: [],
        payInfo: {},
        isShowPayInfoConfirm: false,
        isPayInfoLoading: false,

        actionList: [],
        isShowActionConfirm: false,
        isActioning: false,
        actionRemark: '',
        actionText: '',
        isNeedRemark: false,
        url: '',

        pageId: '',
        tabStatus: '',
        // 财务备注
        financeRemark: '',
        financeRemarks: [],
        isEditState: false,
        canEdit: false,
        note: "",
        followInfoDetail: {},
        isShowNoticeModal: false,
        noticeOrderList: [],
        bankInfoList: [],
        bankInfoId: "",
        bankDetailId: "",
        bankInfo: "",
        finalBankInfos: [],
        currentBankInfo: {},
        payByCash: {
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
        isAllCash: false,
        isAllDirect: false,
        isAllAgency: false,
        shippingMethodMap: {},
        orderSnMap: [],
        logisticSnId:0,
      };
    },
  },
};
