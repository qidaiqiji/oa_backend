import { reqCustomerDetail, reqPaymentList, changeGoodsCount, createBill, reqCreditCheckBill, reqSalePaymentDetail, reqSaleStatusMap, addReceiveRecord, addRemark, deletePayRecord } from './billService';
import { notification } from 'antd/lib/index';

const BillModel = {

  state: {

  },

  effects: {
    *getList({ payload }, { put }) {
      yield put({
        type: 'getListReducer',
        payload: {
          ...payload,
        },
      });
    },
    // state数据变化
    *updateState({ payload }, { put }) {
      yield put({
        type: 'updateStateReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 生成对账单
    *createBill({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          goodsInfoList,
          useBalance,
          customerId,
        } = payload;
        const res = yield call(createBill, { goodsInfoList, useBalance, customerId });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
              [payload.LOADING]: false,
            },
          });
          notification.success({
            message: '成功提示',
            description: '生成对账单成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },
    // 更新备注
    *addRemark({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
      });
      try {
        const {
          checkBillId,
          remark,
        } = payload;
        const res = yield call(addRemark, { checkBillId, remark });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
            },
          });
          notification.success({
            message: '成功提示',
            description: '备注更新成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
          },
        });
      }
    },
    // 删除付款流水
    *deletePayRecord({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
      });
      try {
        const {
          payRecId,
        } = payload;
        const res = yield call(deletePayRecord, { payRecId });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
            },
          });
          notification.success({
            message: '成功提示',
            description: '记录删除成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
          },
        });
      }
    },
    // 添加付款记录
    *addReceiveRecord({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          checkBillId,
          financialAccountId,
          payDate,
          payer,
          imageUrl,
          shouldReceiveAmount,
        } = payload;
        const res = yield call(addReceiveRecord, {
          checkBillId,
          financialAccountId,
          payDate,
          payer,
          imageUrl,
          shouldReceiveAmount,
        });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.LOADING]: false,
            },
          });
          notification.success({
            message: '成功提示',
            description: '添加付款记录成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },
    // 请求对账单接口
    *reqCreditCheckBill({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          customerId,
          status,
        } = payload;
        const res = yield call(reqCreditCheckBill, { customerId, status, currentPage: 1, pageSize: 0 });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
              [payload.LOADING]: false,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },
    // 获取配置项接口
    *reqSaleStatusMap({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
      });
      try {
        const res = yield call(reqSaleStatusMap);
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
          },
        });
      }
    },
    // 对账单详情
    *reqSalePaymentDetail({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          checkBillId,
        } = payload;
        const res = yield call(reqSalePaymentDetail, { checkBillId });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
              [payload.LOADING]: false,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },
    *changeGoodsCount({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
      });
      try {
        const {
          goodsInfoList,
          useBalance,
          customerId,
        } = payload;
        const res = yield call(changeGoodsCount, { goodsInfoList, useBalance, customerId });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
          },
        });
      }
    },
    // 获取客户详情数据
    *getCustomerDetail({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
      });
      try {
        const {
          customerId,
        } = payload;
        const res = yield call(reqCustomerDetail, { customerId });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
          },
        });
      }
    },
    *getPaymentList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        payload: {
          [payload.LOADING]: true,
        },
      });
      try {
        const {
          customerId,
          expireStartTime,
          expireEndTime,
          orderStartTime,
          orderEndTime,
          orderSn,
          goodsKeywords,
          pageSize,
          currentPage,
        } = payload;
        const res = yield call(reqPaymentList, {
          customerId,
          expireStartTime,
          expireEndTime,
          orderStartTime,
          orderEndTime,
          orderSn,
          goodsKeywords,
          pageSize,
          currentPage,
        });
        if (res.code === 0) {
          yield put({
            type: 'handleRequestResolved',
            payload: {
              [payload.NAME]: res.data,
              [payload.LOADING]: false,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
          payload: {
            [payload.LOADING]: false,
          },
        });
      }
    },

  },

  reducers: {
    updateStateReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleRequestPending(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    handleRequestResolved(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        ...payload,
      };
    },
    handleRequestRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default BillModel;
