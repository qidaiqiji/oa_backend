import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { reqReviseGoodsInventory } from '../services/importInventoryList';

export default {
  namespace: 'importInventoryList',

  state: {
    isLoading: false,
    isShowOperaInventoryModal: false,
    isOkingOperaInventoryModal: false,
    total: 0,
    goodsList: [],
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    *uploadingGoodsList(_, { put }) {
      yield put({
        type: 'uploadingGoodsListReducer',
      });
    },
    *updateGoodsList({ payload }, { put }) {
      yield put({
        type: 'updateGoodsListReducer',
        payload,
      });
    },
    *triggerOperaInventoryModal(_, { put }) {
      yield put({
        type: 'triggerOperaInventoryModalReducer',
      });
    },
    *okOperaInventoryModal(_, { put, call, select }) {
      yield put({
        type: 'okOperaInventoryModalPending',
      });
      const importInventoryList = yield select(state => state.importInventoryList);
      try {
        yield call(reqReviseGoodsInventory, { ...importInventoryList.goodsList });
        yield put({
          type: 'okOperaInventoryModalResolved',
        });
        notification.success({
          message: '提示',
          description: '校正成功',
        });
        yield put(routerRedux.push('/warehouse/goods-stock-list'));
      } catch (error) {
        yield put({
          type: 'okOperaInventoryModalRejected',
        });
      }
    },
  },

  reducers: {
    unmountReducer() {
      return {
        isLoading: false,
        isShowOperaInventoryModal: false,
        isOkingOperaInventoryModal: false,
        total: 0,
        goodsList: [],
      };
    },
    uploadingGoodsListReducer(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    updateGoodsListReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    },
    triggerOperaInventoryModalReducer(state) {
      return {
        ...state,
        isShowOperaInventoryModal: !state.isShowOperaInventoryModal,
      };
    },
    okOperaInventoryModalPending(state) {
      return {
        ...state,
        isOkingOperaInventoryModal: true,
      };
    },
    okOperaInventoryModalResolved(state) {
      return {
        ...state,
        isOkingOperaInventoryModal: false,
        isShowOperaInventoryModal: false,
      };
    },
    okOperaInventoryModalRejected(state) {
      return {
        ...state,
        isOkingOperaInventoryModal: false,
      };
    },
  },
};
