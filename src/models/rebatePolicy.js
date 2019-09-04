import moment from 'moment';
import {
    reqList,
    reqGetConfig,
    reqSupplierSuggest,
   
} from '../services/rebatePolicy';

export default {
  namespace: 'rebatePolicy',

  state: {
    isTableLoading:false,
    currentPage:1,
    pageSize:50,
    goodsSn:'',
    goodsKeywords:'',
    supplierId:'',
    purchaser:'',
    checkTimeStart:'',
    checkTimeEnd:'',
    brandPolicyList:[],
    purchaserMap:{},
    size:999,
    keywords:'',
    supplierSuggest:[],
    total:0,
   
  },

  effects: {
    *getList({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
                isTableLoading:true,
            }
        })
        const { 
            goodsSn,
            goodsKeywords,
            supplierId,
            purchaser,
            checkTimeStart,
            checkTimeEnd,
            currentPage,
            pageSize,
         } = yield select(state=>state.rebatePolicy);
        try{
            const res = yield call(reqList,{
                goodsSn,
                goodsKeywords,
                supplierId,
                purchaser,
                checkTimeStart,
                checkTimeEnd,
                currentPage,
                pageSize,
            })
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...res.data,
                    isTableLoading:false,
                }
            })
        }catch(err) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    isTableLoading:false,
                }
            })
        }
    },
    *getConfig({ payload },{ put, call, select }) {
        try{
            const config = yield call(reqGetConfig);
            yield put({
                type:'updatePageReducer',
                payload:{
                    purchaserMap:config.data.purchaserMap,
                }
            })
        }catch(err) {
            console.lo0g(err)
        }
    },
    *changeSupplier({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { size, keywords } = yield select(state=>state.rebatePolicy);  
        if(keywords == "") {
            yield put({
                type:'getList',
                payload:{
                    supplierId:''
                }
            })
            return;
        }
        try {
          const res = yield call(reqSupplierSuggest, { keywords,size });
          yield put({
            type: 'updatePageReducer',
            payload: {
              supplierSuggest: res.data.suppliers,
            },
          });
        } catch (error) {
            console.log(error)
        }
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
            isTableLoading:false,
            currentPage:1,
            pageSize:50,
            goodsSn:'',
            goodsKeywords:'',
            supplierId:'',
            purchaser:'',
            checkTimeStart:'',
            checkTimeEnd:'',
            brandPolicyList:[],
            purchaserMap:{},
            size:999,
            keywords:'',
            supplierSuggest:[],
            total:0,
            isTableLoading:false,
            currentPage:1,
            pageSize:50,
            goodsSn:'',
            goodsKeywords:'',
            supplierId:'',
            purchaser:'',
            checkTimeStart:'',
            checkTimeEnd:'',
            brandPolicyList:[],
            purchaserMap:{},
            size:999,
            keywords:'',
            supplierSuggest:[],
            total:0,
        };
    }
  },
};
