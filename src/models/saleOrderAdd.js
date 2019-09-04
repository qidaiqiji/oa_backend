import { notification, message } from 'antd';
import moment from 'moment';
import { isNumber } from 'util';
import { routerRedux } from 'dva/router';
import area from '../area.json';
import { reqSaveModifyOrder, reqGetGoods, reqSaveOrder, reqGetOrderInfo, reqGetinvoiceInfo, reqGetOrderConfig, reqGetUsers, reqGetReceiving, reqAddInvoice, reqUpdateReceivingInfo, reqDeleteReceiving, reqDeleteInvoice, reqUpdateInvoice, reqAddReceivingInfo, reqChangeDefaultReceiving, reqChangeDefaultInvoice } from '../services/saleOrderAdd';

export default {
  namespace: 'saleOrderAdd',

  state: {
    type:'1',
    goodsRemark: '',
    // 修改订单的详细信息
    orderDetail: null,
    searchGoodsValue: '',
    // 地址 省市区
    addressOptions: area.data,
    // 详细地址
    userName: '',
    mobilePhone: '',
    province: null,
    city: null,
    district: null,
    address: '',
    // 总数量
    total: 0,
    // 当前页
    curPage: 1,
    // 每页的列表数
    size: 10,
    siftGoods: [],
    siftUsers: [],
    // 所有的商品信息
    goods: [],
    // 所有的客户信息
    users: [],
    // 所有的收货信息
    receiving: [],
    // 已选中的收货信息
    receivingInfos: [],
    // 默认收货的信息
    defaultReceivingInfos: [],
    // 已选中的商品信息
    goodsInfos: [],
    // 已选中的客户信息

    payConditionMap: {}, // 账期条件
    payCondition: -1,


    userInfos: [],
    otherMoney: 0,
    // 交货日期
    date: moment().format('YYYY-MM-DD'),
    // 制单备注
    remark: '',
    isSave: 0,
    // 发票信息配置
    invoiceInfo: [],
    // 默认发票信息
    defaultInvoiceInfos: [],
    // 运费信息配置
    fareInfo: '',
    fareInfoMap: {},
    // 交付信息配置
    payInfo: '',

    payInfoMap: {},
    // 特批价
    specialPrice: -1,
    isShowDeleteConfirm: false,
    isDeleting: false,
    deleteRowId: null,
    deleteGoodsId: null,
    isLoading: true,
    isUserLoading: true,
    // 新增修改收货地址弹窗
    isShowReceivingUpdateConfirm: false,
    // 收货信息列表弹窗
    isShowReceivingConfirm: false,
    // 修改发票弹窗
    isShowUpdateInvoiceConfirm: false,
    isUpdateInvoiceLoading: false,
    // 新建发票弹窗
    isShowAddInvoiceConfirm: false,
    isAddInvoiceLoading: false,
    // 发票信息弹窗
    isShowInvoiceConfirm: false,
    isInvoiceLoading: false,
    isInvoiceListLoading: true,
    // 更多客户弹窗
    isShowMoreUserConfirm: false,
    isMoreUserLoading: false,
    // 更多商品弹窗
    isShowMoreGoodsConfirm: false,
    isMoreGoodsLoading: false,
    isGoodsLoading: true,
    isInvoiceInformation: false,
  },
  effects: {
    // 删除发票信息
    *clickDeleteInvoice({ payload }, { put, call, all }) {
      try {
        yield call(reqDeleteInvoice, { invoiceId: payload.invoiceId });
        const invoiceData = yield call(reqGetinvoiceInfo, { userId: payload.userId });
        const defaultInvoiceInfos = [];
        for (let i = 0; i < invoiceData.data.invoiceInfo.length; i += 1) {
          if (invoiceData.data.invoiceInfo[i].isDefault === '1') {
            defaultInvoiceInfos.push(invoiceData.data.invoiceInfo[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            invoiceInfo: invoiceData.data.invoiceInfo,
            defaultInvoiceInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 删除收货信息
    *clickDeleteReceiving({ payload }, { put, call }) {
      try {
        yield call(reqDeleteReceiving, { addressId: payload.addressId });
        const receivingData = yield call(reqGetReceiving, { userId: payload.userId });
        const defaultReceivingInfos = [];
        for (let i = 0; i < receivingData.data.receiving.length; i += 1) {
          if (receivingData.data.receiving[i].isDefault === 1) {
            defaultReceivingInfos.push(receivingData.data.receiving[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            receiving: receivingData.data.receiving,
            defaultReceivingInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 设置默认收货信息
    *clickOkDefaultReceivingInfo({ payload }, { put, call }) {
      try {
        yield call(reqChangeDefaultReceiving, { ...payload });
        const receivingData = yield call(reqGetReceiving, { userId: payload.userId });
        const defaultReceivingInfos = [];
        for (let i = 0; i < receivingData.data.receiving.length; i += 1) {
          if (receivingData.data.receiving[i].isDefault === 1) {
            defaultReceivingInfos.push(receivingData.data.receiving[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            receiving: receivingData.data.receiving,
            defaultReceivingInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 设置默认发票
    *clickOkDefaultInvoiceInfo({ payload }, { put, call }) {
      try {
        yield call(reqChangeDefaultInvoice, { ...payload });
        const invoiceData = yield call(reqGetinvoiceInfo, { userId: payload.userId });
        const defaultInvoiceInfos = [];
        for (let i = 0; i < invoiceData.data.invoiceInfo.length; i += 1) {
          if (invoiceData.data.invoiceInfo[i].isDefault === '1') {
            defaultInvoiceInfos.push(invoiceData.data.invoiceInfo[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            invoiceInfo: invoiceData.data.invoiceInfo,
            defaultInvoiceInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 确认收货信息列表
    *clickReceivingInfoListOkBtn({ payload }, { put }) {
      yield put({
        type: 'clickReceivingInfoListOkBtnReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 修改收货信息
    *changeReceivingInfoOk({ payload }, { put, call }) {
      try {
        yield call(reqUpdateReceivingInfo, { ...payload });
        yield put({
          type: 'changeReceivingInfoOkReducer',
        });
        const receivingData = yield call(reqGetReceiving, { userId: payload.userId });
        const defaultReceivingInfos = [];
        for (let i = 0; i < receivingData.data.receiving.length; i += 1) {
          if (receivingData.data.receiving[i].isDefault === 1) {
            defaultReceivingInfos.push(receivingData.data.receiving[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            receiving: receivingData.data.receiving,
            defaultReceivingInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 新建收货地址
    *addReceivingInfoOk({ payload }, { put, call }) {
      try {
        yield call(reqAddReceivingInfo, { ...payload });
        yield put({
          type: 'changeReceivingInfoOkReducer',
        });
        const receivingData = yield call(reqGetReceiving, { userId: payload.userId });
        const defaultReceivingInfos = [];
        for (let i = 0; i < receivingData.data.receiving.length; i += 1) {
          if (receivingData.data.receiving[i].isDefault === 1) {
            defaultReceivingInfos.push(receivingData.data.receiving[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            receiving: receivingData.data.receiving,
            defaultReceivingInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 收货信息输入框地址信息改变
    *changeReceivingAddressValue({ payload }, { put }) {
      yield put({
        type: 'changeReceivingAddressValueReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 取消收货信息列表弹窗
    *clickCancelReceivingInfoButton(_, { put }) {
      yield put({
        type: 'cancelReceivingInfoConfirmReducer',
      });
    },
    // 取消新建或修改收货信息弹窗
    *clickCancelChangeReceivingInfoButton(_, { put }) {
      yield put({
        type: 'cancelChangeReceivingInfoConfirmReducer',
      });
    },
    // 打开收货信息列表弹窗
    *openReceivingInfoConfirm(_, { put }) {
      yield put({
        type: 'openReceivingInfoConfirmReducer',
      });
    },
    *clickOkInvoiceInfoButton(_, { put }) {
      yield put({
        type: 'clickOkInvoiceInfoButtonReducer',
      });
    },
    *updateOkInvoiceInfo({ payload }, { put, call }) {
      try {
        yield call(reqUpdateInvoice, {
          companyName: payload.companyName,
          address: payload.address,
          phoneNumber: payload.phoneNumber,
          companyTaxID: payload.companyTaxID,
          bank: payload.bank,
          bankAccount: payload.bankAccount,
          invoiceId: payload.invoiceId,
        });
        yield put({
          type: 'updateInvoiceInfoOkReducer',
        });
        yield put({
          type: 'getinvoiceInfoPending',
        });
        const invoiceData = yield call(reqGetinvoiceInfo, { userId: payload.userId });
        const defaultInvoiceInfos = [];
        for (let i = 0; i < invoiceData.data.invoiceInfo.length; i += 1) {
          if (invoiceData.data.invoiceInfo[i].isDefault === '1') {
            defaultInvoiceInfos.push(invoiceData.data.invoiceInfo[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            invoiceInfo: invoiceData.data.invoiceInfo,
            defaultInvoiceInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *addInvoiceInfo({ payload }, { put, call }) {
      try {
        yield call(reqAddInvoice, { ...payload });
        yield put({
          type: 'addInvoiceInfoOkReducer',
        });
        yield put({
          type: 'getinvoiceInfoPending',
        });
        const invoiceData = yield call(reqGetinvoiceInfo, { userId: payload.userId });
        const defaultInvoiceInfos = [];
        for (let i = 0; i < invoiceData.data.invoiceInfo.length; i += 1) {
          if (invoiceData.data.invoiceInfo[i].isDefault === '1') {
            defaultInvoiceInfos.push(invoiceData.data.invoiceInfo[i]);
          }
        }
        yield put({
          type: 'changeDefaultReceivingInfosReducer',
          payload: {
            invoiceInfo: invoiceData.data.invoiceInfo,
            defaultInvoiceInfos,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeUpdateInvoiceInfoConfirm(_, { put }) {
      yield put({
        type: 'UpdateInvoiceInfoConfirmReducer',
      });
    },
    *clickAddReceivingInfoConfirm({ payload }, { put }) {
      yield put({
        type: 'addReceivingInfoConfirmReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeAddInvoiceInfoConfirm(_, { put }) {
      yield put({
        type: 'AddInvoiceInfoConfirmReducer',
      });
    },
    *changeSpecialPrice({ payload }, { put }) {
      if (payload.value) {
        yield put({
          type: 'changeSpecialPriceReducer',
          payload: {
            specialPrice: payload.value,
          },
        });
      } else {
        yield put({
          type: 'changeSpecialPriceReducer',
          payload: {
            specialPrice: -1,
          },
        });
      }
    },
    *changeFareInfo({ payload }, { put }) {
      yield put({
        type: 'changeFareInfoReducer',
        payload: {
          fareInfo: payload.value,
        },
      });
    },
    *changePayInfo({ payload }, { put }) {
      yield put({
        type: 'changePayInfoReducer',
        payload: {
          payInfo: payload.value,
        },
      });
    },
    *changePayInfoId({ payload }, { put }) {
      yield put({
        type: 'changeDefaultPayInfoId',
        payload: {
          payCondition: payload.value,
        },
      });
    },
    *changeInvoiceInfo({ payload }, { put }) {
      yield put({
        type: 'changeInvoiceInfoReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 查看更多客户
    *showMoreUser({ payload }, { put, call }) {
      try {
        const userData = yield call(reqGetUsers, { curPage: payload.curPage, keywords: '' });
        yield put({
          type: 'changeMoreUserReducer',
          payload: {
            ...payload,
            siftUsers: userData.data.users,
            total: userData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    // 查看更多商品
    *showMoreGoods({ payload }, { put, call, select }) {
      const { userId } = yield select(state=>state.saleOrderAdd);
      try {
        const goodsData = yield call(reqGetGoods, { curPage: payload.curPage, keywords: '',customerId:userId });
        yield put({
          type: 'changeMoreGoodsReducer',
          payload: {
            ...payload,
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *searchGoods({ payload }, { put, call, select }) {
      const { curPage, value } = payload;
      const { userId } = yield select(state=>state.saleOrderAdd)
      if (value === '') {
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: [],
            searchGoodsValue: value,
          },
        });
        return;
      }
      // const values = value.split(' ');
      // function match(matchValue, matchs) {
      //   return matchs.every((match) => {
      //     return matchValue.indexOf(match) >= 0;
      //   });
      // }
      // const siftGoods = goods.filter((oneGoods) => {
      //   return oneGoods.goodsNo.toLowerCase().indexOf(value.toLowerCase()) >= 0 || oneGoods.goodsName.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      // });
      // const siftGoods2 = goods.filter((oneGoods) => {
      //   return match(oneGoods.goodsNo, values) || match(oneGoods.goodsName, values);
      // });
      // yield put({
      //   type: 'searchGoodsReducer',
      //   payload: {
      //     siftGoods: siftGoods2,
      //     searchGoodsValue: value,
      //   },
      // });
      try {
        const goodsData = yield call(reqGetGoods, { curPage, keywords: value, customerId:userId });
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: goodsData.data.goods,
            searchGoodsValue: value,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *moreSearchGoods({ payload }, { put, call, select }) {
      const { userId } = yield select(state=>state.saleOrderAdd)
      try {
        const goodsData = yield call(reqGetGoods, { curPage: 1, keywords: payload.value, customerId:userId });
        yield put({
          type: 'searchGoodsReducer',
          payload: {
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
            curPage: 1,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *searchUsers({ payload }, { put, call }) {
      const { value, curPage } = payload;
      if (value === '') {
        yield put({
          type: 'searchUsersReducer',
          payload: {
            siftUsers: [],
          },
        });
        return;
      }
      // const values = value.split(' ');
      // function match(matchValue, matchs) {
      //   return matchs.every((match) => {
      //     return matchValue.indexOf(match) >= 0;
      //   });
      // }
      // const siftUsers = users.filter((oneUsers) => {
      //   return oneUsers.userNo.toLowerCase().indexOf(value.toLowerCase()) >= 0 || oneUsers.userName.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      // });
      // const siftUsers2 = users.filter((oneUsers) => {
      //   return match(oneUsers.userNo, values) || match(oneUsers.userName, values);
      // });
      // yield put({
      //   type: 'searchUsersReducer',
      //   payload: {
      //     siftUsers: siftUsers2,
      //   },
      // });
      try {
        const userData = yield call(reqGetUsers, { curPage, keywords: value });
        yield put({
          type: 'searchUsersReducer',
          payload: {
            siftUsers: userData.data.users,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *moreSearchUsers({ payload }, { put, call }) {
      try {
        const userData = yield call(reqGetUsers, { curPage: 1, keywords: payload.value });
        yield put({
          type: 'searchUsersReducer',
          payload: {
            siftUsers: userData.data.users,
            total: userData.data.total,
            curPage: 1,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *getConfig({ payload }, { call, put, all }) {
      console.log('123');
      if (payload.id) {
        console.log('1234');
        try {
          const [orderConfig, orderData] = yield all([call(reqGetOrderConfig), call(reqGetOrderInfo, { id: payload.id })]);
          console.log('拿值', orderConfig);
          yield put({
            type: 'saleOrderAdd/changeUser',
            payload: {
              initStatus: true,
              userId: orderData.data.userId,
            },
          });
          yield put({
            type: 'getOrderInfo',
            payload: {
              ...orderConfig.data,
              orderDetail: orderData.data,
              specialPrice: orderData.data.specialPrice,
              date: orderData.data.date,
              invoiceInfoType:orderData.data.invoiceType,
              // invoiceInfo:orderData.data.invoiceInfo,
            },
          });
        } catch (error) {
          // dodo
        }
      } else {
        try {
          const orderConfig = yield call(reqGetOrderConfig);
          console.log('数据', orderConfig);
          yield put({
            type: 'getOrderConfigReducer',
            payload: {
              ...orderConfig.data,
            },
          });
        } catch (error) {
          // dodo
        }
      }
    },
    *getGoodsPage({ payload }, { call, put, select }) {
      const { userId } = yield select(state=>state.saleOrderAdd);
      yield put({
        type: 'getGoodsPending',
      });
      try {
        const goodsData = yield call(reqGetGoods, { curPage: payload.curPage, keywords: payload.value, customerId:userId });
        yield put({
          type: 'getGoodsChangePage',
          payload: {
            ...payload,
            siftGoods: goodsData.data.goods,
            total: goodsData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *getUsersPage({ payload }, { put, call }) {
      yield put({
        type: 'getUsersPending',
      });
      try {
        const usersData = yield call(reqGetUsers, { curPage: payload.curPage, keywords: payload.value });
        yield put({
          type: 'getUsers',
          payload: {
            ...payload,
            siftUsers: usersData.data.users,
            total: usersData.data.total,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeGoods({ payload }, { put, call, select }) {
      const { userId } = yield select(state=>state.saleOrderAdd);
      if (!Array.isArray(payload.goodsId)) {
        yield put({
          type: 'getGoodsInfo',
          payload: {
            // goodsInfo: response.data.goodsInfo,
            goodsId: payload.goodsId,
            searchGoodsValue: '',
          },
        });
      } else {
        try {
          if (payload.goodsId.length > 0) {
            const res = yield call(reqGetGoods, { keywords: '', curPage: 1, goodsIds: payload.goodsId, userId });
            yield put({
              type: 'getGoodsInfos',
              payload: {
                siftGoodsList: res.data.goods,
                goodsIds: payload.goodsId,
                searchGoodsValue: '',
              },
            });
          } else {
            yield put({
              type: 'clickCancelMoreGoodsInfoButtonReducer',
            });
          }
        } catch (error) {
          // to do
        }
      }
    },
    *changeUser({ payload }, { put, call, all }) {
      if (payload.initStatus) {
        yield put({
          type: 'getUserInfo',
          payload: {
            initStatus: true,
            userId: payload.userId,
          },
        });
      } else {
        yield put({
          type: 'getUserInfo',
          payload: {
            userId: payload.userId,
          },
        });
      }
      try {
        // 获取收货地址信息和用户的发票信息列表
        const allData = yield all([call(reqGetReceiving, { userId: payload.userId }), call(reqGetinvoiceInfo, { userId: payload.userId })]);
        const defaultReceivingInfos = [];
        const defaultInvoiceInfos = [];
        for (let i = 0; i < allData[0].data.receiving.length; i += 1) {
          if (allData[0].data.receiving[i].isDefault === 1) {
            defaultReceivingInfos.push(allData[0].data.receiving[i]);
          }
        }
        for (let i = 0; i < allData[1].data.invoiceInfo.length; i += 1) {
          if (allData[1].data.invoiceInfo[i].isDefault === '1') {
            defaultInvoiceInfos.push(allData[1].data.invoiceInfo[i]);
          }
        }
        yield put({
          type: 'getReceiving',
          payload: {
            defaultReceivingInfos,
            defaultInvoiceInfos,
            receiving: allData[0].data.receiving,
            invoiceInfo: allData[1].data.invoiceInfo,
          },
        });
      } catch (error) {
        // dodo
      }
    },
    *changeSaleNum({ payload }, { put }) {
      yield put({
        type: 'changeSaleNumReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeGoodsRemark({ payload }, { put }) {
      yield put({
        type: 'changeGoodsRemarkReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeSalePrice({ payload }, { put }) {
      yield put({
        type: 'changeSalePriceReducer',
        payload: {
          ...payload,
        },
      });
    },
    *changeIsTax({ payload }, { put,select }) {
      const { selectedRow } = payload;
      const { goodsInfos } = yield select(state=>state.saleOrderAdd)
      goodsInfos.map((item) => {
        item.isTax = 0;
        selectedRow.map((items, index) => {
          if (+item.goodsId === +items.goodsId) {
            item.isTax = 1;
          }
        });
      });
      yield put({
        type: 'goodsInfos',
        payload: {
          ...payload,
          goodsInfos,
        },
      });
      // yield put({
      //   type: 'goodsInfos',
      //   payload: {
      //     ...payload,
      //   },
      // });
    },
    *deleteGoods({ payload }, { put }) {
      yield put({
        type: 'deleteGoodsReducer',
        payload: {
          ...payload,
        },
      });
    },

    *clickDeleteGoodsButton({ payload }, { put }) {
      yield put({
        type: 'clickDeleteGoodsButtonReducer',
        payload: {
          ...payload,
        },
      });
    },
    // 取消新建发票信息
    *clickCancelAddInvoiceInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelAddInvoiceInfoButtonReducer',
      });
    },
    // 取消修改发票信息的弹窗
    *handleClickCancelUpdateInvoiceInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelUpdateInvoiceInfoReducer',
      });
    },
    // 取消发票信息弹窗
    *clickCancelInvoiceInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelInvoiceInfoButtonReducer',
      });
    },
    // 取消查看更多客户
    *clickCancelMoreUserInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelMoreUserInfoButtonReducer',
      });
    },
    // 取消查看更多商品
    *clickCancelMoreGoodsInfoButton(_, { put }) {
      yield put({
        type: 'clickCancelMoreGoodsInfoButtonReducer',
      });
    },
    *changeOtherMoney({ payload }, { put }) {
      yield put({
        type: 'changeOtherMoneyReducer',
        payload: {
          otherMoney: payload.otherMoney,
        },
      });
    },
    *changeDate({ payload }, { put }) {
      yield put({
        type: 'changeDateReducer',
        payload: {
          date: payload.date,
        },
      });
    },
    *changeRemark({ payload }, { put }) {
      yield put({
        type: 'changeRemarkReducer',
        payload: {
          remark: payload.remark,
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
    // 保存订单修改
    *clickSaveModifyBtn({ payload }, { put, call }) {
      try {
        const res = yield call(reqSaveModifyOrder, { ...payload });
        notification.success({
          message: '提示',
          description: '修改订单成功',
        });
        yield put(routerRedux.push(`/sale/sale-order/sale-order-list/sale-order-detail/${res.data[0]}`));
      } catch (error) {
        // dodo
      }
    },
    *clickSaveBtn({ payload }, { put, call }) {
      try {
        const res = yield call(reqSaveOrder, { ...payload });
        notification.success({
          message: '提示',
          description: '提交审核成功',
        });
        yield put(routerRedux.push(`/sale/sale-order/sale-order-list/sale-order-detail/${res.data.id}`));
      } catch (error) {
        // dodo
      }
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
  },

  reducers: {
    // 获取客户列表中
    getUsersPending(state) {
      return {
        ...state,
        isUserLoading: true,
      };
    },
    // 获取商品列表中
    getGoodsPending(state) {
      return {
        ...state,
        isGoodsLoading: true,
      };
    },
    // 获取发票信息列表中
    getinvoiceInfoPending(state) {
      return {
        ...state,
        isInvoiceListLoading: true,
      };
    },
    changeMoreGoodsReducer(state, { payload }) {
      return {
        ...state,
        isShowMoreGoodsConfirm: true,
        isGoodsLoading: false,
        ...payload,
      };
    },
    changeMoreUserReducer(state, { payload }) {
      return {
        ...state,
        isShowMoreUserConfirm: true,
        isUserLoading: false,
        ...payload,
      };
    },
    changeInvoiceInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isShowInvoiceConfirm: true,
      };
    },
    changeFareInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changePayInfoReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeDefaultPayInfoId(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeSpecialPriceReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    deleteGoodsReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      goodsInfos.splice(payload.index, 1);
      // for (let i = 0; i < goodsInfos.length; i += 1) {
      //   if (goodsInfos[i].goodsId === payload.goodsId) {
      //     goodsInfos.splice(i, 1);
      //     break;
      //   }
      // }
      return {
        ...newState,
        specialPrice: -1,
        isDeleting: false,
        isShowDeleteConfirm: false,
      };
    },
    changeAddressReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeIsTaxReducer(state, action) {
      
    },
    changeSalePriceReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      goodsInfos[payload.index].salePrice = payload.price;
      // for (let i = 0; i < goodsInfos.length; i += 1) {
      //   if (goodsInfos[i].goodsId === payload.goodsId) {
      //     goodsInfos[i].salePrice = payload.price;
      //     break;
      //   }
      // }
      return newState;
    },
    changeSaleNumReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      goodsInfos[payload.index].saleNum = payload.number;
      // for (let i = 0; i < goodsInfos.length; i += 1) {
      //   if (goodsInfos[i].goodsId === payload.goodsId) {
      //     goodsInfos[i].saleNum = payload.number;
      //     break;
      //   }
      // }
      newState.specialPrice = -1;
      return newState;
    },
    changeGoodsRemarkReducer(state, { payload }) {
      const newState = Object.assign({}, state);
      const { goodsInfos } = newState;
      goodsInfos[payload.index].goodsRemark = payload.goodsRemark;
      goodsInfos[payload.index].remark = payload.goodsRemark;
      console.log(goodsInfos);
      // for (let i = 0; i < goodsInfos.length; i += 1) {
      //   if (goodsInfos[i].goodsId === payload.goodsId) {
      //     goodsInfos[i].goodsRemark = payload.goodsRemark;
      //     break;
      //   }
      // }
      return {
        ...state,
        goodsInfos,
      };
    },
    getOrderInfo(state, { payload }) {
      const goodsInfos = payload.orderDetail.goodsInfos.map((goodsInfo) => {
        return {
          ...goodsInfo,
          goodsRemark: goodsInfo.remark,
        };
      });

      return {
        ...state,
        ...payload,
        goodsInfos,
        isLoading: false,
      };
    },
    getGoodsChangePage(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isGoodsLoading: false,
      };
    },
    getUsers(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isUserLoading: false,
      };
    },
    getOrderConfigReducer(state, action) {
      const { payload } = action;
      console.log(action.payload.payConditionMap);
      return {
        ...state,
        ...payload,
        fareInfoMap: action.payload.fareInfoMap,
        payInfoMap: action.payload.payInfoMap,
        payConditionMap: action.payload.payConditionMap,
        goodsInfos: [],
        isLoading: false,
        isGoodsLoading: false,
      };
    },
    getGoodsInfos(state, { payload }) {
      payload.siftGoodsList.map((siftGoodsItem) => {
        if (siftGoodsItem.setFromNum > siftGoodsItem.canUseNum) {
          siftGoodsItem.saleNum = 0;
        } else {
          siftGoodsItem.saleNum = siftGoodsItem.setFromNum;
        }
        siftGoodsItem.goodsRemark = '';
        siftGoodsItem.isTax = 0;
      });
      return {
        ...state,
        goodsInfos: state.goodsInfos.concat(payload.siftGoodsList),
        siftGoods: [],
        isShowMoreGoodsConfirm: false,
        specialPrice: -1,
      };
    },
    getGoodsInfo(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { siftGoods } = newState;
      let goodsInfo = {
        saleNum: 0,
        // salePrice: 0,
      };
      for (let i = 0; i < siftGoods.length; i += 1) {
        if (+siftGoods[i].goodsId === +payload.goodsId) {
          goodsInfo = Object.assign({}, siftGoods[i]);
          if (siftGoods[i].setFromNum > siftGoods[i].canUseNum) {
            goodsInfo.saleNum = 0;
          } else {
            goodsInfo.saleNum = siftGoods[i].setFromNum;
          }
          goodsInfo.goodsRemark = '';
          goodsInfo.isTax = 0;
          // goodsInfo.salePrice = 0;
          // goodsInfo.subtotal = 0;
          break;
        }
      }
      return {
        ...state,
        goodsInfos: state.goodsInfos.concat([goodsInfo]),
        siftGoods: [],
        isShowMoreGoodsConfirm: false,
        searchGoodsValue: '',
        specialPrice: -1,
      };
    },
    getUserInfo(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { siftUsers } = newState;
      let userInfo = [];
      for (let i = 0; i < siftUsers.length; i += 1) {
        if (+siftUsers[i].userId === +payload.userId) {
          userInfo = [Object.assign({}, siftUsers[i])];
          break;
        }
      }
      if (payload.initStatus) {
        return {
          ...state,
          userInfos: userInfo,
          siftUsers: [],
          isShowMoreUserConfirm: false,
          searchGoodsValue: '',
        };
      }
      return {
        ...state,
        ...payload,
        userInfos: userInfo,
        siftUsers: [],
        goodsInfos: [],
        isShowMoreUserConfirm: false,
        searchGoodsValue: '',
      };
    },
    getReceiving(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    updateInvoiceInfo(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isInvoiceListLoading: false,
      };
    },
    addInvoiceInfoOkReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        isShowAddInvoiceConfirm: false,
      };
    },
    changeReceivingAddressValueReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    cancelReceivingInfoConfirmReducer(state) {
      return {
        ...state,
        isShowReceivingConfirm: false,
      };
    },
    clickReceivingInfoListOkBtnReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { orderDetail } = newState;
      if (payload.receivingInfos) {
        if (orderDetail) {
          orderDetail.receiving = null;
          return {
            ...state,
            ...payload,
            orderDetail: {
              ...orderDetail,
            },
            isShowReceivingConfirm: false,
          };
        } else {
          return {
            ...state,
            ...payload,
            isShowReceivingConfirm: false,
          };
        }
      } else {
        return {
          ...state,
          isShowReceivingConfirm: false,
        };
      }
    },
    changeReceivingInfoOkReducer(state) {
      return {
        ...state,
        isShowReceivingUpdateConfirm: false,
        userName: '',
        mobilePhone: '',
        province: null,
        city: null,
        district: null,
        address: '',
      };
    },
    cancelChangeReceivingInfoConfirmReducer(state) {
      return {
        ...state,
        isShowReceivingUpdateConfirm: false,
        userName: '',
        mobilePhone: '',
        province: null,
        city: null,
        district: null,
        address: '',
      };
    },
    openReceivingInfoConfirmReducer(state) {
      return {
        ...state,
        isShowReceivingConfirm: true,
      };
    },
    clickOkInvoiceInfoButtonReducer(state, action) {
      const { payload } = action;
      const newState = Object.assign({}, state);
      const { orderDetail } = newState;
      if (orderDetail) {
        orderDetail.invoiceInfo = null;
        return {
          ...state,
          orderDetail: {
            ...orderDetail,
          },
          isShowInvoiceConfirm: false,
        };
      }
      return {
        ...state,
        isShowInvoiceConfirm: false,
      };
    },
    updateInvoiceInfoOkReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        isShowUpdateInvoiceConfirm: false,
      };
    },
    UpdateInvoiceInfoConfirmReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        isShowUpdateInvoiceConfirm: true,
      };
    },
    AddInvoiceInfoConfirmReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        isShowAddInvoiceConfirm: true,
      };
    },
    addReceivingInfoConfirmReducer(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isShowReceivingUpdateConfirm: true,
      };
    },
    changeOtherMoneyReducer(state, action) {
      return {
        ...state,
        otherMoney: action.payload.otherMoney,
      };
    },
    changeDefaultReceivingInfosReducer(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeDateReducer(state, action) {
      return {
        ...state,
        date: action.payload.date,
      };
    },
    changeRemarkReducer(state, action) {
      return {
        ...state,
        remark: action.payload.remark,
      };
    },
    saveResolved(state) {
      return {
        ...state,
        isSave: 1,
      };
    },
    clickDeleteGoodsButtonReducer(state, { payload }) {
      return {
        ...state,
        deleteRowId: payload.rowId,
        deleteGoodsId: payload.goodsId,
      };
    },
    clickCancelUpdateInvoiceInfoReducer(state) {
      return {
        ...state,
        isShowUpdateInvoiceConfirm: false,
      };
    },
    clickCancelInvoiceInfoButtonReducer(state) {
      return {
        ...state,
        isShowInvoiceConfirm: false,
      };
    },
    clickCancelAddInvoiceInfoButtonReducer(state) {
      return {
        ...state,
        isShowAddInvoiceConfirm: false,
      };
    },
    clickCancelMoreUserInfoButtonReducer(state) {
      return {
        ...state,
        siftUsers: [],
        isShowMoreUserConfirm: false,
      };
    },
    clickCancelMoreGoodsInfoButtonReducer(state) {
      return {
        ...state,
        siftGoods: [],
        isShowMoreGoodsConfirm: false,
      };
    },
    searchGoodsReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchUsersReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        type:'1',
        goodsRemark: '',
        // 修改订单的详细信息
        orderDetail: null,
        // 地址 省市区
        addressOptions: area.data,
        // 详细地址
        userName: '',
        mobilePhone: '',
        province: null,
        city: null,
        district: null,
        address: '',
        // 总数量
        total: 0,
        // 当前页
        curPage: 1,
        // 每页的列表数
        size: 10,
        siftGoods: [],
        siftUsers: [],
        goods: [],
        users: [],
        receiving: [], 
        // 已选中的收货信息
        receivingInfos: [],
        // 默认收货的信息
        defaultReceivingInfos: [],
        goodsInfos: [],
        otherMoney: 0,
        date: moment().format('YYYY-MM-DD'),
        remark: '',
        // 发票信息配置
        invoiceInfo: [],
        // 默认发票信息
        defaultInvoiceInfos: [],
        // 运费信息配置
        fareInfo: '',
        fareInfoMap: {},
        // 支付信息配置
        payInfo: '',
        payInfoMap: {},
        payConditionMap: {},
        payCondition: -1,
        // 特批价
        specialPrice: -1,
        isSave: 0,
        userInfos: [],
        isShowDeleteConfirm: false,
        isDeleting: false,
        deleteRowId: null,
        deleteGoodsId: null,
        isLoading: true,
        isUserLoading: true,
        // 新增修改收货地址弹窗
        isShowReceivingUpdateConfirm: false,
        // 收货信息列表弹窗
        isShowReceivingConfirm: false,
        // 修改发票弹窗
        isShowUpdateInvoiceConfirm: false,
        isUpdateInvoiceLoading: false,
        // 新建发票信息弹窗
        isShowAddInvoiceConfirm: false,
        isAddInvoiceLoading: false,
        // 发票信息弹窗
        isShowInvoiceConfirm: false,
        isInvoiceLoading: false,
        isInvoiceListLoading: true,
        // 更多客户弹窗
        isShowMoreUserConfirm: false,
        isMoreUserLoading: false,
        // 更多商品弹窗
        isShowMoreGoodsConfirm: false,
        isMoreGoodsLoading: false,
        isGoodsLoading: true,
        isInvoiceInformation: false,
      };
    },
  },
};
