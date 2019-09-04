import { reqArea, reqEdit, reqConfig } from '../services/saleArea.js';
export default {
  namespace: 'saleArea',
  state: {
    list:[],
    managerId:'',
    assistantId:'',
    showEditModal:false,
    sellerPhoneMap:{},
    loading:false,
    selectRecord:{}
  },

  effects: {
      *getAreaInfo({ payload },{ put, call }) {
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          })
          try{
              const res = yield call(reqArea)
              yield put({
                type:'updatePageReducer',
                payload:{
                  list:res.data,
                  loading:false,
                }
              })
          }catch(err) {
              yield put({
                type:'updatePageReducer',
                payload:{
                  loading:false,
                }
              })
              console.log(err)
          }
      },
      *getConfig({ payload },{ put, call }) {
        try{
          const res = yield call(reqConfig)
          yield put({
            type:'updatePageReducer',
            payload:{
              sellerPhoneMap:res.data.sellerPhoneMap
            }
          })
        }catch(err) {
            console.log(err)
        }
      },
      *submitEdit({ payload },{ put, call, select }) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
          }
        })
        const { values, selectRecord } = yield select(state=>state.saleArea);
        try{
          const res = yield call(reqEdit,{ ...values, id:selectRecord.id })
          yield put({
            type:'updatePageReducer',
            payload:{
              showEditModal:false,
              selectRecord:{},
            }
          })
          yield put({
            type:'getAreaInfo',
          })
        }catch(err){
          yield put({
            type:'updatePageReducer',
            payload:{
              showEditModal:false,
              selectRecord:{}
            }
          })
          console.log(err)

        }
      }
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
        list:[],
        managerId:'',
        assistantId:'',
        showEditModal:false,
        sellerPhoneMap:{},
        loading:false,
        selectRecord:{}
      };
    },
  },
};
