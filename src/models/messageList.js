import { reqList, reqConfig } from '../services/messageList';
import moment from 'moment';
export default {
  namespace: 'messageList',
  state: {
    publisher: [],
    createBy: [],
    status: "",
    keywords: "",
    pageSize:10,
    currentPage: 1,
    totalInfoList: [],
    publishTime: "",
    startTime: "",
    endTime: "",
    departmentListMap: {},
    employeeMap: {},
    statusMap: {},
    isLoadMore: true,
    cardLoading: false,
  },

  effects: {
    *getList({ payload },{ call, put, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { publisher,createBy, publishTime, status, keywords, pageSize, currentPage, totalInfoList } = yield select(state=>state.messageList)
      try{
        const res = yield call(reqList,{ 
          publisher:publisher.length>0?publisher:"",
          createBy:createBy.length>0?createBy:"",
          startTime:publishTime.length>0?moment(publishTime[0]).format('YYYY-MM-DD'):"",
          endTime:publishTime.length>0?moment(publishTime[1]).format('YYYY-MM-DD'):"",
          status,
          keywords,
          pageSize,
          currentPage,
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            totalInfoList:[...totalInfoList,...res.data.infoList],
            total:res.data.total,
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
        const config = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            ...config.data,
          }
        })
      }catch(err){
        console.log(err)
      }
    }
    
  },

  reducers: {
    updatePageReducer(state,{ payload }) {
      return {
        ...state,
        ...payload
      }
    },
    unmountReducer(state,{ payload }) {
      return {
        publisher: [],
        createBy: [],
        status: "",
        keywords: "",
        pageSize:10,
        currentPage: 1,
        totalInfoList: [],
        publishTime: "",
        startTime: "",
        endTime: "",
        departmentListMap: {},
        employeeMap: {},
        statusMap: {},
        isLoadMore: true,
        cardLoading: false,
      }
    }
  },
};
