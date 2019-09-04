import { reqList, reqConfig } from '../services/agentList.js';
export default {
  namespace: 'agentList',
  state: {
    isTableLoading:false,
    currentPage:1,
    pageSize:50,   
    keywords:'',
    regStartTime:'',
    regEndTime:'',
    province:'',
    status:'',
    list:[],
    count:0,
    statusMap:{},
    provinceMap:{}
  },

  effects: {
        *getList({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                    isTableLoading:true,
                }
            })
            const { 
                keywords,
                province,
                regStartTime,
                regEndTime,
                status,
                currentPage,
                pageSize

            } = yield select(state=>state.agentList)
            try{
                const res = yield call(reqList,{ 
                    keywords,
                    province,
                    regStartTime,
                    regEndTime,
                    status,
                    currentPage,
                    pageSize
                 })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data,
                        isTableLoading:false
                    }
                })
            }catch(err) {
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        isTableLoading:false,
                    }
                })
                console.log(err)
            }
        },
        *getConfig({ payload },{ call, put }) {
            try{
                const res = yield call(reqConfig);
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data
                    }
                })
            }catch(err) {
                console.log(err)
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
        isTableLoading:false,
        currentPage:1,
        pageSize:50,   
        keywords:'',
        regStartTime:'',
        regEndTime:'',
        province:'',
        status:'',
        list:[],
        count:0,
        statusMap:{},
        provinceMap:{}
      };
    },
  },
};
