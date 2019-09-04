import moment from 'moment';
import { reqGetConfig, reqConfig, reqRejectOrder, reqCheckOrder, reqList, reqSupplierSuggest, reqDeleteOrder, reqApplyMoney, reqOkEditRemarkModal } from '../services/commonPurchaseList';

export default {
  namespace: 'commonPurchaseList',

  state: {
    // 列表数据
    table: [],
    isTableLoading: true,

    // --- 搜索数据
    // 总数量
    total: 0,
    // 当前页
    curPage: 1,
    // 搜索的供应商 id
    supplierId: 0,
    // 搜索的供应商文案
    supplierSearchText: '',
    // 每页的列表数
    pageSize: 40,
    // 订单状态
    status: '0',
    shippingStatus: '-1',
    // 订单号
    storeNo: '',
    purchaser: 0,
    // 支付方式
    payType: -1,
    // 开始时间
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    // 结束时间
    endDate: moment().format('YYYY-MM-DD'),
    // 采购单号
    purchaseOrderId: '',

    // 搜索供应商的 suggest
    supplierSuggest: [],

    purchaseOrderStatusMap: {},

    // 选择了第一个行时获取的供应商名字
    supplierName: '',

    // --- 删除订单数据 start
    // 要删除的订单 id
    deleteOrderId: null,
    isDeleting: false,
    isShowDeleteModal: false,

    // --- 审核订单数据 statrt
    checkOrderId: null,
    isChecking: false,
    isShowCheckModal: false,
    // --- 审核订单数据 end
    // --- 驳回订单数据 start
    rejectOrderId: null,
    isRejecting: false,
    isShowRejectModal: false,
    // --- 驳回订单数据 end

    // --- 申请货款
    isShowApplyMoneyModal: false,
    isApplying: false,
    selectedRows: [],

    purchaserMap: {},
    // ---支付方式
    paymentMethod: {},

    // --- 备注修改
    isShowEditRemarkModal: false,
    isEditingRemark: false,
    orderId: null,
    orderRemark: '',
    isBack:"",
    brandName:"",
    snNo:"",
    brandListMap:[],
    purchaseOrderStatusListMap:{},
    goodsSn:"",
    brandId:"",
    purchaseShippingStatus:{},
    payTimeStart: '',
    payTimeEnd: '',
  },
  effects: {
    *getList({ payload }, { put, select, call }) {
      yield put({
        type: 'getListPending',
        payload:{
          ...payload,
        }
      });
      const {
        pageSize,
        curPage,
        supplierId,
        status,
        startDate,
        endDate,
        purchaseOrderId,
        storeNo,
        purchaser,
        payType,
        shippingStatus,
        isBack,
        brandId,
        goodsSn,
        payTimeStart,
        payTimeEnd,
      } = yield select(state => state.commonPurchaseList);
      try {
        const order = yield call(reqList, {
          pageSize,
          curPage,
          supplierId,
          type: 1,
          status,
          startDate,
          endDate,
          purchaseOrderId,
          storeNo,
          purchaser,
          payType,
          shippingStatus,
          isBack,
          brandId,
          goodsSn,
          payTimeStart,
          payTimeEnd,
        });
        order.data.table.map(item=>{
          item.isChange=false;
        })
        const config = yield call(reqGetConfig);
        yield put({
          type: 'getListResolved',
          payload: {
            ...order.data,
            ...payload,
            purchaserMap: config.data.purchaserMap,
            paymentMethod :config.data.paymentMethod
          },
        });
      } catch (error) {
        yield put({
          type: 'getListRejected',
        });
      }
    },
    *getConfig({ payload },{ put, call }) {
      try{
        const config = yield call(reqConfig);
        const brandListMap = config.data.brandListMap;
        let sortedBrandListMap = [];
        Object.keys(brandListMap).map(item=>{
          sortedBrandListMap.push({id:item,value:brandListMap[item]})
        })
        sortedBrandListMap.sort((a,b)=>{
          return b.id-a.id
        })
        yield put({
          type:'clickRowsReducer',
          payload:{
            ...config.data,
            brandListMap:sortedBrandListMap,
          }
        })

      }catch(err){
        console.log(err)
      }
  },
    *triggerEditRemarkModal({ payload }, { put,select }) {
      const { orderId } = payload;
      const { table } = yield select(state=>state.commonPurchaseList);
      let orderRemark = "";
      table.map(item=>{
        if(+item.id === +orderId) {
          if(!item.isChange) {
            orderRemark = item.remark;
          }
        }
      })
      yield put({
        type: 'triggerEditRemarkModalReducer',
        payload:{
          orderRemark,
          orderId,
        },
      });
    },
    *okEditRemarkModal(_, { put, select, call }) {
      yield put({
        type: 'okEditRemarkModalPending',
      });
      const {
        orderId,
        orderRemark,
      } = yield select(state => state.commonPurchaseList);
      try {
        yield call(reqOkEditRemarkModal, { orderId, remark: orderRemark });
        yield put({
          type: 'okEditRemarkModalResolved',
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'okEditRemarkModalRejected',
        });
      }
    },
    *changeOrderRemark({ payload }, { put }) {
      yield put({
        type: 'changeOrderRemarkReducer',
        payload,
      });
    },

    // 点击申请货款按钮
    *triggerApplyMoneyModal(_, { put }) {
      yield put({
        type: 'triggerApplyMoneyModalReducer',
      });
    },
    // 确认申请货款按钮
    *okApplyMoneyModal(_, { put, call, select }) {
      yield put({
        type: 'okApplyMoneyModalPending',
      });
      const {
        selectedRows,
      } = yield select(state => state.commonPurchaseList);
      try {
        yield call(reqApplyMoney, { ids: selectedRows });
        yield put({
          type: 'okApplyMoneyModalResolved',
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'okApplyMoneyModalRejected',
        });
      }
    },

    // 选择行
    *clickRows({ payload }, { put }) {
      yield put({
        type: 'clickRowsReducer',
        payload: {
          ...payload,
        },
      });
    },

    // 删除订单相关
    *triggerDeleteModal({ payload }, { put }) {
      yield put({
        type: 'triggerDeleteModal',
        payload,
      });
    },
    *okDeleteModal({ payload }, { call, put, select }) {
      const { deleteOrderId } = yield select(state => state.commonPurchaseList);
      yield put({
        type: 'okDeleteModalPending',
      });
      try {
        yield call(reqDeleteOrder, { id: deleteOrderId });
        yield put({
          type: 'okDeleteModalResolved',
        });
        yield put({
          type: 'getList',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'okDeleteModalRejected',
        });
      }
    },

    // ????
    *clickCancelDeleteButton({ payload }, { put }) {
      yield put({
        type: 'cancelDeleteConfirm',
        payload: {
          ...payload,
        },
      });
    },

    // 驳回订单
    *triggerRejectModal({ payload }, { put }) {
      yield put({
        type: 'triggerRejectModalReducer',
        payload,
      });
    },
    *okRejectModal({ payload }, { call, put, select }) {
      const { rejectOrderId } = yield select(state => state.commonPurchaseList);
      yield put({
        type: 'okRejectModalPending',
      });
      try {
        yield call(reqRejectOrder, { id: rejectOrderId });
        yield put({
          type: 'okRejectModalResolved',
        });
        yield put({
          type: 'getList',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'okRejectModalRejected',
        });
      }
    },

    // 通过审核相关
    *triggerCheckModal({ payload }, { put }) {
      yield put({
        type: 'triggerCheckModalReducer',
        payload,
      });
    },
    *okCheckModal({ payload }, { call, put, select }) {
      const { checkOrderId } = yield select(state => state.commonPurchaseList);
      yield put({
        type: 'okCheckModalPending',
      });
      try {
        yield call(reqCheckOrder, { id: checkOrderId });
        yield put({
          type: 'okCheckModalResolved',
        });
        yield put({
          type: 'getList',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'okCheckModalReject',
        });
      }
    },
    *changeSyncItem({ payload }, { put }) {
      yield put({
        type: 'changeSyncItemReducer',
        payload,
      });
    },
    *changeSupplier({ payload }, { put, call, select }) {
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
          type: 'getList',
        });
        return;
      }
      try {
        const res = yield call(reqSupplierSuggest, { keywords: payload.supplierSearchText });
        yield put({
          type: 'changeSupplierResolved',
          payload: {
            supplierSearchText: payload.supplierSearchText,
            supplierSuggest: res.data.suppliers,
          },
        });
      } catch (error) {
        yield put({
          type: 'changeSupplierRejected',
        });
      }
    },
    *handleChangeOrderRemark({ payload }, { put }) {
      yield put({
        type: 'changeOrderRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    changeOrderRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickRowsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // delete order
    triggerDeleteModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowDeleteModal: !state.isShowDeleteModal,
      };
    },
    okDeleteModalPending(state) {
      return {
        ...state,
        isDeleting: true,
      };
    },
    okDeleteModalRejected(state) {
      return {
        ...state,
        isDeleting: false,
      };
    },
    okDeleteModalResolved(state) {
      return {
        ...state,
        isDeleting: false,
        isShowDeleteModal: false,
      };
    },

    // check order
    triggerCheckModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowCheckModal: true,
      };
    },
    cancelCheckConfirm(state) {
      return {
        ...state,
        isShowCheckModal: false,
      };
    },


    // reject order
    triggerRejectModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRejectModal: !state.isShowRejectModal,
      };
    },
    okRejectModalPending(state) {
      return {
        ...state,
        isRejecting: true,
      };
    },
    okRejectModalRejected(state) {
      return {
        ...state,
        isRejecting: false,
        isShowRejectModal: false,
      };
    },
    okRejectModalResolved(state) {
      return {
        ...state,
        isRejecting: false,
        isShowRejectModal: false,
      };
    },

    triggerCheckModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowCheckModal: !state.isShowCheckModal,
      };
    },
    okCheckModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isChecking: true,
      };
    },
    okCheckModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isChecking: false,
        isShowCheckModal: false,
      };
    },
    okCheckModalReject(state, { payload }) {
      return {
        ...state,
        ...payload,
        isChecking: false,
      };
    },

    changeSyncItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
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
    getListRejected(state) {
      return {
        ...state,
        isTableLoading: false,
      };
    },
    // 获取列表成功
    getListResolved(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isTableLoading: false,
        selectedRows: [],
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
    // 获取提供商搜索列表
    changeSupplierResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    showApplyMoneyConfirmPending(state) {
      return {
        ...state,
      };
    },
    triggerEditRemarkModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowEditRemarkModal: !state.isShowEditRemarkModal,
      };
    },
    okEditRemarkModalPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isEditingRemark: true,
      };
    },
    okEditRemarkModalResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowEditRemarkModal: false,
        isEditingRemark: false,
        orderRemark: '',
      };
    },
    okEditRemarkModalRejected(state, { payload }) {
      return {
        ...state,
        ...payload,
        isEditingRemark: false,
      };
    },
    changeOrderRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    triggerApplyMoneyModalReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowApplyMoneyModal: !state.isShowApplyMoneyModal,
      };
    },
    okApplyMoneyModalPending(state) {
      return {
        ...state,
        isApplying: true,
      };
    },
    okApplyMoneyModalRejected(state) {
      return {
        ...state,
        isApplying: false,
        isShowApplyMoneyModal: false,
      };
    },
    okApplyMoneyModalResolved(state) {
      return {
        ...state,
        isApplying: false,
        isShowApplyMoneyModal: false,
      };
    },
    unmountReducer() {
      return {
        // 列表数据
        table: [],
        isTableLoading: true,

        // --- 搜索数据 start
        // 总数量
        total: 0,
        // 当前页
        curPage: 1,
        // 搜索的供应商 id
        supplierId: 0,
        // 搜索的供应商文案
        supplierSearchText: '',
        // 每页的列表数
        pageSize: 40,

        // 订单状态
        status: '0',
        shippingStatus: '-1',
        // 订单号
        storeNo: '',
        // --- 搜索数据 end
        // 开始时间
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        // 结束时间
        endDate: moment().format('YYYY-MM-DD'),

        // 搜索供应商的 suggest
        supplierSuggest: [],

        purchaseOrderStatusMap: {},

        // 选择的订单 id
        selectedRows: [],
        // 选择了第一个行时获取的供应商名字
        supplierName: '',

        // --- 删除订单数据 start
        // 要删除的订单 id
        deleteOrderId: null,
        // 删除中...
        isDeleting: false,
        // 是否显示删除弹窗
        isShowDeleteModal: false,
        // --- 删除订单数据 end

        // --- 审核订单数据 statrt
        checkOrderId: null,
        isChecking: false,
        isShowCheckModal: false,
        // --- 审核订单数据 end
        // --- 驳回订单数据 start
        rejectOrderId: null,
        isRejecting: false,
        isShowRejectModal: false,
        // --- 驳回订单数据 end

        // --- 申请货款
        isShowApplyMoneyModal: false,
        isApplying: false,

        purchaserMap: {},
        // ----支付方式
        paymentMethod :{},

        // --- 备注修改
        isShowEditRemarkModal: false,
        isEditingRemark: false,
        
        orderId: null,
        orderRemark: '',
        payType: -1,
        isBack:"",
        brandName:"",
        snNo:"",
        brandListMap:[],
        purchaseOrderStatusListMap:{},
        goodsSn:"",
        brandId:"",
        purchaseShippingStatus:{},
        payTimeStart: '',
        payTimeEnd: '',
      };
    },
  },
};
