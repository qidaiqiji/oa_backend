import {
  reqList,
  reqConfig,

} from '../services/supplierCheckList';

export default {
  namespace: 'supplierCheckList',

  state: {
    isTableLoading:false,
    currentPage: 1,
    pageSize:50,
    purchaseSupplierId:'',
    checkTimeStart: '',
    checkTimeEnd: '',
    purchaser: '',
    changeType: '',
    supplierInfoList: [],
    total: 0,
    supplierChangeType:{},
    purchaserMap: {},
  },

  effects: {
    *getList({ payload },{ put, call, select }) {
        yield put({
          type:'updatePage',
          payload:{
              ...payload,
              isTableLoading:true,
          }
        })
        const { 
          currentPage,
          pageSize,
          purchaseSupplierId,
          checkTimeStart,
          checkTimeEnd,
          purchaser,
          changeType,
        } = yield select(state=>state.supplierCheckList)
        try{
            const res = yield call(reqList,{
              currentPage,
              pageSize,
              purchaseSupplierId,
              checkTimeStart,
              checkTimeEnd,
              purchaser,
              changeType,
            })
            yield put({
              type:'updatePage',
              payload:{
                supplierInfoList:res.data.supplierInfoList,
                total:res.data.total,
                isTableLoading:false,
              }
            })

        }catch(err) {
          yield put({
            type:'updatePage',
            payload:{
                isTableLoading:false,
            }
          })
          console.log(err)
        }
    },
    *getConfig({ payload },{ put, call }) {
      try{
        const config = yield call(reqConfig);
        yield put({
          type:'updatePage',
          payload:{
            ...config.data,
          }
        })

      }catch(err){
        console.log(err)
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    
  },

  reducers: {
    updatePage(state,{ payload }) {
        return {
            ...state,
            ...payload,
        }
    },
    unmountReducer() {
      return {
        isTableLoading:false,
        currentPage: 1,
        pageSize:50,
        purchaseSupplierId:'',
        checkTimeStart: '',
        checkTimeEnd: '',
        purchaser: '',
        changeType: '',
        supplierInfoList: [],
        total: 0,
        supplierChangeType:{},
        purchaserMap: {},
      };
    }
  },
};
