import { notification } from 'antd';
import { reqInvoiceConfig, reqInvoiceList, reqInvoiceStockList, reqInvGoodsNameList, createInvoiceDetail, createInvoiceGoodsName, reqAwaitInvoiceList, reqAwaitInvoiceDetail, updateInvoiceInfo, invoiceOutStorage } from './invoiceService';

const InvoiceModel = {

  state: {

  },

  effects: {
    // state数据变化
    *updateState({ payload }, { put }) {
      yield put({
        type: 'updateStateReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const res = yield call(reqInvoiceConfig);
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
    // 新增发票明细
    *createInvoiceDetail({ payload }, { put, call }) {
      try {
        const res = yield call(createInvoiceDetail, { ...payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新增发票明细成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
        });
      }
    },
    // 更新发票信息
    *updateInvoiceInfo({ payload }, { put, call }) {
      try {
        console.log('payload ', payload);
        const res = yield call(updateInvoiceInfo, { ...payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '更新发票信息成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
        });
      }
    },
    // 开票请求
    *invoiceOutStorage({ payload }, { put, call }) {
      try {
        const res = yield call(invoiceOutStorage, { ...payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '开票成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
        });
      }
    },
    // 新增发票明细
    *createInvoiceGoodsName({ payload }, { put, call }) {
      try {
        const res = yield call(createInvoiceGoodsName, { ...payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新增发票商品名称成功！',
          });
        }
      } catch (error) {
        yield put({
          type: 'handleRequestRejected',
        });
      }
    },
    // 请求发票进出明细总表
    *getInvoiceList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          invoiceKeywords,
          companyKeywords,
          goodsKeywords,
          invoiceDateStart,
          invoiceDateEnd,
          invoiceSourceType,
          isSuitDetail,
          currentPage,
          pageSize,
          inStorageDateStart,
          inStorageDateEnd,
        } = payload;
        const res = yield call(reqInvoiceList, {
          invoiceKeywords,
          companyKeywords,
          goodsKeywords,
          invoiceDateStart,
          invoiceDateEnd,
          invoiceSourceType,
          isSuitDetail,
          currentPage,
          pageSize,
          inStorageDateStart,
          inStorageDateEnd,
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
    // 请求发票库存表
    *getInvoiceStockList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          goodsKeywords,
          goodsSn,
          invSn,
          invoiceDateStart,
          invoiceDateEnd,
          currentPage,
          pageSize,
          type,
        } = payload;
        const res = yield call(reqInvoiceStockList, {
          goodsKeywords,
          goodsSn,
          invSn,
          invoiceDateStart,
          invoiceDateEnd,
          currentPage,
          pageSize,
          type,
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
    // 拉取发票商品列表
    *reqInvGoodsNameList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          goodsKeywords,
          currentPage,
          pageSize,
        } = payload;
        const res = yield call(reqInvGoodsNameList, {
          goodsKeywords,
          currentPage,
          pageSize,
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
    // 拉取待开票列表
    *reqAwaitInvoiceList({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          status,
          customerKeywords,
          createDateStart,
          createDateEnd,
          sellerId,
          isSuitDetail,
          outInvOrderSn,
          orderSn,
          goodsSn,
          orderCreateDateStart,
          orderCreateDateEnd,
          orderPayDateStart,
          orderPayDateEnd,
          currentPage,
          pageSize,
          invType,
          invDateStart,
          invDateEnd,
        } = payload;
        const res = yield call(reqAwaitInvoiceList, {
          status,
          customerKeywords,
          createDateStart,
          createDateEnd,
          sellerId,
          isSuitDetail,
          outInvOrderSn,
          orderSn,
          goodsSn,
          orderCreateDateStart,
          orderCreateDateEnd,
          orderPayDateStart,
          orderPayDateEnd,
          currentPage,
          pageSize,
          invType,
          invDateStart,
          invDateEnd,
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

    // 拉取待开票列表详情
    *reqAwaitInvoiceDetail({ payload }, { put, call }) {
      yield put({
        type: 'handleRequestPending',
        [payload.LOADING]: true,
      });
      try {
        const {
          id,
        } = payload;
        const res = yield call(reqAwaitInvoiceDetail, {
          id,
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
export default InvoiceModel;
