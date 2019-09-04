import moment from 'moment';
import { reqGetList, reqGetConfig } from '../services/grossProfitBySort';
export default {
  namespace: 'grossProfitBySort',
  state: {
    goodsKeywords: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    catId:'',
    pageSize:'40',
    currentPage: 1,
    sort: '',
    order: '',
    isTableLoading: false,
    actionList: [],
    categoryList: [],
    profitRate:'',
    profitTotalAmount: '',
    purchaseTotalCost: '',
    totalAmount: '',
    totalGoodsNum: '',
    isCardLoading: false,
    menuId: '/finance/gross-profit/gross-profit-by-sort',
    categoryMap: {},
  },

  effects: {
    *getConfig({ paylaod },{ put, call }) {
        try{
            const res = yield call(reqGetConfig);
            yield put({
                type:'updatePageReducer',
                payload:{
                    categoryMap:res.data.categoryMap,
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
            startDate,
            endDate,
            catId,
            pageSize,
            currentPage,
            sort,
            order,
         } = yield select(state=>state.grossProfitBySort);
        try{  
            const res = yield call(reqGetList,{
                goodsKeywords,
                startDate,
                endDate,
                catId,
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
                startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                catId:'',
                pageSize:'40',
                currentPage: 1,
                sort: '',
                order: '',
                isTableLoading: false,
                actionList: [],
                categoryList: [],
                profitRate:'',
                profitTotalAmount: '',
                purchaseTotalCost: '',
                totalAmount: '',
                totalGoodsNum: '',
                isCardLoading: false,
                menuId: '/finance/gross-profit/gross-profit-by-sort',
                categoryMap: {},
            };
        },
  },
};
