import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { reqInfo, reqCommit, reqConfig, reqPosition } from '../services/staffDetail';

export default {
  namespace: 'staffDetail',

  state: {
    infoDetail: {},
    id: '',
    educationMap: {},
    genderMap: {},
    marriageStatusMap:{},
    positionMap: {},
    provinceMap: {},
    statusMap: {},
    politicalStatusMap:{},
    tab1SubmitLoading: false,
    tab2SubmitLoading:false,
    tab3SubmitLoading:false,
    tab4SubmitLoading:false,
    departmentMap: {},
    employeeStatusMap: {},
    jobTypeMap: {},
    employeeContractTypeMap: {},
    backImgUrl: '',
    uploadLoading: false,
    cardLoading: false,
  },

  effects: {
    *getInfoDetail({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      try {
        const res = yield call(reqInfo,{ id: payload.id });
        yield put({
          type:'updatePageReducer',
          payload:{
            infoDetail:res.data,
            cardLoading: false,
          }
        })

      }catch(err){
        yield put({
          type:'updatePageReducer',
          payload:{
            cardLoading: false,
          }
        })
        console.log(err)
      }
    },
    *getConfig({ payload },{ put, call }) {
      try {
        const res = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            ...res.data,
          }
        })

      }catch(err){
        console.log(err)
      }
    },

    *handleCommit({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload
        }
      })
      const { id, values, type, backImgUrl } = yield select(state=>state.staffDetail);
      try {
        const res = yield call(reqCommit,{ ...values, id, type, headImgUrl:backImgUrl});
        notification.success({
          message:res.msg
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            tab1SubmitLoading:false,
            tab2SubmitLoading:false,
            tab3SubmitLoading:false,
            tab4SubmitLoading:false,
          }
        })
      }catch(err){
        yield put({
          type:'updatePageReducer',
          payload:{
            tab1SubmitLoading:false,
            tab2SubmitLoading:false,
            tab3SubmitLoading:false,
            tab4SubmitLoading:false,
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
            positionMap:res.data,
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
        infoDetail: {},
        id: '',
        educationMap: {},
        genderMap: {},
        marriageStatusMap:{},
        positionMap: {},
        provinceMap: {},
        statusMap: {},
        politicalStatusMap:{},
        tab1SubmitLoading: false,
        tab2SubmitLoading:false,
        tab3SubmitLoading:false,
        tab4SubmitLoading:false,
        departmentMap: {},
        employeeStatusMap: {},
        jobTypeMap: {},
        employeeContractTypeMap: {},
        backImgUrl: '',
        uploadLoading: false,
        cardLoading: false,
      };
    },
  },
};
