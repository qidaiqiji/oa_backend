import { message, notification } from 'antd';
import { 
  reqGalleryList, 
  reqGetConfig, 
  reqUpdateGallery, 
  reqCreateGallery, 
  reqDeleteGallery, 
  reqUpload, 
  reqDeleteVideo, 
  reqUploadVideo,
  reqImgList,
  reqDeleteImgs,
  reqMoveImgs,
  reqVideoList,
  reqUpdateVideo,
  reqChangeTitle,
 } from '../services/sourceManage';

export default {
  namespace: 'sourceManage',
  state: {
    galleryList: [],
    galleryTitle: '',
    isShowLoadModal:false,
    isShowNewGalleryModal:false,
    newGalleryTitle: '',
    fileList: [],
    galleryId:'',
    seletedKey: '',
    isShowConfirmDeleteModal: false,
    createGalleryModal: false,
    modalClose: true,
    videoTitle: '',
    uploadTimeStart: '',
    uploadTimeEnd: '',
    videoList: [],
    isDeleteVideo: false,
    videoId: '',
    isUploadVideo: false,
    videoFileList: [],
    selectedVideoFileList: [],
    coverList: [],
    copied:false,
    imgList: [],
    galleryToImgId: '',
    imgIds: [],
    deleteImgModal: false,
    isChecked: false,
    checkedList: [],
    isAllChecked: false,
    showMoveModal: false,
    imgGalleries: {},
    multipleImgs: false,
    showSlideModal:false,
    currentIndex: '',
    file: [],
    tabKey: '1',
    getVideo:true,
    videoInfo:{},
    beforeOperate: [],
    uploaded: false,
    videoFace: '',
    videoTitle: '',
    imgTitle:'',
    previewVisible: false,
    previewImage: '',
    imgType: '',
    editImgTitle: '',
    selectedImg: '',
    galleryCurrentPage:1,
    galleryPageSize:16,
    imgListCount: '',
    imgPageSize:32,
    imgCurrentPage:1,
    videoListCurrentPage: 1,
    videoListPageSize: 14,
    videoListTotalCount: '',
    successImgIds: [],
    totalDeleteImgId: [],
  },
  effects: {
      *getGalleryList({ payload },{ put, call, select }){
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { galleryTitle, galleryCurrentPage, galleryPageSize } = yield select(state=>state.sourceManage);
            try{
                const res = yield call(reqGalleryList,{ title:galleryTitle, page:galleryCurrentPage, pageSize:galleryPageSize});
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        galleryList: res.data.galleryList,
                        galleryTotalCount:res.data.totalCount,
                    }
                })

            }catch(err) {
                console.log(err)
            }
      },
      *getVideoList({ payload },{ put, call, select }) {
          yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
          })
          const { videoTitle, uploadTimeStart, uploadTimeEnd, videoListCurrentPage, videoListPageSize } = yield select(state=>state.sourceManage);
          try{
              const res = yield call(reqVideoList,{ title:videoTitle, uploadTimeStart, uploadTimeEnd, page: videoListCurrentPage, pageSize:videoListPageSize});
              yield put({
                  type:'updatePageReducer',
                  payload:{
                      videoList: res.data.videoList,
                      videoListTotalCount:res.data.totalCount,
                  }
              })

          }catch(err) {
              console.log(err)
          }
      },
      *getConfig({ payload },{ put, call }) {
        try{
          const config = yield call(reqGetConfig);
          yield put({
              type:'updatePageReducer',
              payload:{
                  imgGalleries: config.data.imgGalleries,
              }
          })

      }catch(err) {
          console.log(err)
      }

      },
      *confirmCreateGallery({ payload },{ put, call, select }) {
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          })
          const { newGalleryTitle, galleryId, seletedKey, modalClose } = yield select(state=>state.sourceManage);
          try{
            if(!modalClose) {
              const res = yield call(reqCreateGallery,{ title: newGalleryTitle });
              if(+res.code === 0) {
                notification.success({
                  message:res.msg,
                })
              }
            }else{
              if(seletedKey) {
                const res = yield call(reqUpdateGallery,{ title: newGalleryTitle, galleryId });
                if(+res.code === 0) {
                  notification.success({
                    message:res.msg,
                  })
                }
              }else{
                const result = yield call(reqCreateGallery,{ title: newGalleryTitle });
                if(+result.code === 0) {
                  notification.success({
                    message:result.msg,
                  })
                }
              }
              yield put({
                  type:'getGalleryList',
              })
            }
            yield put({
              type:'getConfig'
            });
            yield put({
              type:'updatePageReducer',
              payload:{
                  modalClose: true,
                  galleryId: '',
                  newGalleryTitle: '',
                  seletedKey: '',
              }
            })
          }catch(err) {
                yield put({
                  type:'updatePageReducer',
                  payload:{
                      galleryId: '',
                      newGalleryTitle: '',
                      seletedKey: '',
                  }
              })
              console.log(err)
          }
      },
      *confirmUpload({ payload },{ put, select, call }) {
        const { galleryId, file } = yield select(state=>state.sourceManage);
        try{
          const res = yield call(reqUpload,{ galleryId, file })
          if(+res.code ===0){
            notification.success({
              message:res.msg,
            })
          }
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          })
          yield put({
            type:'getGalleryList',
          })
        }catch(err) {
          yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
          })
          console.log(err)
        }
      },
      // 删除相册
      *confirmDeleteGallery({ payload },{put, call, select}) {
        const { galleryId } = yield select(state=>state.sourceManage);
        try{
          const res = yield call(reqDeleteGallery,{ galleryId })
          if(+res.code ===0){
            notification.success({
              message:res.msg,
            })
          }
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          })
          yield put({
            type:'getGalleryList',
          })
          yield put({
            type:'getConfig',
          })
        }catch(err) {
          yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
          })
          console.log(err)
        }
      },
      /**--------------图片部分------------- */
      *getImgList({ payload },{ put, call, select }){
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
          }
        })
        const { galleryToImgId, imgPageSize, imgCurrentPage } = yield select(state=>state.sourceManage);
        try{
          const res = yield call(reqImgList,{ galleryId:galleryToImgId, page:imgCurrentPage, pageSize:imgPageSize });
          let plainOptions = [];
          let imgList = res.data.imgList;
          imgList.map(item=>{
            item.isChecked = false;
            item.isEditTitle = false;
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              imgList,
              plainOptions,
              imgListCount:res.data.totalCount,              
            }
          })
        }catch(err) {
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          });
          console.log(err)
        }

      },
      *deleteImgs({ payload },{ call, select, put }) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
          }
        })
        const { imgIds, checkedList, multipleImgs } = yield select(state=>state.sourceManage);
        if(multipleImgs) {
          checkedList.map(item=>{
            imgIds.push(item.imgId)
          })
        }
        try{
          const res = yield call(reqDeleteImgs,{ imgIds });
          yield put({
            type:'getImgList',
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              multipleImgs: false,
              checkedList: [],
              imgIds: [],
            }
          })

        }catch(err) {
          yield put({
              type:'updatePageReducer',
              payload:{
                payload:{
                  multipleImgs: false,
                  checkedList: [],
                  imgIds: [],
                  ...payload,
                }
              }
            });
            console.log(err)
          }
        },
        *confirmMoveImgs({ payload },{ put, call, select }) {
          const { checkedList, galleryId, multipleImgs, imgIds } = yield select(state=>state.sourceManage);
          if(multipleImgs) {
            checkedList.map(item=>{
              imgIds.push(item.imgId)
            });
          }
          try{
            const res = yield call(reqMoveImgs,{ imgIds, galleryId });
            if(+res.code === 0){
              notification.success({
                message:res.msg,
              })
            }
            yield put({
              type:'getImgList',
            })
            yield put({
              type:'updatePageReducer',
              payload:{
                ...payload,
                imgIds: [],
                checkedList:[]
              }
            });
  
          }catch(err) {
            yield put({
                type:'updatePageReducer',
                payload:{
                  imgIds: [],
                  checkedList:[],
                  ...payload,
                }
              });
              console.log(err)
            }
        },
        *changeImgTitle({ payload },{ put, call, select }) {
          const { editImgTitle,selectedImg, imgList } = yield select(state=>state.sourceManage);
          imgList.map(item=>{
            if(+item.imgId === +selectedImg) {
              item.isEditTitle = false;
            }
          })
          try{
            const res = yield call(reqChangeTitle,{ title:editImgTitle,imgId:selectedImg });
            if(res.code == 0) {
              imgList.map(item=>{
                if(+item.imgId === +selectedImg) {
                  item.title = editImgTitle;
                }
              })
            }
            notification.success({
              message:res.msg,
            })
            yield put({
              type:'updatePageReducer',
              payload:{
                imgList,
              }
            })
          }catch(err) {
            yield put({
              type:'updatePageReducer',
              payload:{
                imgList,
              }
            })
            console.log(err)
          }
        },
      /**------------视频部分---------- */
      *confirmDeleteVideo({ payload },{ call, select, put }) {
        const { videoId } = yield select(state=>state.sourceManage);
        try{
          const res = yield call(reqDeleteVideo,{ videoId });
          if(+res.code === 0){
            notification.success({
              message:res.msg,
            })
          }
          yield put({
            type:'getVideoList',
            payload:{
              ...payload,
            }
          })
        }catch(err) {
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          });
          console.log(err)
        }
      },
      *confirmUploadVideo({ payload },{ call, put, select }) {
        const { videoTitle, videoFace, videoId } = yield select(state=>state.sourceManage);
        try{
          const res = yield call(reqUpdateVideo,{title:videoTitle, videoFace, videoId})
          notification.success({
            message:res.msg,
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
              videoTitle:'',
            }
          });
          yield put({
            type:'getVideoList'
          })
          
        }catch(err) {
          yield put({
            type:'updatePageReducer',
            payload:{
              ...payload,
            }
          });
          console.log(err)
        }
      },
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
        galleryList: [],
        galleryTitle: '',
        isShowLoadModal:false,
        isShowNewGalleryModal:false,
        newGalleryTitle: '',
        fileList: [],
        galleryId:'',
        seletedKey: '',
        isShowConfirmDeleteModal: false,
        createGalleryModal: false,
        modalClose: true,
        videoTitle: '',
        uploadTimeStart: '',
        uploadTimeEnd: '',
        videoList: [],
        isDeleteVideo: false,
        videoId: '',
        isUploadVideo: false,
        videoFileList: [],
        selectedVideoFileList: [],
        coverList: [],
        copied:false,
        imgList: [],
        galleryToImgId: '',
        imgIds: [],
        deleteImgModal: false,
        checkedList: [],
        isAllChecked: false,
        showMoveModal: false,
        imgGalleries: {},
        multipleImgs: false,
        showSlideModal:false,
        currentIndex: '',
        file: [],
        tabKey: '1',
        getVideo:true,
        videoInfo:{},
        coverList: [],
        beforeOperate: [],
        uploaded: false,
        videoFace: '',
        videoTitle: '',
        imgTitle:'',
        previewVisible: false,
        previewImage: '',
        imgType: '',
        editImgTitle:'',
        selectedImg: '',
        galleryCurrentPage:1,
        galleryPageSize:16,
        imgListCount: '',
        imgPageSize:32,
        imgCurrentPage:1,
        videoListCurrentPage: 1,
        videoListPageSize: 14,
        videoListTotalCount: '',
        successImgIds: [],
        totalDeleteImgId: [],
      }
    }
  
  },
};
