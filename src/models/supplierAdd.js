import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import {
  reqGetSupplierInfo,
  reqEditSupplier,
  reqAddSupplier, 
  addBrandInfo,
  deleteBrandInfo,
  reqGetGoods,
  reqAddSupplyGoodsList,
  reqUpdateSupplyGoodsList,
  addPaymentMethods,
  reqEditSupplyGoodsList,
  reqDeleteSupplyGoodsList,
  reqUpload,
  reqCheckBrandInfo,
  reqConfig,
  reqDeleteContract,
  reqCancelDelete,
  reqCancelRemoveBrand,
  reqDeleteGoods,
} from '../services/supplierAdd';

export default {
  namespace: 'supplierAdd',
  state: {
    supplierLevel:"",
    supplierProperty:"",
    contractExpireDateStart:"",
    contractExpireDateEnd: "",
    supplierName: "",
    mobile: "",
    contractNo: "",
    status: "",
    contact: "",
    payType: "",
    isSign: 1,
    remark: "",   
    linkmanMobile: "",
    brandList: [],
    brandPolicy:"",
    payMoney: "",
    authorizationExpireDateStart: "",
    authorizationExpireDateEnd: "",
    brandId: "",
    isShowDeleteModal: false,
    id: '',
    goodsList: [],
    isShowGoodsModal: false,
    curPage: 1,
    goodsCheckboxIds: [],
    supplierId: "",
    // selectGoodsId: [],
    isShowAddMethods: false,
    brandListMap: [],
    supplierBrandId: "",
    selectGoodsList: [],
    selectedBrand:{},
    payMethodMap: {},
    payMethod:"",
    propertyMap: {},
    goodsInfos: [],
    allSendPalce: "",
    payType: "",
    total:0,
    curPage: 1,
    isTableLoading: true, 
    showUploadModal:false,
    fileList: [],
    files: [],
    isShowNextStepModal:false,
    activeKey:"1",
    previewUrl: '',
    showDeleteContractModal: false,
    showConfrimModal: false,
    payInfoList: [
      {
        type:"1",
        bankName: "",
        bankInfo: '',
        bankAccount: '',
      },
      {
        type:"2",
        bankName: "",
        bankInfo: '',
        bankAccount: '',
      },
    ],
    rebatePurchasePrice: '',
    brandInfoList: [],
    contractList: [],
    supplierPropertyMap: {},
    uploadBtnLoading: false,
    submitSupplierBtnLoading: false,
    supplierLevelMap:{},
    index:"",
    // 代理品牌审核状态
    brandStatus:"",
    canEdit: 1,
    purchaserMap:{},
    purchaser: "",
    supplierGoodsPayMethodMap:{},
    bankType:""
  },

  effects: {
    *getConfig({payload},{ put, call, select }) {
      try{
        const config = yield call(reqConfig);
        const brandListMap = config.data.brandListMap;
        let sortedBrandListMap = [];
        Object.keys(brandListMap).map(item=>{
          sortedBrandListMap.push({id:item,value:brandListMap[item]})
        })
        sortedBrandListMap.sort((a,b)=>{
          return b.id-a.id
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            ...config.data,
            brandListMap:sortedBrandListMap,
          }
        })
      }catch(err) {
        console.log(err)
      }
    },
    *getInfoById({ payload },{ put, call, select }) {
        yield put({
          type:'changeDefault',
          payload:{
            ...payload,
          }
        })
        yield put({
          type:'getSupplierInfo',
        })
    },
    *getSupplierInfo({ payload }, { put, call, select }) {
      yield put({
        type:'changeDefault',
        payload:{
          isShowNextStepModal: false,
        }
      })
      const { id, activeKey } = yield select(state=>state.supplierAdd)
      try {
        const res = yield call(reqGetSupplierInfo, { id });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...res.data,
            activeKey:payload&&payload.activeKey?payload.activeKey:activeKey,
          },
        });
        yield put({
          type: 'addIsSaved',
        });
        yield put({
          type: 'addSelectedGoodsNum'
        })
        yield put({
          type: 'addSelectedGoods'
        })
      } catch (error) {
        console.log(error)
      }
    },
    *reduceFinanceMark({ payload }, { put, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const {
        payInfoList,
        index,
      } = yield select(state => state.supplierAdd);
      if(payInfoList[index].id) {
        payInfoList[index].isRemove = 1;
      }else{
        payInfoList.splice(index, 1);
      }
      const hasPublic = payInfoList.some(item=>item.type == '1')
      const hasPrivate = payInfoList.some(item=>item.type == '2')
      if(!hasPublic) {
        payInfoList.unshift({
          type:'1',
          bankName: "",
          bankInfo: '',
          bankAccount: '',
        })
      }
      if(!hasPrivate) {
        payInfoList.push({
          type:'2',
          bankName: "",
          bankInfo: '',
          bankAccount: '',
        })
      }
      yield put({
        type: 'updatePageReducer',
        payload: {
          payInfoList,
        },
      });
    },
    *plusFinanceMark({ payload }, { put, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const {
        payInfoList,
        bankType,
        index,
      } = yield select(state => state.supplierAdd);
      payInfoList.splice((index+1),0,
        {
          bankName: "",
          bankInfo: '',
          bankAccount: '',
          type: bankType,
        },
      );
      yield put({
        type: 'updatePageReducer',
        payload: {
          payInfoList,
        },
      });
    },
    *deleteAttachment({ payload },{ put, call, select }) {
        const { deleteId } = payload;
        const { contractList, id, index } = yield select(state=>state.supplierAdd);
        try{
          const res = yield call(reqDeleteContract,{ id:deleteId });
          notification.success({
            message:res.msg,
          })
          // 新增的时候直接做删除，修改的时候删除的也要展示
          if(id) {
            contractList[index].isDelete = 1;
          }else{
            contractList.splice(index,1)
          }
          yield put({
            type:'changeDefault',
            payload:{
              contractList,
              showDeleteContractModal:false,
            }
          })
        }catch(err) {
          console.log(err);
        }
    },
    *cancelDeleteContract({ payload },{ put, call, select }) {
      const { contractList } = yield select(state=>state.supplierAdd);
      try{
        const res = yield call(reqCancelDelete,{ id:payload.currentId });
        notification.success({
          message:res.msg,
        })
        contractList[payload.index].isDelete = 0;
        yield put({
          type:'changeDefault',
          payload:{
            contractList,
          }
        })
      }catch(err){
        console.log(err);
      }
    },
    *saveSupplier({ payload }, { call, put, select }) {
      yield put({
        type:'changeDefault',
        payload:{
          ...payload,
          
        }
      })
      const { supplierName, contact, mobile, id, supplierProperty, isSign, contractExpireDateStart, contractExpireDateEnd, payMethod, remark, contractList, payInfoList, finalPayInfoList } = yield select(state=>state.supplierAdd)
      
      
      try {
        if (id) {
          yield call(reqEditSupplier, { supplierName,
            contact, 
            mobile, 
            id, 
            supplierProperty, 
            isSign, 
            contractExpireDateStart, 
            contractExpireDateEnd, 
            payMethod,
            remark,
            payInfoList:finalPayInfoList,
            contractList,
          });
          notification.success({
            message: '成功',
            description: '修改供应商成功',
          });
          yield put({
            type: 'updatePageReducer',
            payload: {
              // isShowNextStepModal:true,
              submitSupplierBtnLoading: false,
              showConfrimModal:false,
            },
          })
          yield put(routerRedux.push('/purchase/supplier-management/supplier-management-list'));
        } else {
          const res = yield call(reqAddSupplier,{ supplierName,
            contact, 
            mobile,
            supplierProperty, 
            isSign, 
            contractExpireDateStart, 
            contractExpireDateEnd, 
            payMethod,
            remark,
            payInfoList:finalPayInfoList,
            // payInfoList:isEmpty?[...privateBankInfo]:[...privateBankInfo,publicBankInfo],
            contractList,
          });
          // privateBankInfo.push({
          //   bankName: "",
          //   bankInfo: '',
          //   bankAccount: '',
          //   type: '',
          // })
          yield put({
            type: 'updatePageReducer',
            payload: {
              id:res.data.id,
              isShowNextStepModal:true,
              submitSupplierBtnLoading: false,
              showConfrimModal:false,
              // privateBankInfo,
            },
          })
          notification.success({
            message: '成功',
            description: '新增供应商成功',
          });
        }
      } catch (error) {
        yield put({
          type:'updatePageReducer',
          payload:{
            submitSupplierBtnLoading:false,
            showConfrimModal:false,
          }
        })
        
        // do
      }
    },
    *forwardBrand({ payload },{ put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
        },
      })
      if(!id) {
        yield put(routerRedux.push(`/purchase/supplier-management/supplier-management-list/supplier-add/${res.data.id}`));
      }
    },
    *uploadContract({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const { formData,contractList } = yield select(state=>state.supplierAdd);
      try{
        const res = yield call(reqUpload,{ formData });
        let obj = {};
        obj.attachementList = res.data.attchementUrlList;
        obj.contractNo = res.data.contractNo;
        obj.createTime = res.data.createTime;
        obj.id = res.data.id;
        contractList.push(obj)
        yield put({
          type:'updatePageReducer',
          payload:{
            contractList,
            showUploadModal:false,
            fileList:[],
            files:[],
            uploadBtnLoading: false,
          }
        })

      }catch(err){
        yield put({
          type:'updatePageReducer',
          payload:{
            uploadBtnLoading: false,
          }
        })
        console.log(err)
      }

    },
    /**---------------保存新增信息的时候发送请求--------- */
    *submitAddBrandInfo({ payload },{ put, call, select }) {
        const { brandId, supplierId } = payload;
        const {
          supplierLevel,
          brandPolicy,
          payMoney,
          brandRemark,
        } = yield select(state=>state.supplierAdd);
        try {
          const res = yield call(addBrandInfo,{
            brandId,
            supplierId,
            supplierLevel,
            brandPolicy,
            payMoney,
            brandRemark,
         })
          notification.success({
            message: res.msg,
          });
          yield put({
            type:'updatePageReducer',
            payload: {
              brandId:"",
              authorizationExpireDateStart:"",
              authorizationExpireDateEnd:"",
              brandPolicy:"",
              payMoney:"",
              brandRemark:"",
              ...res.data,
            }
          })

        }catch(err) {

        }
    },
    /**--------------给每一条品牌信息都添加一个isSaved的字段---------- */
    *addIsSaved({ payload }, { put, select }) {
      const { brandList, payInfoList } = yield select(state=>state.supplierAdd);
      brandList.map(item=>{
          item.isSaved = false;
      })
      const hasPrivate = payInfoList.some(item=>item.type == 2);
      if(!hasPrivate) {
        payInfoList.push({
          type:"2",
            bankName: "",
            bankInfo: '',
            bankAccount: '',
        })
      }
      const hasPublic = payInfoList.some(item=>item.type == 1);
      if(!hasPublic) {
        payInfoList.unshift({
          type:"1",
            bankName: "",
            bankInfo: '',
            bankAccount: '',
        })
      }
      yield put({
          type:'updatePageReducer',
          payload: {
            brandList,
          }
      })
  },
  *addSelectedGoodsNum({ payload }, { put, select }) {
    const { brandList } = yield select(state=>state.supplierAdd);
    brandList.map(item=>{
        item.selectGoodsId = [];
    })
    yield put({
        type:'updatePageReducer',
        payload: {
          brandList,
        }
    })
},
*addSelectedGoods({ payload }, { put, select }) {
  const { brandList } = yield select(state=>state.supplierAdd);
  brandList.map(item=>{
      item.selectRows = [];
  })
  yield put({
      type:'updatePageReducer',
      payload: {
        brandList,
      }
  })
},
  // 点击保存的时候发送请求
  *editBrandInfo({ payload },{ put, call }) {
    const { currentEdit } = payload;
     try {
        const res = yield call(reqEditSupplyGoodsList,{
            ...currentEdit
        })
        yield put({
          type:'updatePageReducer',
          payload: {
              ...payload,
              brandList: res.data.brandList,
          }
      })
        notification.success({
           message: res.msg,
         });

    } catch(error) { 
       //  TODO
    }
    
  },
  // 点击删除的时候删除对应的品牌信息
  *DeleteBrandInfo({ payload }, { put, call, select }) {
    const { id } = yield select(state=>state.supplierAdd);
    const { supplierBrandId, isShowDeleteModal } = payload;
    try {
      const res = yield call(deleteBrandInfo,{
        supplierBrandId
      })
      yield put({
        type:'updatePageReducer',
         payload: {
           isShowDeleteModal,
         }
      })
      yield put({
        type:'getSupplierInfo',
        payload: {
          id,
          activeKey:"2",
        }
      })

    } catch(error) { 
      //  TODO
    }
  },
  // 撤销删除品牌信息
  *cancelRemoveBrand({ payload },{ put, call, select }) {
    const { supplierBrandId } = payload;
    const { brandList } = yield select(state=>state.supplierAdd);
    try{
      const res = yield call(reqCancelRemoveBrand,{ supplierBrandId });
      notification.success({
        message:res.msg,
      })
      // brandList.map(item=>{
      //   if(+item.id === +supplierBrandId) {
      //     item.isDelete = 0;
      //   }
      // })
      yield put({
        type:'getSupplierInfo',
        payload:{
          activeKey:"2"
        }
      })

    }catch(err){
      console.log(err)
    }
  },
  /**-------删除商品------ */
  *deleteGoods({ payload }, { put,select, call }) {
    const { brandList } = yield select(state=>state.supplierAdd);
    try{
      const res = yield call(reqDeleteSupplyGoodsList, { ...payload });
      // const goodsList = res.data.goodsList;
      brandList.map(brand=>{
        if(+brand.id === +payload.supplierBrandId) {
          brand.goodsList.map(item=>{
            if(+item.id === +payload.id) {
                item.isDelete = 1;
            }
          })
        }
      })
      // message.success("删除成功");
      yield put({
        type: 'updatePageReducer',
        payload:{
          brandList,
        }
      })
    }catch(err) {
      console.log(err)
    }

  },
  *cancelDeleteGoods({ payload },{ put, call, select }) {
      const { brandList } = yield select(state=>state.supplierAdd);
      try{
        yield call(reqDeleteGoods,{ id:payload.goodsId });
        brandList.map(brand=>{
          if(+brand.id === +payload.supplierBrandId) {
            brand.goodsList.map(item=>{
              if(+item.id === +payload.goodsId) {
                  item.isDelete = 0;
              }
            })
          }
        })
        yield put({
          type: 'updatePageReducer',
          payload:{
            brandList,
          }
        })
      }catch(err){
        console.log(err)

      }
  },
  // ------点击添加供应商品-----
  *addSipplierGoods({payload}, { put, call, select }) {   
    yield put({
      type:'getListPending',
      payload: {
        ...payload,
      }
    })  
    const { curPage, brandId, isShowGoodsModal,supplierBrandId,selectedBrand } = yield select(state=>state.supplierAdd);
    const list = yield call(reqGetGoods, { brandId, curPage })
    yield put({
      type:'updatePageReducer',
      payload: {
        goodsList:list.data.goods,
        total:list.data.total,
        isShowGoodsModal,
        supplierBrandId,
        selectedBrand,
        brandId,
      }
    })  
  },
  // },
  // ----点击确定的时候添加商品-------
  *changeGoods({ payload }, { put, call, select }) {
    const { supplierBrandId } = payload;
    const { id, brandList,goodsCheckboxIds } = yield select(state=>state.supplierAdd)
    yield put({
      type: 'updatePageReducer',
    });
    try {
      const res = yield call(reqGetGoods, { keywords: '', curPage: 1, goodsIds: payload.goodsIds, id, pageSize: 0 });
      const order = res.data.goods;
      const siftGoodsList = order.filter((oneGoods) => {
        return payload.goodsIds.indexOf(oneGoods.goodsId) > -1;
      });
      const goodsInfos = [];
      for (let i = 0; i < siftGoodsList.length; i += 1) {
        const obj = {};
        obj.goodsId = siftGoodsList[i].goodsId;
        obj.supplyPrice = 0;
        goodsInfos.push(obj);
      }
      const goods = yield call(reqAddSupplyGoodsList, { supplierBrandId, goodsInfos, id});
      notification.success({
        message: goods.msg,
      });
      const record = goods.data;
      // let supplierGoodsList = record.supplierGoodsList;
      // supplierGoodsList.map(item=>{
      //   item.rebatePurchasePrice = 0;
      // })
      brandList.map(item=>{
        if(+item.id === +record.supplierBrandId) {
          item.goodsList = record.supplierGoodsList;
        }
      })
      yield put({
        type: 'updatePageReducer',
        payload: {
          keywords: '',
          goodsId: '',
          curPage: 1,
          isShowGoodsModal: false,
          brandList,
          goodsCheckboxIds: [],
        },
      });
    } catch (error) {
      // to do
    }
  },
  // 弹窗搜索商品
  *searchGoods({payload},{put, call, select}) {
     const { curPage, keywords } = payload;
     yield put({
        type: 'getListPending',
      });
      const { brandId } = yield select(state=>state.supplierAdd);
     try {
      const goodsData = yield call(reqGetGoods, {
        curPage,
        keywords,
        brandId
      });
      for (let i = 0; i < goodsData.data.goods.length; i += 1) {
        goodsData.data.goods[i].supplyPrice = 0;
      }
      yield put({
        type: 'updatePageReducer',
        payload: {
          goodsList: goodsData.data.goods,
          total:goodsData.data.total,
          ...payload,
        },
      });
    } catch (error) {
      // dodo
    }
  },
  *ChangeBrandInfo({payload},{put,select}){
    const { brandList } = yield select(state=>state.supplierAdd);
    brandList&&brandList.map(item=>{
        if(item.brandId&&item.brandId === payload.brandId){  
            Object.keys(item).map(key=>{
                Object.keys(payload).map(item2=>{
                    if(key === item2) {
                        item[key] = payload[item2]
                    }
                })
            })
        }
    })
    yield put({
        type:'updatePageReducer',
        payload: {
          brandList,
        }
    })           
},
/**------------------更改输入框的值------------ */
  *ChangeSupplyInfos({ payload },{ put, select }) {
    const { brandList } = yield select(state=>state.supplierAdd);
    brandList.map(item=>{
      item.goodsList.map(item2=>{
        if(+item2.goodsId === +payload.goodsId) {
          Object.keys(item2).map(key=>{
            Object.keys(payload).map(key2=>{
              if(key === key2) {
                item2[key] = payload[key2]
              }
            })
          })
        }
      })
    })
    yield put({
      type:'updatePageReducer',
      payload: {
        brandList,
      }
  })     

  },

  *updateByChange({ payload },{ put, select, call }) {
    const { supplierBrandId, selectedRows, id } = payload;
    const { brandList } = yield select(state=>state.supplierAdd);
    brandList.map(item=>{
      if(+item.id === +supplierBrandId) {
        item.goodsList.map(list=>{
          selectedRows.map(selected=>{
            if(+list.goodsId === +selected.goodsId) {
              list = selected;
            }
          })
        })
      }
    })
    yield put({
      type:'updatePageReducer',
      payload: {
        brandList,
      }
    })
    try {
      const res = yield call(reqUpdateSupplyGoodsList, { 
        supplierBrandId,
        id,
        goodsInfos: selectedRows
      });
      // if(res.code == 0) {
      //   message.success("修改成功")
      // }
       
    }catch(err) {
      console.log(err)
    } 
  },
  // 添加新的付款方式
  *addNewMethods({payload},{ put, call }) {
    const { payType, isShowAddMethods } = payload;
    try {
      const res = yield call(addPaymentMethods, { 
        payType
      }); 
      if(+res.code === 0) {
        message.success(res.msg)
      }
      yield put({
        type:'updatePageReducer',
        payload: {
          isShowAddMethods,
          supplierGoodsPayMethodMap:res.data.payTypeMap,
          payType: "",
        }
      })
      
    }catch(err) {
    } 
  },
  *checkBrandInfo({ payload },{ put, call, select }) {
      const { id, brandList } = yield select(state=>state.supplierAdd)
      let goodsList = [];
      
      brandList.map(item=>{
        let goodsIds = [];
        item.goodsList.map(goods=>{
          goodsIds.push(goods.id)
        })
        goodsList.push({brandId:item.brandId,goodsIds})
      })
      try{
        const res = yield call(reqCheckBrandInfo,{ id, brandList:goodsList });
        notification.success({
          message:res.msg,
        })
        yield put({
          type:"updatePageReducer",
          payload:{
            showConfrimModal:false,
          }
        })
        yield put(
          routerRedux.push('/purchase/supplier-management/supplier-management-list')
        );
      }catch(err) {
        yield put({
          type:"updatePageReducer",
          payload:{
            showConfrimModal:false,
          }
        })
        console.log(err)
      }
  },
  *updateSupplyGoods({ payload },{ put, select, call }) {
    const { brandList } = yield select(state=>state.supplierAdd);
    const { goodsInfos } = payload;
    brandList.map(item=>{
      item.goodsList.map(item2=>{
        goodsInfos.map(items=>{
          if(+item2.goodsId === +items.goodsId) {
            Object.keys(item2).map(key=>{
              Object.keys(goodsInfos).map(key2=>{
                if(key === key2) {
                  item2[key] = goodsInfos[key2]
                }
              })
            })
          }
        })
      })
    })
    yield put({
      type:'updatePageReducer',
      payload: {
        brandList,
      }
  })
    try {
      const res = yield call(reqUpdateSupplyGoodsList, { ...payload });
    }catch(err) {
      console.log(err)
    } 
  },
  *unmount({ payload }, { put }) {
      yield put({
        type: 'unmountReducer',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
        isTableLoading:false,
      };
    },
     // 获取列表中
     getListPending(state, { payload }) {
      return {
          ...state,
          ...payload,
          isTableLoading: true,
      };
    },
    getGoodsInfos(state) {
      return {
        ...state,
        goodsCheckboxIds: [],
        isShowMoreGoodsConfirm: false,
        isMoreGoodsLoading: false,
      };
    },
    changeDefault(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        supplierLevel:"",
        supplierProperty:"",
        contractExpireDateStart:"",
        contractExpireDateEnd:"",
        supplierName: "",
        mobile: "",
        contractNo: "",
        status: "",
        contact: "",
        payType: "",
        payMethod: "",
        isSign: 1,
        remark: "", 
        brandRemark:"",
        brandList: [],
        brandPolicy:"",
        payMoney: "",
        authorizationExpireDateStart: "",
        authorizationExpireDateEnd: "",
        brandId: "",
        isShowDeleteModal: false,
        id: "",
        goodsList: [],
        isShowGoodsModal: false,
        curPage: 1,
        goodsCheckboxIds: [],
        supplierId: "",
        // selectGoodsId: [],
        isShowAddMethods:false,
        brandListMap: [],
        // 当前选中的品牌列表中的id，不是brandId
        supplierBrandId: "",
        selectGoodsList: [],
        selectedBrand: {},
        payMethodMap: {},
        propertyMap: {},
        goodsInfos: [],
        allSendPalce: "",
        payType: "",
        total:0,
        curPage: 1,
        isTableLoading: true,
        brandRemark:"",
        showUploadModal:false,
        fileList: [],
        files: [],
        isShowNextStepModal:false,
        activeKey:"1",
        previewUrl: '',
        payInfoList: [
          {
            type:"1",
            bankName: "",
            bankInfo: '',
            bankAccount: '',
          },
          {
            type:"2",
            bankName: "",
            bankInfo: '',
            bankAccount: '',
          },
        ],
        rebatePurchasePrice: '',
        brandInfoList: [],
        contractList: [],
        supplierPropertyMap: {},
        uploadBtnLoading: false,
        submitSupplierBtnLoading: false,
        supplierLevelMap:{},
        showDeleteContractModal: false,
        index:"",
        brandStatus:"",
        canEdit: 1,
        purchaserMap:{},
        purchaser: "",
        supplierGoodsPayMethodMap: {},
        showConfrimModal: false,
        bankType: ""
      };
    },
  },
};
