import { reqList, reqConfig } from '../services/invoiceAfterSaleList';
export default {
  namespace: 'invoiceAfterSaleList',
  state: {
    invSn: "",
    invCompany: "",
    invoiceSourceType: "",
    financier: "",
    invoiceDateStart: "",
    invoiceDateEnd: "",
    invoiceBackList: [],
    isTableLoading: false,
    financierMap: {},
    backInvSourceTypeMap: {},
    currentPage: 1,
    pageSize: 40,
  },
  effects: {
    *getConfig({  },{ call, put }) {
      try {
        const config = yield call(reqConfig);
        yield put({
          type: 'updatePageReducer',
          payload:{
            backInvSourceTypeMap:config.data.backInvSourceTypeMap,
            financierMap: config.data.financierMap,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: 'updatePageReducer',
        payload:{
            ...payload,
            isTableLoading:true,
        }
      });
      const {
        invSn,
        invCompany,
        invoiceSourceType,
        financier,
        invoiceDateStart,
        invoiceDateEnd,
        currentPage,
        pageSize,
      } = yield select(state => state.invoiceAfterSaleList);
      try {
        const list = yield call(reqList, {
            invSn,
            invCompany,
            invoiceSourceType,
            financier,
            invoiceDateStart,
            invoiceDateEnd,
            currentPage,
            pageSize,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...payload,
            ...list.data,
            isTableLoading: false,
          },
        });
      } catch (error) {
        yield put({
          type: 'updatePageReducer',
        });
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    
  },

  reducers: {
    updatePageReducer(state,{ payload }) {
        return {
            ...state,
            ...payload,
        }
    },
    unmountReducer() {
      return {
        invSn: "",
        invCompany: "",
        invoiceSourceType: "",
        financier: "",
        invoiceDateStart: "",
        invoiceDateEnd: "",
        invoiceBackList: [],
        isTableLoading: false,
        financierMap: {},
        backInvSourceTypeMap: {},
        currentPage: 1,
        pageSize: 40,
      };
    },
  },
};
