import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reqInfo, reqDepart, reqConfig } from '../services/dashboard';

export default {
  namespace: 'dashboard',

  state: {
    infoDetail: {
      businessList:[],
      systemList: [],
    },
    departmentListMap: {},    
    cardLoading:false,
  },

  effects: {
    *getInfo({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          cardLoading:true,
        }
      })
       try{
         const res = yield call(reqInfo)
          yield put({
            type:'updatePageReducer',
            payload:{
                infoDetail:res.data,
                cardLoading:false,
            }
          })
       }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            cardLoading:false,
          }
        })
         console.log(err)
       }
    },
    *getConfig({ payload },{ put, call }) {
      try{
        const config = yield call(reqConfig)
        yield put({
          type:'updatePageReducer',
          payload:{
            departmentListMap:config.data.departmentListMap,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    *searchByDepart({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { departmentId, infoDetail } = yield select(state=>state.dashboard)
      try{
        const res = yield call(reqDepart,{departmentId})
        const businessList = res.data;
        infoDetail.businessList = businessList;
         yield put({
           type:'updatePageReducer',
           payload:{
               infoDetail,
           }
         })
      }catch(err) {
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
        infoDetail: {
          businessList:[],
          systemList: [],
        },
        departmentListMap: {},   
        cardLoading:false,         
      };
    },
  },
};
