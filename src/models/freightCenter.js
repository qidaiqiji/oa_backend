import moment from 'moment';
import { routerRedux } from 'dva/router';
import { reqList , reqApply, reqAddNew, reqUpload, reqConfig, reqSupplierSuggest, reqChangeAmount, reqEdit, reqDelete, reqChangeRemark, reqDeleteImg} from '../services/freightCenter';
import { notification } from 'antd';
import { stat } from 'fs';
export default {
    namespace: 'freightCenter',

    state: {
        isLoading:true,
        showCreateModal:false,
        purhcaseOrder:"",
        showApplyModal: false,
        showConfirmModal:false,
        currentPage:1,
        pageSize:50,
        status:"",
        createTimeStart: "",
        createTimeEnd:"",
        purchaseOrderId:"",
        supplierId:'',
        purchaser:'',  
        purchaseOrderList: [],
        total:'',
        actionList:[],
        currentRow:{
            shippingOrderFee:{
                shippingList:[]
            }
        },
        selectedRowKeys:[],
        selectRows:[],
        showAddNewRecord:false,
        payType: '',
        amount: '',
        bankInfoId:'', 
        remark:'',
        totalAmount:0,
        shippingList: [],
        values:{},
        shippingFeeStatusMap:{},
        purchaserMap:{},
        previewModal:false,
        previewUrl:'',
        orderId:'',
        finalBankInfos:[],
        bankType:'',
        bankInfoDetail:[],
        size:999,
        supplierSuggest:[],
        submitLoading:false,
        shippingInfoRecord:{},
        newShippingList:[],
        isEdit:false,
        assignAmount:0,
        totalLogisticFee:0,
        selectType:1,
        payInfo:""
    },

    effects: {
        *getList({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                    isLoading:true,
                }
            })
            const { purchaseOrderId } = yield select(state=>state.freightCenter)
            const { 
                status,
                createTimeStart,
                createTimeEnd,
                orderId,
                supplierId,
                purchaser, 
                currentPage,
                pageSize,
            } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(reqList,{
                    status,
                    createTimeStart,
                    createTimeEnd,
                    purchaseOrderId:orderId,
                    supplierId,
                    purchaser, 
                    currentPage,
                    pageSize,
                })
                let currentRow = {};
                let purchaseOrderList = res.data.purchaseOrderList;
                purchaseOrderList.map(item=>{
                    if(item.id == purchaseOrderId) {
                        currentRow = item;
                    }
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data,
                        isLoading:false,
                        currentRow
                    }
                })
                
             }catch(err) {
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        isLoading:false,
                    }
                })

             }

        },
        *getConfig({ payload },{ put, call }) {
            try{
                const res = yield call(reqConfig);
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data
                    }
                })
            }catch(err){
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
            const { size, supplierSearchText } = yield select(state=>state.freightCenter);
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
        *changeAmount({ payload },{ put, call, select }) {
            const { infos } = payload;
            const { purchaseOrderId } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(reqChangeAmount, { ...infos, purchaseOrderId })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        assignAmount:res.data.amount,
                        ...payload,
                    }
                })
            }catch(err) {
                console.log(err)

            }
        },
        *confirmApply({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { payType, selectedRowKeys, totalAmount, bankInfoId, remark, bankType, selectType, payInfo } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(reqApply,{
                    payType, 
                    purchaseOrderIdList:selectedRowKeys, 
                    amount:totalAmount, 
                    bankInfoId:selectType==1?bankInfoId:0, 
                    remark,
                    bankType:selectType==1?bankType:0,
                    payInfo:selectType==2?payInfo:0,
                })
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        showApplyModal:false,
                        selectedRowKeys:[],
                        remark:'',
                        payType:'',
                        purchaseOrderIdList:[],
                        bankInfoId:'',
                        bankType:'',
                        submitLoading:false,
                    }
                })
                yield put({
                    type:'getList',
                })
            }catch(err){
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        showApplyModal:false,
                        selectedRowKeys:[],
                        remark:'',
                        payType:'',
                        purchaseOrderIdList:[],
                        bankInfoId:'',
                        bankType:'',
                        submitLoading:false,
                    }
                })
                console.log(err)
            }
        },
        *addNewRecord({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { formData, form } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(reqAddNew,{ formData });
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        fileList:[],
                        files:[],
                        buttonLoading:false,
                        showAddNewRecord:false,
                        values:{},
                        amount:'',
                    }
                })
                yield put({
                    type:'getList'
                })
            }catch(err){
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        buttonLoading:false,
                        amount:'',
                    }
                })

            }

        },
        *deleteInfo({ payload },{ put, call, select }) {
            const { deleteId } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(reqDelete,{ id:deleteId });
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'getList',
                    payload:{
                        ...payload,
                    }
                })
            }catch(err) {
                console.log(err)
            }
        },
        *deleteImg({ payload },{ put, call, select }) {
            try{
                const res = yield call(reqDeleteImg,{ id:payload.deleteImgId });
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'getList',
                    payload:{
                        ...payload,
                    }
                })
            }catch(err) {
                console.log(err)
            }
        },
        *confrimUpload({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { formData, isEdit } = yield select(state=>state.freightCenter);
            try{
                const res = yield call(isEdit?reqEdit:reqUpload,{ formData });
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        showCreateModal:false,
                        shippingList:[],
                        remark:''
                    }
                })
                yield put({
                    type:'getList'
                })
            }catch(err){
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        showCreateModal:false,
                        shippingList:[]
                    }
                })

            }

        },
        *saveRemark({ payload },{ put, call, select }) {
            const { editId, followRemark } = yield select(state=>state.freightCenter);
            try{
                yield call(reqChangeRemark,{ id:editId, remark:followRemark })

            }catch(err) {

            }
        }
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
                isLoading:true,
                showCreateModal:false,
                purhcaseOrder:"",
                showApplyModal: false,
                showConfirmModal:false,
                currentPage:1,
                pageSize:50,
                status:"",
                createTimeStart: "",
                createTimeEnd:"",
                purchaseOrderId:"",
                supplierId:'',
                purchaser:'',  
                purchaseOrderList: [],
                total:'',
                actionList:[],
                currentRow:{
                    shippingOrderFee:{
                        shippingList:[]
                    }
                },
                selectedRowKeys:[],
                selectRows:[],
                showAddNewRecord:false,
                payType: '',
                amount: '',
                remark:'',
                totalAmount:0,
                shippingList: [],
                values:{},
                shippingFeeStatusMap:{},
                purchaserMap:{},
                previewModal:false,
                previewUrl:'',
                orderId:'',
                finalBankInfos:[],
                bankType:'',
                bankInfoId:'',
                bankInfoDetail:[],
                size:999,
                supplierSuggest:[],
                submitLoading:false,
                shippingInfoRecord:{},
                newShippingList:[],
                isEdit:false,
                assignAmount:0,
                totalLogisticFee:0,
                selectType:1,
                payInfo:''
            };
        },
        
    },
};
