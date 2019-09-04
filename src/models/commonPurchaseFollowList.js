import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import moment from 'moment';
import { reqCommonList, reqConfig, reqPurchaseList, addLogisInfo, editLogisInfo, changeSign, reqCancelSign, reqDeleteInfo, reqAllSign, reqSupplierSuggest, editRemark } from '../services/commonPurchaseFollowList';
notification.config({
    placement: 'topRight',
    duration: 2,
  });
export default {
    namespace: 'commonPurchaseFollowList',
    state: {
        isShowLogisticsModal: false,
        isTableLoading:true,
        isSaved: false,
        isSigned: false,
        // 选中的tab标签的值
        selectedTab: "1",
        selectedPurchaseOrder: {},
        followInfoDetail: [],
        // 常规采购列表数据
        actionList: [],
        purchaseOrderList: [],
        purchaseShippingId: "",
        // 销售采购列表数据
        actionList2: [],
        purchaseOrderList2: [],
        // 当前选中的tab列表的物流信息
        currentOrderList: [],
        isShowAllSignModal: false,
        // 物流信息
        purchaseOrderId: "",
        shippingNo: "",
        shippingCompany: "",
        shippingPlace: "",
        shippingDate: "",
        followRemark: "",
        total:"",
        purchaserMap: [],
        sellerMap: [],
        total2:"",
        editShippingDate: "",
        supplierSearchText:'',
        supplierSuggest: [],
        expectArrivingDate:'',
        size:999,
        stockFollowPurchaseOrderMap:{},
        daifaFollowPurchaseOrderMap:{},
        status:1,
        reqKeyList: [
            {
                pageSize: 40,
                curPage: 1,
                followStatus: "",
                purchaser: "",
                keywords: "",
                supplierId: "",
                expectShippingDateStart: "",
                expectShippingDateEnd: "",
                expectReceivedDateStart: "",
                expectReceivedDateEnd: "",
                purchaseOrderId:"",
                createTimeStart: "",
                createTimeEnd:"",

            },
            {
                pageSize: 40,
                curPage: 1,
                daifaFollowStatus: "",
                purchaser: "",
                sellerId: "",
                consignee: "",
                keywords: "",
                purchaseOrderId:"",
                supplierId: "",
                expectShippingDateStart: "",
                expectShippingDateEnd: "",
                expectReceivedDateStart: "",
                expectReceivedDateEnd: "",
                createTimeStart: "",
                createTimeEnd:"",
            },
        ],
        orderSnMap:[],
        orderId:""
    },
    effects: {
        //------------- 获取常规采购的列表数据---------
        *getCommonList({ payload },{ put, call, select }) {
            const { reqKeyList } = yield select(state => state.commonPurchaseFollowList);
            yield put({
                type: 'getListPending',
                payload:{
                    ...payload,
                }
            });
            try {
                const order = yield call(reqCommonList, {
                   ...reqKeyList[0]
                });    
                yield put({
                    type: 'getListResolved',
                    payload: {
                        actionList: order.data.actionList,
                        purchaseOrderList: order.data.purchaseOrderList,
                        total:order.data.total,
                    },
                });
                } catch (error) {
                    console.log(error)
            }            
        },
        *getConfig({ payload },{ put, call, select }) {
            try{
                const config = yield call(reqConfig);
                yield put({
                    type:"updatePageReducer",
                    payload:{
                        stockFollowPurchaseOrderMap:config.data.stockFollowPurchaseOrderMap,
                        daifaFollowPurchaseOrderMap: config.data.daifaFollowPurchaseOrderMap,
                        purchaserMap:config.data.purchaserMap,
                        sellerMap:config.data.sellerMap,
                    }
                })

            }catch(err) {

            }
        },
        // -----------------获取销售采购订单列表-------
        *getPurchaseList({ payload },{ put, call, select }) {
            const { reqKeyList } = yield select(state => state.commonPurchaseFollowList);
            yield put({
                type: 'getListPending',
                payload:{
                    ...payload,
                }
            });
            try {
                const order = yield call(reqPurchaseList, {
                   ...reqKeyList[1]
                })
                yield put({
                type: 'getListResolved',
                payload: {
                    purchaseOrderList2: order.data.purchaseOrderList,
                    total2:order.data.total,
                    actionList2:order.data.actionList,
                },
                });
                } catch (error) {
                    console.log(error)
            }            
        },
        *changeSearchItem({ payload },{ put, select }) {
             const { reqKeyList, selectedTab } = yield select(state => state.commonPurchaseFollowList);
             if(selectedTab == 1) {
                Object.keys(reqKeyList[0]).map((item)=>{
                    Object.keys(payload).map(item2=>{
                        if(item === item2 ){
                            reqKeyList[0][item] = payload[item2];
                        }
                    })
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        ...reqKeyList[0],
                    }
                })
             }else if(selectedTab == 2) {
                Object.keys(reqKeyList[1]).map((item)=>{
                    Object.keys(payload).map(item2=>{
                        if(item === item2 ){
                            reqKeyList[1][item] = payload[item2];
                        }
                    })
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        ...reqKeyList[1],
                    }
                })
             }
        },
        // ---------------处理搜索提交的内容，对参数做进一步处理
        *handleSearchResult({ payload },{ put ,select }) {
             const { reqKeyList,selectedTab } = yield select(state => state.commonPurchaseFollowList);
             if(selectedTab == 1) {
                Object.keys(reqKeyList[0]).map((item)=>{
                    Object.keys(payload).map(item2=>{
                        if(item === item2 ){
                            reqKeyList[0][item] = payload[item2];
                        }
                    })
                })
                yield put({
                    type:'getCommonList',
                    payload: {
                        ...reqKeyList[0],
                    }
                })
             }else if(selectedTab == 2) {
                Object.keys(reqKeyList[1]).map((item)=>{
                    Object.keys(payload).map(item2=>{
                        if(item === item2 ){
                            reqKeyList[1][item] = payload[item2];
                        }
                    })
                })
                yield put({
                    type:'getPurchaseList',
                    payload: {
                        ...reqKeyList[1],
                    }
                })
             }
             yield put({
                type:'updatePageReducer',
                payload: {
                    ...payload,
                }
            })

        },
         // 筛选供应商
    *changeSupplier({ payload }, { put, call, select }) {
        const { size,selectedTab,status } = yield select(state=>state.commonPurchaseFollowList);
        yield put({
          type: 'changeSupplierPending',
          payload: {
            supplierSearchText: payload.supplierSearchText,
          },
        });
        if (payload.supplierSearchText === '') {
          yield put({
            type: 'changeSupplierReducer',
          });
          yield put({
            type: 'handleSearchResult',
            payload: {
                ...selectedTab
            }
          });
          return;
        }
        try {
          const res = yield call(reqSupplierSuggest, { keywords: payload.supplierSearchText,size });
          yield put({
            type: 'updatePageReducer',
            payload: {
              supplierSearchText: payload.supplierSearchText,
              supplierSuggest: res.data.suppliers,
            },
          });
        } catch (error) {
        
        }
      },
        // ---------------修改点击保存的时候更新物流信息--------
        *editLogisticsInfo({ payload },{ put, call }) {
            const { editItem } = payload;
             try {
                const res = yield call(editLogisInfo,{
                     ...editItem
                })
                notification.success({
                   message: res.msg,
                 });

            } catch(error) { 
               //  TODO
            }
            yield put({
                type:'updatePageReducer',
                payload: {
                    ...payload,
                }
            })
        },       
        // ---------------点击签收的时候发送请求------
        *handleSign({ payload },{ put, call }) {
            // yield put({
            //     type:'handleIssignLoadingReducer'
            // })
            const { purchaseShippingId } = payload;
            try {
                const res = yield call(changeSign,{ purchaseShippingId });
                notification.success({
                    message: res.msg,
                    });
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        ...payload,
                        followInfoDetail: res.data.purchaseShippingList,
                    }
                })
                yield put({
                    type:'addIsSaved',
                })
            }catch(err) {
                console.log(err)
            } 
            
        },
        // --------------点击取消签收的时候发送请求---------
        *cancelSign({ payload }, { put, call }) {
            yield put({
                type:'handleIssignLoadingReducer'
            })
            const { purchaseShippingId } = payload;
            try {
                const res = yield call(reqCancelSign, { purchaseShippingId })
                notification.success({
                    message: res.msg,
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        ...payload,
                        followInfoDetail: res.data.purchaseShippingList,
                    }
                })
                yield put({
                    type:'addIsSaved',
                })
            }catch(err) {
                console.log(err)
            }
            
        },
        /**---------点击全部签收------------ */
        *confirmAllSign({ payload },{ put, call }) {
            const { purchaseOrderId } = payload;
            try {
                const res = yield call(reqAllSign, { purchaseOrderId })
                notification.success({
                    message: res.msg,
                })
                yield put({
                    type:'getPurchaseList',
                    payload: {
                        ...payload
                    }
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        ...payload
                    }
                })
            }catch(err) {
                console.log(err)
            }

        },
        /**------------点击删除的时候发送请求--------- */
        *handleDelete({ payload }, { put, call }) {
            // yield put({
            //     type:'showDeleteLoadingReducer',
            // })
            const { purchaseShippingId } = payload;
            try {
                const res = yield call(reqDeleteInfo, { purchaseShippingId })
                notification.success({
                    message: res.msg,
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        followInfoDetail:res.data.purchaseShippingList,
                    }
                })
                yield put({
                    type:'addIsSaved',
                })
            }catch(err) {
                console.log(err)
            }
        },
        // -----------修改物流信息--------
        *changeLogisticsInfo({payload},{put,select}){
            const { followInfoDetail } = yield select(state=>state.commonPurchaseFollowList);
            followInfoDetail&&followInfoDetail.map(item=>{
                if(item.purchaseShippingId&&item.purchaseShippingId === payload.id){  
                    Object.keys(item).map(key=>{
                        Object.keys(payload).map(item2=>{
                            if(key === item2) {
                                item[key] = payload[item2]
                            }
                        })
                    })
                }
            })
            yield put({
                type:'updatePageReducer',
                payload: {
                    followInfoDetail,
                }
            })           
        },

         // -------------------新建：点击保存的时候提交物流信息------------
         *saveLogisticsInfo({ payload },{ put, call, select }) {
            const { purchaseOrderId } = payload;
            const { 
                shippingNo,
                shippingCompany,
                shippingPlace,
                shippingDate,
                followRemark,
                expectArrivingDate,
                orderId,
                orderSnMap
             } = yield select(state => state.commonPurchaseFollowList);
             let orderSn = ""
             orderSnMap.map(item=>{
                item.orderId = orderId;
                orderSn = `${item.orderSn}/${item.consignee}`
             })
             
             try {
                const res = yield call(addLogisInfo,{
                    purchaseOrderId,
                    shippingNo,
                    shippingCompany,
                    shippingPlace,
                    shippingDate,
                    followRemark,
                    expectArrivingDate,
                    orderId,
                    orderSn
                 })
                notification.success({
                    message: res.msg,
                  });
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        followInfoDetail:res.data.purchaseShippingList,
                        ...payload,
                        purchaseOrderId,
                        shippingNo:"",
                        followRemark:"",
                    }
                })
                yield put({
                    type:'addIsSaved',
                })
             } catch(error) { 
                //  TODO
             }
        },
        /**----------点击跟进物流的操作-------------- */
        *FollowLogistic({ payload },{ put }) {
            yield put({
                type:'updatePageReducer',
                payload: {
                    ...payload,
                }
            })
            yield put({
                type:'addIsSaved',
            })
        },
        /**--------------给每一条物流信息都添加一个isSaved的字段---------- */
        *addIsSaved({ payload }, { put, select }) {
            const { followInfoDetail } = yield select(state=>state.commonPurchaseFollowList);
            followInfoDetail.map(item=>{
                item.isSaved = false;
            })
            yield put({
                type:'updatePageReducer',
                payload: {
                    followInfoDetail,
                }
            })
        },
        /**----------------修改备注------- */
        *changeReamrk({ payload },{ put, select }) {
            const { purchaseOrderList, purchaseOrderList2 } = yield select(state=>state.commonPurchaseFollowList);
            const { remark, selectedTab, id } = payload;
            if(+selectedTab === 1) {
                purchaseOrderList.map(item=>{
                    item.goodsList.map(item2=>{
                        if(+item2.id === +id) {
                            item2.remark = remark;
                        }
                    })
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        purchaseOrderList,
                    }
                })

            }else if(+selectedTab === 2){
                purchaseOrderList2.map(item=>{
                    item.goodsList.map(item2=>{
                        if(+item2.id === +id) {
                            item2.remark = remark;
                        }
                    })
                })
                yield put({
                    type:'updatePageReducer',
                    payload: {
                        purchaseOrderList2,
                    }
                })

            }

        },

        /**------提交备注---- */
        *submitPurchaseReamrk({ payload },{ put, call }) {
            try{
                const res = yield call(editRemark,{ ...payload });
            }catch(err) {
                console.log(err)
            }

        },
        *unmount(_,{ put }) {
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
        // 改变提供商搜索文案
        changeSupplierPending(state, { payload }) {
            return {
            ...state,
            supplierSearchText: payload.supplierSearchText,
            };
        },
        changeSupplierReducer(state, { payload }) {
            return {
            ...state,
            ...payload,
            supplierId: 0,
            supplierSuggest: [],
            };
        },
        // 获取列表中
        getListPending(state,{ payload }) {
            return {
                ...state,
                ...payload,
                isTableLoading: true,
            };
        },
        // 获取列表成功
        getListResolved(state, action) {
            const { payload } = action;
            return {
                ...state,
                ...payload,
                isTableLoading: false,
            };
        },
        unmountReducer() {
            return {
                isShowLogisticsModal: false,
                isTableLoading: false,
                isSaved: false,
                isSigned: false,  
                selectedTab: "1",
                electedPurchaseOrder: {},
                // 常规采购列表数据
                actionList: [],
                purchaseOrderList: [],
                // 销售采购列表数据
                actionList2: [],
                purchaseOrderList2: [],
                purchaseOrderId: "",
                // 当前选中的tab列表的物流信息
                currentOrderList: [],
                followInfoDetail: [],
                selectedPurchaseOrder: {},
                // 物流信息
                shippingNo: "",
                shippingCompany: "",
                shippingPlace: "",
                shippingDate: "",
                followRemark: "",
                isShowAllSignModal: false,
                purchaseShippingId: "",
                total:"",
                purchaserMap: [],
                sellerMap: [],
                total2:"",
                supplierSearchText:'',
                supplierSuggest: [],
                size:999,
                status:1,
                expectArrivingDate:'',
                stockFollowPurchaseOrderMap:{},
                daifaFollowPurchaseOrderMap:{},
                reqKeyList: [
                {
                    pageSize: 40,
                    curPage: 1,
                    followStatus: "",
                    purchaser: "",
                    keywords: "",
                    supplierId: "",
                    expectShippingDateStart: "",
                    expectShippingDateEnd: "",
                    expectReceivedDateStart: "",
                    expectReceivedDateEnd: "",
                    purchaseOrderId:"",
                    createTimeStart: "",
                    createTimeEnd:"",
    
                },
                {
                    pageSize: 40,
                    curPage: 1,
                    daifaFollowStatus: "",
                    purchaser: "",
                    keywords: "",
                    supplierId: "",
                    expectShippingDateStart: "",
                    expectShippingDateEnd: "",
                    expectReceivedDateStart: "",
                    expectReceivedDateEnd: "",
                    purchaseOrderId:"",
                    createTimeStart: "",
                    createTimeEnd:"",
                },     
                ],
                orderSnMap:[]
           
            }
        }
    }
}

