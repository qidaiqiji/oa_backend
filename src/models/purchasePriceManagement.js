import { routerRedux } from 'dva/router';
import { notification, Message } from 'antd';
import moment from 'moment';
import { reqList, reqUpdatePurchaser,reqSupplierSuggest,reqConfig } from '../services/purchasePriceManagement';
import { stat } from 'fs';
notification.config({
    placement: 'topRight',
    duration: 2,
  });
export default {
    namespace: 'purchasePriceManagement',
    state: {
        goodsKeywords:"",
        supplierId: "",
        goodsSn: "",
        purchaser: "",
        property: "",
        contractExpireDateStart: "",
        contractExpireDateEnd:"",
        authorizationExpireDateStart: "",
        authorizationExpireDateEnd: "",
        status: "",
        payMethod: "",
        currentPage: 1,
        pageSize: 40,
        goodsList: [],
        orderIds: [],
        purchaserId: "",
        purchaserMap:[],
        payTypeMap:[],
        propertyMap:[],
        saleMap:[],  
        total:""  ,
        isTableLoading: true,  
        supplierSearchText:'',
        supplierSuggest: [],
        size:999,
        supplierStatus:1,
        supplierGoodsPayMethodMap:{},
        actionList:[]

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
            goodsKeywords,
            supplierId,
            goodsSn,
            purchaser,
            contractExpireDateStart,
            contractExpireDateEnd,
            authorizationExpireDateStart,
            authorizationExpireDateEnd,
            status,
            payMethod,
            currentPage,
            pageSize,
           } = yield select(state=>state.purchasePriceManagement)
           try{
                const order = yield call(reqList,{
                    goodsKeywords,
                    supplierId,
                    goodsSn,
                    purchaser:purchaser==undefined?"":purchaser,
                    contractExpireDateStart,
                    contractExpireDateEnd,
                    authorizationExpireDateStart,
                    authorizationExpireDateEnd,
                    status:status==undefined?"":status,
                    payMethod:payMethod==undefined?"":payMethod,
                    currentPage,
                    pageSize,
                })
                yield put({
                    type: "updatePageReducer",
                    payload: {
                        goodsList: order.data.goodsList,
                        saleMap:order.data.saleMap,
                        total:order.data.total,
                        isTableLoading:false,
                        actionList:order.data.actionList,
                    }
                })
           }catch(err) {
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
    *handleSearchResult({ payload },{ put }) {
        yield put({
            type: "updatePageReducer",
            payload: {
                ...payload,
            }
        })
        yield put({
            type: "getList",
            payload: {
                ...payload,
            }
        })
      },
      *changeSupplyGoodsCheckboxIds({ payload }, { put }) {
        yield put({
            type: "updatePageReducer",
            payload: {
                orderIds: payload.supplyGoodsCheckboxIds,
                selectedRows: payload.selectedRows,
                goodsIdLists: payload.goodsIdLists,
          },
        });
      },
    //   批量修改采购员
    *updateEidtPurchaser({ payload },{ put, call, select }) {
        const { selectedRows,goodsList } = yield select(state=>state.purchasePriceManagement);
        selectedRows.map(item=>{
            item.purchaser = payload.purchaserId
        })
        goodsList.map(item=>{
            selectedRows.map(item2=>{
               if(+item.id === +item2.id) {
                Object.keys(item).map(key=>{
                    Object.keys(item2).map(key2=>{
                        if(key === key2) {
                            item[key] = item2[key2]
                        }
                    })
                })
               }
            })
        })
        yield put({
            type: 'updatePageReducer',
            payload:{
                goodsList,
                selectedRows,
                purchaserId:payload.purchaserId,
            }
        });
    },
      // 分配采购员
    *assignPurchaserOrder({ payload }, { put, call ,select}) {
        const { goodsInfos } = payload;
        const { goodsList } = yield select(state=>state.purchasePriceManagement);
        goodsList.map(item=>{
            goodsInfos.map(item2=>{
                if(+item.id === +item2.goodsId) {
                    item.purchaser = item2.purchaserId
                }
            })
        })
        try{
            const res = yield call(reqUpdatePurchaser, { goodsInfos });
            if(res.code == 0) {
                Message.success(res.msg)
            }
            yield put({
                type: 'updatePageReducer',
                payload:{
                    goodsList,
                }
            });
            
        }catch(err) {

        }
      },
      *assignPurchaser({ payload },{ put, call, select }) {
            const goodsInfos = [];
            goodsInfos.push(payload);
            const { goodsList } = yield select(state=>state.purchasePriceManagement);
            goodsList.map(item=>{
                goodsInfos.map(item2=>{
                    if(+item.id === +item2.goodsId) {
                        item.purchaser = item2.purchaserId
                    }
                })
            })
            yield put({
                type: 'updatePageReducer',
                payload: {
                    goodsList
                }
            })
            try{
                const res = yield call(reqUpdatePurchaser, { goodsInfos });
                if(res.code == 0) {
                    Message.success(res.msg)
                }
            }catch(err) {

            }
      },
      *changeSupplier({ payload }, { put, call, select }) {
        const { size , supplierStatus} = yield select(state=>state.purchasePriceManagement);
        yield put({
          type: 'updatePageReducer',
          payload: {
            supplierSearchText: payload.supplierSearchText,
          },
        });
        if (payload.supplierSearchText === '') {
          yield put({
            type: 'updatePageReducer',
            payload:{
                supplierId: 0,
                supplierSuggest: [],
            }
          });
          yield put({
            type: 'getList',
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
            console.log(error)
        }
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
                goodsKeywords:"",
                supplierId: "",
                goodsSn: "",
                purchaser: "",
                property: "",
                contractExpireDateStart: "",
                contractExpireDateEnd:"",
                authorizationExpireDateStart: "",
                authorizationExpireDateEnd: "",
                status: "",
                payMethod: "",
                currentPage: 1,
                pageSize: 40,
                goodsList: [],
                orderIds: [],
                purchaserId: "",
                purchaserMap:[],
                payTypeMap:[],
                propertyMap:[],
                saleMap:[],  
                total:""  ,
                isTableLoading: true,  
                supplierSearchText:'',
                supplierSuggest: [],
                size:999,
                supplierStatus:1,
                supplierGoodsPayMethodMap:{},
                actionList:[]
            }
        }
    }
}

