import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reqList, reqCommit, reqConfig, reqPosition, reqSearchByPhone } from '../services/staffList';

export default {
  namespace: 'staffList',

  state: {
    id:"",
    jobNumber: "",
    mobilePhone: "",
    name: "",
    position:"",
    birthdayStart: "",
    birthdayEnd :"",
    entryTimeStart: "",
    entryTimeEnd: "",
    status:"",
    pageSize: 40,
    currentPage: 1,
    showEditModal: false,
    employeeList:[],
    total:0,
    buttonLoading:false,
    positionMap: {},
    searchPositionMap: {},
    departmentMap: {},
    statusMap:{},
    tableLoading:false,
    actionList:[],
    isLoading:false,
    name: '',
    values:{},
    currentValue: {},
  },

  effects: {
    *getConfig({ payload },{ put, call }) {
      try{
        const config = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            positionMap:config.data.positionMap,
            departmentMap:config.data.departmentMap,
            statusMap: config.data.statusMap,
          }
        })

      }catch(err) {
        console.log(err)
      }

    },
    *getList({ payload },{ put, call, select }) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
            tableLoading: true,
        }
      })
      const { 
        id,
        jobNumber,
        mobilePhone,
        name,
        position,
        birthdayStart,
        birthdayEnd,
        entryTimeStart,
        entryTimeEnd,
        status,
        pageSize,
        currentPage,
       } = yield select(state=>state.staffList)
       try{
         const res = yield call(reqList,{ 
            id, 
            jobNumber, 
            mobilePhone,
            name, 
            position, 
            birthdayStart, 
            birthdayEnd, 
            entryTimeStart, 
            entryTimeEnd, 
            status,
            pageSize,
            currentPage
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              ...res.data,
              tableLoading:false,
            }
          })
       }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            tableLoading:false,
          }
        })
         console.log(err)
       }
    },
    *searchByPhone({ payload },{ put, call, select }) {
      try{
        const res = yield call(reqSearchByPhone,{ mobilePhone: payload.mobilePhone })
        yield put({
          type:'updatePageReducer',
          payload:{
            name:res.data.userName,
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
      const { values, entryTime } = yield select(state=>state.staffList)
      try{
        const res = yield call(reqCommit,{ ...values, entryTime })
        notification.success({
          message:res.msg
        })
        yield put({
          type:'getList',
          payload:{
            name:'',
            status:'',
          }
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            buttonLoading:false,
            showEditModal: false,
          }
        })
      }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            buttonLoading:false,
            showEditModal: false,
          }
        })
        console.log(err)
      }
    },
    *getPosition({ payload },{ put, call }) {
      yield put({
        type:'updatePageReducer',
        paylaod:{
          ...payload,
        }
      })
      try {
        const res = yield call(reqPosition,{ id: payload.id});
        yield put({
          type:'updatePageReducer',
          payload:{
            searchPositionMap:res.data,
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
        ...payload,
      }
    },   
    unmountReducer() {
      return {
        id:"",
        jobNumber: "",
        mobilePhone: "",
        name: "",
        position:"",
        birthdayStart: "",
        birthdayEnd :"",
        entryTimeStart: "",
        entryTimeEnd: "",
        status:"",
        pageSize: 40,
        currentPage: 1,
        showEditModal: false,
        employeeList: [],
        total:0,
        buttonLoading:false,
        positionMap: {},
        searchPositionMap: {},
        departmentMap: {},
        statusMap:{},
        tableLoading:false,
        actionList:[],
        isLoading:false,
        name: '',
        values:{},
        currentValue: {},
      };
    },
  },
};
