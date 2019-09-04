import moment from 'moment';
import { reqGetList, reqGetConfig } from '../services/grossProfitBySaler';
export default {
  namespace: 'grossProfitBySaler',
  state: {
    sellerId: '',
    sellerGroupId: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    pageSize:40,
    currentPage: 1,
    sort: '',
    order: '',
    isTableLoading: false,
    actionList: [],
    sellerList: [],
    profitRate:'',
    profitTotalAmount: '',
    purchaseTotalCost: '',
    totalAmount: '',
    totalGoodsNum: '',
    isCardLoading: false,
    menuId: '/finance/gross-profit/gross-profit-by-saler',
    sellerMap: {},
    sellerTeamMap: {},
    total: 0,
  },

  effects: {
    *getConfig({ paylaod },{ put, call }) {
        try{
            const config = yield call(reqGetConfig);
            yield put({
                type:'updatePageReducer',
                payload:{
                    sellerMap:config.data.sellerMap,
                    sellerTeamMap: config.data.sellerTeamMap,
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
            sellerId,
            startDate,
            endDate,
            pageSize,
            currentPage,
            sort,
            order,
            sellerGroupId,
         } = yield select(state=>state.grossProfitBySaler);
        try{  
            const res = yield call(reqGetList,{
                sellerId,
                startDate,
                endDate,
                pageSize,
                currentPage,
                sort,
                order,
                sellerGroupId,
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
                sellerId: '',
                sellerGroupId: '',
                startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                pageSize:40,
                currentPage: 1,
                sort: '',
                order: '',
                isTableLoading: false,
                actionList: [],
                sellerList: [],
                profitRate:'',
                profitTotalAmount: '',
                purchaseTotalCost: '',
                totalAmount: '',
                totalGoodsNum: '',
                isCardLoading: false,
                menuId: '/finance/gross-profit/gross-profit-by-saler',
                sellerMap: {},
                sellerTeamMap: {},
                total: 0,
            };
        },
  },
};
