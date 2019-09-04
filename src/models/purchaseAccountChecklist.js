import moment from 'moment';
import {
    reqList,
    reqConfig,
} from '../services/purchaseAccountChecklist';

export default {
    namespace: 'purchaseAccountChecklist',
    state: {
        status: 18,
        orderId: "",
        supplierName: "",
        purchaser: "",
        createTimeStart: "",
        createTimeEnd: "",
        currentPage: 1,
        pageSize: 40,
        isTableLoading:false,
        total:0,    
    },
    effects: {
    *getList({ payload },{ put, select, call }) {
        yield put({
            type: "updatePageReducer",
            payload: {
                  ...payload,
                  isTableLoading:true,
            }
        })
        const { 
            status,
            orderId,
            supplierName,
            purchaser,
            createTimeStart,
            createTimeEnd,
            currentPage,
            pageSize,
        } = yield select(state=>state.purchaseAccountChecklist)
        try{
              const order = yield call(reqList,{
                status,
                orderId,
                supplierName,
                purchaser,
                createTimeStart,
                createTimeEnd,
                currentPage,
                pageSize,
            })
            yield put({
                type: "updatePageReducer",
                payload: {
                    purchaseOrderList:order.data.purchaseOrderList,
                    total:order.data.total,
                    isTableLoading:false,
                }
            })
        }catch(err) {
             console.log(err)
        }
    },
    *getConfig({ },{ put, call }) {
        try {
            const config = yield call(reqConfig)
            yield put({
                type:"updatePageReducer",
                payload:{
                    purchaserMap:config.data.purchaserMap,
                }
            })
        }catch(err) {
            console.log(err)
        }
    }   
},
reducers: {
    updatePageReducer(state, { payload }) {
        return {
            ...state,
            ...payload,
        };
    },  
    unmountReducer() {
        return {
            status: 18,
            orderId: "",
            supplierName: "",
            purchaser: "",
            createTimeStart: "",
            createTimeEnd: "",
            currentPage: 1,
            pageSize: 40,      
            isTableLoading:false,  
            total:0,
        };
    },
  },
};
