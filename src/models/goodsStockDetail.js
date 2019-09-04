import { notification ,message} from 'antd';
import moment from 'moment';
import {
  reqGetList,
} from '../services/goodsStockDetail';

export default {
  namespace: 'goodsStockDetail',

  state: {
    stockRecordList: [],
    isTableLoading:true,
    goodsSn:"",
    goodsName:"",
    immNum:0,
    canUseNum:0,
    occupyNum:0,
    totalImportNum:0,
    totalExportNum:0,
    totalOrderOccupyNum:0,
    totalManMadeOccupyNum:0,
    createTimeStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
    createTimeEnd: moment().format('YYYY-MM-DD'),
    orderSn: "",
    stockType: ["1","2","3","4"],
    currentPage: 1,
    pageSize: 40,
    total:"",
    id: "",
  },
  effects: {
    *getList({ payload },{ put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          isTableLoading:true,

        }
      })
      const { id, createTimeStart, createTimeEnd, orderSn, stockType, currentPage, pageSize } = yield select(state=>state.goodsStockDetail);
      try{
        const res = yield call(reqGetList,
          {
            id,
            createTimeStart,
            createTimeEnd,
            orderSn,
            stockType,
            currentPage,
            pageSize,
          })
        yield put({
          type: "updatePageReducer",
          payload: {
            ...payload,
            ...res.data,
            isTableLoading: false,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
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
        stockRecordList: [],
        isTableLoading:true,
        goodsSn:"",
        goodsName:"",
        immNum:0,
        canUseNum:0,
        occupyNum:0,
        totalImportNum:0,
        totalExportNum:0,
        totalOrderOccupyNum:0,
        totalManMadeOccupyNum:0,
        createTimeStart: moment().add(-30, 'days').format('YYYY-MM-DD'),
        createTimeEnd: moment().format('YYYY-MM-DD'),
        orderSn: "",
        stockType: ["1","2","3","4"],
        currentPage: 1,
        pageSize: 40,
        total: "",  
        id: "",      
      }
    }
  }
    
};
