import { notification ,message} from 'antd';
import moment from 'moment';
import {
  reqGetList,
  reqGetConfig,
  reqUnlockStock,
  reqAddNewStock,
  reqSupplierSuggest,
  reqSearch,
} from '../services/goodsStockFollowList';

export default {
  namespace: 'goodsStockFollowList',

  state: {
    isShowAddNewStockModal:false,
    isShowUnlockModal:false,
    goodsSn: "",
    occupyNum: "",
    expireDate: "",
    remark: "",
    keywords:"",
    occupyType: "",
    expireDateStart: "",
    expireDateEnd: "",
    curPage: 1,
    pageSize: 40,
    createTimeStart: "",
    createTimeEnd: "",
    sort: "",
    orderBy: "",
    goodsList: [],
    stockRecordList: [],
    isTableLoading: true,
    occupyTypeMap: [],
    goodsNoSuggest: [],
    size:99,
    isZhiFa:1,
    userList:{},
    controlPerson:'',
    followPerson:'',
    isLoading:false,
  },

  effects: {
    *getList({ payload },{ put, all, call, select }) {
      yield put({
        type:"updatePageReducer",
        payload:{
          ...payload,
          isTableLoading:true,
        }
      })
      const {
        keywords,
        occupyType,
        expireDateStart,
        expireDateEnd,
        curPage,
        pageSize,
        createTimeStart,
        createTimeEnd,
        sort,
        orderBy,
        isZhiFa,
      }=yield select(state=>state.goodsStockFollowList)
      try{
        const res = yield call(reqGetList,{
              keywords,
              occupyType,
              expireDateStart,
              expireDateEnd,
              curPage,
              pageSize,
              createTimeStart,
              createTimeEnd,
              sort,
              orderBy,
              isZhiFa,
          })
        yield put({
          type: "updatePageReducer",
          payload: {
            ...payload,
            goodsList: res.data.goods,
            total:res.data.total,
            isTableLoading: false,
          }
        })
      }catch(err) {
        console.log(err)
      }

    },
    *getConfig({},{put, call}) {
      try {
        const config = yield call(reqGetConfig);
        yield put({
          type: 'updatePageReducer',
          payload: {
            occupyTypeMap:config.data.occupyType,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    /**---拿到goodslist里面的stockRecordList */
    *resolveGoodsList({ payload },{ put, select }) {
      const { isShowUnlockModal,goodsId } = payload;
      const { goodsList } = yield select(state=>state.goodsStockFollowList);
      const obj = goodsList.filter(item=>+item.goodsId === +goodsId);
      yield put({
        type: 'updatePageReducer',
        payload: {
          isShowUnlockModal,
          stockRecordList:obj[0].stockRecordList,
        }
      })
    },
    /**-----点击解锁的时候发送请求 */
    *unlockGoods({ payload },{ put, call }) {
      const { id } = payload;
      try {
        const res= yield call(reqUnlockStock,{ id });        
        message.success(res.msg);
        yield put({
          type: 'updatePageReducer',
          payload: {
            stockRecordList:res.stockRecordList,
            unlockLoading:false,
          }
        })
      }catch(err) {
        console.log(err)
      }

    },
    /**----新增占用的请求--- */
    *addNewStock({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { goodsSn, expireDate,occupyNum,remark, controlPerson, followPerson } = yield select(state=>state.goodsStockFollowList);
      try {
        const res = yield call(reqAddNewStock,{ goodsSn, expireDate, occupyNum, remark, controlPerson, followPerson});
        if (res.code === 0) { 
          notification.success({
            message: res.msg,
            duration: 2,
          });
        }
        yield put({
          type: 'updatePageReducer',
          payload: {
            goodsSn:"",
            expireDate: "",
            occupyNum: "",
            remark: "",
            controlPerson:"",
            followPerson:""
          }
        })
        yield put({
          type: 'getList'
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
    *searchGoodsNo({ payload },{ put, call, select }) {
      const { isZhiFa, goodsSn } = yield select(state=>state.goodsStockFollowList);
      try {
        const res = yield call(reqGetList,{ pageSize:10, keywords: goodsSn,isZhiFa });
        yield put({
          type:'updatePageReducer',
          payload: {
            goodsNoSuggest:res.data.goods,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    *searchKeywords({ payload },{ put, call }) {
      try{
        const res = yield call(reqSearch,{ keywords:payload.keyWords });
        yield put({
          type:"updatePageReducer",
          payload:{
            userList:res.data.list,
          }
        })

      }catch(err) {

      }
    },

    *unmount({},{ put }) {
      yield put({
          type: "unmountReducer",
      })
    }
  },
  
  reducers: {
    updatePageReducer(state, { payload }){
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        isShowAddNewStockModal:false,
        isShowUnlockModal:false,
        goodsSn: "",
        occupyNum: "",
        expireDate: "",
        remark: "",
        keywords:"",
        occupyType: "",
        expireDateStart: "",
        expireDateEnd: "",
        curPage: 1,
        pageSize: 40,
        createTimeStart: "",
        createTimeEnd: "",
        sort: "",
        orderBy: "",
        goodsList: [],
        stockRecordList: [],
        isTableLoading: true,
        occupyTypeMap: [],
        goodsNoSuggest: [],
        size:99,
        isZhiFa:1,
        userList:{},
        controlPerson:'',
        followPerson:'',
        isLoading:false,
      }
    }
  }
    
};
