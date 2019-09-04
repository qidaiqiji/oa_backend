import moment from 'moment';
import { reqInfo, reqConfig, reqCommit, reqAction, reqDelete } from '../services/freightDetail';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'freightDetail',
    state: {
        isTableLoading: false,
        id: '',
        status: '',
        supplierName: '',
        purchaser: '',
        createTime: '',
        payType: '',
        bankInfo: '',
        remark: '',
        shippingInfoList: [],
        shippingFeeId: '',
        relatePurchaseOrderIdList: [],
        alreadyPayAmount: '',
        amount: '',
        waitPayAmount: '',
        recordList: [],
        buttonLoading: false,
        statusMap: {},
        payTypeMap: {},
        purchaserMap: {},
        uploadModal: false,
        collectAccountMap: [],
        actionList: [],
        actionModal: false,
        rejectRemark: '',
        actionRecord: {},
        showDeleteModal: false,
        isShowPayInfoConfirm:false,
        detailRecord:{},
        totalAmount:0
    },
    effects: {
        *getDetailInfo({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload,
                }
            })
            const { shippingFeeId } = yield select(state => state.freightDetail);
            try {
                const res = yield call(reqInfo, { shippingFeeId })
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res.data.shippingFee,
                        isTableLoading: false,
                        actionList: res.data.actionList,
                    }
                })
            } catch (err) {
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        isTableLoading: false,
                    }
                })
            }
        },
        *getConfig({ payload }, { put, call, select }) {
            try {
                const config = yield call(reqConfig);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...config.data,
                    }
                })

            } catch (err) {

            }
        },
        *handleCommit({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload
                }
            })
            const { values, shippingFeeId } = yield select(state => state.freightDetail);
            try {
                const res = yield call(reqCommit, { ...values, shippingFeeId });
                notification.success({
                    message: res.msg
                })
                yield put({
                    type: 'getDetailInfo',
                    payload: {
                        uploadModal: false,
                    }
                })
            } catch (err) {
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        uploadModal: false,
                    }
                })
                console.log(err)

            }
        },
        *confirmAction({ payload }, { put, call, select }) {
            const { actionRecord, rejectRemark } = yield select(state => state.freightDetail);
            try {
                const res = yield call(reqAction, actionRecord.url, { remark: rejectRemark })
                notification.success({
                    message: res.msg
                })
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        actionModal: false,
                        rejectRemark: ''
                    }
                })
                if(actionRecord.name.indexOf("驳回")>-1) {
                    yield put(
                        routerRedux.push('/purchase/freight/freight-list')
                    )
                }else{
                    yield put({
                        type: 'getDetailInfo'
                    })
                }
            } catch (err) {
                console.log(err)
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        actionModal: false,
                        rejectRemark: ''
                    }
                })
            }
        },
        *deleteRecord({ payload }, { put, call, select }) {
            const { id } = payload;
            const { shippingFeeId } = yield select(state=>state.freightDetail)
            try {
                const res = yield call(reqDelete, { id, shippingFeeId });
                notification.success({
                    message: res.msg,
                })
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...payload
                    }
                })
                yield put({
                    type: 'getDetailInfo',
                })
            } catch (err) {
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        showDeleteModal: false,
                    }
                })
                console.log(err)
            }
        }
    },
    reducers: {
        updatePageReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
        unmountReducer() {
            return {
                isTableLoading: false,
                id: '',
                status: '',
                supplierName: '',
                purchaser: '',
                createTime: '',
                payType: '',
                bankInfo: '',
                remark: '',
                shippingInfoList: [],
                shippingFeeId: '',
                relatePurchaseOrderIdList: [],
                alreadyPayAmount: '',
                amount: '',
                waitPayAmount: '',
                recordList: [],
                buttonLoading: false,
                statusMap: {},
                payTypeMap: {},
                purchaserMap: {},
                uploadModal: false,
                collectAccountMap: [],
                actionList: [],
                actionModal: false,
                rejectRemark: '',
                actionRecord: {},
                showDeleteModal: false,
                isShowPayInfoConfirm:false,
                detailRecord:{},
                totalAmount:0
            };
        },

    },
};
