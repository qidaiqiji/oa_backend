import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { reqSubmit, reqConfig, reqInfo, reqEdit } from '../services/agentAdd.js';

export default {
  namespace: 'agentAdd',

  state: {
    id:'',
    statusMap:{},
    provinceMap:{},
    name:'',
    mobile:'',
    province:'',
    remark:'',
    status:'1',
    provinceId:''
  },

  effects: {
    *getAgentInfo({ payload },{ put, call, select }) {
      console.log("payload",payload)
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { id } = yield select(state=>state.agentAdd)
      try{
        const res = yield call(reqInfo,{ id })
        yield put({
          type:'updatePageReducer',
          payload:{
            ...res.data
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    *getConfig({ payload },{ put, call }) {
      try{
        const res = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            ...res.data,
          }
        })

      }catch(err) {
        console.log(err)
      }

    },
    *handleCommit({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { values,id } = yield select(state=>state.agentAdd);
      try{
        const res = yield call(id?reqEdit:reqSubmit,id?{...values,id}:{...values})
        notification.success({
          message:res.msg
        })
        yield put(routerRedux.push('/customer/agent-list'))        
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
        id:'',
        statusMap:{},
        provinceMap:{},
        name:'',
        mobile:'',
        province:'',
        remark:'',
        status:'1',
        provinceId:''
      };
    },
  },
};
