import moment from 'moment'
import {reqGetCustomerListConfig, reqGetCustomerList } from '../services/customerList'
export default {
    namespace: 'customerList',

    state:{ //本地数据在这定义？
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

},
effects:{
    *mount(_,{put}){
      yield put({
          type:'getConfig',
      })
    },
    *getConfig(_,{put,call}){
        try{
            const res = yield call(reqGetCustomerListConfig)
            yield put({
                type:'configReducer',
                payload:{
                    ...res.data,
                }
            })
            yield put({
                type:'getList',
            })

        } catch (error){
            console.log(error)
        }
    },
    *changeConfig({payload},{put}){
        yield put({  //就是要异步一下，皮
            type:'updateConfig',
            payload:{
                ...payload,
            }
        })
    },
    *getList({payload},{put,call,select}){
       yield put({
           type:'getListPending',
           payload:{
               ...payload,
           }
       })
       const customerList = yield select(state =>state.customerList)
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
      } = customerList;
      
     try{
         const res = yield call(reqGetCustomerList,{
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
         })
        yield put({
            type:'getListResolved',
            payload:{
                total:res.data.total,
                customerInfo:res.data.customerList,
                ...res.data
            }
        })

     } catch(error){
         console.log(error)
     }





    },
    *changeViewMore(_,{put,select}){
        const customerList= yield select(state=>state.customerList)
        const {viewMoreStatus} =customerList
        yield put({
            type:'viewMoreStatusReducer',
            payload:{
                viewMoreStatus: !viewMoreStatus,
            }
        })

    },
    *changeSelectOrderIds({payload},{put}){
        yield put({
            type:'changeSelectOrderIdsReducer',
            payload,
        })
    },
    *changeSortList({payload},{put,select}){
            const customerList = yield select(state=>state.customerList)
            const {sort,order}=customerList
            yield put({
                type:'getList',
                payload:{
                    ...payload,
                    order:(payload.sort !== sort)?1:Number(!order),
                }
            })

    },
    *emptySiftItem(_,{put}){
        yield put({
            type:'getList',
            payload:{
                customerId:'',
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

            }
        })
    },
    *unmount(_,{put}){
        yield put({
            type:'unmountReducer',
        })
    }

//effects
},
  reducers:{
    changeSelectOrderIdsReducer(state,{payload}){
        return {
            ...state,
            ...payload
        }
    },
    updateConfig(state,{payload}){
         return {
             ...state,
             ...payload,
         }
    },
    getListResolved(state,payload){
        return {
            ...state,
            ...payload,
            isLoading:false
        }
    },
    getListPending(state,{payload}){
        return {
            ...state,
            ...payload,
            isLoading:true 
        }
    },
    viewMoreStatusReducer(state,{payload}){
        return {
            ...state,
            ...payload,
        }
    },
    configReducer(state,{payload}){
        return {
            ...state,
            ...payload,
            isLoadingConfig:false,
        }
    },
    unmountReducer(){
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
        }
    }




      //reducers
  }




}