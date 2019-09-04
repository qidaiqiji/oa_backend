import moment from 'moment';
import { reqGetList } from '../services/grossProfitByCustomer';
export default {
  namespace: 'grossProfitByCustomer',
  state: {
    customerName: '',
    startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    pageSize:40,
    currentPage: 1,
    sort: '',
    order: '',
    isTableLoading: false,
    actionList: [],
    customerList: [],
    profitRate:'',
    profitTotalAmount: '',
    purchaseTotalCost: '',
    totalAmount: '',
    totalGoodsNum: '',
    isCardLoading: false,
    menuId: '/finance/gross-profit/gross-profit-by-customer',
    total: 0
,  },

  effects: {
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
            customerName,
            startDate,
            endDate,
            pageSize,
            currentPage,
            sort,
            order,
         } = yield select(state=>state.grossProfitByCustomer);
        try{  
            const res = yield call(reqGetList,{
                customerName,
                startDate,
                endDate,
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
                customerName: '',
                startDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                pageSize:40,
                currentPage: 1,
                sort: '',
                order: '',
                isTableLoading: false,
                actionList: [],
                customerList: [],
                profitRate:'',
                profitTotalAmount: '',
                purchaseTotalCost: '',
                totalAmount: '',
                totalGoodsNum: '',
                isCardLoading: false,
                menuId: '/finance/gross-profit/gross-profit-by-customer',
                total: 0
            };
        },
  },
};
