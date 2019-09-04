import moment from 'moment';
import { 
    reqInGoodsList, 
    addOutInvoiceBill, 
    reqGoodsList, 
    addInInvoiceBill, 
    handleDelete, 
    reqGoodsDetail, 
    confirmInInvoiceBill,
    confirmOutInvoiceBill 
} from '../services/manualInInvoice';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';
import InvoiceModel from '../common/Invoice/invoiceModel';

export default modelExtend(InvoiceModel, {
  namespace: 'manualInInvoice',
  state: {
        invSn:"",
        invCompany: "",
        invDate: "",
        invGoodsList: [],
        remark: "",   
        pageSize: 40,
        currentPage: 1, 
        goodsKeywords: "",
        isShowInvGoodsNameModal: false,
        total: 0,
        id:"",
        invType: "",
        selectedIds: [],
        selectedRows: [],
        taxRate: 0.13,
        isSuitDetail:1,
        confirmIsDelete: false,
        addInvoiceGoodsNameList: [{
            goodsName: '',
            goodsSn: '',
            invGoodsName: '',
            size: '',
            unit: '',
            id: '新增发票名称',
            isAdd: true,
        }],
        invoiceGoodsList: [],
        edit:false,
        isTableLoading: false,
        isLoading: false,
  },
  effects: {
    *getGoodsList({ payload }, { call, put, select }) {
        yield put({
            type: 'updatePageReducer',
            payload:{
                ...payload,
                isTableLoading:true,
            }
        })
        const { currentPage, pageSize, goodsKeywords, id } = yield select(state => state.manualInInvoice);
        try {
            if(id === "out") {
                const list = yield call(reqGoodsList, { currentPage, pageSize, goodsKeywords });
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...list.data,
                        isTableLoading:false,
                    },
                });
            }else if(id === "in") {
                const list = yield call(reqInGoodsList, { currentPage, pageSize, goodsKeywords });
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...list.data,
                        isTableLoading:false,
                    },
                });
            }
        } catch (error) {
            console.log(error)
        }
    },
    *addNewInvoiceBill({ payload },{ put, call, select }) {
        const { isConfirm } = payload;
        const { invSn, invCompany, invDate, invGoodsList, remark, isSuitDetail, id, invType } = yield select(state => state.manualInInvoice);
        invGoodsList.map(item=>{
            item.price = item.importPrice
        })
        try {
            if(isNaN(id)) {
                const res = yield call(id=="out"?addOutInvoiceBill:addInInvoiceBill, { invSn, invCompany, invDate, invGoodsList, remark, isSuitDetail, isConfirm });
                if(res.code === 0) {
                    notification.success({
                        message: res.msg
                    });
                }
                if(isConfirm == 1) {                
                    yield put(routerRedux.push('/finance/finance-invoice/invoice-in-out-list'))
                }else{
                    yield put(routerRedux.push('/finance/finance-invoice/invoice-after-sale-list'))
                }
            }else {
                // 1为手动来票,2为手动开票
                try{
                    const res = yield call(+invType === 1?confirmInInvoiceBill:confirmOutInvoiceBill, { invId: id });
                    if(res.code === 0) {
                        notification.success({
                            message: res.msg
                        });
                        yield put(routerRedux.push('/finance/finance-invoice/invoice-in-out-list'))
                    }
                }catch(err) {
                    console.log(err)
                }
            }
        }catch(err) {
            console.log(err)
        }
    },
    *getInvGoodsNameListData({ payload }, { put, select }) {
        const {
            goodsKeywords,
            currentPage,
            pageSize,
        } = yield select(state => state.manualInInvoice);
        yield put({
            type: 'reqInvGoodsNameList',
            payload: {
                NAME: 'invGoodsNameListData',
                LOADING: 'isLoading',
                goodsKeywords,
                currentPage,
                pageSize,
                ...payload,
            },
        });
    },
     // 拉取列表详情
    *getGoodsDetail({ payload },{ put, call, select }) {
        yield put({
            type: 'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { id } = yield select(state => state.manualInInvoice);
        if(!isNaN(id)) {
            try{
                const res = yield call(reqGoodsDetail,{ id });
                yield put({
                    type: 'updatePageReducer',
                    payload:{
                        ...res.data,
                    }
                })
            }catch(err) {
                console.log(err)
            }
        }
        
    },
     // 点击作废
     *removeGoodsList({ payload },{ put, call, select }) {
        yield put({
            type: 'updatePageReducer',
            payload:{
                ...payload,
            }
        })
        const { id } = yield select(state => state.manualInInvoice);
        try{
            const res = yield call(handleDelete,{ invId:id });
            if(res.code == 0) {
                notification.success({
                    message: res.msg
                });
                yield put(routerRedux.push('/finance/finance-invoice/invoice-after-sale-list'))
            } 
        }catch(err) {
            console.log(err)
        }
    },
    *unmount(_, { put }) {
        yield put({
            type: 'unmountReducer',
        });
        yield put({
            type: 'getInvGoodsNameListData',
            payload: {
              NAME: 'invGoodsNameListData',
            },
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
            invSn:"",
            invCompany: "",
            invDate: "",
            invGoodsList: [],
            isSuitDetail:1,
            remark: "",   
            id:"",
            invType: "",
            pageSize: 40,
            currentPage: 1, 
            goodsKeywords: "",
            isShowInvGoodsNameModal:false,
            total: 0,
            selectedIds: [],
            selectedRows: [],
            taxRate: 0.13,
            addInvoiceGoodsNameList: [{
                goodsName: '',
                goodsSn: '',
                invGoodsName: '',
                size: '',
                unit: '',
                id: '新增发票名称',
                isAdd: true,
            }],
            invGoodsNameListData: {
                invoiceGoodsList: [],
            },
            edit: false,
            isTableLoading: false,
            confirmIsDelete: false,
            isLoading: false,
        };
    },
  },
});
