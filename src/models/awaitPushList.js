import moment from 'moment';
import { reqList, reqPush, reqRemove, reqStatus, reqCheck, reqRollBack, reqFastPush } from '../services/awaitPushList';
import { stat } from 'fs';
import { notification } from 'antd';

// 定义一个常量来存放下推待出库的状态值
const rollBackStatus = 4;
export default {
  namespace: 'awaitPushList',

  state: {
    // 列表数据
    orderList: [],
    isTableLoading: true,
    statusMap: {},
    typeMap: {},
    canPushMap: [],
    canRollbackMap: [],
    canCheckMap: [],
    // --- 搜索数据 start
    // 总数量
    total: 0,
    // 当前页
    currentPage: 1,
    // 搜索总单号
    sumOrderNum: '',
    // 搜索的收货人
    consignee: '',
    // 订单起始时间
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    // 订单结束时间
    endDate: moment().format('YYYY-MM-DD'),
    // 每页的列表数
    pageSize: 40,
    // 订单类型
    type: undefined,
    // 订单状态
    status: undefined,
    // --- 搜索数据 end
    // 当前要推送的 id
    currentPushOrderId: 100,
    // 是否显示推送弹窗
    isShowPushConfirm: false,
    isPushLoading: false,
    isShowRemoveConfirm: false,
    isRemoveLoading: false,
    isShowCheckConfirm: false,
    isCheckLoading: false,
    selectedRow:{},
    depot: "hxlDepot",
    depotMap: {},
    orderType: "1",
    orderTypeMap: {},
    expressB2CMap:{},
    expressB2BMap: {},
    express: "express_deppon",
    actionList:[],
    storageTypeMap:{},
    storageType:'',
    financeCheckTimeStart:'',
    financeCheckTimeEnd:''
  },
  effects: {
    *mount({ payload }, { call, put }) {
      try {
        const statusConfig = yield call(reqStatus, { ...payload });
        yield put({
          type: 'mountResolved',
          payload: {
            ...payload,
            ...statusConfig.data,
          },
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        // dodo
      }
    },
    *pushToDepot({ payload },{ put, call }) {
      yield put({
        type:'changeSyncItemReducer',
        payload:{
          buttonLoading:true,
        }
      })
      try{
        const res = yield call(reqFastPush);
        notification.success({
          message:res.msg,
          description:<div>
            <p>推送总数:{res.data.totalNum}</p>
            <p>推送成功数:{res.data.successNum}</p>
            <p>推送失败数:{res.data.failNum}</p>
            {
              res.data.failMsg.map(item=>(
                <p key={item}>{item}</p>
              ))
            }
          </div>,
          duration:null
        })
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            buttonLoading:false,
          }
        })
      }catch(err) {
        yield put({
          type:'changeSyncItemReducer',
          payload:{
            buttonLoading:false,
          }
        })
        console.log(err)
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const {
        currentPage,
        sumOrderNum,
        consignee,
        startDate,
        endDate,
        status,
        type,
        pageSize,
        financeCheckTimeStart,
        financeCheckTimeEnd
      } = yield select(state => state.awaitPushList);

      try {
        const list = yield call(reqList, {
          currentPage,
          sumOrderNum,
          consignee,
          startDate,
          endDate,
          status,
          type,
          pageSize,
          financeCheckTimeStart,
          financeCheckTimeEnd
        });
        yield put({
          type: 'getListResolved',
          payload: {
            ...payload,
            ...list.data,
          },
        });
      } catch (error) {
        yield put({
          type: 'getListRejected',
        });
      }
    },
    *changeSyncItem({ payload }, { put }) {
      yield put({
        type: 'changeSyncItemReducer',
        payload,
      });
    },
    *clickPushButton({ payload }, { put }) {
      yield put({
        type: 'showPushConfirmResolved',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkPushButton({ payload }, { call, put }) {
      yield put({
        type: 'pushPending',
      });
      const { currentPushOrderId, orderType, depot, express, storageType } = payload;
      try {
        const res = yield call(reqPush, { id: currentPushOrderId, orderType, depot, express, storageType });
        if(+res.code === 0) {
          notification.success({
            message: res.msg,
          })
        }
        yield put({
          type: 'pushResolved',
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'pushRejected',
        });
      }
    },
    // 取消推送
    *clickCancelPushButton(_, { put }) {
      yield put({
        type: 'cancelShowPushConfirm',
      });
    },
    // 点击销毁
    *clickRemoveButton({ payload }, { put }) {
      yield put({
        type: 'showRemoveConfirmResolved',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkRemoveButton({ payload }, { call, put, select }) {
      const { selectedRow } = yield select(state=>state.awaitPushList)
      yield put({
        type: 'removePending',
      });
      if(+selectedRow.status === rollBackStatus) {
        yield put({
          type: 'removeResolved',
        });
        try {
          const res = yield call(reqRollBack,{id:payload.currentPushOrderId})
          if(+res.code === 0) {
            notification.success({
              message:res.msg
            })
          }
          
          yield put({
            type: 'getList',
          });
        }catch(err) {
          console.log(err)
        }
        
      }else{
        try {
          yield call(reqRemove, { id: payload.currentPushOrderId });
          yield put({
            type: 'removeResolved',
          });
          yield put({
            type: 'getList',
          });
        } catch (error) {
          yield put({
            type: 'removeRejected',
          });
        }
        
      }
     
    },
    // 取消销毁
    *clickCancelRemoveButton(_, { put }) {
      yield put({
        type: 'cancelShowRemoveConfirm',
      });
    },
    *clickCheckButton({ payload }, { put }) {
      yield put({
        type: 'showCheckConfirmResolved',
        payload: {
          ...payload,
        },
      });
    },
    *clickOkCheckButton({ payload }, { call, put }) {
      yield put({
        type: 'checkPending',
      });
      try {
        yield call(reqCheck, { currentPushOrderId: payload.currentPushOrderId });
        yield put({
          type: 'checkResolved',
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'checkRejected',
        });
      }
    },
    // 取消审核
    *clickCancelCheckButton(_, { put }) {
      yield put({
        type: 'cancelShowCheckConfirm',
      });
    },
  },

  reducers: {
    // 显示推送提示窗口
    showPushConfirmResolved(state, { payload }) {
      return {
        ...state,
        isShowPushConfirm: true,
        currentPushOrderId: payload.currentPushOrderId,
      };
    },
    pushPending(state) {
      return {
        ...state,
        isPushLoading: true,
      };
    },
    pushRejected(state) {
      return {
        ...state,
        isPushLoading: false,
        isShowPushConfirm: false,
      };
    },
    pushResolved(state) {
      return {
        ...state,
        isPushLoading: false,
        isShowPushConfirm: false,
      };
    },
    // 取消推送
    cancelShowPushConfirm(state) {
      return {
        ...state,
        isShowPushConfirm: false,
      };
    },
    // 显示销毁提示窗口
    showRemoveConfirmResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowRemoveConfirm: true,
        currentPushOrderId: payload.currentPushOrderId,
      };
    },
    removePending(state) {
      return {
        ...state,
        isRemoveLoading: true,
      };
    },
    removeRejected(state) {
      return {
        ...state,
        isRemoveLoading: false,
        isShowRemoveConfirm: false,
      };
    },
    removeResolved(state) {
      return {
        ...state,
        isRemoveLoading: false,
        isShowRemoveConfirm: false,
      };
    },
    // 取消销毁
    cancelShowRemoveConfirm(state) {
      return {
        ...state,
        isShowRemoveConfirm: false,
      };
    },
    // 显示审核提示窗口
    showCheckConfirmResolved(state, { payload }) {
      return {
        ...state,
        isShowCheckConfirm: true,
        currentPushOrderId: payload.currentPushOrderId,
      };
    },
    checkPending(state) {
      return {
        ...state,
        isCheckLoading: true,
      };
    },
    checkRejected(state) {
      return {
        ...state,
        isCheckLoading: false,
        isShowCheckConfirm: false,
      };
    },
    checkResolved(state) {
      return {
        ...state,
        isCheckLoading: false,
        isShowCheckConfirm: false,
      };
    },
    // 取消审核
    cancelShowCheckConfirm(state) {
      return {
        ...state,
        isShowCheckConfirm: false,
      };
    },
    // change 总单号
    changeSumOrderNum(state, { payload }) {
      return {
        ...state,
        sumOrderNum: payload.sumOrderNum,
      };
    },
    ChangeConsigneeReducer(state, { payload }) {
      return {
        ...state,
        consignee: payload.consignee,
      };
    },
    // 获取列表中
    getListPending(state) {
      return {
        ...state,
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
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        // table: payload.table,
        isTableLoading: false,
        isShowDeleteConfirm: false,
      };
    },
    changeSyncItemReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 获取状态列表成功
    mountResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        // 列表数据
        orderList: [],
        isTableLoading: true,
        statusMap: {},
        typeMap: {},
        canPushMap: [],
        canRollbackMap: [],
        canCheckMap: [],
        // --- 搜索数据 start
        // 总数量
        total: 0,
        // 当前页
        currentPage: 1,
        // 搜索总单号
        sumOrderNum: '',
        // 搜索的收货人
        consignee: '',
        // 订单起始时间
        startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        // 订单结束时间
        endDate: moment().format('YYYY-MM-DD'),
        // 每页的列表数
        pageSize: 40,
        // 订单类型
        type: undefined,
        // 订单状态
        status: undefined,
        // --- 搜索数据 end
        // 当前要推送的 id
        currentPushOrderId: 100,
        // 是否显示推送弹窗
        isShowPushConfirm: false,
        isPushLoading: false,
        isShowRemoveConfirm: false,
        isRemoveLoading: false,
        isShowCheckConfirm: false,
        isCheckLoading: false,
        selectedRow:{},
        depot: "hxlDepot",
        depotMap: {},
        orderType: "1",
        orderTypeMap: {},
        express: "express_deppon",
        expressB2CMap:{},
        expressB2BMap: {},
        actionList:[],
        storageTypeMap:{},
        storageType:'',
        financeCheckTimeStart:'',
        financeCheckTimeEnd:''
      };
    },
  },
};
