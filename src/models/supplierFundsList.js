import { reqGetTotalSupplierFunds, reqGetSupplierList, reqGetAccountFinanceList, reqEditRemark,reqGetConfig } from '../services/supplierFundsList';

export default {
  namespace: 'supplierFundsList',

  state: {
    balancesupplierNum: '',
    balanceTotalAmount: '',
    creditsupplierNum: '',
    creditTotalAmount: '',
    siftsuppliers: [],
    supplierInfos: [],
    supplierName: '',
    isLoading: false,
    keywords: '',
    sort:"",
    orderBy:"",
    remark: "",
    recordId:"",
    purchaserMap:{},
    actionList:[],
    purchaser:'',
    balanceInfoCount:"",
    balanceTotalAmount:"",
    creditInfoCount:"",
    creditTotalAmount:"",
  },

  effects: {
    // 拉取总用户资金
    *getFunds(_, { put, call }) {
      try {
        const res = yield call(reqGetTotalSupplierFunds);
        yield put({
          type: 'configReducer',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'configReducer',
          payload: {
            purchaserMap:res.data.purchaserMap,
          },
        });
      } catch (error) {
        // to do
      }
    },
    
    *resetSupplier(payload, { put }) {
      yield put({
        type: 'resetSupplierReducer',
        payload:{
          ...payload
        }
      });
    },
    *inputChange({ payload }, { put }) {
      yield put({
        type: 'inputChangeReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 搜索客户
    *searchsupplierList({ payload }, { put, call, select }) {
      yield put({
        type: 'searchsupplierListPending',
        payload:{
          ...payload
        }
      });
      const { keywords,purchaser } = yield select(state=>state.supplierFundsList)
      try {
        const res = yield call(reqGetSupplierList, { keywords, purchaser });
        yield put({
          type: 'searchsupplierListResovled',
          payload: {
            accountLists: res.data.accountList,
            actionList:res.data.actionList,
            ...payload,
            ...res.data,
          },
        });
      } catch (error) {
        // to do
        yield put({
          type: 'searchsupplierListRejected',
        });
      }
    },
    *editRemark({ payload },{ call, put, select }) {
      yield put({
        type:'inputChangeReducer',
        payload:{
          ...payload,
        }
      })
      const { recordId, remark } = yield select(state=>state.supplierFundsList)
      try{
        const res = yield call(reqEditRemark,{ supplierId: recordId, remark })
      }catch(err) {
        console.log(err)
      }
    },
    // 对拿到的数据做排序
    *sortGoodsList({ payload },{ put, select }) {  
      yield put({
        type: "configReducer",
         payload: {
            ...payload,
         }
      })
      const { accountLists, sort, orderBy } = yield select(state=>state.supplierFundsList);
      if(sort == 2) {
        accountLists.sort(function(a,b){
            return +a[orderBy] - +b[orderBy];
        })
      }else if(sort == 1) {
        accountLists.sort(function(a,b){
          return +b[orderBy] - +a[orderBy];
        })
      }
      yield put({
        type: "configReducer",
         payload: {
          accountLists,
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
  
    resetSupplierReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        keywords: '',
      };
    },
    inputChangeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchsupplierListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    searchsupplierListResovled(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    searchsupplierListRejected(state) {
      return {
        ...state,
        isLoading: false,
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
        balancesupplierNum: '',
        balanceReceiveTotalAmount: '',
        creditSupplierNum: '',
        creditPayTotalAmount: '',
        supplierInfos: [],
        supplierName: '',
        isLoading: false,
        keywords: '',
        sort:"",
        orderBy:"",
        remark: "",
        recordId:"",
        purchaserMap:{},
        actionList:[],
        purchaser:'',
        balanceInfoCount:"",
        balanceTotalAmount:"",
        creditInfoCount:"",
        creditTotalAmount:"",
      };
    },
  },
};
