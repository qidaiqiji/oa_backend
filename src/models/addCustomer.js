import { routerRedux } from 'dva/router';
import {
  reqAuth, reqGetCustomerConfig, reqGetCustomerInfo, reqCreateUser, reqCreateSystem,
  reqEditUser, reqCreateCondition, reqAccounttermcondition,reqChangeDefault
} from '../services/addCustomer';
import { pick } from '../utils/utils';
import { notification } from 'antd/lib/index';
import {
  commitServiceRecord, createServiceTypeReq, deleteRecordReq, newServiceRecord, reqServiceRecord,
  updateServiceRecord,
} from '../services/customerDetail';

export default {
  namespace: 'addCustomer',

  state: {
    showRadio: 0,
    radioIndex: 0,

    customerId: 0, // 客户ID，用来判断当前是新建客户还是修改客户
    userName: '', // 账号
    mobile: '', // 手机号码
    password: '', // 密码
    customerSource: 0, // 客户来源
    customerSystem: 0, // 客户所属体系
    customerName: '', // 客户姓名
    duty: '', // 职位
    companyName: '', // 公司名称
    storeNum: 0, // 店铺数量
    province: 0, // 省份
    city: 0, // 城市
    customerType: 0, // 客户类型
    importedPercent: 0, // 进口品占比
    saleAmountPerMonth: 0, // 月销售额
    channel: 0, // 了解小美诚品的渠道
    userRank: 0, // 客户级别
    checkStatus: 0, // 客户审核状态
    sex: 0, // 性别
    birthday: '', // 生日
    contact: '', // 联系人姓名
    shopFront: '', // 门头照片
    license: '', // 营业执照照片
    seller: 0, // 绑定的销售
    sellerLeader: 0, // 绑定的销售主管
    remark: '', // 备注
    sendSms: 1, // 是否发送审核短信给客户
    log: '', // 审核客勤日志
    area: [], // 省和市的合并结果，数组的第一个元素表示省，第二个元素表示市
    isLoading: false, // 是否提交中
    dutyMap: {}, // 职位的配置项
    typeMap: {}, // 客户类型配置项
    systemMap: {}, // 所属体系配置项
    importedPercentMap: {}, // 进口品占比配置项
    saleAmountPerMonthMap: {}, // 月销售额配置项
    channelMap: {}, // 客户知道小美的渠道配置项
    userRankMap: {}, // 客户级别配置项
    sellerMap: {}, // 绑定销售配置项
    sellerTeamMap: {}, // 绑定销售主管配置项
    isCheckedStatusMap: {}, // 审核状态配置项
    sexMap: {}, // 性别配置项


    showCreditInfo: 0, // 登录用户权限
    payConditionMap: {}, // 账期条件配置
    customerPayTypeMap: [], // 客户类型配置
    customerPayType: 0, // 客户类型
    payCondition: [], // 账期条件
    hasContract: 0, // 是否签订合同

    serviceRecord: [],
    isShowNewServiceRecordModal: false,
    serviceTypeMap: {},
    confirmLoading: false,
    viewServiceRecordId: '',
    viewServiceRecord: {},
    serviceTypeInput: '请选择客勤类型',
    serviceContentInput: '',
    isShowCreateServiceTypeModal: false,
    isShowCreateSystemModal: false,
    isCreateCondition: false,
    createServiceType: '',
    createSystem: '',
    createCondition: '',
    hidden: false,
    refuseMap:[],
    areaManagerId:'',
    provinceManagerId:'',
    stateManagerId:'',
    areaAgentId:'',
    sellerId:'',
    assistantId: '',
    agentMap:{},
    sellerPhoneMap:{}
  },

  effects: {
    *mount({ payload }, { put, call, all }) {
      const { id, showRadio } = payload;
      if (id > 0) {
        try {
          const [configRsp, customerRsp, serviceRsp] = yield all([
            call(reqGetCustomerConfig),
            call(reqGetCustomerInfo, { customerId: id }),
            call(reqServiceRecord, { customerId: id }),
          ]);
          yield put({
            type: 'mountReducer',
            payload: {
              province: 0,
              city: 0,
              ...configRsp.data,
              ...customerRsp.data.customerInfo,
              ...customerRsp.data,
              hidden: customerRsp.data.hidden,
              seller: customerRsp.data.customerInfo.sellerId,
              serviceRecord: serviceRsp.data.serviceList,
              customerId: id,
              showRadio,
            },
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const configRsp = yield call(reqGetCustomerConfig);
          yield put({
            type: 'mountReducer',
            payload: {
              province: 0,
              city: 0,
              ...configRsp.data,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    *unmount({ payload }, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *commit({ payload }, { put, call, select, all }) {
      const data = yield select(state => state.addCustomer);
      const params = pick(data,
        'customerId',
        'userName',
        'mobile', // 手机号码
        'password', // 密码
        'customerSystem', // 客户所属体系
        'customerName', // 客户姓名
        'duty', // 职位
        'companyName', // 公司名称
        'storeNum', // 店铺数量
        'customerType', // 客户类型
        'importedPercent', // 进口品占比
        'saleAmountPerMonth', // 月销售额
        'channel', // 了解小美诚品的渠道
        'userRank', // 客户级别
        'checkStatus', // 客户审核状态
        'sex', // 性别
        'birthday', // 生日
        'contact', // 联系人姓名
        'shopFront', // 门头照片
        'license', // 营业执照照片
        'seller', // 绑定的销售
        'sellerLeader', // 绑定的销售主管
        'remark', // 备注
        'sendSms', // 是否发送审核短信给客户
        'log', // 审核客勤日志
        'province', // 省份
        'city', // 城市
        'customerPayType',
        'payCondition', // 账期条件
        'hasContract', // 是否签订合同
        'refuseType',
        'areaManagerId',
        'provinceManagerId',
        'stateManagerId',
        'areaAgentId',
        'sellerId',
      );

      params.id = params.customerId;
      if (params.customerId > 0) {
        try {
          const rsp = yield call(reqEditUser, {
            ...params,
          });

          if (rsp.code === 0) {
            notification.success({
              message: '成功提示',
              description: '修改客户成功',
            });
            yield put(
              routerRedux.push('/customer/customer-list')
            );
          }
          yield put({
            type: 'mount',
            payload: {
              id: params.id,
              showRadio: data.showRadio,
            },
          });
        } catch (error) {
          console.log('请求失败0');
        }
      } else {
        try {
          const rsp = yield call(reqCreateUser, {
            ...params,
          });

          yield put({
            type: 'mount',
            payload: {
              id: params.id,
              showRadio: data.showRadio,
            },
          });
          if (rsp.code === 0) {
            notification.success({
              message: '成功提示',
              description: '创建客户成功',
            });
            yield put(
              routerRedux.push('/customer/customer-list')
            );
          }
        } catch (error) {
          console.log('请求失败1');
        }
      }
    },
    *changeValue({ payload }, { put }) {
      yield put({
        type: 'inputChangeValue',
        payload: {
          ...payload,
        },
      });
    },
    *changeArea({ payload }, { put, call, select }) {
      const [province, city] = payload.area;
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
          province,
          city,
        }
      })
      const { customerId, areaManagerId, provinceManagerId, seller, stateManagerId, } = yield select(state=>state.addCustomer);
      try{
        const res = yield call(reqChangeDefault,{ userId: customerId, provinceId: province, cityId: city });
        if(customerId) {
          yield put({
            type:'updatePageReducer',
            payload:{
              areaManagerId:areaManagerId?areaManagerId:res.data.areaManagerId,
              provinceManagerId: provinceManagerId?provinceManagerId:res.data.provinceManagerId,
              seller: seller?seller:res.data.seller,
              stateManagerId: stateManagerId?stateManagerId:res.data.stateManagerId,
            }
          })
        }else{
          yield put({
            type:'updatePageReducer',
            payload:{
              ...res.data
            }
          })
        }
      }catch(err) {

      }
      yield put({
        type: 'inputChangeArea',
        payload: {
          ...payload,
          province,
          city,
        },
      });
    },
    *changeBirthday({ payload }, { put }) {
      yield put({
        type: 'inputChangeBirthday',
        payload: {
          ...payload,
        },
      });
    },
    *deleteRecordConfirm({ payload }, { put, call, all }) {
      try {
        yield put({
          type: 'deleteRecordConfirmPending',
        });
        const res = yield all([
          call(deleteRecordReq, { payload }),
          call(reqServiceRecord, { customerId: payload.customerId }),
        ]);
        if (res[0].code === 0) {
          notification.success({
            message: '成功提示',
            description: '删除客勤记录成功！',
          });
          yield put({
            type: 'deleteRecordConfirmResolved',
            payload: {
              ...res[1].data,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        yield put({
          type: 'deleteRecordConfirmRejected',
        });
      }
    },
    *createServiceType({ payload }, { put, call }) {
      try {
        yield put({
          type: 'createServiceTypePending',
        });
        const res = yield call(createServiceTypeReq, { payload });
        if (res.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新建客勤类型成功！',
          });
          yield put({
            type: 'createServiceTypeResolved',
            payload: {
              ...res.data,
            },
          });
        } else {
          throw new Error('code 不为0');
        }
      } catch (error) {
        yield put({
          type: 'createServiceTypeRejected',
        });
      }
    },
    *showCreateServiceTypeModal(_, { put }) {
      yield put({
        type: 'showCreateServiceTypeModalReducer',
      });
    },
    *hideCreateServiceTypeModal(_, { put }) {
      yield put({
        type: 'hideCreateServiceTypeModalReducer',
      });
    },
    *getCreateServiceTypeValue({ payload }, { put }) {
      yield put({
        type: 'getCreateServiceTypeValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getServiceContentValue({ payload }, { put }) {
      yield put({
        type: 'getServiceContentValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getServiceTypeValue({ payload }, { put }) {
      yield put({
        type: 'getServiceTypeValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showServiceRecordDetail({ payload }, { put }) {
      yield put({
        type: 'showServiceRecordDetailReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showNewServiceRecordModal(_, { put }) {
      yield put({
        type: 'showNewServiceRecordModalReducer',
      });
    },
    *handleCancelServiceRecordModal(_, { put }) {
      yield put({
        type: 'handleCancelServiceRecordModalReducer',
      });
    },
    *getServiceList({ payload }, { call, put }) {
      yield put({
        type: 'getServiceListPending',
      });
      try {
        const serviceListRes = yield call(reqServiceRecord, {
          ...payload,
        });
        yield put({
          type: 'getServiceListResolved',
          payload: {
            serviceRecord: serviceListRes.data.serviceList,
            total: serviceListRes.data.total,
            ...payload,
          },
        });
      } catch (error) {
        yield put({
          type: 'getServiceListRejected',
        });
      }
    },
    *updateCustomerServiceRecord({ payload }, { put, call }) {
      try {
        yield put({
          type: 'updateCustomerServiceRecordPending',
        });
        const response = yield call(updateServiceRecord, { payload });
        if (response.code === 0) {
          notification.success({
            message: '成功提示',
            description: '更新客勤记录成功！',
          });
          yield put({
            type: 'updateCustomerServiceRecordResolved',
          });
          yield put({
            type: 'getServiceList',
            payload: {
              customerId: payload.customerId,
            },
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        yield put({
          type: 'updateCustomerServiceRecordRejected',
        });
      }
    },
    *newCustomerServiceRecord({ payload }, { put, call }) {
      try {
        yield put({
          type: 'newCustomerServiceRecordPending',
        });
        const response = yield call(newServiceRecord, { payload });
        if (response.code === 0) {
          notification.success({
            message: '成功提示',
            description: '新建客勤记录成功！',
          });
          yield put({
            type: 'newCustomerServiceRecordResolved',
          });
          yield put({
            type: 'getServiceList',
            payload: {
              customerId: payload.customerId,
            },
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        yield put({
          type: 'newCustomerServiceRecordRejected',
        });
      }
    },
    *updatePage({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
        },
      });
    },
    *showCreateSystemModal({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          isShowCreateSystemModal: true,
        },
      });
    },

    *showCreateCondition({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          isCreateCondition: true,
        },
      });
    },

    *hideCreateCondition({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          isCreateCondition: false,
        },
      });
    },
    *hideCreateSystemModal({ payload }, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          isShowCreateSystemModal: false,
        },
      });
    },
    *createSystem({ payload }, { put, call }) {
      try {
        const rsp = yield call(
          reqCreateSystem,
          { ...payload }
        );
        if (rsp.code === 0) {
          const { customerSystemList } = rsp.data;
          yield put({
            type: 'updatePageReducer',
            payload: {
              ...payload,
              systemMap: customerSystemList,
              isShowCreateSystemModal: false,
            },
          });
          notification.success({
            message: '新建客户体系成功',
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        notification.error({
          message: '操作失败',
        });
        yield put({
          type: 'updatePageReducer',
        });
      }
    },
    *createCondition({ payload }, { put, call }) {
      try {
        const req = yield call(
          reqCreateCondition,
          { ...payload }
        );
        if (req.code === 0) {
          const { payConditionMap } = req.data;
          yield put({
            type: 'updatePageReducer',
            payload: {
              ...payload,
              payConditionMap,
              isCreateCondition: false,
            },
          });
          notification.success({
            message: '新建账期条件成功',
          });
        } else {
          throw new Error('code不为0');
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: '操作失败',
        });
        yield put({
          type: 'updatePageReducer',
        });
      }
    },

    *getCreateSystemValue({ payload }, { put }) {
      yield put({
        type: 'getCreateSystemValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    *getreqCreateConditionValue({ payload }, { put }) {
      yield put({
        type: 'getReqCreateConditionValueReducer',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {

    inputChangeValue(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    inputChangeArea(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    inputChangeBirthday(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    mountReducer(state, { payload }) {
      const {
        customerTypeMap: typeMap,
        customerSystemMap: systemMap,
        province,
        city,
        sexId,
        checkStatusId,
        dutyId,
        importPercentId,
        saleAmountPerMonthId,
        customerTypeId,
        customerPayTypeId,
        payConditionId,
        sellerId,
        channelId,
        userRankId,
        sellerLeaderMap: sellerTeamMap,
      } = payload;
      const res = {
        ...state,
        ...payload,
        typeMap,
        systemMap,
        sellerTeamMap,
        area: [province.toString(), city.toString()],
        sex: sexId,
        checkStatus: checkStatusId,
        duty: dutyId,
        importedPercent: importPercentId,
        saleAmountPerMonth: saleAmountPerMonthId,
        customerType: customerTypeId,
        seller: sellerId,
        channel: channelId,
        userRank: userRankId,
        customerPayType: customerPayTypeId,
        payCondition: payConditionId,
      };
      return res;
    },


    deleteRecordConfirmPending(state) {
      return {
        ...state,
      };
    },
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    deleteRecordConfirmResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    deleteRecordConfirmRejected(state) {
      return {
        ...state,
      };
    },
    createServiceTypeResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        confirmLoading: false,
        isShowCreateServiceTypeModal: false,
      };
    },
    createServiceTypePending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    createServiceTypeRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowCreateServiceTypeModal: false,
      };
    },
    showCreateServiceTypeModalReducer(state) {
      return {
        ...state,
        isShowCreateServiceTypeModal: true,
      };
    },
    hideCreateServiceTypeModalReducer(state) {
      return {
        ...state,
        isShowCreateServiceTypeModal: false,
      };
    },
    getCreateServiceTypeValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceContentValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getServiceTypeValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    showServiceRecordDetailReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowNewServiceRecordModal: true,
        serviceContentInput: payload.viewServiceRecord.content,
        serviceTypeInput: payload.viewServiceRecord.type,
        viewServiceRecordId: payload.viewServiceRecord.id,
      };
    },
    showDetailImageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowImg: true,
      };
    },
    showNewServiceRecordModalReducer(state) {
      return {
        ...state,
        isShowNewServiceRecordModal: true,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceContentInput: '',
        serviceTypeInput: '选择客勤类型',
      };
    },
    handleCancelServiceRecordModalReducer(state) {
      return {
        ...state,
        isShowNewServiceRecordModal: false,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceContentInput: '',
        serviceTypeInput: '选择客勤类型',
      };
    },
    getCreateSystemValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getReqCreateConditionValueReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    updateCustomerServiceRecordPending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    updateCustomerServiceRecordResolved(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    updateCustomerServiceRecordRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    newCustomerServiceRecordPending(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },
    newCustomerServiceRecordResolved(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    newCustomerServiceRecordRejected(state) {
      return {
        ...state,
        confirmLoading: false,
        isShowNewServiceRecordModal: false,
      };
    },
    getServiceListPending(state) {
      return {
        ...state,
        isGetServiceListing: true,
      };
    },
    getServiceListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
        isGetServiceListing: false,
      };
    },
    getServiceListRejected(state) {
      return {
        ...state,
        isGetServiceListing: false,
      };
    },

    unmountReducer() {
      return {
        showRadio: 0,
        radioIndex: 0,

        customerId: 0, // 客户ID，用来判断当前是新建客户还是修改客户
        userName: '', // 账号
        mobile: '', // 手机号码
        password: '', // 密码
        customerSource: 0, // 客户来源
        customerSystem: 0, // 客户所属体系
        customerName: '', // 客户姓名
        duty: '', // 职位
        companyName: '', // 公司名称
        storeNum: 0, // 店铺数量
        province: 0, // 省份
        city: 0, // 城市
        customerType: 0, // 客户类型
        importedPercent: 0, // 进口品占比
        saleAmountPerMonth: 0, // 月销售额
        channel: 0, // 了解小美诚品的渠道
        userRank: 0, // 客户级别
        checkStatus: 0, // 客户审核状态
        sex: 0, // 性别
        birthday: '', // 生日
        contact: '', // 联系人姓名
        shopFront: '', // 门头照片
        license: '', // 营业执照照片
        seller: 0, // 绑定的销售
        sellerLeader: 0, // 绑定的销售主管
        remark: '', // 备注
        sendSms: 1, // 是否发送审核短信给客户
        log: '', // 审核客勤日志
        area: [], // 省和市的合并结果，数组的第一个元素表示省，第二个元素表示市

        isLoading: false, // 是否提交中

        dutyMap: {}, // 职位的配置项
        typeMap: {}, // 客户类型配置项
        systemMap: {}, // 所属体系配置项
        importedPercentMap: {}, // 进口品占比配置项
        saleAmountPerMonthMap: {}, // 月销售额配置项
        channelMap: {}, // 客户知道小美的渠道配置项
        userRankMap: {}, // 客户级别配置项
        sellerMap: {}, // 绑定销售配置项
        sellerTeamMap: {}, // 绑定销售主管配置项
        isCheckedStatusMap: {}, // 审核状态配置项
        sexMap: {}, // 性别配置项

        showCreditInfo: 0, // 登录用户权限
        payConditionMap: {}, // 账期条件配置
        customerPayTypeMap: [], // 客户类型配置
        customerPayType: 0, // 客户类型
        payCondition: [], // 账期条件
        hasContract: 0, // 是否签订合同

        serviceRecord: [],
        isShowNewServiceRecordModal: false,
        serviceTypeMap: {},
        confirmLoading: false,
        viewServiceRecordId: '',
        viewServiceRecord: {},
        serviceTypeInput: '请选择客勤类型',
        serviceContentInput: '',
        isShowCreateServiceTypeModal: false,
        isCreateCondition: false,
        isShowCreateSystemModal: false,
        createServiceType: '',
        createSystem: '',
        createCondition: '',
        hidden: false,
        refuseMap:[],
        areaManagerId:'',
        provinceManagerId:'',
        stateManagerId:'',
        areaAgentId:'',
        sellerId:'',
        assistantId: '',
        agentMap:{},
        sellerPhoneMap:{}
      };
    },
  },
};

