import moment from 'moment';
import { notification } from 'antd';
import { reqList, reqSave, reqRelease, reqSearch } from '../services/manualOccupy';
import { stat } from 'fs';

export default {
  namespace: 'manualOccupy',

  state: {
    stockReturnTimeStart:'',
    stockReturnTimeEnd:'',
    createTimeStart:'',
    createTimeEnd:'',
    currentPage:1,
    pageSize:50,
    followPerson:'',
    controlPerson:'',
    keywords:'',
    isTableLoading:false,
    actionList:[],
    goodsDepotList:[],
    total:0,
    userList:[],
    currentId:''
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
                stockReturnTimeStart,
                stockReturnTimeEnd,
                createTimeStart,
                createTimeEnd,
                currentPage,
                pageSize,
                followPerson,
                controlPerson,
                keywords,
            } = yield select(state=>state.manualOccupy);
            try{
                const res = yield call(reqList,{
                    stockReturnTimeStart,
                    stockReturnTimeEnd,
                    createTimeStart,
                    createTimeEnd,
                    currentPage,
                    pageSize,
                    followPerson,
                    controlPerson,
                    keywords,
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        ...res.data,
                        isTableLoading:false,
                    }
                })

            }catch(err) {
                
            }
      },
      *confirmRelease({ payload },{ put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    ...payload,
                }
            })
            const { currentId } = yield select(state=>state.manualOccupy);
            try{
                const res = yield call(reqRelease,{ id:currentId })
                notification.success({
                    message:res.msg
                })
                yield put({
                    type:'getList',
                    payload:{
                        buttonLoading:false,
                        showModal:false,
                    }
                })
            }catch(err) {
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        buttonLoading:false,
                        showModal:false,
                    }
                })
            }
      },
      *searchKeywords({ payload },{ put, call }) {
            if(payload.type=="followPerson"&&payload.keyWords == "" ){
                yield put({
                    type:'getList',
                    payload:{
                        followPerson:''
                    }
                })
                return;
            }else if(payload.type=="controlPerson"&&payload.keyWords == "" ) {
                yield put({
                    type:'getList',
                    payload:{
                        controlPerson:''
                    }
                })
                return;
            }
            try{
                const res = yield call(reqSearch,{ keywords:payload.keyWords });
                yield put({
                    type:"updatePageReducer",
                    payload:{
                    userList:res.data.list,
                    }
                })
            }catch(err) {
    
            }
            
      },
      *saveRemark({ payload },{ put, call, select }) {
          yield put({
              type:'updatePageReducer',
              payload:{
                  ...payload,
              }
          })
          const { goodsDepotList, editId } = yield select(state=>state.manualOccupy);
          let remark = "";
          goodsDepotList.map(item => {
              if(editId == item.goodsId) {
                  remark = item.remark;
              }
          })
          try{
              const res = yield call(reqSave, { id:editId, remark })

          }catch(err){
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
                stockReturnTimeStart:'',
                stockReturnTimeEnd:'',
                createTimeStart:'',
                createTimeEnd:'',
                currentPage:1,
                pageSize:50,
                followPerson:'',
                controlPerson:'',
                keywords:'',
                isTableLoading:false,
                actionList:[],
                goodsDepotList:[],
                total:0,
                userList:[],
                currentId:''
            };
        },
    }
};
