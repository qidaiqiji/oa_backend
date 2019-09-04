import moment from 'moment';
import { notification } from 'antd';
import { reqGetOrderInfo, reqGenOutStoreOrder, reqPostRemark, reqPostOrderRemark, reqCancelDelay, reqGetConfig } from '../services/awaitOutStoreList';

export default {
  namespace: 'awaitOutStoreList',

  state: {
    // ------ 搜索项
    // 总单号
    sumOrderNum: '',
    // 创建开始日期
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    // 创建结束日期
    endDate: moment().format('YYYY-MM-DD'),
    // 收货人
    consignee: '',
    // 收货地址
    address: '',
    // ------ 搜索项 end
    // 列表数据
    total: 0,
    currentPage: 1,
    pageSize:40,
    size: 10,
    isLoadingList: true,
    orderList: [
      // {
      //   // 订单 id
      //   id: 0,
      //   // 订单号
      //   no: '',
      //   // 联系人电话
      //   consigneeMobile: '',
      //   // 联系人姓名
      //   consigneeName: '',
      //   // 订单状态
      //   status: '',
      //   // 地址
      //   address: '',
      //   // 备注
      //   remark: '',
      //   goods: [
      //     {
      //       // 商品图标
      //       img: '',
      //       // 商品 id
      //       id: 0,
      //       // 商品名
      //       name: '',
      //       // 商品条码
      //       no: '333',
      //       // 商品数量
      //       num: 333,
      //       // 小计
      //       subtotal: '',
      //     },
      //   ],
      // },
    ],
    // 选择的行 id
    selectedRowIds: [],

    // 选择修改备注的行id
    orderId: '',
    orderRemark: '',

    // 生成出库单弹窗
    isShowGenConfirm: false,
    isGening: false,

    // 修改订单备注弹窗
    isShowRemarkConfirm: false,
    isRemarking: false,
    // 出库单备注
    outStoreRemark: '',
    mergeStatusMap: {},
    sellerMap: {},
  },

  effects: {
    *changeRemarkInput({ payload }, { call }) {
      try {
        yield call(reqPostRemark, { ...payload });
        notification.success({
          message: '备注',
          description: '修改成功！',
        });
      } catch (error) {
        // dodo
      }
    },
    *cancelDelay({ payload }, { call, put, select }) {
      const { currentPage, sumOrderNum, startDate, endDate, consignee, address } = yield select(state => state.awaitOutStoreList);
      try {
        const res = yield call(reqCancelDelay, { ...payload });
        if (res.code === 0) {
          yield put({
            type: 'getOrderList',
            payload: {
              currentPage,
              sumOrderNum,
              startDate,
              endDate,
              consignee,
              address,
            },
          });
        }
      } catch (error) {
        // do something
      }
    },
    *getConfig(_, { call, put }) {
      try {
        const res = yield call(reqGetConfig);
        yield put({
          type: 'updataReducer',
          payload: {
            ...res.data,
          },
        });
      } catch (error) {
        
      }
    },
    *getOrderList({ payload }, { call, put, select }) {
      yield put({
        type: 'getOrderListPending',
        payload:{
          ...payload,
        }
      });
      const { currentPage, sumOrderNum, startDate, endDate, consignee, address, seller, status, pageSize } = yield select(state=>state.awaitOutStoreList)
      try {
        const orderList = yield call(reqGetOrderInfo, { currentPage, sumOrderNum, startDate, endDate, consignee, address, seller, status, pageSize });
        yield put({
          type: 'getOrderListResolved',
          payload: {
            ...orderList.data,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getOrderListRejected',
        });
      }
    },
    *clickRows({ payload }, { put }) {
      yield put({
        type: 'clickRowsReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeConsignee({ payload }, { put }) {
      yield put({
        type: 'changeConsigneeReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeSumOrderNum({ payload }, { put }) {
      yield put({
        type: 'changeSumOrderNumReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeAddress({ payload }, { put }) {
      yield put({
        type: 'changeAddressReducer',
        payload: {
          ...payload,
        },
      });
    },
    // *changeDate({ payload }, { put }) {
    //   // ???
    // },
    *reset(_, { put }) {
      yield put({
        type: 'resetReducer',
      });
    },
    *clickGenButton(_, { put }) {
      yield put({
        type: 'clickGenButtonReducer',
      });
    },
    *clickCancelGenButton(_, { put }) {
      yield put({
        type: 'clickCancelGenButtonReducer',
      });
    },
    *clickOkGenButton({ payload }, { put, call }) {
      yield put({
        type: 'genPending',
      });
      const { selectedRowIds, orderList, outStoreRemark } = payload;
      const siftOrder = orderList.filter((order) => {
        return selectedRowIds.indexOf(order.id) >= 0;
      });
      const ids = selectedRowIds.filter((selectedRowId) => {
        for (const order of siftOrder) {
          if (order.id === selectedRowId) {
            return order.status === 0;
          }
        }
      });
      try {
        yield call(reqGenOutStoreOrder, { ids, outStoreRemark });
        yield put({
          type: 'genResolved',
        });
        yield put({
          type: 'getOrderListPending',
        });
        try {
          const orderRes = yield call(reqGetOrderInfo, { ...payload.searchOptions });
          yield put({
            type: 'getOrderListResolved',
            payload: {
              ...orderRes.data,
            },
          });
        } catch (error) {
          yield put({
            type: 'getOrderListRejected',
          });
        }
      } catch (error) {
        yield put({
          type: 'genRejected',
        });
      }
    },
    *clickOrderRemark({ payload }, { put }) {
      yield put({
        type: 'clickOrderRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickCancleRemarkButton(_, { put }) {
      yield put({
        type: 'clickCancleRemarkButtonReducer',
      });
    },
    *changeOrderRemark({ payload }, { put }) {
      yield put({
        type: 'changeOrderRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeOutStoreRemark({ payload }, { put }) {
      yield put({
        type: 'changeOutStoreRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkRemarkButton(_, { put, call, select }) {
      const awaitOutStoreList = yield select(state => state.awaitOutStoreList);
      const { orderId, orderRemark, currentPage,
        sumOrderNum,
        startDate,
        endDate,
        consignee,
        address } = awaitOutStoreList;
      yield put({
        type: 'clickOkRemarkButtonPending',
      });
      try {
        yield call(reqPostOrderRemark, { orderId, remark: orderRemark });
        yield put({
          type: 'clickOkRemarkButtonReducer',
        });
        yield put({
          type: 'getOrderList',
          payload: {
            currentPage,
            sumOrderNum,
            startDate,
            endDate,
            consignee,
            address,
          },
        });
      } catch (error) {
        // to do
      }
    },
    *handleChangeSeller( {payload },{ put }) {


    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    // *fetch({payload}, { call, put }) {
    // const response = yield call(fakeChartData);
    // yield put({
    //   type: 'save',
    //   payload: response,
    //   });
    // },
  },

  reducers: {
    clickOkRemarkButtonReducer(state) {
      return {
        ...state,
        isShowRemarkConfirm: false,
        isRemarking: false,
      };
    },
    clickOkRemarkButtonPending(state) {
      return {
        ...state,
        isRemarking: true,
      };
    },
    changeOutStoreRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeOrderRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clickCancleRemarkButtonReducer(state) {
      return {
        ...state,
        isShowRemarkConfirm: false,
        orderRemark: '',
        orderId: '',
      };
    },
    clickOrderRemarkReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRemarkConfirm: true,
      };
    },
    clickRowsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeConsigneeReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSumOrderNumReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeAddressReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updataReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        // ------ 搜索项
        // 总单号
        sumOrderNum: '',
        // 创建开始日期
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        // 创建结束日期
        endDate: moment().format('YYYY-MM-DD'),
        // 收货人
        consignee: '',
        // 收货地址
        address: '',
        // ------ 搜索项 end
        // 列表数据
        total: 0,
        pageSize:40,
        currentPage: 1,
        size: 10,
        isLoadingList: true,
        orderList: [
          {
            // 订单 id
            id: 0,
            // 订单号
            no: '',
            // 联系人电话
            consigneeMobile: '',
            // 联系人姓名
            consigneeName: '',
            // 订单状态
            status: '',
            // 地址
            address: '',
            // 备注
            remark: '',
            goods: [
              {
                // 商品图标
                img: '',
                // 商品 id
                id: 0,
                // 商品名
                name: '',
                // 商品条码
                no: '333',
                // 商品数量
                num: 333,
                // 小计
                subtotal: '',
              },
            ],
          },
        ],
        // 选择的行 id
        selectedRowIds: [],

        // 选择修改备注的行id
        orderId: '',
        orderRemark: '',

        // 生成出库单弹窗
        isShowGenConfirm: false,
        isGening: false,

        // 修改订单备注弹窗
        isShowRemarkConfirm: false,
        isRemarking: false,
        // 出库单备注
        outStoreRemark: '',
        mergeStatusMap: {},
        sellerMap: {},
      };
    },
    getOrderListPending(state,{ payload }) {
      return {
        ...state,
        ...payload,
        isLoadingList: true,
      };
    },
    getOrderListRejected(state, { payload }) {
      return {
        ...state,
        isLoadingList: false,
      };
    },
    getOrderListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        selectedRowIds: [],
        isLoadingList: false,
      };
    },
    clickGenButtonReducer(state) {
      return {
        ...state,
        isShowGenConfirm: true,
      };
    },
    clickCancelGenButtonReducer(state) {
      return {
        ...state,
        isShowGenConfirm: false,
        outStoreRemark: '',
      };
    },
    genPending(state) {
      return {
        ...state,
        isGening: true,
      };
    },
    genRejected(state) {
      return {
        ...state,
        isShowGenConfirm: false,
        isGening: false,
      };
    },
    genResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowGenConfirm: false,
        isGening: false,
      };
    },
    resetReducer(state) {
      return {
        ...state,
        sumOrderNum: '',
        // 创建开始日期
        startDate: '',
        // 创建结束日期
        endDate: '',
        // 收货人
        consignee: '',
      };
    },
    // save(state, { payload }) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // }
  },
};
