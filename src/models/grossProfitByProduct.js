import moment from 'moment';
import { reqGetList, reqGetConfig } from '../services/grossProfitByProduct';
export default {
  namespace: 'grossProfitByProduct',
  state: {
    goodsKeywords: '',
    saleOrderSn: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    orderSource: '-1',
    orderType: '-1',
    pageSize:'40',
    currentPage: 1,
    sort: '',
    order: '',
    isTableLoading: false,
    actionList: [],
    orderGoodsList: [],
    profitRate:'',
    profitTotalAmount: '',
    purchaseTotalCost: '',
    totalAmount: '',
    totalGoodsNum: '',
    isCardLoading: false,
    menuId: '/finance/gross-profit/gross-profit-by-product',
    orderGoodsTypeMap: {},
    orderGroupTypeMap: {},
    total: 0,
  },

  effects: {
    *getConfig({ paylaod },{ put, call }) {
        try{
            const res = yield call(reqGetConfig);
            yield put({
                type:'updatePageReducer',
                payload:{
                    orderGoodsTypeMap:res.data.orderGoodsTypeMap,
                    orderGroupTypeMap:res.data.orderGroupTypeMap,
                }
            })
        }catch(err) {
            console.log(err)
        }
    },
    *getList({ payload },{ put, call, select }) {
        yield put({
            type:'updatePageReducer',
            payload:{
                ...payload,
                isTableLoading:true,
                isCardLoading: true,
            }
        })
        const { 
            goodsKeywords,
            saleOrderSn,
            startDate,
            endDate,
            orderSource,
            orderType,
            pageSize,
            currentPage,
            sort,
            order,
         } = yield select(state=>state.grossProfitByProduct);
        try{  
            const res = yield call(reqGetList,{
                goodsKeywords,
                saleOrderSn,
                startDate,
                endDate,
                orderSource,
                orderType,
                pageSize,
                currentPage,
                sort,
                order,
            })
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...res.data,
                    isTableLoading:false,
                    isCardLoading: false,
                }
            })
        }catch(err){
            yield put({
                type:'updatePageReducer',
                payload:{
                    isTableLoading:false,
                    isCardLoading: false,
                }
            })
        }
    }
  },

  reducers: {
        updatePageReducer(state,{ payload }) {
            return {
                ...state,
                ...payload,
            }
        },
        unmountReducer() {
            return {
                goodsKeywords: '',
                saleOrderSn: '',
                startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                orderSource: '-1',
                orderType: '-1',
                pageSize:'40',
                currentPage: 1,
                sort: '',
                order: '',
                isTableLoading: false,
                actionList: [],
                orderGoodsList: [],
                profitRate:'',
                profitTotalAmount: '',
                purchaseTotalCost: '',
                totalAmount: '',
                totalGoodsNum: '',
                isCardLoading: false,
                menuId: '/finance/gross-profit/gross-profit-by-product',
                orderGoodsTypeMap: {},
                orderGroupTypeMap: {},
                total: 0,
            };
        },
  },
};
