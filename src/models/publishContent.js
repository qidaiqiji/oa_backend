// import moment from 'moment';
import BraftEditor from 'braft-editor';
import {
  reqList, reqConfig, reqaddContent, reqDetailContent, reqBrandList, reqReviseContent, reqUpload
} from '../services/publishContent';
import {
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'publishContent',
  state: {
    previewVisible: false,
    previewImage: '',
    selectedRowIds: [],
    selectedRows: [],
    totalSelectedRowIds: [],
    totalselectedRows: [],
    fileListTotal: [],
    startDate: '',
    endDate: '',
    goodsList: [],
    isLoading: true,
    isShowSearchGoodsModal: false,
    curPage: 1,
    pageSize: 40,
    total: 0,
    goodsInfo: [],
    dindex: '',
    videofile: {},
    filesingle: [],
    brandId: '',
    keywords: '',
    guideText: '',
    guideLink: '',
    goodSn: '',
    authorId: '',
    articleId: '',
    guideData: {},
    version: '',
    brandList: {},
    type: '',
    previewVideo: '',
    previewVisibleVideo: false,
    authorList: {},
    title: '',
    mapFoundList: [],
    mapFoundSpList: [],
    publishTime: '',
    autoPublish: false,
    isShowUploadModal: false,
    foundListAll: [],
    foundSpListAll: [],
    isShowUploadSingleModal: false,
    isShowUploadVideoModal: false,
    isShowWaringModelPublish: false,
    previewVisiblesing: false,
    imgIds: [],
    videoId: '',
    actionType: '',
    isGoodsListFirst:'',
    isOnlyOnSale:1,
    braftFileList: [],
    content:'',
    editorContent: ''
  },
  effects: {
    *getList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        }
      });
      const {
        curPage, pageSize,isOnlyOnSale
      } = yield select(state => state.publishContent);
      try {
        const order = yield call(reqList, {
          curPage, pageSize,isOnlyOnSale,
          ...payload,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            goodsList: order.data.goods,
            isLoading: false,
            total: order.data.total,
            ...payload,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getBrandList({ payload }, { put, select, call }) {
      const brandList = yield call(reqBrandList);
      yield put({
        type: 'getListResolved',
        payload: {
          brandList: brandList.data.brandList,
          ...payload,
        },
      });

    },
    *getConfig({ payload }, { put, call }) {
      const { articleId, type } = payload;
      try {
        const config = yield call(reqConfig);
        const mapFoundList = config.data.foundListAll;
        const mapFoundSpList = config.data.foundSpListAll;
        // 如果是第一次编辑，渲染config里面的数据
        if (articleId === undefined) {
          // 重组配置项数组列表，FoundList添加isTop，topEndTime，isChecked属性。FoundSpList添加endTime，isChecked
          mapFoundList.forEach(item => {
            item.isTop = 0;
            item.topEndTime = '';
            item.isChecked = 0;
          })
          mapFoundSpList.forEach(function (item, index) {
            item.endTime = '';
            item.isChecked = 0;
          })
          yield put({
            type: 'getListResolved',
            payload: {
              authorList: config.data.authorList,
              foundListAll: mapFoundList,
              foundSpListAll: mapFoundSpList,
              articleId,
              type,
              // ...payload,
            },
          });

        } else {
          yield put({
            type: 'getListResolved',
            payload: {
              authorList: config.data.authorList,
              type,
              // ...payload,
            },
          });
        }
      } catch (error) {
        console.log(error)
      }
    },
    *changeProvideRows({ payload }, { put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const { selectedRowIds, selectedRows } = payload;
      const {
        totalselectedRows,
      } = yield select(state => state.publishContent);
      if (totalselectedRows.length + selectedRows.length <= 16) {
        totalselectedRows.push(...selectedRows);
      }
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
          selectedRowIds: [],
          selectedRows: [],
        },
      });
    },
    *changefileList({ payload }, { put, select }) {
      const { fileListTotal } = yield select(state => state.publishContent);
      const { duid } = payload;
      let dindex = fileListTotal.findIndex(item => item.imgId === duid);
      fileListTotal.splice(dindex, 1);
      yield put({
        type: 'getListResolved',
        payload: {
          fileListTotal,
        },
      });
    },
    *viewBigImg({ payload }, { put, select }) {
      const { fileListTotal } = yield select(state => state.publishContent);
      const { vindex } = payload;
      const viewImg = fileListTotal[vindex].url;
      yield put({
        type: 'getListResolved',
        payload: {
          previewImage: viewImg,
          ...payload,
        },
      });
    },
    *changeFoundStatus({ payload }, { put, select }) {
      const { foundId, whichClick, isChecked } = payload;
      const { foundListAll } = yield select(state => state.publishContent);
      foundListAll.forEach(function (item, index) {
        if (item.foundId == foundId) {
          if (whichClick == 'isTop') {
            item.isTop = isChecked ? 1 : 0
            if (isChecked == false) {
              item.topEndTime = ''
            }
          } else if (whichClick == 'isChecked') {
            item.isChecked = isChecked ? 1 : 0
            item.topEndTime = ''
          }
        }
      })
      yield put({
        type: 'getListResolved',
        payload: {
          foundListAll,
        },
      });
    },
    *ChangeSpecialStatus({ payload }, { put, select }) {
      const { foundId, isChecked } = payload;
      const { foundSpListAll } = yield select(state => state.publishContent);
      foundSpListAll.forEach(function (item, index) {
        if (item.foundId == foundId) {
          item.isChecked = isChecked ? 1 : 0
          item.endTime = ''
        }
      })
      yield put({
        type: 'getListResolved',
        payload: {
          foundSpListAll,
        },
      });

    },
    *ChangeFoundEndTime({ payload }, { put, select }) {
      const { foundId, endtime, chaneels } = payload;
      const { foundListAll, foundSpListAll, publishTime, autoPublish } = yield select(state => state.publishContent);
      let changePublishTime = publishTime;
      if (chaneels == 'chaneelsnormal') {
        foundListAll.forEach(function (item, index) {
          if (item.foundId == foundId) {
            item.topEndTime = endtime
          }
        })
      } else if (chaneels == 'chaneelspecial') {
        foundSpListAll.forEach(function (item, index) {
          if (item.foundId == foundId) {
            item.endTime = endtime
          }
        })
      } else if (chaneels == 'chaneelPublish') {
        changePublishTime = endtime
        if (autoPublish == false) {
          changePublishTime = ''
        }
      }
      yield put({
        type: 'getListResolved',
        payload: {
          foundListAll,
          foundSpListAll,
          publishTime: changePublishTime,
        },
      });
    },
    *getListChangeKeyName({ payload }, { put, select }) {
      const { fileListReturn } = payload;
      const { fileListTotal } = yield select(state => state.publishContent);
      const fileListPush = fileListTotal;
     
      if (fileListTotal.length + fileListReturn.length <= 9) {
        fileListPush.push(...fileListReturn)
      }
    
      let result = new Map();
      for (let i = 0; i < fileListPush.length; i++) {
        const row = fileListPush[i];
        if (!result.has([row.imgId])) {
          result.set(row.imgId, row);
        }
      }
      result = [...result.values()];
      yield put({
        type: 'getListResolved',
        payload: {
          fileListTotal: result,
          ...payload,
        },
      });
    },
    *getvideoFaceChange({ payload }, { put, select }) {
      const { videoFace, version } = payload
      const { videofile } = yield select(state => state.publishContent);
      videofile.videoFace = videoFace;
      yield put({
        type: 'getListResolved',
        payload: {
          videofile,
          version,
          ...payload,
        },
      });
    },
    *getContentDetail({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload
        },
      });
      const { videofile, guideText, guideLink, type } = yield select(state => state.publishContent);
      try {
        const res = yield call(reqDetailContent, {
          ...payload
        });
        if (type == 2) {
          const videofileNow = res.data.video;
          videofileNow.videoFace = res.data.videoImg;
        }
        yield put({
          type: 'getListResolved',
          payload: {
            videofile: res.data.video,
            //  videofile: videofileNow,
            title: res.data.title,
            foundListAll: res.data.foundListAll,
            foundSpListAll: res.data.foundSpListAll,
            publishTime: res.data.publishTime,
            fileListTotal: res.data.imgs,
            totalselectedRows: res.data.goodsList,
            videoImg: res.data.videoImg,
            authorId: res.data.authorId,
            guideData: res.data.guideData,
            autoPublish: res.data.publishTime != '' ? true : false,
            guideText: res.data.guideData.guideText,
            guideLink: res.data.guideData.guideLink,
            editorState: BraftEditor.createEditorState(res.data.content),
            ...payload,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    // 上传的参数整理
    *changSubmitContent({ payload }, { put, select, call }) {
      const { isShowWaringModelPublish } = payload
      yield put({
        type: 'getListResolved',
        payload: {
          isShowWaringModelPublish,
        },
      });
      const { autoPublish, articleId, authorId, actionType, guideData, title, type, foundListAll, foundSpListAll, publishTime, guideText, guideLink, imgIds, videoId, videofile, fileListTotal, totalselectedRows, content } = yield select(state => state.publishContent);
      const isalert = foundSpListAll.some(item => {
        return (item.isChecked == true) && (item.endTime == '')
      })
      if (type === '1') {
        if (fileListTotal != '') {
          fileListTotal.map((item, index) => {
            imgIds[index] = item.imgId;
          })
        }
      }
      guideData.guideText = guideText;
      guideData.guideLink = guideLink;
      if ((imgIds.length != 0 || videofile != '' && JSON.stringify(videofile) != "{}") && !isalert && title != '' && foundListAll != '' ) {
        const goodsIds = [];
        totalselectedRows.map((item, index) => {
          goodsIds[index] = item.goodsId
        })

        let foundListAllNow = foundListAll.filter(item => {
          return item.isChecked == 1
        })
        let foundSpListAllNow = foundSpListAll.filter(item => {
          return item.isChecked == 1
        })
        if (articleId != undefined) {
          try {
            const addMessage = yield call(reqReviseContent, {
              authorId,
              articleId,
              title,
              type: +type,
              foundList: foundListAllNow,
              foundSpList: foundSpListAllNow,
              publishTime: autoPublish ? publishTime : '',
              goodsIds,
              videoId: videofile.videoId,
              guideData,
              actionType,
              imgIds,
              content,
            });
            if (addMessage.code == 0) {
              message.info('内容修改成功');
              yield put(
                routerRedux.push('/operation/media/content-manage')
              );
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            const addMessage = yield call(reqaddContent, {
              authorId,
              articleId,
              title,
              type: +type,
              foundList: foundListAllNow,
              foundSpList: foundSpListAllNow,
              publishTime: autoPublish ? publishTime : '',
              goodsIds,
              videoId: videofile.videoId,
              guideData,
              actionType,
              imgIds,
              content,
            });
            if (addMessage.code == 0) {
              if(actionType==1){
                message.info('保存成功');
              }else if(actionType==2){
                message.info('发布成功');
              }     
              yield put(
                routerRedux.push('/operation/media/content-manage')
              );
            }
          } catch (error) {
            console.log(error)
          }
        }

      } else {
        if (isalert) {
          message.warning('请选择截止时间！');
        } else {
          message.warning('请完善信息！');
        }

      }

    },
    *uploadMedia({ payload },{ put, call, select }) {
      const { braftFormData, params } = payload;
      try{
        const res = yield call(reqUpload,{ braftFormData });
        params.success({
            url: res.data.filePath,
            // meta: {
            //   loop: true, // 指定音视频是否循环播放
            //   autoPlay: true, // 指定音视频是否自动播放
            //   controls: true, // 指定音视频是否显示控制栏
            // }
        })
      }catch(err) {
        params.error({
          msg: '上传失败，请稍后重试'
      })
        console.log(err)
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
        previewVisible: false,
        previewImage: '',
        selectedRowIds: [],
        selectedRows: [],
        totalSelectedRowIds: [],
        totalselectedRows: [],
        fileListTotal: [],
        startDate: '',
        endDate: '',
        goodsList: [],
        isLoading: true,
        isShowSearchGoodsModal: false,
        curPage: 1,
        pageSize: 40,
        total: 0,
        goodsInfo: [],
        dindex: '',
        videofile: {},
        filesingle: [],
        keywords: '',
        guideText: '',
        guideLink: '',
        goodSn: '',
        authorId: '',
        articleId: '',
        guideData: {},
        version: '',
        brandList: {},
        type: '',
        previewVideo: '',
        previewVisibleVideo: false,
        authorList: {},
        title: '',
        mapFoundList: [],
        mapFoundSpList: [],
        publishTime: '',
        autoPublish: false,
        isShowUploadModal: false,
        foundListAll: [],
        foundSpListAll: [],
        previewVisiblesing: false,
        isShowUploadSingleModal: false,
        isShowUploadVideoModal: false,
        isShowWaringModelPublish: false,
        imgIds: [],
        videoId: '',
        brandId: '',
        actionType: '',
        isGoodsListFirst:'',
        isOnlyOnSale:1,
        
      };
    },
  },
};

