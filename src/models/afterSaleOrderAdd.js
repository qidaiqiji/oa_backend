import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import {
  reqGetConfig,
  reqGetOrderList,
  reqGetGoodsList,
  reqSaveList,
  reqGetRefundInfo,
  reqGetUpdateOrderList,
  reqSaveUpdateList,
} from '../services/afterSaleOrderAdd';

export default {
  namespace: 'afterSaleOrderAdd',

  state: {
    siftOrderInfos: [],
    orderInfos: [],
    goodsInfos: [],
    refundTypeMap: {},
    orderTypeMap: {},
    refundType: '',
    refundInfo: '',
    isReturn: 0,
    pageId: '',
    specialPrice: '-1',
    isSpecial: 0,
    remark: '',
    isLoading: false,
    type: '',
    backOrderType:'',
    isShowModal:false,
    relateOutInvFollowList:[]
  },

  effects: {
    // 获取页面配置项
    *getConfig({ payload }, { put, call, all, select }) {
      yield put({
        type:'configReducer',
        payload:{
          ...payload,
        }
      })
      const {
        goodsInfos,
        backOrderType
      } = yield select(state => state.afterSaleOrderAdd);
      
      if (payload.orderId) {
        const [goods, refund, order] = yield all([
          call(reqGetGoodsList, { orderId: payload.orderId, backOrderType }),
          call(reqGetRefundInfo, { userId: payload.userId }),
          call(reqGetOrderList, { keywords: payload.orderSn, status: [1, 2, 3, 5] }),
        ]);
        yield put({
          type: 'changeOrderReducer',
          payload: {
            orderId: payload.orderId,
          },
        });
        yield put({
          type: 'changeOrderInfosReducer',
          payload: {
            orderList: order.data.orderList.length>0&&order.data.orderList[0],
            goodsInfos,
          },
        });
        yield put({
          type: 'getGoodsListReducer',
          payload: {
            goodsInfos: goods.data.returnGoodsList,
          },
        });
        yield put({
          type: 'changeRefundInfoReducer',
          payload: {
            refundInfo: refund.data.refundInfo.content,
          },
        });
      }
      if (payload.id) {
        try {
          const [config, order] = yield all([call(reqGetConfig), call(reqGetUpdateOrderList, { backOrderId: payload.id })]);
          yield put({
            type: 'changeOrderInfosReducer',
            payload: {
              orderList: order.data,
              goodsInfos,
            },
          });
          try {
            const goods = yield call(reqGetGoodsList, {
              orderId: order.data.id,
              backOrderId: payload.id,
              
            });
            yield put({
              type: 'getGoodsListReducer',
              payload: {
                goodsInfos: goods.data.returnGoodsList,
              },
            });
          } catch (error) {
            // to do
          }
          const refundTypeArr = Object.keys(config.data.refundTypeMap);
          yield put({
            type: 'changePageOrderInfoReducer',
            payload: {
              pageId: payload.id,
              refundTypeMap: config.data.refundTypeMap,
              orderTypeMap: config.data.orderTypeMap,
              refundType: refundTypeArr[0],
              ...order.data,
            },
          });
        } catch (error) {
          // to do
        }
      } else {
        console.log("backOrderType,",backOrderType,)
        try {
          const config = yield call(reqGetConfig);
          const refundTypeArr = Object.keys(config.data.refundTypeMap);
          yield put({
            type: 'configReducer',
            payload: {
              refundTypeMap: config.data.refundTypeMap,
              orderTypeMap: config.data.orderTypeMap,
              refundType: refundTypeArr[0],
            },
          });
        } catch (error) {
          // to do
        }
      }
    },
    // 搜索订单号
    *searchOrderList({ payload }, { put, call }) {
      const { keywords, status } = payload;
      if (keywords === '') {
        yield put({
          type: 'searchOrderListReducer',
          payload: {
            siftOrderInfos: [],
          },
        });
        return;
      }
      try {
        const res = yield call(reqGetOrderList, { keywords, status });
        yield put({
          type: 'searchOrderListReducer',
          payload: {
            siftOrderInfos: res.data.orderList,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 更换订单
    *changeOrder({ payload }, { put, call, all, select }) {
      yield put({
        type: 'changeOrderReducer',
        payload: {
          orderId: payload.orderId,
        },
      });
      const { backOrderType } = yield select(state=>state.afterSaleOrderAdd);
      try {
        const { goodsData, refundData } = yield all({
          goodsData: call(reqGetGoodsList, { orderId: payload.orderId, backOrderType }),
          refundData: call(reqGetRefundInfo, { userId: payload.userId }),
        });
        yield put({
          type: 'getGoodsListReducer',
          payload: {
            goodsInfos: goodsData.data.returnGoodsList,
            relateOutInvFollowList:goodsData.data.relateOutInvFollowList,
          },
        });
        yield put({
          type: 'changeRefundInfoReducer',
          payload: {
            refundInfo: refundData.data.refundInfo.content,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // 修改各商品的售后数
    *changeBackNum({ payload }, { put }) {
      yield put({
        type: 'changeBackNumReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改各商品的售后金额
    *changeReturnAmount({ payload }, { put }) {
      yield put({
        type: 'changeReturnAmountReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 删除商品
    *deleteGoods({ payload }, { put }) {
      yield put({
        type: 'deleteGoodsReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 改变isSpecial
    *changeIsSpecial({ payload }, { put }) {
      yield put({
        type: 'changeIsSpecialReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 改变协商退款金额
    *changeSpecialPrice({ payload }, { put }) {
      yield put({
        type: 'changeSpecialPriceReducer',
        payload: {
          specialPrice: payload.value,
        },
      });
    },
    // 选择退款方式
    *changeRefundType({ payload }, { put }) {
      yield put({
        type: 'cahngeRefundTypeReducer',
        payload: {
          refundType: payload.value,
        },
      });
    },
    // 选择售后类型
    *getOrderTypeValue({ payload }, { put }) {
      yield put({
        type: 'getOrderTypeValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 更改退款信息
    *changeRefundInfo({ payload }, { put }) {
      yield put({
        type: 'changeRefundInfoReducer',
        payload: {
          refundInfo: payload.value,
        },
      });
    },
    // 更改制单备注
    *changeRemark({ payload }, { put }) {
      yield put({
        type: 'changeRemarkReducer',
        payload: {
          remark: payload.value,
        },
      });
    },
    // 选择是否退货
    *changeIsReturnRadio({ payload }, { put }) {
      yield put({
        type: 'changeIsReturnRadioReducer',
        payload: {
          isReturn: payload.value,
        },
      });
    },
    // 售后单新建提交
    *clickSaveBtn({ payload }, { put, call,select }) {
      const { backOrderType } = yield select(state=>state.afterSaleOrderAdd)
      if (payload.pageId) {
        try {
          yield call(reqSaveUpdateList, { ...payload });
          notification.success({
            message: '成功提示',
            description: '修改售后单成功！',
          });
          yield put({
            type:'configReducer',
            payload:{
              isShowModal:false
            }
          })
          yield put(
            routerRedux.push(
              `/sale/sale-order/after-sale-order-list/after-sale-order-detail/${payload.pageId}/${backOrderType}`
            )
          );
        } catch (error) {
          yield put({
            type:'configReducer',
            payload:{
              isShowModal:false
            }
          })
          // to do
        }
      } else {
        try {
          const res = yield call(reqSaveList, { ...payload });
          notification.success({
            message: '成功提示',
            description: '新建售后单成功！',
          });
          yield put({
            type:'configReducer',
            payload:{
              isShowModal:false
            }
          })
          yield put(
            routerRedux.push(
              `/sale/sale-order/after-sale-order-list/after-sale-order-detail/${res.data.id}/${backOrderType}`
            )
          );
        } catch (error) {
          yield put({
            type:'configReducer',
            payload:{
              isShowModal:false
            }
          })
          // to do
        }
      }
    },
    // 页面结束退出后各状态恢复初始状态
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    changePageOrderInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeOrderInfosReducer(state, { payload }) {
      const orderInfo = [];
      const { orderSn, customer, mobile, saler, id, type } = payload.orderList;
      const goodsInfosAddType = payload.goodsInfos.map((item) => {
        return {
          ...item,
          type,
        };
      });
      const obj = {
        orderSn,
        customer,
        mobile,
        saler,
        id,
      };
      orderInfo.push(obj);
      return {
        ...state,
        orderInfos: orderInfo,
        type,
        goodsInfos: goodsInfosAddType,
      };
    },
    changeIsReturnRadioReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeRefundInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    cahngeRefundTypeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getOrderTypeValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSpecialPriceReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeIsSpecialReducer(state, { payload }) {
      if (!payload.isSpecial) {
        return {
          ...state,
          ...payload,
          specialPrice: '-1',
        };
      }
      return {
        ...state,
        ...payload,
      };
    },
    deleteGoodsReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      for (let i = 0; i < goodsInfos.length; i += 1) {
        if (goodsInfos[i].orderGoodsId === payload.orderGoodsId) {
          goodsInfos.splice(i, 1);
          break;
        }
      }
      return {
        ...newState,
      };
    },
    changeBackNumReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      if (+payload.type !== 3) {
        for (let i = 0; i < goodsInfos.length; i += 1) {
          if (goodsInfos[i].orderGoodsId === payload.orderGoodsId) {
            goodsInfos[i].backNumber = payload.number;
            goodsInfos[i].returnAmount = +(payload.number * goodsInfos[i].price).toFixed(2);
            break;
          }
        }
      } else {
        for (let i = 0; i < goodsInfos.length; i += 1) {
          if (goodsInfos[i].orderGoodsId === payload.orderGoodsId) {
            goodsInfos[i].backNumber = payload.number;
            break;
          }
        }
      }
      return newState;
    },
    changeReturnAmountReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      for (let i = 0; i < goodsInfos.length; i += 1) {
        if (goodsInfos[i].orderGoodsId === payload.orderGoodsId) {
          goodsInfos[i].returnAmount = payload.number;
          break;
        }
      }
      return newState;
    },
    getGoodsListReducer(state, { payload }) {
      const { goodsInfos } = payload;
      for (let i = 0; i < goodsInfos.length; i += 1) {
        goodsInfos[i].backNumber = 0;
        goodsInfos[i].returnAmount = 0;
      }
      return {
        ...state,
        goodsInfos,
        isLoading: false,
      };
    },
    changeOrderReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { siftOrderInfos } = newState;
      let orderInfo = [];
      for (let i = 0; i < siftOrderInfos.length; i += 1) {
        if (+siftOrderInfos[i].id === +payload.orderId) {
          orderInfo = [Object.assign({}, siftOrderInfos[i])];
          break;
        }
      }
      return {
        ...state,
        ...payload,
        orderInfos: orderInfo,
        isLoading: true,
        siftOrderInfos: [],
      };
    },
    searchOrderListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    configReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        siftOrderInfos: [],
        orderInfos: [],
        goodsInfos: [],
        refundTypeMap: {},
        orderTypeMap: {},
        refundType: '',
        refundInfo: '',
        isReturn: 0,
        pageId: '',
        specialPrice: '-1',
        isSpecial: 0,
        remark: '',
        isLoading: false,
        type: '',
        backOrderType:'',
        isShowModal:false,
        relateOutInvFollowList:[]
      };
    },
  },
};
