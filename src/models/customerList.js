import moment from 'moment';
import { reqGetCustomerListConfig, reqGetCustomerList, reqInviterMap, checkType, reqBind, reqCustomerDetail, newServiceRecord, createServiceTypeReq } from '../services/customerList';
import { notification } from 'antd';
import { stat } from 'fs';

export default {
  namespace: 'customerList',

  state: {
    customerActionList: [],
    hiddenItem: {},
    customerId: '',
    customerKeywords: '',
    goodsSn: '',
    regStartDate: '',
    regEndDate: '',
    payStartDate: '',
    payEndDate: '',
    // 配置项
    seller: '',
    sellerMap: {},
    sellerTeam: '',
    sellerTeamMap: {},
    area: [],
    areaMap: {},
    customerTag: [],
    customerTagMap: {},
    customerType: [],
    customerTypeMap: {},
    customerSource: [],
    customerSourceMap: {},
    saleAmountPerMonth: [],
    saleAmountPerMonthMap: {},
    importedPercent: [],
    importedPercentMap: {},
    duty: [],
    dutyMap: {},
    payMethod: [],
    payMethodMap: {},
    userRank: [],
    userRankMap: {}, // 配置项
    isLoadingConfig: true,
    sort: '', // 排序的类型 reg_time(注册时间), storeNum(店铺数量),totalOrderAmount(订单金额),lastPayTime(下单时间)
    order: 0, // 0为降序， 1为升序
    currentPage: 1,
    pageSize: 50,
    viewMoreStatus: 0,
    total: '', // 列表总条数
    customerInfo: [], // 客户列表数据
    isLoading: false,
    selectOrderIds: [],
    inviter: "",
    inviterMap:{},
    areaManagerId:'',
    provinceManagerId:'',
    stateManagerId:'',
    agentMap:{},
    areaAgentId:'',
    areaManagerList:{},
    provinceManagerList:{},
    stateManagerList:{},
    salerList:{},
    selectRows:[],
    showModal:false,
    sellerTypeMap:{},
    disabled:false,
    name:[],
    lostStartDate:"",
    lostEndDate:"",
    lastMonthPaid:'',
    isShowCreateServiceTypeModal:false,
    confirmLoading:false,
    isShowNewServiceRecordModal:false,
    serviceTypeMap: {},
    customerDetail:{},
    lastLoginStartTime:'',
    lastLoginEndTime:''
  },

  effects: {
    *mount(_, { put }) {
      yield put({
        type: 'getConfig',
      });
    },
    *getConfig(_, { put, call }) {
      try {
        const res = yield call(reqGetCustomerListConfig);
        yield put({
          type: 'configReducer',
          payload: {
            ...res.data,
          },
        });
        yield put({
          type: 'getList',
        });
      } catch (error) {
        yield put({
          type: 'updateConfig',
          payload: {
            isLoadingConfig:false,
          },
        });
        // to do
      }
    },
    *changeConfig({ payload }, { put }) {
      yield put({
        type: 'updateConfig',
        payload: {
          ...payload,
        },
      });
    },
    *getList({ payload }, { put, call, select }) {
      yield put({
        type: 'getListPending',
        payload: {
          ...payload,
        },
      });
      const customerList = yield select(state => state.customerList);
      const {
        customerId,
        customerKeywords,
        goodsSn,
        regStartDate,
        regEndDate,
        payStartDate,
        payEndDate,
        seller,
        currentPage,
        pageSize,
        sort,
        order,
        sellerTeam,
        area,
        customerTag,
        customerType,
        customerSource,
        saleAmountPerMonth,
        importedPercent,
        duty,
        payMethod,
        userRank,
        inviter,
        areaManagerId,
        provinceManagerId,
        stateManagerId,
        areaAgentId,
        lostStartDate,
        lostEndDate,
        lastMonthPaid,
        lastLoginStartTime,
        lastLoginEndTime
      } = customerList;
      try {
        const res = yield call(reqGetCustomerList, {
          customerId,
          customerKeywords,
          goodsSn,
          regStartDate,
          regEndDate,
          payStartDate,
          payEndDate,
          seller,
          currentPage,
          pageSize,
          sort,
          order,
          sellerTeam,
          area,
          customerTag,
          customerType,
          customerSource,
          saleAmountPerMonth,
          importedPercent,
          duty,
          payMethod,
          userRank,
          checkStatus: 2,
          inviter,
          areaManagerId,
          provinceManagerId,
          stateManagerId,
          areaAgentId,
          lostStartDate,
          lostEndDate,
          lastMonthPaid,
          lastLoginStartTime,
          lastLoginEndTime
        });
        yield put({
          type: 'getListResolved',
          payload: {
            total: res.data.total,
            customerInfo: res.data.customerList,
            ...res.data,
          },
        });
      } catch (error) {
        // to do
      }
    },
    // *getConfigList({ payload },{ put, call, select }) {
    //   if(payload.keywords == "") {
    //     yield put({
    //       type: 'getList',
    //       payload: {
    //         inviter:''
    //       },
    //     });
    //   }else{
    //     try {
    //       const configZhi = yield call(reqInviterMap, { keywords: payload.keywords });
    //       yield put({
    //         type: 'getListResolved',
    //         payload: {
    //           keywords: payload.keywords,
    //           inviterMap: configZhi.data.list,
    //         },
    //       });
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // },
    *selectType({ payload },{ put, call, select }) {
      const { selectOrderIds } = yield select(state=>state.customerList)
      try{
        const res = yield call(checkType,{ type:payload.type, userIdList:selectOrderIds });
        yield put({
          type:'updateConfig',
          payload:{
            name:res.data.name,
            disabled:+res.data.code
          }
        })

      }catch(err){
      }
    },
    *confirmBind({ payload },{ put, call, select }) {
      const { values,selectOrderIds } = yield select(state=>state.customerList);
      try{
        const res = yield call(reqBind,{ ...values, userIdList:selectOrderIds });
        notification.success({
          message:res.msg
        })
        yield put({
          type:"updateConfig",
          payload:{
            ...payload,
          }
        })
        yield put({
          type:'getList'
        })
      }catch(err){
        console.log(err)
      }
    },
    *changeViewMore(_, { put, select }) {
      const customerList = yield select(state => state.customerList);
      const { viewMoreStatus } = customerList;
      yield put({
        type: 'viewMoreStatusReducer',
        payload: {
          viewMoreStatus: !viewMoreStatus,
        },
      });
    },
    *changeSelectOrderIds({ payload }, { put }) {
      yield put({
        type: 'changeSelectOrderIdsReducer',
        payload,
      });
    },
    *changeSortList({ payload }, { put, select }) {
      const customerList = yield select(state => state.customerList);
      const { sort, order } = customerList;
      yield put({
        type: 'getList',
        payload: {
          ...payload,
          order: (payload.sort !== sort) ? 1 : Number(!order),
        },
      });
    },
    *emptySiftItem(_, { put }) {
      yield put({
        type: 'getList',
        payload: {
          customerId: '',
          customerKeywords: '',
          goodsSn: '',
          regStartDate: '',
          regEndDate: '',
          payStartDate: '',
          payEndDate: '',
          seller: '',
          currentPage: 1,
          pageSize: 50,
          sort: '',
          order: 0,
          sellerTeam: '',
          area: [],
          customerTag: [],
          customerType: [],
          customerSource: [],
          saleAmountPerMonth: [],
          importedPercent: [],
          duty: [],
          payMethod: [],
          userRank: [],
          lastMonthPaid:'',
          lostStartDate:"",
          lostEndDate:""
        },
      });
    },
    *getCustomerDetail({ payload },{ put, call, select }){
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload
          }
        })
        const { currentCustomerId } = yield select(state=>state.customerList);
        try{
          const res = yield call(reqCustomerDetail,{ customerId:currentCustomerId });
          yield put({
            type:'updatePageReducer',
            payload:{
              customerDetail:res.data.customerInfo,
            }
          })
        }catch(err){

        }
    },
    *newCustomerServiceRecord({ payload }, { put, call }) {
      const { currentCustomerId, serviceContent, serviceType } = payload;
      try {
        yield call(newServiceRecord, {customerId: currentCustomerId, serviceContent, serviceType });
          notification.success({
            message: '成功提示',
            description: '新建客勤记录成功！',
          });
          yield put({
            type:'updatePageReducer',
            payload:{
              isShowNewServiceRecordModal:false,
              serviceContentInput:'',
              serviceType:''
            }
          })
          yield put({
            type: 'getList',
          });
      } catch (error) {
        console.log(error)
      }
    },
    *createServiceType({ payload }, { put, call }) {
      const { serviceTypeName } = payload;
      try {
        yield put({
          type: 'updatePageReducer',
        });
        const res = yield call(createServiceTypeReq, { serviceTypeName });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新建客勤类型成功！',
          });
          yield put({
            type: 'updatePageReducer',
            payload: {
              ...res.data,
              isShowCreateServiceTypeModal:false
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        yield put({
          type: 'updatePageReducer',
          payload:{
            isShowCreateServiceTypeModal:false
          }
        });
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    changeSelectOrderIdsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    getListPending(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: true,
      };
    },
    viewMoreStatusReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    configReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoadingConfig: false,
      };
    },
    updatePageReducer(state,{ payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    
    unmountReducer() {
      return {
        customerActionList: [],
        hiddenItem: {},
        customerId: '',
        customerKeywords: '',
        goodsSn: '',
        regStartDate: '',
        regEndDate: '',
        payStartDate: '',
        payEndDate: '',
        // 配置项
        seller: '',
        sellerMap: {},
        sellerTeam: '',
        sellerTeamMap: {},
        area: [],
        areaMap: {},
        customerTag: [],
        customerTagMap: {},
        customerType: [],
        customerTypeMap: {},
        customerSource: [],
        customerSourceMap: {},
        saleAmountPerMonth: [],
        saleAmountPerMonthMap: {},
        importedPercent: [],
        importedPercentMap: {},
        duty: [],
        dutyMap: {},
        payMethod: [],
        payMethodMap: {},
        userRank: [],
        userRankMap: {}, // 配置项
        isLoadingConfig: true,
        sort: '', // 排序的类型 reg_time(注册时间), storeNum(店铺数量),totalOrderAmount(订单金额),lastPayTime(下单时间)
        order: 0, // 0为降序， 1为升序
        currentPage: 1,
        pageSize: 50,
        viewMoreStatus: 0,
        total: '', // 列表总条数
        customerInfo: [], // 客户列表数据
        isLoading: false,
        selectOrderIds: [],
        inviter: "",
        inviterMap:{},
        areaManagerId:'',
        provinceManagerId:'',
        stateManagerId:'',
        agentMap:{},
        areaAgentId:'',
        areaManagerList:{},
        provinceManagerList:{},
        stateManagerList:{},
        salerList:{},
        selectRows:[],
        showModal:false,
        sellerTypeMap:{},
        disabled:false,
        name:[],
        lostStartDate:"",
        lostEndDate:"",
        lastMonthPaid:'',
        isShowCreateServiceTypeModal:false,
        confirmLoading:false,
        isShowNewServiceRecordModal:false,
        serviceTypeMap: {},
        customerDetail:{},
        lastLoginStartTime:'',
        lastLoginEndTime:''
      };
    },
  },
};
