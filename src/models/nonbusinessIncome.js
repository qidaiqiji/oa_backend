import { message, notification } from 'antd';
import { reqList, reqConfig, reqCommit, reqConfirm, reqCertificate, reqAccountList, reqEdit, reqSupplierSuggest, reqSearch, reqDelete } from '../services/nonbusinessIncome';

export default {
    namespace: 'nonbusinessIncome',
  state: {
    isTableLoading:true,
    currentPage: 1,
    pageSize:50,
    showAddNew:false,
    showCertificateModal:false,
    buttonLoading: false,
    submitLoading: false,
    showDetailModal:false,
    createTImeStart:"",
    createTImeEnd:"",
    followPersonId:"",
    supplierId:"",
    purchaseOrder:"",
    incomeList:[],
    allBussinessAmount:'',
    shopServiceAmount:'',
    returnGoodsAmount:'',
    policyRebateAmount:'',
    waitCheckAmount:'',
    total:'',
    incomeMethod:'',
    incomeType:'',
    supplierId:'',
    amount:'',
    remark:'',
    showConfirmModal:false,
    actionName:'',
    recordId:'',
    actionUrl:'',
    record:{},
    isEidt:false,
    size:999,
    supplierSuggest:[],
    shouldReceiveAmount:'',
    supplierName:'',
    incomeTypeMap:{},
    incomeMethodMap:{},
    statusMap:{},
    checkStatus:'',
    collectAccountMap:[],
    values:{},
    newRecord:{},
    isShowPayInfoConfirm:false,
    detailRecord:{},
    userList:[],
    partIncomeMethodMap:{},
    showDeleteModal:false,
    followPersonMap:{}
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
            createTimeStart,
            createTimeEnd,
            incomeType,
            incomeMethod,
            followPersonId,
            supplierId,
            purchaseOrder,
            currentPage,
            pageSize,
            checkStatus,
            record,
        } = yield select(state=>state.nonbusinessIncome);
        try{
            const res = yield call(reqList,{ 
                createTimeStart,
                createTimeEnd,
                incomeType,
                incomeMethod,
                followPersonId,
                supplierId,
                purchaseOrder,
                currentPage,
                pageSize,
                checkStatus
            })
            const incomeList = res.data.incomeList;
            if(Object.keys(record).length>0) {
                Object.keys(record).map(key=>{
                    incomeList.map(item=>{
                        if(item.id == record.id) {
                            record[key] = item[key];
                        }
                    })
                })
            }
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...res.data,
                    isTableLoading:false,
                    record,
                }
            })
        }catch(err) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    isTableLoading:false,
                }
            })
        }
    },
    *getConfig(_,{ put, call }) {
        try{
            const config = yield call(reqConfig);
            yield put({
                type:'updatePageReducer',
                payload:{
                    incomeTypeMap:config.data.incomeTypeMap,
                    statusMap:config.data.status,
                    incomeMethodMap:config.data.incomeMethodMap,
                    collectAccountMap:config.data.collectAccountMap,
                    partIncomeMethodMap:config.data.partIncomeMethodMap,
                    followPersonMap:config.data.followPersonMap,
                }
            })
        }catch(err){
            console.log(err)
        }
    },
    *searchKeywords({ payload },{ put, call }) {
        if(payload.keyWords == ""){
            yield put({
                type:'getList',
                payload:{
                    followPersonId:''
                }
            })
            return;
        }
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
    *changeSupplier({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { size, supplierSearchText, searchType } = yield select(state=>state.nonbusinessIncome);        
        if (supplierSearchText === '') {
            if(searchType == "search") {
                yield put({
                    type: 'getList',
                    payload:{
                        supplierId: '',
                        supplierSuggest: [],
                    }
                })
            }else{
                yield put({
                    type: 'updatePageReducer',
                    payload:{
                        supplierId: '',
                    }
                })
            }
          
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
    *handleCommit({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { 
            isEidt,
            newRecord,
            record,
        } = yield select(state=>state.nonbusinessIncome)
        const editRecord = (({incomeType,incomeMethod,supplierId,amount,remark,id})=>({incomeType,incomeMethod,supplierId,amount,remark,id}))(record)
        try{
            const res = yield call(isEidt?reqEdit:reqCommit,isEidt?{...editRecord}:{...newRecord});
            notification.success({
                message:res.msg
            })
            yield put({
                type:'getList'
            })
            yield put({
                type:'updatePageReducer',
                payload:{
                    submitLoading:false,
                    showAddNew:false,
                    recordId:'',
                    isEidt:false,
                    record:{},
                    newRecord:{},
                    supplierSearchText:''
                }
            })
        }catch(err){
            yield put({
                type:'updatePageReducer',
                payload:{
                    submitLoading:false,
                    isEidt:false,
                    record:{},
                    showAddNew:false,
                    supplierSearchText:''
                }
            })
        }
    },
    *handleConfirm({ payload },{ put, call, select }) {
       const { actionUrl, recordId, rejectRemark } = yield select(state=>state.nonbusinessIncome);
       try{
           const res = yield call(reqConfirm,actionUrl,{ id:recordId, rejectRemark });
           yield put({
               type:'updatePageReducer',
               payload:{
                   showConfirmModal:false,
               }
           })
           yield put({
               type:'getList'
           })

       }catch(err){

       }
    },
    *submitAddCertificate({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { formData } = yield select(state=>state.nonbusinessIncome);
        try{
            const res = yield call(reqCertificate,{ formData })
            yield put({
                type:'updatePageReducer',
                payload:{
                    buttonLoading:false,
                    showCertificateModal:false,
                    payMethod:'',
                    receiveAccountId:'',
                    transactionSn:'',
                    amount:'',
                    remark:''
                }
            })
            yield put({
                type:'getList',
            })
        }catch(err) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    buttonLoading:false,
                }
            })
        }
    },
    *getAccountDetail({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { recordId } = yield select(state=>state.nonbusinessIncome);
        try{
            const res = yield call(reqAccountList,{ id:recordId });
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...res.data,
                }
            })

        }catch(err){

        }
    },
    *deleteRecord({ payload },{ put, call, select }) {
        const { id, payType } = payload;
        const { recordId } = yield select(state=>state.nonbusinessIncome)
        try{
            const res = yield call(reqDelete,{ id, payType, incomeId:recordId });
            notification.success({
                message:res.msg,
            })
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload
                }
            })
            yield put({
                type:'getList',
            })
        }catch(err) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    showDeleteModal:false,
                }
            })
            console.log(err)
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
    unmountReducer(){
        return {
            isTableLoading:false,
            currentPage: 1,
            pageSize:50,
            showAddNew:false,
            showCertificateModal:false,
            buttonLoading: false,
            submitLoading: false,
            showDetailModal:false,
            createTImeStart:"",
            createTImeEnd:"",
            incomeMethod:"",
            followPersonId:"",
            purchaseOrder:"",
            incomeList:[],
            allBussinessAmount:'',
            shopServiceAmount:'',
            returnGoodsAmount:'',
            policyRebateAmount:'',
            waitCheckAmount:'',
            otherAmount:'',
            total:'',
            incomeType:'',
            amount:'',
            remark:'',
            showConfirmModal:false,
            actionName:'',
            recordId:'',
            actionUrl:'',
            record:{},
            isEidt:false,
            size:999,
            supplierSuggest:[],
            shouldReceiveAmount:'',
            supplierName:'',
            incomeTypeMap:{},
            incomeMethodMap:{},
            statusMap:{},
            checkStatus:'',
            collectAccountMap:[],
            values:{},
            newRecord:{},
            isShowPayInfoConfirm:false,
            detailRecord:{},
            userList:[],
            partIncomeMethodMap:{},
            showDeleteModal:false,
            followPersonMap:{},
            otherAmount:'',
        }
    }
  }
};
