import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { reqGetList, reqConfig } from '../services/supplierManagementList';

export default {
  namespace: 'supplierManagementList',
  state: {
    supplierKeyWords: "",
    goodsKeyWords: "",
    brandName: "",
    identifierKeyWords: "",
    supplierProperty: "",
    status: "",
    contractExpireDateStart: "",
    contractExpireDateEnd: "",
    curPage: 1,
    size: 40,   
    actionList: [],
    suppliers: [],
    isTableLoading: true,
    total:"",
    statusMap:{},
    supplierPropertyMap:{},
    propertyMap: {},
    payMethodMap: {},
    supplierStatusMap:{},
    brandStatusMap:{},
    purchaserMap:{},
    brandListMap:{},
    contact:"",
    supplierLevelMap:{},
    supplierGoodsPayMethodMap:{},
  },
  effects: {
    *getList({ payload },{ put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload:{
          ...payload,
          isTableLoading:true,
        }
      });
      const { 
        supplierKeyWords, 
        goodsKeyWords, 
        brandName, 
        identifierKeyWords, 
        supplierProperty, 
        status, 
        contractExpireDateStart,
        contractExpireDateEnd,
        curPage,
        size,       
        purchaser,
        contact,
        brandStatus,
        
      } = yield select(state=>state.supplierManagementList);
      try {
        const order = yield call(reqGetList, {
          supplierKeyWords, 
          goodsKeyWords, 
          brandName, 
          identifierKeyWords, 
          supplierProperty, 
          status, 
          contractExpireDateStart,
          contractExpireDateEnd,
          curPage,
          size,
          purchaser,
          contact,
          brandStatus,
        })
        yield put({
          type: "updatePageReducer",
          payload: {
            actionList: order.data.actionList,
            suppliers: order.data.suppliers,
            total:order.data.total,
            isTableLoading: false,
          }
        })

      }catch(err) {
        yield put({
          type: "updatePageReducer",
          payload: {
            isTableLoading: false,
          }
        })
        console.log(err)

      }
    },
    *getConfig({ payload },{ call, put }) {
      try{
        const config = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            ...config.data
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    *unmount({ payload },{ put }) {
      yield put({
        type:'unmountReducer'
      })

    },

  },
  reducers: {
    updatePageReducer(state, {payload}) {
      return {
          ...state,
          ...payload,
      };
    },
    unmountReducer() {
      return {
        supplierKeyWords: "",
        goodsKeyWords: "",
        brandName: "",
        identifierKeyWords: "",
        supplierProperty: "",
        status: "",
        contractExpireDateStart:"",
        contractExpireDateEnd: "",
        curPage: 1,
        size: 40,       
        actionList: [],
        suppliers: [],
        isTableLoading: true,
        total:"",
        statusMap:{},
        supplierPropertyMap:{},
        propertyMap: {},
        payMethodMap: {},
        supplierStatusMap:{},
        brandStatusMap:{},
        purchaserMap:{},
        brandListMap:{},
        contact:"",
        supplierLevelMap:{},
        supplierGoodsPayMethodMap:{},
      }
    }
  },
};
