import moment from 'moment';
import {
    reqConfig,
    reqGetConfig,
} from '../services/statisticsReport';

export default {
  namespace: 'statisticsReport',

  state: {
    buttonValue:"1",
    brandListMap:{},
    categoryMap: {},
    goodsKeywords:"",
    brandId:"",
    supplierContract:"",
    supplierName:"",
    startTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endTime:moment().format('YYYY-MM-DD'),
    startTimeNow:moment().add(-30, 'days').format('YYYY-MM-DD'),
    endTimeNow:moment().format('YYYY-MM-DD'),
    catId:"",
  },

  effects: {
    
    *getConfig({ payload },{ put, call, all }) {
      try{
        const [config, res] = yield all([
          call(reqConfig),
          call(reqGetConfig)
        ]);
        yield put({
          type:'updatePageReducer',
          payload:{
            brandListMap: config.data.brandListMap,
            categoryMap: res.data.categoryMap,
          }
        })
      }catch(err){
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
    updatePageReducer(state,{ payload }) {
        return {
            ...state,
            ...payload,
        }
    },
    unmountReducer() {
      return {
        buttonValue:"1",
        brandListMap:{},
        categoryMap: {},
        goodsKeywords:"",
        brandId:"",
        supplierContract:"",
        supplierName:"",
        startTime: moment().add(-30, 'days').format('YYYY-MM-DD'),
        endTime:moment().format('YYYY-MM-DD'),
        startTimeNow:moment().add(-30, 'days').format('YYYY-MM-DD'),
        endTimeNow:moment().format('YYYY-MM-DD'),
        catId:"",
      };
    }
  },
};
