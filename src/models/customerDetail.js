import moment from 'moment';
import { notification } from 'antd';
import { reqGetOrderList, reqGetConfig, reqCustomerConfig, reqCustomerDetail, reqServiceRecord, updateServiceRecord, newServiceRecord, createServiceTypeReq, deleteRecordReq } from '../services/customerDetail';
import { getServiceList } from '../services/customerServiceManage';

export default {
  namespace: 'customerDetail',

  state: {
    customerPayTypeId: 1,
    customerPayType: [],
    creditTypeId: 1,
    creditType: [],
    hasContract: 0,
    customerId: -1,
    customerTag: [],
    customerInfo: {},
    operateRecord: [],
    serviceList: [],
    orderList: [],
    checkMap: {},
    statusMap: {},
    originMap: {},
    payMethodMap: {},
    payStatusMap: {},
    isGetOrderListing: true,
    detectRecord: [],
    customerTagRecord: [],
    // 筛选项
    checkStatus: -1,
    orderStatus: -1,
    orderOrigin: -1,
    orderStartTime: '',
    orderEndTime: '',
    curPage: 1,
    pageSize: 40,
    total: '',
    isShowImg: false,
    modalImg: '',
    isShowNewServiceRecordModal: false,
    serviceTypeMap: {},
    confirmLoading: false,
    viewServiceRecordId: '',
    viewServiceRecord: {},
    serviceTypeInput: '',
    serviceContentInput: '',
    isShowCreateServiceTypeModal: false,
    createServiceType: '',
    customerTagMap: {},
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getServiceList({ payload }, { call, put }) {
      yield put({
        type: 'getServiceListPending',
      });
      try {
        const serviceListRes = yield call(reqServiceRecord, {
          ...payload,
        });
        yield put({
          type: 'getServiceListResolved',
          payload: {
            serviceList: serviceListRes.data.serviceList,
            total: serviceListRes.data.total,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getServiceListRejected',
        });
      }
    },
    *deleteRecordConfirm({ payload }, { put, call, all }) {
      try {
        yield put({
          type: 'deleteRecordConfirmPending',
        });
        const deleteRes = yield call(deleteRecordReq, { payload });
        if (deleteRes.code === 0) {
          notification.success({
            message: '成功提示',
            description: '删除客勤记录成功！',
          });
          yield put({
            type: 'deleteRecordConfirmResolved',
          });
          yield put({
            type: 'getServiceList',
            payload: {
              customerId: payload.customerId,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        yield put({
          type: 'deleteRecordConfirmRejected',
        });
      }
    },
    *createServiceType({ payload }, { put, call }) {
      try {
        yield put({
          type: 'createServiceTypePending',
        });
        const res = yield call(createServiceTypeReq, { payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新建客勤类型成功！',
          });
          yield put({
            type: 'createServiceTypeResolved',
            payload: {
              ...res.data,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        yield put({
          type: 'createServiceTypeRejected',
        });
      }
    },
    *showCreateServiceTypeModal(_, { put }) {
      yield put({
        type: 'showCreateServiceTypeModalReducer',
      });
    },
    *hideCreateServiceTypeModal(_, { put }) {
      yield put({
        type: 'hideCreateServiceTypeModalReducer',
      });
    },
    *getCreateServiceTypeValue({ payload }, { put }) {
      yield put({
        type: 'getCreateServiceTypeValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getServiceContentValue({ payload }, { put }) {
      yield put({
        type: 'getServiceContentValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getServiceTypeValue({ payload }, { put }) {
      yield put({
        type: 'getServiceTypeValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showServiceRecordDetail({ payload }, { put }) {
      yield put({
        type: 'showServiceRecordDetailReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showDetailImage({ payload }, { put }) {
      yield put({
        type: 'showDetailImageReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showNewServiceRecordModal(_, { put }) {
      yield put({
        type: 'showNewServiceRecordModalReducer',
      });
    },
    *handleCancelServiceRecordModal(_, { put }) {
      yield put({
        type: 'handleCancelServiceRecordModalReducer',
      });
    },
    *newCustomerServiceRecord({ payload }, { put, call }) {
      try {
        yield put({
          type: 'newCustomerServiceRecordPending',
        });
        const response = yield call(newServiceRecord, { payload });
        if (response.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新建客勤记录成功！',
          });
          yield put({
            type: 'newCustomerServiceRecordResolved',
          });
          yield put({
            type: 'getServiceList',
            payload: {
              customerId: payload.customerId,
            },
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        yield put({
          type: 'newCustomerServiceRecordRejected',
        });
      }
    },
    *updateCustomerServiceRecord({ payload }, { put, call }) {
      try {
        yield put({
          type: 'updateCustomerServiceRecordPending',
        });
        const response = yield call(updateServiceRecord, { payload });
        if (response.code === 0) {
          notification.success({
            message: '成功提示',
            description: '更新客勤记录成功！',
          });
          yield put({
            type: 'updateCustomerServiceRecordResolved',
          });
          yield put({
            type: 'getServiceList',
            payload: {
              customerId: payload.customerId,
            },
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        yield put({
          type: 'updateCustomerServiceRecordRejected',
        });
      }
    },
    *hideDetailImage(_, { put }) {
      yield put({
        type: 'hideDetailImageReducer',
      });
    },
    *getConfig({ payload }, { all, call, put }) {
      try {
        const res = yield all([
          call(reqGetConfig),
          call(reqCustomerConfig),
          call(reqCustomerDetail, { ...payload }),
          call(reqServiceRecord, { ...payload }),
        ]);
        if (res[0].code === 0 && res[1].code === 0 && res[2].code === 0 && res[3].code === 0) {
          yield put({
            type: 'getConfigResolved',
            payload: {
              ...res[0].data,
              ...res[1].data,
              ...res[2].data,
              ...res[3].data,
            },
          });
          yield put({
            type: 'getOrderList',
          });
        }
      } catch (error) {
        yield put({
          type: 'getConfigRejected',
        });
      }
    },
    *getOrderList({ payload }, { call, put, select }) {
      yield put({
        type: 'getOrderListPending',
      });
      const {
        customerId,
        checkStatus,
        orderStatus,
        orderOrigin,
        orderStartTime,
        orderEndTime,
        customer,
        consignee,
        selectedRows,
        curPage,
        pageSize,
      } = yield select(state => state.customerDetail);
      try {
        const orderListRes = yield call(reqGetOrderList, {
          customerId,
          checkStatus,
          orderStatus,
          orderOrigin,
          orderStartTime,
          orderEndTime,
          customer,
          consignee,
          selectedRows,
          curPage,
          pageSize,
          ...payload,
        });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            orderList: orderListRes.data.orderList,
            total: orderListRes.data.total,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
  },

  reducers: {
    deleteRecordConfirmPending(state) {
      return {
        ...state,
      };
    },
    deleteRecordConfirmResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    deleteRecordConfirmRejected(state) {
      return {
        ...state,
      };
    },
    createServiceTypeResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        confirmLoading: false,
        isShowCreateServiceTypeModal: false,
      };
    },
    createServiceTypePending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    createServiceTypeRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowCreateServiceTypeModal: false,
      };
    },
    showCreateServiceTypeModalReducer(state) {
      return {
        ...state,
        isShowCreateServiceTypeModal: true,
      };
    },
    hideCreateServiceTypeModalReducer(state) {
      return {
        ...state,
        isShowCreateServiceTypeModal: false,
      };
    },
    getCreateServiceTypeValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceContentValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceTypeValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    showServiceRecordDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowNewServiceRecordModal: true,
        serviceContentInput: payload.viewServiceRecord.content,
        serviceTypeInput: payload.viewServiceRecord.type,
        viewServiceRecordId: payload.viewServiceRecord.id,
      };
    },
    showDetailImageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowImg: true,
      };
    },
    showNewServiceRecordModalReducer(state) {
      return {
        ...state,
        isShowNewServiceRecordModal: true,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceContentInput: '',
        serviceTypeInput: '',
      };
    },
    handleCancelServiceRecordModalReducer(state) {
      return {
        ...state,
        isShowNewServiceRecordModal: false,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceContentInput: '',
        serviceTypeInput: '',
      };
    },
    newCustomerServiceRecordPending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    newCustomerServiceRecordResolved(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    newCustomerServiceRecordRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    updateCustomerServiceRecordPending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    updateCustomerServiceRecordResolved(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    updateCustomerServiceRecordRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    hideDetailImageReducer(state) {
      return {
        ...state,
        isShowImg: false,
      };
    },
    unmountReducer() {
      return {
        customerId: -1,
        customerTag: [],
        customerInfo: {},
        operateRecord: [],
        serviceList: [],
        orderList: [],
        checkMap: {},
        statusMap: {},
        originMap: {},
        payMethodMap: {},
        payStatusMap: {},
        isGetOrderListing: true,

        // 筛选项
        checkStatus: -1,
        orderStatus: -1,
        orderOrigin: -1,
        orderStartTime: '',
        orderEndTime: '',
        customer: '',
        consignee: '',
        curPage: 1,
        pageSize: 40,

        selectedRows: [],
        total: '',
        isShowImg: false,
        modalImg: '',
        isShowNewServiceRecordModal: false,
        serviceTypeMap: {},
        confirmLoading: false,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceTypeInput: '请',
        serviceContentInput: '',
        isShowCreateServiceTypeModal: false,
        createServiceType: '',
        customerTagMap: {},
        detectRecord: [],
        customerTagRecord: [],
      };
    },
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetOrderListing: false,
      };
    },
    getConfigRejected(state) {
      return {
        ...state,
        isGetOrderListing: false,
      };
    },
    getOrderListPending(state) {
      return {
        ...state,
        isGetOrderListing: true,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetOrderListing: false,
      };
    },
    getOrderListRejected(state) {
      return {
        ...state,
        isGetOrderListing: false,
      };
    },
    getServiceListPending(state) {
      return {
        ...state,
        isGetServiceListing: true,
      };
    },
    getServiceListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetServiceListing: false,
      };
    },
    getServiceListRejected(state) {
      return {
        ...state,
        isGetServiceListing: false,
      };
    },
  },
};
