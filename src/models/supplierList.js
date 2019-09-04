import {
  reqGetSupplierSuggests,
  reqGetSuppliers,
  reqForbiddenSupplier,
  reqStartupSupplier,
} from '../services/supplierList';

export default {
  namespace: 'supplierList',

  state: {
    keywords: '',
    id: null,
    status: -1,
    curPage: 1,
    isLoading: true,
    isOperaing: false,
    isShowOperaModal: false,
    supplierSuggests: [],

    suppliers: [],
    isShowUploadModal: false,
    isUploading: false,
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    // 改变 status
    *searchSupplierStatus({ payload }, { put }) {
      yield put({
        type: 'searchSupplierStatusReducer',
        payload: {
          status: payload.status,
        },
      });
      yield put({
        type: 'getSupplierList',
        payload: {
          curPage: 1,
        },
      });
    },
    // 通过 select 搜索列表
    *searchSupplierId({ payload }, { put }) {
      yield put({
        type: 'searchSupplierIdReducer',
        payload: {
          id: payload.id,
          keywords: null,
        },
      });
      yield put({
        type: 'getSupplierList',
        payload: {
          curPage: 1,
        },
      });
    },
    // 改变 keywords 值
    *changeSupplierKeyword({ payload }, { put, call }) {
      yield put({
        type: 'changeSupplierKeywordPending',
        payload: {
          ...payload,
        },
      });
      try {
        const res = yield call(reqGetSupplierSuggests, { ...payload });
        yield put({
          type: 'changeSupplierKeywordResolved',
          payload: {
            supplierSuggests: res.data.suppliers,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 通过回车的方式搜索 suppliers
    *searchSupplierKeyword({ payload }, { put }) {
      yield put({
        type: 'searchSupplierKeywordReducer',
        payload: {
          keywords: payload.keywords,
          id: null,
        },
      });
      yield put({
        type: 'getSupplierList',
        payload: {
          curPage: 1,
        },
      });
    },
    // 改变页码
    *changePage({ payload }, { put }) {
      yield put({
        type: 'changePageReducer',
        payload: {
          curPage: payload.curPage,
        },
      });
      yield put({
        type: 'getSupplierList',
        payload: {
          curPage: payload.curPage,
        },
      });
    },
    // 获取列表
    *getSupplierList({ payload }, { put, call, select }) {
      yield put({
        type: 'getSupplierPending',
        payload: {
          ...payload,
        },
      });
      const { id, keywords, status } = yield select(state => state.supplierList);
      try {
        const res = yield call(reqGetSuppliers, {
          id,
          keywords,
          status,
          curPage: payload.curPage || 1,
        });
        yield put({
          type: 'getSupplierResolved',
          payload: {
            ...res.data,
            curPage: payload.curPage,
          },
        });
      } catch (error) {
        // console.log('bbb');
      }
    },
    *triggerOperaSupplier({ payload }, { put }) {
      yield put({
        type: 'triggerOperaSupplierReducer',
        payload: {
          ...payload,
        },
      });
    },
    *okOperaSupplier(_, { put, call, select }) {
      yield put({
        type: 'okOperaSupplierPending',
      });
      const { supplierStatus, supplierId, curPage } = yield select(
        state => state.supplierList
      );
      try {
        if (+supplierStatus === 1) {
          yield call(reqForbiddenSupplier, { id: supplierId });
        }
        if (+supplierStatus === 0) {
          yield call(reqStartupSupplier, { id: supplierId });
        }
        yield put({
          type: 'okOperaSupplierResolved',
        });
        yield put({
          type: 'getSupplierList',
          payload: {
            curPage,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *clickImportButton(_, { put }) {
      yield put({
        type: 'clickImportButtonReducer',
      });
    },
    *clickCancleImportButton(_, { put }) {
      yield put({
        type: 'clickCancleImportButtonReducer',
      });
    },
    *uploadingSupplierList(_, { put }) {
      yield put({
        type: 'uploadingSupplierListReducer',
      });
    },
    *updateSupplierList(_, { put }) {
      yield put({
        type: 'getSupplierList',
        payload: {
          curPage: 1,
        },
      });
    },
  },

  reducers: {
    unmountReducer() {
      return {
        keywords: '',
        id: null,
        status: -1,
        curPage: 1,
        isLoading: true,
        isOperaing: false,
        supplierSuggests: [],

        suppliers: [],
        isShowUploadModal: false,
        isUploading: false,
      };
    },
    uploadingSupplierListReducer(state) {
      return {
        ...state,
        // isLoading: true,
      };
    },
    clickCancleImportButtonReducer(state) {
      return {
        ...state,
        isShowUploadModal: false,
      };
    },
    clickImportButtonReducer(state) {
      return {
        ...state,
        isShowUploadModal: true,
      };
    },
    searchSupplierStatusReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchSupplierIdReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchSupplierKeywordReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSupplierKeywordPending(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSupplierKeywordResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getSupplierPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    getSupplierResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        supplierSuggests: [],
        isLoading: false,
      };
    },
    triggerOperaSupplierReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowOperaModal: !state.isShowOperaModal,
      };
    },
    okOperaSupplierPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isOperaing: true,
      };
    },
    okOperaSupplierResolved(state) {
      return {
        ...state,
        isOperaing: false,
        isShowOperaModal: false,
      };
    },
  },
};
