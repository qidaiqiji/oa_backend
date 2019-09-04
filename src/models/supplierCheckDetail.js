import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
  reqGetSupplierInfo,
  reqConfig,
  reqRecord,
  reqOperation,
  reqBrnadInfo,
  reqGoodsSn,
} from '../services/supplierCheckDetail';
import { truncate } from 'fs';
export default {
  namespace: 'supplierCheckDetail',
  state: {
    supplierLevel:"",
    supplierProperty:"",
    contractExpireDateStart:"",
    contractExpireDateEnd:"",
    supplierName: "",
    mobile: "",
    contact: "",
    payType: "",
    isSign: 1,
    remark: "", 
    brandRemark:"",
    brandList: [],
    brandPolicy:"",
    payMoney: "",
    brandId: "",
    isShowDeleteModal: false,
    id: "",
    goodsList: [],
    currentPage: 1,
    supplierId: "",
    // 当前选中的品牌列表中的id，不是brandId
    supplierBrandId: "",
    goodsInfos: [],
    payType: "",
    total:0,
    brandRemark:"",
    payInfoList: [],
    supplierNameIsChange:0,
    mobileIsChange:0,
    contractExpireDateEndIsChange: 0,
    contractExpireDateStartIsChange:0,
    supplierPropertyIsChange: 0,
    contractListIsChange: 0,
    payInfoListIsChange:0,
    supplierChangeRecordList:[],
    infoBrandId: '',
    changeTimeStart: '',
    changeTimeEnd: '',
    purchaseSupplierGoodsId: '',
    changeType: '',
    createBy: '',
    checkBy: '',
    purchaseGoodsList: [],
    isShowRejectModal:false,
    recordCurPage:1,
    recordPageSize:50,
    pageSize: 50,
    payMethodMap:{},
    supplierGoodsPropertyMap:{},
    supplierLevelMap:{},
    supplierPropertyMap:{},
    contractList:[],
    previewModal:false,
    previewUrl:'',
    recordList:[],
    purchaserMap: {},
    contactIsChange:0,
    status:'',
    recordTotal: 0,
    actionList:[],
    brandActionList: [],
    actionType: '',
    actionUrl: '',
    isShowConfirmModal: false,
    rejectRemark: '',
    brandListMap:{},
    goodsChangeTypeMap:{},
    goodsSnMap: {},
    supplierGoodsAllPayMethodMap:{},
  },

  effects: {
    *getConfig({ payload },{ put, call }) {
        try{
          const config = yield call(reqConfig);
          yield put({
            type:'updatePageReducer',
            payload:{
              ...config.data
            }
          })

        }catch(err){
          console.log(err)
        }
    },
    *getSupplierInfo({ payload }, { put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { id } = yield select(state=>state.supplierCheckDetail);
      try {
        const res = yield call(reqGetSupplierInfo, { id });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...res.data,
          },
        });
       
      } catch (error) {
        console.log(error)
      }
    },
    *getBrandInfoList({ payload },{ call, put, select }) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload,
          }
        })
        const { 
          changeTimeStart,
          changeTimeEnd,
          brandId,
          purchaseSupplierGoodsId,
          changeType,
          createBy,
          checkBy,
          currentPage,
          pageSize,
          id,
        } = yield select(state=>state.supplierCheckDetail)
        try{
          const res = yield call(reqBrnadInfo,{
            changeTimeStart,
            changeTimeEnd,
            brandId,
            purchaseSupplierGoodsId,
            changeType,
            createBy,
            checkBy,
            currentPage,
            pageSize,
            supplierId: id,
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              purchaseGoodsList: res.data.recordList,
              total:res.data.total
            }
          })

        }catch(err){

        }
    },
    *getRecordList({ payload },{ call, put, select }) {
        const { id } = yield select(state=>state.supplierCheckDetail)
        try{
          const res = yield call(reqRecord,{id});
          yield put({
            type:'updatePageReducer',
            payload:{
              ...res.data,
              recordTotal:res.data.recordList.length,
            }
          })

        }catch(err){
          console.log(err)
        }
    },
    *confirmOperation({ payload },{ put, call, select }) {
        const { actionType, actionUrl, rejectRemark } = yield select(state=>state.supplierCheckDetail);
        try{
          const res = yield call(reqOperation,actionUrl,{ remark:actionType?rejectRemark:"" });
          notification.success({
            message:res.msg,
          })
          yield put({
            type:'updatePageReducer',
            payload:{
              isShowConfirmModal:false,
            }
          })
          yield put({
            type:"getSupplierInfo"
          })

        }catch(err){
          yield put({
            type:'updatePageReducer',
            payload:{
              isShowConfirmModal:false,
            }
          })
          console.log(err)

        }
    },
    *searchByBrndId({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { brandId, id } = yield select(state=>state.supplierCheckDetail);
      try{
        const res = yield call(reqGoodsSn,{ id: brandId==undefined?"":brandId,supplierId:id});
        yield put({
          type:'updatePageReducer',
          payload:{
            goodsSnMap:res.data,
          }
        })
      }catch(err){
        console.log(err)
      }
    },
   
  *unmount({ payload }, { put }) {
      yield put({
        type: 'unmountReducer',
        payload: {
          ...payload,
        },
      });
    },
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
        supplierLevel:"",
        supplierProperty:"",
        contractExpireDateStart:"",
        contractExpireDateEnd:"",
        supplierName: "",
        mobile: "",
        contact: "",
        payType: "",
        isSign: 1,
        remark: "", 
        brandRemark:"",
        brandList: [],
        brandPolicy:"",
        payMoney: "",
        brandId: "",
        isShowDeleteModal: false,
        id: "",
        goodsList: [],
        currentPage: 1,
        supplierId: "",
        // 当前选中的品牌列表中的id，不是brandId
        supplierBrandId: "",
        goodsInfos: [],
        payType: "",
        total:0,
        brandRemark:"",
        payInfoList: [],
        supplierNameIsChange:0,
        mobileIsChange:0,
        contractExpireDateEndIsChange: 0,
        contractExpireDateStartIsChange:0,
        supplierPropertyIsChange: 0,
        contractListIsChange: 0,
        payInfoListIsChange:0,
        supplierChangeRecordList:[],
        infoBrandId: '',
        changeTimeStart: '',
        changeTimeEnd: '',
        purchaseSupplierGoodsId: '',
        changeType: '',
        createBy: '',
        checkBy: '',
        purchaseGoodsList: [],
        isShowRejectModal:false,
        recordCurPage:1,
        recordPageSize:50,
        pageSize: 50,
        payMethodMap:{},
        supplierGoodsPropertyMap:{},
        supplierLevelMap:{},
        supplierPropertyMap:{},
        contractList:[],
        previewModal:false,
        recordList:[],
        purchaserMap: {},
        contactIsChange:0,
        status:'',
        recordTotal: 0,
        actionList:[],
        brandActionList: [],
        actionType: '',
        actionUrl: '',
        isShowConfirmModal: false,
        rejectRemark: '',
        goodsChangeTypeMap:{},
        brandListMap:{},
        goodsSnMap: {},
        supplierGoodsAllPayMethodMap:{},
      };
    },
  },
};
