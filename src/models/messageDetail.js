import { reqInfo, reqExecute, reqComment, reqConfig } from '../services/messageDetail';
import { notification } from 'antd';

export default {
  namespace: 'messageDetail',

  state: {
    id:"",
    consigneeList: [],
    packageList: [],
    readerList:[],
    isExecute:false,
    commentList: [],
    taskStartTime: "",
    taskEndTime: "",
    content: "",
    replyId: "",
    buttonLoading:false,
    replyButtonLoading: false,
    showCommentModal: false,
    replyId: '',
    replyComment: '',
    comment:'',
    employeeMap: {},
    infoDetail:{
      consigneeList:[],
      packageList: [],
      commentList: [],
      readerList:[],
    },
    actionList:[],
    performLoading: false,
  },

  effects: {
    *getInfo({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { id } = yield select(state=>state.messageDetail);
      try{
        const res = yield call(reqInfo,{ id });
        yield put({
          type:'updatePageReducer',
          payload:{
            infoDetail:res.data.detail,
            actionList: res.data.actionList,
          }
        })

      }catch(err) {
        console.log(err)

      }
    },
    *getConfig({ paylaod },{ put, call }) {
      try{
        const config = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            employeeMap:config.data.employeeMap,
          }
        })

      }catch(err){

      }
    },
    *toggleExecute({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { id, operationUrl } = yield select(state=>state.messageDetail);
      try{
        const res = yield call(reqExecute,operationUrl,{ id });
        notification.success({
          message:res.msg,
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            performLoading: false,
          }
        })
        yield put({
          type:'getInfo',
        })
      }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            performLoading: false,
          }
        })
        console.log(err)
      }
    },
    *commitComment({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { comment, replyId, id, isReply, replyComment } = yield select(state=>state.messageDetail);
      try{
        const res = yield call(reqComment,{ content:isReply?replyComment:comment, replyId:isReply?replyId:'0', infoId:id })
        yield put({
          type:'getInfo',
          payload:{
            comment:'',
            replyButtonLoading:false,
            buttonLoading: false,
            showCommentModal:false,
            replyComment:'',
            isReply:false,
          }
        })
      }catch(err){
        yield put({
          type:'updatePageReducer',
          payload:{
            comment:'',
            buttonLoading:false,
            replyButtonLoading:false,
            replyComment:'',
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
    unmountReducer(state,{ payload }) {
      return {
        id:"",
        consigneeList: [],
        packageList: [],
        readerList:[],
        isExecute:false,
        commentList: [],
        taskStartTime: "",
        taskEndTime: "",
        content: "",
        replyId: "",
        buttonLoading:false,
        replyButtonLoading: false,
        showCommentModal: false,
        replyId: '',
        replyComment: '',
        comment:'',
        employeeMap: {},
        infoDetail:{
          consigneeList:[],
          packageList: [],
          commentList: [],
          readerList:[],
        },
        actionList:[],
        performLoading: false,
      }
    },
    
  },
};
