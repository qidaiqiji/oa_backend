// import moment from 'moment';
import {
  reqPurList, selectList,
} from '../services/purchaseAccountPeriod';

export default {
  namespace: 'purchaseAccountPeriod',
  state: {
    appliedNotPayTotalMoney: '',
    expiredTotalMoney: '',
    shouldPayTotalMoney: '',
    supplierList: [],
    supplierKeyWords: '',
    orderId: '',
    supplierName: '',
    creditSupplierStatus: 1,
    size: 10,
    curPage: 1,
    total: '',
    isTableLoadingOrd: true,
    supplierPayMap: '',
    payType: 2,
    actionList: [],
    orderBy: "",
    sort:"",
    purchaserMap:{},
    purchaser:'',
    goodsKeyWords:'',
    orderSn:'',
    brandId:'',
    brandListMap:{}
  },
  effects: {
    *getList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListPending',
        payload:{
          ...payload,
        }
      });
      const {
        supplierKeyWords,
        orderId,
        curPage,
        size,
        supplierName,
        creditSupplierStatus,
        payType,
        sort,
        orderBy,
        purchaser,
        goodsKeyWords,
        brandId
      } = yield select(state => state.purchaseAccountPeriod);
      try {
        const PurList = yield call(reqPurList, {
          supplierKeyWords,
          orderId,
          size,
          curPage,
          supplierName,
          creditSupplierStatus,
          payType,
          sort,
          orderBy,
          purchaser,
          goodsKeyWords,
          brandId
        });
        yield put({
          type: 'getListResolved',
          payload: {
            appliedNotPayTotalMoney: PurList.data.appliedNotPayTotalMoney,
            expiredTotalMoney: PurList.data.expiredTotalMoney,
            shouldPayTotalMoney: PurList.data.shouldPayTotalMoney,
            supplierList: PurList.data.supplierList,
            total: PurList.data.total,
            actionList: PurList.data.actionList,
          },
        });
        yield put({
          type: 'getListOver',
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getSelectList({ payload }, { put, call }) {
      try {
        const selectData = yield call(selectList, {
        });
        yield put({
          type: 'getListResolved',
          payload: {
            supplierPayMap: selectData.data.supplierPayMap,
            purchaserMap: selectData.data.purchaserMap,
            brandListMap:selectData.data.brandListMap,
          },
        });
      } catch (error) {
        console.log(error);
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
    getListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isTableLoadingOrd: true,
      };
    },
    getListOver(state) {
      return {
        ...state,
        isTableLoadingOrd: false,
      };
    },
    unmountReducer() {
      return {
        appliedNotPayTotalMoney: '',
        expiredTotalMoney: '',
        shouldPayTotalMoney: '',
        supplierList: [],
        supplierKeyWords: '',
        orderId: '',
        supplierName: '',
        creditSupplierStatus: 1,
        size: 10,
        curPage: 1,
        total: '',
        isTableLoadingOrd: true,
        supplierPayMap: '',
        payType: 2,
        actionList: [],
        orderBy: "",
        sort:"",
        purchaserMap:{},
        purchaser:'',
        goodsKeyWords:'',
        orderSn:'',
        brandId:'',
        brandListMap:{}
      };
    },
  },
};
