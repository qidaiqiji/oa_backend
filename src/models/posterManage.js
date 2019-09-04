import { message, notification } from 'antd';
import { reqGetList, reqGetConfig, reqBrandList, reqAddPoster, reqEditPoster, reqDeletePoster } from '../services/posterManage';
export default {
  namespace: 'posterManage',
  state: {
    authorName: '',
    authorList: [],
    isTableLoading: false,
    isShowAddPosterModal: false,
    fileList: [],
    isEdit: false,
    isDelete: false,
    authorId: '',
    previewVisible: false,
    previewImage: '',
    isShowUploadModal: false,
    brandList: {},
    brandId: '',
    isConveyToDev: false,
    authorImgId: '',
    page:1,
    pageSize:40,
    totalCount:0,
    editImg: '',
  },

  effects: {
    *getList({ payload },{ put, call, select }){
      yield put({
        type: 'updatePageReducer',
        payload:{
          ...payload,
          isTableLoading:true,
        }
      })
      const { authorId, authorName, page, pageSize } = yield select(state=>state.posterManage);
      try{
        const res = yield call(reqGetList,{ authorId, authorName,page, pageSize });
        yield put({
          type: 'updatePageReducer',
          payload:{
            ...res.data,
            isTableLoading:false,
          }
        })

      }catch(err) {
        yield put({
          type: 'updatePageReducer',
          payload:{
            isTableLoading:false,
          }
        })
        console.log(err)
      }
    },
    *getBrandList({ payload },{ put, call }) {
      try{
        const res = yield call(reqBrandList);
        yield put({
          type: 'updatePageReducer',
          payload:{
            brandList:res.data.brandList,
          }
        })

      }catch(err) {
        yield put({
          type: 'updatePageReducer',
          payload:{
            // isTableLoading:false,
          }
        })
        console.log(err)
      }
    },
    *confirmAddPoster({ payload },{put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { authorImgId, brandId, authorName, isEdit, authorId } = yield select(state=>state.posterManage);
      try{
        if(isEdit){
          const res = yield call(reqEditPoster,{ authorId, authorImgId, authorName, brandId});
          if(+res.code === 0) {
            notification.success({
              message:res.msg,
            })
          }
        }else{
          const res = yield call(reqAddPoster,{ authorImgId, authorName, brandId});
          if(+res.code === 0) {
            notification.success({
              message:res.msg,
            })
          }
        }
        yield put({
          type:'updatePageReducer',
          payload:{
            isEdit: false,
            authorName: '',
            brandId: '',
            authorImgId:'',
            authorId: '',
            fileList: [],
            editImg: '',
          }
        })
        yield put({
          type: 'getList',
        })
      }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
            isEdit: false,
            authorName: '',
            brandId: '',
            authorId:'',
            fileList: [],
          }
        })
        console.log(err)
      }
    },
    *confirmDelete({ payload },{ put, call, select }) {
      const { authorId } = yield select(state=>state.posterManage);
      try{
        const res = yield call(reqDeletePoster, { authorId });
        if(+res.code === 0){
          notification.success({
            message:res.msg,
          })
        }
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
            authorId: '',
          }
        })
        yield put({
          type: 'getList',
        })
      }catch(err) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
            authorId: '',
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
        authorName: '',
        authorList: [],
        isTableLoading: false,
        isShowAddPosterModal: false,
        fileList: [],
        isEdit: false,
        isDelete: false,
        authorId: '',
        previewVisible: false,
        previewImage: '',
        isShowUploadModal: false,
        brandList: {},
        brandId: '',
        isConveyToDev: false,
        authorImgId: '',
        page:1,
        pageSize:40,
        totalCount:0,
        editImg: '',
      }
    }
  
  },
};
