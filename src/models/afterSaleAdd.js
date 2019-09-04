import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import {
    reqGoodsList,
    addNewOrder,
    reqGetList,
    handleDelete,
    confirmNewOrder,
} from '../services/afterSaleAdd';

export default {
  namespace: 'afterSaleAdd',
    state: {
        invSn: "",
        invCompany: "",
        invDate: "",
        invSourceType: "",
        invGoodsList: [],
        invoiceList: [],
        remark: "",
        id: "",
        isTableLoading:false,
        confirmIsDelete:false,
        itemId: "",
    },
    effects: {
        *getList({ payload },{ put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
           const { id } = yield select(state=>state.afterSaleAdd);
            try{
                const res = yield call(reqGetList, { id });
                yield put({
                    type: 'updatePageReducer',
                    payload:{
                        ...res.data,
                        itemId:id,
                        isTableLoading:false,
                    }
                })
            }catch(err) {
                console.log(err)
            }

        },
        *searchForGoodsInfo({ payload },{ put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { invSn, itemId } = yield select(state=>state.afterSaleAdd);
            try{
                const res = yield call(reqGoodsList, { invSn, id: itemId })
                res.data.invGoodsList.map(item=>{
                    item.backNum = "";
                })
                yield put({
                    type:"updatePageReducer",
                    payload:{
                        ...res.data,
                        isTableLoading:false,
                    }
                })

            }catch(err) {
                console.log(err)
            }
        },
        *createNewAfterOrder({ payload },{ put, call, select }) {
            const { isConfirm } = payload;
            const { invSn, invGoodsList, remark,id, itemId } = yield select(state => state.afterSaleAdd);
            try{
                if(id) {
                    const res = yield call(confirmNewOrder, { invId:id });
                    if(res.code === 0) {
                        notification.success({
                            message: res.msg
                        });
                    }
                    yield put(routerRedux.push('/finance/finance-invoice/invoice-in-out-list'))
                }else{
                    const res = yield call(addNewOrder, { invSn, invGoodsList, remark, isConfirm, invId: itemId })
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
                }
            }catch(err) {
                console.log(err)
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
            const { invSn, itemId } = yield select(state => state.afterSaleAdd);
            try{
                const res = yield call(handleDelete,{ invSn, invId:itemId });
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
                invSn: "",
                invCompany: "",
                invDate: "",
                invSourceType: "",
                invGoodsList: [],
                invoiceList: [],
                remark: "",
                id: "",
                isTableLoading:false,
                confirmIsDelete:false,
                itemId: "",
            };
        },
    },
};
