import moment from 'moment';
import {
  reqList, reqConfig,reqAction,
} from '../services/broadcastActivityList';
import {
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'broadcastActivityList',
  state: {
    currentPage: 1,
    pageSize: 40,
    totalCount: 200,
    isTableLoading: true,
    csStatusMap:'',
    roomId:'',
    title:'',
    keywords:'',
    csStatus:'',
    startTime:moment().add(-30, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    sortType:'',
    orderBy:'',
    list:[],
    sortType:'',
    orderBy:'',
    actionText:'',
    BroadcastActivityList:false,
    id:'',
  },
  effects: {
    *getList({ payload }, { put, select, call }) {
      const {
        currentPage, pageSize, sortType,orderBy,startTime,endTime,
      } = yield select(state => state.broadcastActivityList);
      try {
        const res = yield call(reqList, {
          currentPage, pageSize, sortType,orderBy,startTime,endTime,
          ...payload,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            list:res.data.list,
            totalCount:res.data.count,
            roomId:'',
            title:'',
            keywords:'',
            isTableLoading:false,
            ...payload,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const config = yield call(reqConfig);
        yield put({
          type: 'getListResolved',
          payload: {
            csStatusMap:config.data.csStatusMap,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *confirmAction({ payload },{ put, select, call }) {
      const { id,actionUrl} = yield select(state=>state.broadcastActivityList);
     
      try{
        const res = yield call(reqAction, {url:actionUrl,id:id,});
        if(+res.code === 0) {
          message.success( res.msg, 
          )
          yield put({
            type:'getList'
          })
        }
        yield put({
          type:'getListResolved',
          payload:{
            ...payload,
          }
        })
      }catch(err) {
        yield put({
          type:'getListResolved',
          payload:{
            ...payload,
          }
        })
        console.log(err);
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },
  reducers: {
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,

      };
    },
    unmountReducer() {
      return {
        currentPage: 1,
        pageSize: 40,
        totalCount: 200,
        isTableLoading: true,
        csStatusMap:'',
        roomId:'',
        title:'',
        keywords:'',
        csStatus:'',
        startTime:moment().add(-30, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        sortType:'',
        orderBy:'',
        list:[],
        sortType:'',
        orderBy:'',
        actionText:'',
        BroadcastActivityList:false,
        id:'',
      };
    },
  },
};

