import moment from 'moment';
import { reqList, reqConfig, reqSupplierSuggest } from '../services/freightList';
export default {
    namespace: 'freightList',

    state: {
        isTableLoading:false,
        currentPage: 1,
        pageSize:50,
        purchaseOrderId:'',
        shippingFeeId:'',
        supplierId:'',
        purchaser:'',
        createTimeStart:'',
        createTimeEnd:'',
        status:'',
        shippingFeeList: [],
        purchaserMap:{},
        statusMap:{},
        supplierSuggest:[],
        size:999,
        checkStatus:[4,5],
        checkStatusMap:{
            4: "待财务审核",
            5: "已付款"
        },
        type:2,
        actionList:[]  
    },

    effects: {
        *getList({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                    isTableLoading:true,
                }
            })
            const { 
                purchaseOrderId,
                shippingFeeId,
                supplierId,
                purchaser,
                createTimeStart,
                createTimeEnd,
                status,
                currentPage,
                pageSize,
                type,
                checkStatus
            } = yield select(state=>state.freightList);
            try{
                const res = yield call(reqList,{
                    purchaseOrderId,
                    shippingFeeId,
                    supplierId,
                    purchaser,
                    createTimeStart,
                    createTimeEnd,
                    status:type==1?checkStatus:status,
                    currentPage,
                    pageSize,
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data,
                        isTableLoading:false,
                    }
                })

            }catch(err){
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        isTableLoading:false,
                    }
                })

            }
        },
        *getConfig({ payload },{ put, call, select }) {
            try{
                const config = yield call(reqConfig);
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...config.data,
                    }
                })
            }catch(err) {
                console.log(err)

            }

        },
        *changeSupplier({ payload }, { put, call, select }) {
            yield put({
              type: 'updatePageReducer',
              payload: {
                ...payload
              },
            });
            const { size, supplierSearchText } = yield select(state=>state.freightList);
            if (supplierSearchText === '') {
              yield put({
                type: 'getList',
                payload:{
                    supplierId:''
                }
              });
              return;
            }
            try {
              const res = yield call(reqSupplierSuggest, { keywords: supplierSearchText,size });
              yield put({
                type: 'updatePageReducer',
                payload: {
                  supplierSuggest: res.data.suppliers,
                },
              });
            } catch (error) {
                console.log(error)
            }
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
                isTableLoading:false,
                currentPage: 1,
                pageSize:50,
                purchaseOrderId:'',
                shippingFeeId:'',
                supplierId:'',
                purchaser:'',
                createTimeStart:'',
                createTimeEnd:'',
                status:'',
                purchaserMap:{},
                statusMap:{},
                supplierSuggest:[],
                size:999,
                checkStatus:[4,5],
                checkStatusMap:{
                    4: "待财务审核",
                    5: "已付款"
                },
                type:2,
                actionList:[]        
            };
        },
        
    },
};
