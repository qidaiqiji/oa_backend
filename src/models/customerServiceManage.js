import moment from 'moment';
import { notification } from 'antd';
import { reqGetConfig, getCustomerList, getServiceList, newServiceRecord, createServiceTypeReq, deleteRecordReq, updateServiceRecord } from '../services/customerServiceManage';


export default {
  namespace: 'customerServiceManage',

  state: {
    // 参数
    keywords: '',
    startDate: '',
    endDate: '',
    seller: '',
    serviceType: '',
    sellerTeam: '',
    currentPage: 1,
    pageSize: 40,
    customerKeywords: '',
    customerId: '',

    serviceList: [],
    orderEndTime: moment().format('YYYY-MM-DD'),
    isShowNewServiceRecordModal: false,
    confirmLoading: false,
    viewServiceRecordId: '',
    viewServiceRecord: {},
    serviceTypeInput: '',
    customerSelected: '添加绑定客户',
    serviceContentInput: '',
    isShowCreateServiceTypeModal: false,
    createServiceType: '',
    serviceTypeMap: {},
    sellerMap: {},
    sellerTeamMap: {},
    customerList: [],
    isGetServiceListing: true,
    hiddenItem: {},
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getServiceListAll(_, { call, put }) {
      yield put({
        type: 'getServiceListPending',
      });
      try {
        const serviceListRes = yield call(getServiceList, {
          keywords: '',
          startDate: '',
          endDate: '',
          seller: '',
          serviceType: '',
          sellerTeam: '',
          currentPage: 1,
          pageSize: 40,
          customerKeywords: '',
          customerId: '',
        });
        yield put({
          type: 'getServiceListResolved',
          payload: {
            serviceList: serviceListRes.data.serviceList,
            total: serviceListRes.data.total,
            hiddenItem: serviceListRes.data.hiddenItem,
            keywords: '',
            startDate: '',
            endDate: '',
            seller: '',
            serviceType: '',
            sellerTeam: '',
            currentPage: 1,
            pageSize: 40,
            customerKeywords: '',
            customerId: '',
          },
        });
      } catch (error) {
        yield put({
          type: 'getServiceListRejected',
        });
      }
    },
    *getServiceList({ payload }, { call, put, select }) {
      yield put({
        type: 'getServiceListPending',
      });
      const {
        keywords,
        startDate,
        endDate,
        seller,
        serviceType,
        sellerTeam,
        currentPage,
        pageSize,
        customerId,
      } = yield select(state => state.customerServiceManage);
      try {
        const serviceListRes = yield call(getServiceList, {
          keywords,
          startDate,
          endDate,
          seller,
          serviceType,
          sellerTeam,
          currentPage,
          pageSize,
          customerId,
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
    *handleInputChange({ payload }, { put }) {
      yield put({
        type: 'handleInputChangeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getServiceCustomerInput({ payload }, { put, call, select }) {
      try {
        yield put({
          type: 'getServiceCustomerInputPending',
        });
        const { customerSelected } = yield select(state => state.customerServiceManage);
        const res = yield call(getCustomerList, { ...payload });
        yield put({
          type: 'getServiceCustomerInputResolved',
          payload: {
            ...res.data,
            customerKeywords: payload.customerKeywords,
            customerSelected,
          },
        });
      } catch (error) {
        console.log(error);
        yield put({
          type: 'getServiceCustomerInputRejected',
        });
      }
    },
    *deleteRecordConfirm({ payload }, { put, call, all, select }) {
      try {
        yield put({
          type: 'deleteRecordConfirmPending',
        });
        const {
          keywords,
          startDate,
          endDate,
          seller,
          serviceType,
          sellerTeam,
          currentPage,
          pageSize,
          customerId,
        } = yield select(state => state.customerServiceManage);
        const res = yield all([
          call(deleteRecordReq, { payload }),
          call(getServiceList, {
            keywords,
            startDate,
            endDate,
            seller,
            serviceType,
            sellerTeam,
            currentPage,
            pageSize,
            customerId,
          }),
        ]);
        if (res[0].code === 0) {
          notification.success({
            message: '成功提示',
            description: '删除客勤记录成功！',
          });
          yield put({
            type: 'deleteRecordConfirmResolved',
            payload: {
              ...res[1].data,
            },
          });
          yield put({
            type: 'getServiceListAll',
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
    *showServiceRecordDetail({ payload }, { put }) {
      yield put({
        type: 'showServiceRecordDetailReducer',
        payload: {
          ...payload,
        },
      });
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
    *getServiceTypeValue({ payload }, { put }) {
      yield put({
        type: 'getServiceTypeValueReducer',
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
    *getServiceCustomerValue({ payload }, { put }) {
      yield put({
        type: 'getServiceCustomerValueReducer',
        payload: {
          ...payload,
        },
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
            type: 'getServiceListAll',
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
            type: 'getServiceListAll',
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
    *getConfig(_, { all, call, put, select }) {
      yield put({
        type: 'getConfigPending',
      });
      const {
        keywords,
        startDate,
        endDate,
        seller,
        serviceType,
        sellerTeam,
        currentPage,
        pageSize,
        customerKeywords,
        customerId,
      } = yield select(state => state.customerServiceManage);
      try {
        const res = yield all([
          call(reqGetConfig),
          call(getCustomerList, {
            customerKeywords,
          }),
          call(getServiceList, {
            keywords,
            startDate,
            endDate,
            seller,
            serviceType,
            sellerTeam,
            currentPage,
            pageSize,
            customerId,
          }),
        ]);
        yield put({
          type: 'getConfigResolved',
          payload: {
            ...res[0].data,
            ...res[1].data,
            ...res[2].data,
          },
        });
      } catch (error) {
        yield put({
          type: 'getConfigRejected',
        });
      }
    },
  },

  reducers: {
    handleInputChangeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceCustomerInputPending(state) {
      return {
        ...state,
      };
    },
    getServiceCustomerInputResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceCustomerInputRejected(state) {
      return {
        ...state,
      };
    },
    showServiceRecordDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowNewServiceRecordModal: true,
        serviceContentInput: payload.viewServiceRecord.content,
        serviceTypeInput: payload.viewServiceRecord.type,
        customerSelected: payload.viewServiceRecord.customerName,
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
    showNewServiceRecordModalReducer(state) {
      return {
        ...state,
        isShowNewServiceRecordModal: true,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceContentInput: '',
        serviceTypeInput: '',
        customerSelected: '添加绑定客户',
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
        customerSelected: '添加绑定客户',
      };
    },
    getServiceTypeValueReducer(state, { payload }) {
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
    getServiceCustomerValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        customerKeywords: '',
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
    unmountReducer() {
      return {
        // 参数
        keywords: '',
        startDate: '',
        endDate: '',
        seller: '',
        serviceType: '',
        sellerTeam: '',
        currentPage: 1,
        pageSize: 40,
        customerKeywords: '',

        serviceList: [],
        orderEndTime: moment().format('YYYY-MM-DD'),
        isShowNewServiceRecordModal: false,
        confirmLoading: false,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceTypeInput: '',
        customerSelected: '添加绑定客户',
        serviceContentInput: '',
        isShowCreateServiceTypeModal: false,
        createServiceType: '',
        serviceTypeMap: {},
        sellerMap: {},
        sellerTeamMap: {},
        customerList: [],
        isGetServiceListing: true,
        hiddenItem: {},
      };
    },
    getConfigPending(state) {
      return {
        ...state,
        isGetServiceListing: true,
      };
    },
    getConfigResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetServiceListing: false,
      };
    },
    getConfigRejected(state) {
      return {
        ...state,
        isGetServiceListing: false,
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
