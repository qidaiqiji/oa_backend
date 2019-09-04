import moment from 'moment';
import {
  reqList, reqGoodsList, reqBrandList, reqDetailContent, reqCreatUser, reqSubmit, reqZhiboConfig,
} from '../services/broadcastRecordDetail';
import {
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'broadcastRecordDetail',
  state: {
    curPage: 1,
    pageSize: 40,
    total: 200,
    realStartAt: moment().add(-7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    realEndAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    fakeStartAt: '',
    fakeEndAt: '',
    isTableLoading: true,
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
    op: '',
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
    isShowUploadVideoModal: false,
    isShowUploadSucaiModal: false,
    UploadVideoVisible: false,
    videofile: [],
    videofileReturn: {},
    videoList: {},
    viewVideovisible: false,
    keywords: '',
    zhuboMap: {},
    // timeIsWrong: false,
    videoId: '',
    id: '',

  },
  effects: {
    *getContentDetail({ payload }, { put, select, call }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload
        },
      });
      const { articleId, imgList, videoList } = yield select(state => state.broadcastRecordDetail);
      try {
        const res = yield call(reqDetailContent, {
          ...payload

        });
        imgList.push({ url: res.data.cover })
        videoList.url = res.data.videoUrl;
        videoList.videoId = res.data.videoId;
        yield put({
          type: 'getListResolved',
          payload: {
            title: res.data.title,
            fakeTotal: res.data.fakeViewerCount,
            totalselectedRows: res.data.goodsList,
            realEndAt: res.data.realEndAt,
            realStartAt: res.data.realEndAt,
            videoList,
            fakeEndAt: res.data.fakeEndAt,
            fakeStartAt: res.data.fakeEndAt,
            totalselectedRows: res.data.goodsList,
            isHot: res.data.isHot == 1 ? true : false,
            realViewerCount: res.data.realViewerCount,
            sortOrder: res.data.sortOrder,
            totalViewerCount: res.data.totalViewerCount,
            keywords: res.data.nickname,
            videoId: res.data.videoId,
            userId: res.data.userInfo.userId,

          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getTableListSort({ payload }, { put, select, call }) {
      const { goodsId, goodsIdsortOrder } = payload;
      const {
        totalselectedRows,
      } = yield select(state => state.broadcastRecordDetail);
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
        id, op, videoId, totalselectedRows, linkGoodsList, title, cover, userId, isHot, sortOrder, realStartAt, realEndAt, fakeStartAt, fakeEndAt, fakeTotal,
      } = yield select(state => state.broadcastRecordDetail);
      if (title == '' || realStartAt == '' || videoId == '') {
        message.warning("请完善必填信息");
        return;
      }
      let arr = [];
      totalselectedRows.map((item, index) => {
        arr.push({ goodsId: item.goodsId, sortOrder: item.sortOrder });
      })
      try {
        if (+op == 1) {
          const res = yield call(reqSubmit, {
            id, showStatus, title, userId, isHot: isHot ? 1 : 0, sortOrder, realStartAt, realEndAt, fakeStartAt, fakeEndAt, fakeTotal,
            linkGoodsList: arr,
          });
          if (res.code == 0) {
            message.info('内容修改成功');
            yield put(
              routerRedux.push('/operation/media/broadcast-manage/broadcast-record-list')
            );
          }
        } else if (+op == 2) {
          message.warning('您当前处于查看状态，不允许修改！');
        } else if (+op == '') {
          const res = yield call(reqSubmit, {
            showStatus, title, userId, isHot: isHot ? 1 : 0, sortOrder, realStartAt, realEndAt, fakeStartAt, fakeEndAt, fakeTotal,
            linkGoodsList: arr,
          });
          if (res.code == 0) {
            message.info('内容修改成功');
            yield put(
              routerRedux.push('/operation/media/broadcast-manage/broadcast-record-list')
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
      } = yield select(state => state.broadcastRecordDetail);
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
      } = yield select(state => state.broadcastRecordDetail);
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
    *getZhiboConfig({ payload }, { put, select, call }) {
      if (payload.keywords === '') {
        yield put({
          type: 'changeZhiboReducer',
        });
        return;
      }
      try {
        const configZhi = yield call(reqZhiboConfig, { keywords: payload.keywords });
        yield put({
          type: 'getListResolved',
          payload: {
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
      } = yield select(state => state.broadcastRecordDetail);
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
        zhuboMap: {},

      };
    },
    unmountReducer() {
      return {
        curPage: 1,
        pageSize: 40,
        total: 200,
        realStartAt: moment().add(-7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        realEndAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        fakeStartAt: '',
        fakeEndAt: '',
        isTableLoading: true,
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
        op: '',
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
        isShowUploadVideoModal: false,
        isShowUploadSucaiModal: false,
        UploadVideoVisible: false,
        videofile: [],
        videofileReturn: {},
        videoList: {},
        viewVideovisible: false,
        keywords: '',
        zhuboMap: {},
        // timeIsWrong: false,
        videoId: '',
        id: '',
      };
    },
  },
};

