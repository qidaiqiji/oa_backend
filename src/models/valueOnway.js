import moment from 'moment';
import {
  reqList, reqProList, reqAmount, reqConfig, reqBrandList
} from '../services/valueOnway';

export default {
  namespace: 'valueOnway',

  state: {
    pageSize: 40,
    pageSize2: 40,
    isTableLoading: true,
    isTableLoadingPro: true,
    curPage: 1,
    curPage2: 1,
    startDate: '',
    isZhifa: 1,
    endDate: '',
    orderList: [],
    // 总数量
    total: 0,
    total2: 0,
    sellerMap: '',
    goodsList: [],
    goodsData: [],
    receivingStockAmount: '',
    orderId: '',
    goodsKeywords: '',
    keywords: '',
    purchaser: '',
    activeKey: 1,
    totalAmount: [],
    goodsStatusMap: {},
    status: '0',
    actionList: [],
    brandListMap: {},
    brandId:"",
    onWayActionList:[]
  },

  effects: {
    *searchList({ payload }, { put }) {
      yield put({
        type: "changeSyncItemReducer",
        payload: {
          ...payload,

        }
      })
      yield put({
        type: "getList",
        payload: {
          ...payload,
        }
      })
    },

    *changeDate({ payload }, { put }) {
      yield put({
        type: 'getList',
        payload,
      });
    },
    *getList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListPending',
        payload:{
          ...payload,
          isTableLoading: true,
        }

      });
      const {
        pageSize2,
        curPage2,
        startDate,
        goodsKeywords,
        purchaser,
        orderId,
        endDate,
        isZhifa,

      } = yield select(state => state.valueOnway);
      try {
        const order = yield call(reqList, {
          pageSize: pageSize2,
          curPage: curPage2,
          startDate,
          endDate,
          goodsKeywords,
          purchaser,
          orderId,
          isZhifa,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            orderList: order.data.purchaseOrderList,
            sellerMap: order.data.purchaserMap,
            receivingStockAmount: order.data.receivingStockAmount,
            total2: order.data.total,
            onWayActionList:order.data.actionList,
            ...payload,
          },
        });
      } catch (error) {
        console.log(error)
      }
    },
    *getProList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListPending',
        payload:{
          ...payload,
          isTableLoadingPro: true,
        }
      });
      const {
        pageSize,
        curPage,
        isZhifa,
        keywords,
        sort,
        orderBy,
        status,
        brandId,
      } = yield select(state => state.valueOnway);
      try {
        const proList = yield call(reqProList, {
          pageSize,
          curPage,
          isZhifa,
          keywords,
          sort,
          orderBy,
          status,
          brandId,
        });
        yield put({
          type: 'getListResolvedPro',
          payload: {
            goodsList: proList.data.goods,
            goodsData: proList.data,
            total: proList.data.total,
            actionList:proList.data.actionList,
            ...payload,
            //   purchaserMap: config.data.purchaserMap,
            //   paymentMethod :config.data.paymentMethod
          },
        });
      } catch (error) {
        //   yield put({
        //     type: 'getListRejected',
        //   });
      }
    },
    *getConfig({ payload },{ put, call, all }){
      try{
        const [config, brandConfig] = yield all([
          call(reqConfig),
          call(reqBrandList)
        ]);
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            ...config.data,
            brandListMap: brandConfig.data.brandListMap,
          }
        })

      }catch(err){

      }
      
    },
    *totalGoodsAmount({ payload }, { put, select, call }) {

      try {
        const Amount = yield call(reqAmount, {

        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalAmount: Amount.data.totalgoodsAmount,
            ...payload,

          },
        });
      } catch (error) {
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
        isTableLoading: false,
      };
    },
    getListResolvedPro(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoadingPro: false,
      };
    },
    changeSyncItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        // isTableLoading: false,
      };

    },
    // 获取列表中
    getListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        
        
      };
    },
    unmountReducer() {
      return {
        pageSize: '',
        pageSize2: '',
        curPage: '',
        curPage2: '',
        isZhifa: '',
        startDate: '',
        endDate: '',
        orderList: [],
        // 总数量
        total: '',
        total2: '',
        sellerMap: '',
        goodsList: [],
        goodsData: [],
        receivingStockAmount: '',
        orderId: '',
        goodsKeywords: '',
        keywords: '',
        purchaser: '',
        activeKey: '',
        totalAmount: [],
        goodsStatusMap: {},
        status: '0',
        actionList: [],
        brandListMap: {},
        brandId:"",
        onWayActionList:[]
      };
    },
  },
};
