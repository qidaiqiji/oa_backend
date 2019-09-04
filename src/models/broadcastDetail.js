import moment from 'moment';
import {
  reqConfig, reqZhiboConfig, reqGoodsList, reqBrandList, reqDetailContent, reqCreatUser, reqSubmit, reqSubmitChange
} from '../services/broadcastDetail';
import {
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'broadcastDetail',
  state: {
    curPage: 1,
    pageSize: 40,
    total: 200,
    planStartAt: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    planEndAt: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    fakeStartAt: '',
    fakeEndAt: '',
    isTableLoading: false,
    UploadVisible: false,
    fileList: [],
    isShowUploadSucaiModal: false,
    addGoodsModalVisible: false,
    isGoodsListFirst: '',
    goodsList: [],
    keyVal:'',
    brandList: {},
    // 请求在售商品
    isOnlyOnSale: 1,
    selectedRowIds: [],
    totalselectedRows: [],
    selectedRows: [],
    cover: '',
    newUserModalVisible: false,
    imgList: [],
    viewImgfacevisible: false,
    roomId: '',
    title: '',
    customerName: '',
    mobile: '',
    isSupplier: 0,
    sortOrder: 30000,
    fakeTotal: '',
    // showStatus 给后端传参区分是保存还是发布
    showStatus: '',
    userId: '',
    isHot: 0,
    linkGoodsList: [],
    timeIsWrong: false,
    keywords: '',
    liveRoomList: {},
    op: '',
    id: '',
    zhuboMap:{},

  },
  effects: {
    *getContentDetail({ payload }, { put, select, call }) {
      console.log('ooo2222')
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload
        },
      });
      const { imgList } = yield select(state => state.broadcastDetail);
      try {
        const res = yield call(reqDetailContent, {
          ...payload
        });
        imgList.push({ imgId: res.data.cover, url: res.data.coverImgUrl })
        yield put({
          type: 'getListResolved',
          payload: {
            roomId: res.data.roomId,
            title: res.data.title,
            imgList,
            isHot: res.data.isHot == 1 ? true : false,
            sortOrder: res.data.sortOrder,
            planStartAt: res.data.planStartAt,
            planEndAt: res.data.planEndAt,
            fakeStartAt: res.data.fakeStartAt,
            fakeEndAt: res.data.fakeEndAt,
            fakeTotal: res.data.fakeViewerCount,
            userId: res.data.userInfo.userId, cover: imgList[0].imgId,
            totalselectedRows: res.data.goodsList,
            keywords: res.data.userInfo.nickname,

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
            liveRoomList: config.data.liveRoomList,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getZhiboConfig({ payload }, { put, select, call }) {
      if (payload.keywords === '') {
        yield put({
          type: 'changeZhiboReducer',
          payload:{
            ...payload,
          }
        });
        return;
      }
      try {
        const configZhi = yield call(reqZhiboConfig, { keywords: payload.keywords });
        yield put({
          type: 'getListResolved',
          payload: {
            keywords: payload.keywords,
            zhuboMap: configZhi.data.list,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getSearchResult({ payload }, { put, select }) {
      //  const { reqKeyList } = yield select(state => state.commonPurchaseFollowList);

      yield put({
        type: 'getListResolved',
        payload: {
          userId: payload.keyVal,
          keywords: payload.keywords,
        }
      })
    },
    *getTableListSort({ payload }, { put, select, call }) {
      const { goodsId, goodsIdsortOrder } = payload;
      const {
        totalselectedRows,
      } = yield select(state => state.broadcastDetail);
      totalselectedRows.map(item => {
        if (item.goodsId == goodsId) {
          item.sortOrder = goodsIdsortOrder
        }
      })
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
        },
      });

    },
    *getBroadcastSubmit({ payload }, { put, select, call }) {
      const { showStatus } = payload;
      const {
        id, op, totalselectedRows, imgList, linkGoodsList, roomId, title, cover, userId, isHot, sortOrder, planStartAt, planEndAt, fakeStartAt, fakeEndAt, fakeTotal,
      } = yield select(state => state.broadcastDetail);
      if (roomId == '' || title == '' || planStartAt == '' || userId == '' || imgList.length <= 0) {
        message.warning("请完善必填信息");
        return;
      }
      let arr = [];
      totalselectedRows.map((item, index) => {
        arr.push({ goodsId: item.goodsId, sortOrder: item.sortOrder });
      })
      try {
        if (+op == 1) {
          const res = yield call(reqSubmitChange, {
            id, showStatus, roomId, title, cover: imgList[0].imgId, userId, isHot: isHot ? 1 : 0, sortOrder, planStartAt, planEndAt, fakeStartAt, fakeEndAt, fakeTotal,
            linkGoodsList: arr,
          });
          if (res.code == 0) {
           
            if(+showStatus==1){
              message.info('保存草稿成功');
            }else if(+showStatus==2){
              message.info('内容修改成功');
            } 
            yield put(
              routerRedux.push('/operation/media/broadcast-manage/broadcast-activity-list')
            );
          }
        } else if (+op == 2) {
          message.warning('您当前处于查看状态，不允许修改！');
        } else if (op == '') {
          const res = yield call(reqSubmit, {
            showStatus, roomId, title, cover: imgList[0].imgId, userId, isHot: isHot ? 1 : 0, sortOrder, planStartAt, planEndAt, fakeStartAt, fakeEndAt, fakeTotal,
            linkGoodsList: arr,
          });
          if (res.code == 0) {
            if(+showStatus==1){
              message.info('保存草稿成功');
            }else if(+showStatus==2){
              message.info('内容发布成功');
            }         
            yield put(
              routerRedux.push('/operation/media/broadcast-manage/broadcast-activity-list')
            );
          }
        }

      } catch (error) {
        console.log(error)
      }
    },
    *onChangeCreatUser({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const {
        customerName, mobile, isSupplier
      } = yield select(state => state.broadcastDetail);
      try {
        const res = yield call(reqCreatUser, {
          customerName, mobile, isSupplier: isSupplier ? 1 : 0,
        });
        if (res.code == 0) {

          yield put({
            type: 'getListResolved',
            payload: {
              ...payload,
              userId: res.data.userId,
              keywords: res.data.nickname,


            },
          });
          yield put({
            type: 'getZhiboConfig',
            payload: {
              keywords: customerName,
            },
          });
          message.info('新建成功');
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
      } = yield select(state => state.broadcastDetail);
      // if (totalselectedRows.length + selectedRows.length <= 16) {
      //   totalselectedRows.push(...selectedRows);
      // }
      totalselectedRows.push(...selectedRows);
      totalselectedRows.map(item => {
        item.sortOrder = 30000;
      })
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
          selectedRowIds: [],
          selectedRows: [],
        },
      });
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
    *getvideoFaceChange({ payload }, { put, select }) {
      // const { cover, version } = payload
      // const { cover } = yield select(state => state.publishContent);
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
    },
    *getGoodsList({ payload }, { put, select, call }) {
      // yield put({
      //   type: 'getListResolved',
      //   payload: {
      //     ...payload,
      //   }
      // });
      const {
        curPage, pageSize, isOnlyOnSale
      } = yield select(state => state.broadcastDetail);
      try {
        const order = yield call(reqGoodsList, {
          curPage, pageSize, isOnlyOnSale,
          ...payload,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            goodsList: order.data.goods,
            isTableLoading: false,
            total: order.data.total,
            ...payload,
          },
        });
      } catch (error) {
        console.log(error)
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
    changeZhiboReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        // zhuboMap: {},

      };
    },
    unmountReducer() {
      return {
        curPage: 1,
        pageSize: 40,
        total: 200,
        planStartAt: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        planEndAt: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        fakeStartAt: '',
        fakeEndAt: '',
        isTableLoading: false,
        UploadVisible: false,
        fileList: [],
        isShowUploadSucaiModal: false,
        addGoodsModalVisible: false,
        isGoodsListFirst: '',
        goodsList: [],
        brandList: {},
        // 请求在售商品
        isOnlyOnSale: 1,
        selectedRowIds: [],
        totalselectedRows: [],
        selectedRows: [],
        cover: '',
        newUserModalVisible: false,
        imgList: [],
        viewImgfacevisible: false,
        roomId: '',
        title: '',
        customerName: '',
        mobile: '',
        isSupplier: 0,
        sortOrder: 30000,
        fakeTotal: '',
        // showStatus 给后端传参区分是保存还是发布
        showStatus: '',
        userId: '',
        isHot: 0,
        linkGoodsList: [],
        timeIsWrong: false,
        keywords: '',
        liveRoomList: {},
        op: '',
        id: '',
      };
    },
  },
};

