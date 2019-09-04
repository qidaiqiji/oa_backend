import { reqCommit, reqConfig, reqUpload } from '../services/createMessage';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';
export default {
  namespace: 'createMessage',

  state: {
    fileList:[],
    braftFileList: [],
    isShowFeedBackModal: false,
    submitLoading: false,
    departmentMap: {},
    employeeMap: {},
    currentData: {
      consigneeList: [],
      consigneeDepartmentList: [],
      title: '',
      content:'',
    },
    files: [],
    feedBackValues: {},
  },

  effects: {
    *getConfig({ payload },{ put, call }) {
        try{
          const res = yield call(reqConfig)
          yield put({
            type:'updatePageRducer',
            payload:{
              ...res.data,
            }
          })

        }catch(err){
          console.log(err)
        }
    },
    //富文本上传图片
    *uploadMedia({ payload },{ put, call, select }) {
      const { braftFormData, params } = payload;
      try{
        const res = yield call(reqUpload,{ braftFormData });
        params.success({
            url: res.data.filePath,
        })
      }catch(err) {
        params.error({
          msg: '上传失败，请稍后重试'
      })
        console.log(err)
      }
    },
    *handleCommit({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageRducer',
        payload:{
          ...payload,
        }
      })
      const { formData } = yield select(state=>state.createMessage);
      try{
        const res = yield call(reqCommit,{ formData });
        yield put({
          type:'updatePageRducer',
          payload:{
            submitLoading:false,
          }
        })
        notification.success({
          message:res.msg,
        })
        yield put(
          routerRedux.push("/message/message-list")
        )
      }catch(err) {
        yield put({
          type:'updatePageRducer',
          payload:{
            submitLoading:false,
          }
        })
        console.log(err)
      }
    },    
  },

  reducers: {
    
    updatePageRducer(state,{ payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    unmountReducer(state,{ payload }) {
      return {
        fileList:[],
        braftFileList: [],
        isShowFeedBackModal: false,
        submitLoading: false,
        departmentMap: {},
        employeeMap: {},
        currentData: {
          consigneeList: [],
          consigneeDepartmentList: [],
          title: '',
          content:'',
        },
        files: [],
        feedBackValues: {},
      }
    },
    
  }
};
