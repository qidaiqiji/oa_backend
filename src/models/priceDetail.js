import {
  reqList,
  reqConfig,
  reqGetSuppliers,
} from '../services/priceDetail';

export default {
  namespace: 'priceDetail',

  state: {
        isTableLoading:false,
        currentPage: 1,
        pageSize:50,
        total:0,
        supplierId: '',
        changeTimeStart: '',
        changeTimeEnd: '',
        createBy: '',
        checkBy: '',
        goodsChangeTypeMap: {},
        purchaserMap: {},
        recordList: [],
        goodsSn: "",
        suppliers: [],
        changeType: "",
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
          supplierId,
          changeTimeStart,
          changeTimeEnd,
          createBy,
          checkBy,
          goodsSn,
          changeType,
         } = yield select(state=>state.priceDetail)
        try{
            const res = yield call(reqList,{
              currentPage,
              pageSize,
              supplierId,
              changeTimeStart,
              changeTimeEnd,
              createBy,
              checkBy,
              goodsSn,
              changeType,
            });
            yield put({
              type:'updatePage',
              payload:{
                isTableLoading:false,
                recordList:res.data.recordList,
                total:res.data.total,
                goodsName: res.data.goodsName,
                brandName: res.data.brandName,
                goodsSn: res.data.goodsSn,
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
            ...config.data
          }
        })

      }catch(err){
        console.log(err)
      }
    },
    *getSupplierMap({ payload },{ put, call }) {
      try{
        const res = yield call(reqGetSuppliers);
        yield put({
          type:'updatePage',
          payload:{
            suppliers: res.data.suppliers,
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
        total:0,
        supplierId: '',
        changeTimeStart: '',
        changeTimeEnd: '',
        createBy: '',
        checkBy: '',
        goodsChangeTypeMap: {},
        purchaserMap: {},
        recordList: [],
        goodsSn: "",
        suppliers: [],
        changeType: "",
      };
    }
  },
};
