import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
import img from '../../assets/u2741.png';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ClearIcon from '../../components/ClearIcon';
import {
  Modal,
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
  Spin,
  Tooltip,
  Radio,
  Checkbox,
  message,
  Icon,
  AutoComplete,
  Alert,
} from 'antd';
import styles from './SmartPurchaseList.less';
import Debounce from 'lodash-decorators/debounce';
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(state => ({
    smartPurchaseList: state.smartPurchaseList,
}))
export default class smartPurchaseList extends PureComponent{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'smartPurchaseList/getList',
        }); 
        dispatch({
          type: 'smartPurchaseList/getConfig',
        }); 
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'smartPurchaseList/unmount',
        });
    }
/**-----------改变搜索框的值---------- */
    handleChangeGoodsKeywords(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                goodsKeywords:e.target.value,
            }
        });
    }
/**-----------搜索公用一个方法---------- */
    handleSearchMethods=(type,e,dataStrings)=>{
       const { dispatch, smartPurchaseList } = this.props;
       const { goodsKeywords } = smartPurchaseList;
       switch(type) {
           case "goodsKeywords":
            dispatch({
            type: 'smartPurchaseList/getList',
            payload: {
                goodsKeywords,
                curPage:1,
            }
           });
           break;
           case "stockingRange":
           case "purchaser":
           case "supplierId":
           dispatch({
            type: 'smartPurchaseList/getList',
            payload: {
                [type]: e,
                curPage:1,
            }
          });
          break;
          case "purchaseDate":
          dispatch({
            type: 'smartPurchaseList/getList',
            payload: {
                purchaseHistoryDateStart: dataStrings[0],
                purchaseHistoryDateEnd: dataStrings[1],
                curPage:1,
            },
          });
        break;
       }
    }
     // 换页回调
    handleChangePage=(value)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                curPage:value
            },
        });

    }
    handleChangePageSize=(_,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                pageSize,
                curPage:1,
            },
        });

    }
/**--------------点击复选框选择商品----------- */
    handleCheckSupplyGoods=(goodsIds,selectedRows)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/changeSupplyGoodsCheckboxIds',
            payload: {
                supplyGoodsCheckboxIds: goodsIds,
                selectedRows,
            },
        });
    }
/** ----------- 点击生成采购单弹窗------------*/
    handelProducedPurchaserOrder=()=> {
        const { dispatch, smartPurchaseList } = this.props;
        const { orderIds, selectedRows } = smartPurchaseList;
        selectedRows.map(select=>{
            if(!select.isChangeNum) {
                select.purchaseNum = select.recommendNum;
            }
        })
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                selectedRows
            }
        });
        dispatch({
            type: 'smartPurchaseList/producedPurchaserOrder',
            payload: {
                goodsIdList: orderIds,
                isShowGoodsListModal: true,
            },
        });
   }
/**------------取消的时候关闭弹窗----------- */
    handleTriggerGoodsListModal=()=> {
        const { dispatch } = this.props;
        dispatch({
        type: 'smartPurchaseList/updatePageReducer',
        payload: {
            isShowGoodsListModal: false,
        }
        });
    }
/**-------填写实际采购数量--------- */
    handleActualPurchaseNum=(currentId,e)=>{
        const { dispatch } = this.props;
       
        dispatch({
            type: 'smartPurchaseList/actualPurchaseNum',
            payload: {
                currentId,
                purchaseNum:e.target.value,
            }
        });
    }
/**----------选择财务信息------ */
    handleChangeFinanceRemarks(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                financeRemarksIndex: e.target.value,
            },
        });
    }
 // 判断是否勾选了挂账抵扣
    handleIsDeduction(e) {
        const isDeduction = e.target.checked;
        const { dispatch, smartPurchaseList } = this.props;    
        const { isChange, balanceBillTotalAmount } = smartPurchaseList;    
        if(!isChange){
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload: {
                balanceBillAmount: +balanceBillTotalAmount,
                }
            })
        }    
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                isDeduction,
            }
        })
        if(!isDeduction){
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload: {
                balanceBillAmount: 0,
                }
            })
        } 
    }
  // 填写挂账抵扣金额
    inputDeductionValue(e) {
        const balanceBillAmount = e.target.value;
        const { dispatch, smartPurchaseList } = this.props;
        const { balanceBillTotalAmount, isDeduction } = smartPurchaseList;
        if(!isDeduction){
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
            balanceBillAmount: 0,
            }
        })
        }else{      
        if(balanceBillAmount <= +balanceBillTotalAmount ){
            dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                balanceBillAmount,
            }
            })
        }
        else{
            message.warning("挂账抵扣金额超出可用金额，请重新输入");
            dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                balanceBillAmount: +balanceBillTotalAmount,
            }
            })
            return;
        }
        }
    }
    changeDeductionValue=(e)=>{
        const { dispatch, smartPurchaseList } = this.props;
        const { balanceBillTotalAmount, isDeduction } = smartPurchaseList;
        if(isDeduction){
          if( +balanceBillTotalAmount){
            dispatch({
              type: 'smartPurchaseList/updatePageReducer',
              payload: {
                balanceBillAmount: e.target.value,
                isChange: true,
              }
            })
          }else{
            message.warning("无可用抵扣金额");
            dispatch({
              type: 'smartPurchaseList/updatePageReducer',
              payload: {
                balanceBillAmount: +balanceBillTotalAmount,
              }
            })
            return;
          }
        }else{
          dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
              balanceBillAmount: 0,
              isChange: false,
            }
          })
        }
      }
// 抵扣金额是否开票
    deductionIsBill(e) {
        const isOutInv =  e.target.value;
        const { dispatch} = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                isOutInv,
            }
        })
        if(!isOutInv){
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload: {
                    balanceBillOutInvAmount: 0,
                }
            })
        }   
    }
     // 抵扣金额需开票金额
    saveDeductionValue(e) {
        const { dispatch, smartPurchaseList } = this.props;
        const { isOutInv, balanceBillAmount} = smartPurchaseList;
        const balanceBillOutInvAmount = e.target.value;
        if(isOutInv) {
        if(+balanceBillOutInvAmount > +balanceBillAmount) {
            message.warning("开票金额超出抵扣金额");
            return;
        }else{
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload: {
                    balanceBillOutInvAmount,
                }
            })
        }
        }else{
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                balanceBillOutInvAmount: 0,
            }
        })
        }
    }
// 选择支付方式
    handleChangePaymentMethod(value) {
        const { dispatch } = this.props;
        dispatch({
        type: 'smartPurchaseList/handlePaymentMethod',
        payload: {
            payType: value,
            isShowPaymentDate: false
        },
        });
    }
 // 选择预计发货日期
    handleChangeShipItem=( dataStrings) => {
        const { dispatch } = this.props;
        dispatch({
        type: 'smartPurchaseList/updatePageReducer',
        payload: {
            expectShippingDate: dataStrings,
        },
        });
    }
    // 选择预计付款日期
    handleChangePaymentItem=( dataStrings) => {
        const { dispatch } = this.props;
        dispatch({
        type: 'smartPurchaseList/updatePageReducer',
        payload: {
            expectPayTime: dataStrings,
        },
        });
    }
    // 日期选择
    handleChangeSiftItem=( dataStrings) => {
        const { dispatch } = this.props;
        dispatch({
        type: 'smartPurchaseList/updatePageReducer',
        payload: {
            expectInvDate: dataStrings,
        },
        });
    }
    // 制单备注
    handleChangeRemark(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
                remark: e.target.value,
            },
        });
    }
// 选择供应商
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'smartPurchaseList/getList',
      payload: {
        curPage: 1,
        supplierId,
        supplierSearchText: children,
      },
    });
  }
  // 搜索供应商
  @Debounce(200)
  handleChangeSupplier(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'smartPurchaseList/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
    //   升降序排列
    onTableChange=(pagination,filters,sorter)=>{
        const { dispatch } = this.props;
        if(sorter.order === "ascend") {
            dispatch({
                type: 'smartPurchaseList/sortGoodsList',
                payload: {
                    sort:2,
                    orderBy:sorter.field,
                }
            });
        }else if(sorter.order === "descend") {
            dispatch({
                type: 'smartPurchaseList/sortGoodsList',
                payload: {
                    sort:1,
                    orderBy:sorter.field,
                }
            });
        }
    }

  handleChangePayCondition=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'smartPurchaseList/updatePageReducer',
      payload: {
        payCondition: value,
      },
    });
  }
// 提交主管审核
    handleClickSubmitReview() {
        const { dispatch, smartPurchaseList } = this.props;
        const { payType, financeRemarksIndex,
            expectInvDate, isTax, expectShippingDate, isShowPaymentDate, expectPayTime, 
            isDeduction, isOutInv, balanceBillAmount, balanceBillOutInvAmount, isCheck,bankType,
            bankInfoId,
            isAllCash,
            isAllDirect,
            isAllAgency,
            } = smartPurchaseList;
        if (!payType) {
            message.warning('请选择支付方式');
            return;
        }
        if (!financeRemarksIndex&&!bankInfoId) {
            message.warning('请选择一条财务备注');
            return;
        }
        if (!expectShippingDate) {
            message.warning('请添加预发货时间');
            return;
        }
        if (+isTax) {
            if (!expectInvDate) {
                message.warning('请添加预开票时间');
                return;
            }
        }
        if (isShowPaymentDate) {
            if (!expectPayTime) {
                message.warning('请添加预付款时间');
                return;
            }
        }
        if(isDeduction) {
            if(!balanceBillAmount) {
                message.warning('请填写挂账抵扣金额');
                return;
            }
            if (isOutInv) {
                if (!+balanceBillOutInvAmount) {
                message.warning('请填写开票金额');
                return;
                }
            }     
        }
        if(financeRemarksIndex&&bankInfoId) {
            message.error("只能选择一条财务备注");
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload:{
                    financeRemarksIndex:"",
                    bankInfoId:"",
                    bankType:"",
                }
            });
            return;
        }  
        if(isCheck) {
            dispatch({
                type: 'smartPurchaseList/updatePageReducer',
                payload:{
                    showConfirmModal:true,
                }
            });
        }else if(payType == 0&&!isAllCash || payType == 2&&!isAllDirect || payType == 4&&!isAllAgency){
            dispatch({
              type:"smartPurchaseList/updatePageReducer",
              payload:{
                showModal:true,
              }
            })
        }else{
            dispatch({
                type: 'smartPurchaseList/clickSubmitReview',
            });
        }   
    }
      handleChangeBankInfoType=(e)=>{
        const { dispatch, smartPurchaseList } = this.props;
        const { finalBankInfos } = smartPurchaseList;
        let bankInfoDetail = [];
            finalBankInfos.map(item=>{
            if(+item.type === +e) {
              bankInfoDetail = item.bankInfoDetail;
            }
        })
        dispatch({
          type: 'smartPurchaseList/updatePageReducer',
          payload: {
            bankType:e,
            bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
            bankInfoDetail,
          },
        });
      }
      handleChangeBankDetail=(e)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'smartPurchaseList/updatePageReducer',
          payload: {
            bankInfoId:e,
          },
        });
      }
      handleConfirmCheck=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/clickSubmitReview',
        });
      }
      handleCancelConfirm=(type)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload:{
                [type]:false,
            }
        });
      }
      handleClear=(type)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'smartPurchaseList/getList',
            payload:{
                [type]:"",
            }
        }); 
      }
      handleChangeIsTax=(e)=>{
        const { dispatch } = this.props;
          dispatch({
            type: 'smartPurchaseList/changeIsTax',
            payload: {
              isTax: e,
              bankType:+e?1:2,
            },
          });
      }
      handleChangeShippingMethod=(e)=>{
        const { dispatch } = this.props;
          dispatch({
            type: 'smartPurchaseList/updatePageReducer',
            payload: {
             shippingMethod:e
            },
          });
      }
      handleConfirm=()=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'smartPurchaseList/clickSubmitReview',
        });
      }
    render() {
        const {
            smartPurchaseList:{
                goodsList,
                purchaseHistoryDateStart,
                purchaseHistoryDateEnd,
                orderIds,
                isShowGoodsListModal,
                selectedRows,
                purchaseOrderLoading,
                financeRemarksIndex,
                financeRemarks,
                payTypePartMap,
                balanceBillAmount,
                balanceBillTotalAmount,
                isDeduction,
                isChange,
                isOutInv,
                isShowPaymentDate,
                remark,
                balanceBillOutInvAmount,
                isSubmitLoading,
                isTableLoading,
                total,
                stockRangeMap,
                curPage,
                pageSize,
                purchaserMap,
                stockingRange,
                supplierPayType,
                supplierSuggest,
                supplierSearchText,
                payConditionMap,
                payType,
                payCondition,
                expectInvDate,
                expectPayTime,
                expectShippingDate,
                payInfoList,
                isCheck,
                bankType,
                bankInfoId,
                showConfirmModal,
                goodsKeywords,
                actionList,
                finalBankInfos,
                isTax,
                shippingMethodMap,
                bankInfoDetail,
                showModal,
            }            
        } = this.props; 
        let startIndex = (curPage-1)*pageSize;
        let endIndex = curPage*pageSize>=total?total:curPage*pageSize;
        let currentShowGooodsList = goodsList&&goodsList.slice(startIndex,endIndex);
        const goodsIds =  selectedRows.filter(item => +isTax).map(item => item.goodsId);
        const totalAmount = selectedRows.reduce((pre, next) => {
            return pre + (+next.purchaseNum * (!+isTax ? +next.purchasePrice : +next.purchaseTaxPrice));
          }, 0);
        const rowSelection ={
            selectedRowKeys: orderIds,
            onChange:this.handleCheckSupplyGoods.bind(this),
        }
        const columns = [
            {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                title: '条形码',
                dataIndex: 'goodsSn',
                key: 'goodsSn',
                width:150,
            }, 
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width:200,
                render: (goodsName)=>{
                    return <p style={{margin: 0, width:180}} className={globalStyles.twoLine}><Tooltip title={goodsName}>{goodsName}</Tooltip></p>
                }
            },
                        
            {
                title: '供应商',
                dataIndex: 'supplier',
                key: 'supplier',
                width:150,
            }, 
            {
                title: '条码政策',
                key: 'snPolicy',
                dataIndex: 'snPolicy',
                render: (snPolicy) => {
                    return  <Tooltip title={snPolicy}>
                            {
                                snPolicy?(<img 
                                    style={{width:40,height:40}}
                                    src={img} alt="条码政策"></img>):null
                            }    
                        </Tooltip>
                },
            }, 
            {
                title: '箱规',
                key: 'numberPerBox',
                dataIndex: 'numberPerBox',
                width:100,            
            },
            {
                title: '采购员',
                key: 'purchaser',
                dataIndex: 'purchaser',
                width:100,
            
            },
            {
                title: '人工占用库存',
                key: 'manMadeOccupyNum',
                dataIndex: 'manMadeOccupyNum',
                width:100,
                sorter:true,
            
            },
            
            {
                title: '即时库存',
                key: 'immStock',
                dataIndex: 'immStock',
                sorter:true,
               
            },
            {
                title: '在途库存',
                key: 'receivingStock',
                dataIndex: 'receivingStock',   
                sorter:true,        
            },
            {
                title: '可用库存',
                key: 'canUseStock',
                dataIndex: 'canUseStock',
                sorter:true,
               
            },
            {
                title: '系统建议采购量',
                key: 'recommendNum',
                dataIndex: 'recommendNum',           
                width:80,    
                sorter:true,
            },
            {
                title: '安全量',
                key: 'safeNum',
                dataIndex: 'safeNum',   
                width:70,  
                sorter:true,      
            },
            {
                title: '含税采购价',
                key: 'purchaseTaxPrice',
                dataIndex: 'purchaseTaxPrice',  
                sorter:true,         
            },
            // {
            //     title: '是否含税',
            //     key: 'isTax',
            //     dataIndex: 'isTax',           
            // },
            {
                title: '前3用户销量占比',
                key: 'top3Percent',
                dataIndex: 'top3Percent', 
                width:80,      
                sorter:true,    
            },
            {
                title: '历史销量',
                key: 'historySaleNum',
                dataIndex: 'historySaleNum',         
                sorter:true,  
            },
            {
                title: '下单人数',
                key: 'customerNum',
                dataIndex: 'customerNum',   
                width:60,        
                sorter:true,
            },
            {
                title: '采购频次',
                key: 'purchaseTimes',
                dataIndex: 'purchaseTimes',      
                width:60,      
                sorter:true,    
            },
            {
                title: '历史采购数量',
                key: 'historyPurchaseNum',
                dataIndex: 'historyPurchaseNum',     
                width:80,  
                sorter:true,    
            },
        ];
        const modalColumns = [
            {
                title: '条形码',
                dataIndex: 'goodsSn',
                key: 'goodsSn',
                render:(goodsSn,record)=>{
                    return <div>{!record.isCheck?<Tooltip title="该条码信息发生变更，正在审核中"><Icon type="warning" style={{color:'#f60'}}/></Tooltip>:""}<span>{goodsSn}</span></div>
                }
            }, 
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width:200,
            },
                        
            {
                title: '供应商',
                dataIndex: 'supplier',
                key: 'supplier',
            }, 
            {
                title: '条码政策',
                key: 'snPolicy',
                dataIndex: 'snPolicy',
                render: (snPolicy) => {
                    return  <Tooltip title={snPolicy}>
                            {
                                snPolicy?(<img 
                                    style={{width:40,height:40}}
                                    src={img} alt="条码政策"></img>):null
                            }    
                        </Tooltip>
                },
            }, 
            {
                title: '箱规',
                key: 'numberPerBox',
                dataIndex: 'numberPerBox',
                width:100,
            },
            {
                title: '采购员',
                key: 'purchaser',
                dataIndex: 'purchaser',
            
            },
            {
                title: '结算方式',
                key: 'payMethod',
                dataIndex: 'payMethod',
            
            },
            {
                title: '返利后进价',
                key: 'rebatePurchasePrice',
                dataIndex: 'rebatePurchasePrice',
                render:(rebatePurchasePrice,record)=>{
                    return <span>{+isTax?record.taxRebatePurchasePrice:rebatePurchasePrice}</span>
                }
            
            },
            
            {
                title: '即时库存',
                key: 'immStock',
                dataIndex: 'immStock',
               
            },
            {
                title: '在途库存',
                key: 'receivingStock',
                dataIndex: 'receivingStock',           
            },
            {
                title: '人工占用库存',
                key: 'manMadeOccupyNum',
                dataIndex: 'manMadeOccupyNum',           
            },
            {
                title: '系统建议采购量',
                key: 'recommendNum',
                dataIndex: 'recommendNum',    
                width:100,       
            },
            {
                title: '安全量',
                key: 'safeNum',
                dataIndex: 'safeNum',           
            },
            {
                title: '实际采购量',
                key: 'purchaseNum',
                dataIndex: 'purchaseNum',  
                width:100,
                render: (_, record) => {
                  return <Input onChange={this.handleActualPurchaseNum.bind(this,record.goodsId)} value={record.isChangeNum?record.purchaseNum:record.recommendNum}/>
                  },         
            },
            {
                title: '采购单价',
                key: 'purchasePrice',
                dataIndex: 'purchasePrice',  
                width:110,
                render: (_, record) => {
                    return <span>{+isTax?record.purchaseTaxPrice:record.purchasePrice }</span>
                },             
            },
            {
                title: '采购合计',
                key: 'total',
                dataIndex: 'total',           
                render: (_, record) => {
                    return <span>{(+isTax?(+record.purchaseNum * +record.purchaseTaxPrice).toFixed(2):(+record.purchaseNum * +record.purchasePrice).toFixed(2))}</span>
                    }, 
            },
            {
                title: '前3用户销量占比',
                key: 'top3Percent',
                dataIndex: 'top3Percent',           
            },
            {
                title: '历史销量',
                key: 'historySaleNum',
                dataIndex: 'historySaleNum',           
            },
            {
                title: '下单人数',
                key: 'customerNum',
                dataIndex: 'customerNum',           
            },
            {
                title: '采购频次',
                key: 'purchaseTimes',
                dataIndex: 'purchaseTimes',           
            },
            {
                title: '历史采购数量',
                key: 'historyPurchaseNum',
                dataIndex: 'historyPurchaseNum',           
            },
        ];
        // const rowSelection2 = {
        //     columnWidth: 140,
        //     selectedRowKeys:goodsIds,
        //     onChange: (selectedRowKeys, selectedRow) => {
        //       const { dispatch } = this.props;
        //       dispatch({
        //         type: 'smartPurchaseList/changeIsTaxReducer',
        //         payload: {
        //           selectedRow,
        //           selectedRowKeys,
        //         },
        //       });
        //     },
        //   };
       return (
        <PageHeaderLayout 
        title="智能化采购" 
        iconType="question-circle"
        tips={
        <div>
            <p>安全量：安全量=（当前时间范围总销售数量/对应天数）*备货量范围 （备货量范围有7/15/30/45/60/75/90天）</p>
            <p>系统建议采购量：系统建议采购量=安全量-在途库存-即时库存</p>
            <p>前3用户销量占比：前3用户销量占比=（前三用户该商品当前范围内采购数量/当前时间该商品的总销量）*100%</p>
        </div>}
        >
            <Card>
                <Row>
                    <Row style={{
                            display: orderIds.length > 0 ? 'none' : 'block',
                        }}>
                            {"按销售历史采购："}
                            <DatePicker.RangePicker    
                            onChange={this.handleSearchMethods.bind(this,'purchaseDate')}
                            value={[purchaseHistoryDateStart? moment(purchaseHistoryDateStart, 'YYYY-MM-DD') : '', purchaseHistoryDateEnd? moment(purchaseHistoryDateEnd, 'YYYY-MM-DD') : '']}
                            />
                            <p style={{display:"inline-block",paddingTop:5}}>{"备货量范围："}</p>
                            <Select
                            className={globalStyles['select-sift']}  
                            value={stockRangeMap[stockingRange]} 
                            style={{width:100}}
                            onSelect={this.handleSearchMethods.bind(this,'stockingRange')}
                            allowClear
                            dropdownMatchSelectWidth={false}
                            >
                                {
                                    Object.keys(stockRangeMap).map(key => (
                                        <Select.Option value={key}>{stockRangeMap[key]}</Select.Option>
                                    ))
                                }
                            </Select>
                            <Select
                            placeholder="采购员"
                            style={{width:250,marginRight:10}}
                            onSelect={this.handleSearchMethods.bind(this,'purchaser')}
                            allowClear
                            dropdownMatchSelectWidth={false}
                            >
                                <Select.Option value="">全部</Select.Option>
                                {
                                    Object.keys(purchaserMap).map(key => (
                                        <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                                    ))
                                }
                            </Select>
                            <AutoComplete
                                dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                                    return (
                                    <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                                    );
                                })}
                                onSelect={this.handleSelectSupplier.bind(this)}
                                onSearch={this.handleChangeSupplier.bind(this)}
                                className={globalStyles['input-sift']}
                                allowClear
                                dropdownMatchSelectWidth={false}
                                >
                                <Input.Search
                                    placeholder="请输入供应商"
                                    value={supplierSearchText}
                                />
                            </AutoComplete>
                            <Input.Search 
                            placeholder="请输入商品名称/条码"
                            className={globalStyles['input-sift']}   
                            onChange={this.handleChangeGoodsKeywords.bind(this)}      
                            onSearch={this.handleSearchMethods.bind(this,'goodsKeywords')}    
                            value={goodsKeywords} 
                            suffix={goodsKeywords?<ClearIcon 
                                handleClear={this.handleClear.bind(this,"goodsKeywords")}
                            />:""}                    
                            />
                            {
                                actionList.map(item=>{
                                    return <Button type="primary" href={item.url} style={{marginRight:10}}>{item.name}</Button>
                                })
                            }
                    </Row>
                    <Row style={{
                            display: orderIds.length > 0 ? 'block' : 'none',
                            marginBottom: '10px',
                        }}>
                         <span style={{ marginLeft: 20, marginRight: 20 }}>
                            <Icon
                                type="close"
                                style={{
                                fontSize: 16,
                                color: '#C9C9C9',
                                marginRight: '10px',
                                }}
                            />已选择{orderIds.length}项
                        </span>
                        <Button type="primary" loading={purchaseOrderLoading} onClick={this.handelProducedPurchaserOrder}>生成采购单</Button>
                    </Row>
                </Row>
                <Table 
                bordered
                columns={columns}
                className={globalStyles.tablestyle}
                rowKey={record => record.id}
                dataSource={currentShowGooodsList}
                rowSelection={rowSelection}
                loading={isTableLoading}
                onChange={this.onTableChange}
                pagination={{
                    current: curPage,
                    pageSize,
                    onChange: this.handleChangePage.bind(this),
                    onShowSizeChange: this.handleChangePageSize.bind(this),
                    showSizeChanger: true,
                    showQuickJumper: false,
                    total,
                    showTotal:total => `共 ${total} 个结果`,
                  }}
                />
                <Modal
                visible={isShowGoodsListModal}
                width={1900}
                closable={false}
                footer={null}
                >
                    {
                        isCheck?<Row style={{marginBottom:10}}>
                            <Alert
                                message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，采购单依然沿用之前的数据。"
                                type="warning"
                                showIcon
                            />
                        </Row>:""
                    }
                    <Table
                    columns={modalColumns}
                    className={globalStyles.tablestyle}
                    dataSource={selectedRows}
                    rowKey={record => record.goodsId}
                    // rowSelection={rowSelection2}
                    bordered
                    pagination={false}
                    />
                    {/* <span style={{ position: 'absolute', top: 70, left: 42 }}>含税</span> */}
                <Row>
                    <Row style={{ marginTop: 20 }}>
                    <Col>
                        <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>是否含税:</span>
                        <Select
                        value={isTax}
                        onChange = {this.handleChangeIsTax}
                        style={{width:100}}
                        >
                            <Select.Option value={"1"}>
                                是
                            </Select.Option>
                            <Select.Option value={"0"}>
                                否
                            </Select.Option>
                        </Select>
                    </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>财务信息</span>
                        <RadioGroup
                        options={financeRemarks}
                        onChange={this.handleChangeFinanceRemarks.bind(this)}
                        value={financeRemarksIndex}
                        style={{ marginTop: 20 }}
                        />
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>付款信息</span>
                        <Select
                            placeholder="请选择账户类型"
                            value={bankType}
                            onChange={this.handleChangeBankInfoType.bind(this)}
                            style={{ width: 150,marginRight:10 }}
                        >
                            {
                                finalBankInfos.map(item=>{
                                    return <Select.Option
                                    key={item.type}
                                    value={item.type}
                                    >
                                    {+item.type===1?"对公账户":"对私账户"}
                                    </Select.Option>
                                })
                            }
                        </Select>
                        <Select
                            placeholder="请选择供应商财务备注"
                            value={bankInfoId}
                            onChange={this.handleChangeBankDetail.bind(this)}
                            style={{ width: 500 }}
                        >
                            {
                                bankInfoDetail.map(info=>{
                                    return <Select.Option
                                    key={info.id}
                                    value={info.id}
                                    >
                                        {`开户名称:${info.bankName} 开户行:${info.bankInfo} 银行账户:${info.bankAccount}`}
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </Row>
                    {
                         +supplierPayType===2?(<Row style={{ marginBottom: 20 }}>
                            <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                                  供应商类型:
                              </span>
                              <span style={{ marginLeft: 15, marginRight: 5 }}>
                                账期供应商
                              </span>
                        </Row>):null
                    }
                    {/* <Row style={{ marginTop: 20 }}>
                        <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>供应商类型：</span><span>{+supplierPayType===2?"账期供应商":""}</span>
                    </Row> */}
                    <Col>
                        <Row style={{marginTop:10}}>
                            <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>支付类型</span>
                            <Select
                            style={{ width: 200 }}
                            value={payTypePartMap[payType]}
                            placeholder="选择支付方式"
                            onChange={this.handleChangePaymentMethod.bind(this)}
                            >
                            {
                                (Object.entries(payTypePartMap).map((value) => {
                                return <Select.Option key={value[0]} value={value[0]}>{value[1]}</Select.Option>;
                                }))
                            }
                            </Select>
                        </Row> 
                        <Row style={{marginTop:10}}>
                            <Col><span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>运费类型：</span>
                            <Select
                            onChange = {this.handleChangeShippingMethod}
                            style={{width:200}}
                            >
                                {
                                    (Object.keys(shippingMethodMap).map((item) => {
                                    return <Select.Option key={item} value={item}>{shippingMethodMap[item]}</Select.Option>;
                                    }))
                                }
                            </Select>
                            </Col>
                        </Row>                       
                        <Col span={12}>
                        {isShowPaymentDate ? (
                        <Row style={{marginTop:10}}>
                             <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                            账期条件：
                            </span>
                            <Select
                                style={{ width: 200, display: 'inline-block' }}
                                value={payConditionMap[payCondition]}
                                placeholder="账期条件"
                                onChange={this.handleChangePayCondition.bind(this)}
                            >
                                {
                                    (Object.entries(payConditionMap).map((value) => {
                                    return <Select.Option key={value[0]}>{value[1]}</Select.Option>;
                                    }))
                                }
                            </Select>
                            <Row style={{ marginBottom: 14, marginTop: 10 }}>
                                <Col>
                                    <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计付款时间:</span>
                                    <DatePicker
                                    value={expectPayTime?moment(expectPayTime):""}
                                    onChange={this.handleChangePaymentItem}
                                    />
                                </Col>                
                            </Row>
                        </Row>
                       ) : null}
                            <Row style={{ marginBottom: 14, marginTop: 10 }}>
                                <Col>
                                <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计发货时间:</span>
                                <DatePicker
                                    value={expectShippingDate?moment(expectShippingDate):""}
                                    onChange={this.handleChangeShipItem}
                                />
                                </Col>                
                            </Row>
                        {
                            +isTax?
                           ( <Row style={{ marginBottom: 14, marginTop: 10 }}>
                                <Col>
                                <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计开票时间:</span>
                                <DatePicker
                                    value={expectInvDate?moment(expectInvDate):""}
                                    onChange={this.handleChangeSiftItem}
                                />
                                </Col>                
                            </Row>):null
                        }

                        </Col>
                    </Col>
                    <Col span={5} offset={7}>
                        <Row style={{ marginBottom: 6 }}>                
                        <span style={{ marginLeft: 22 }}>采购总额: </span>
                        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{totalAmount.toFixed(2)}</span>              
                        </Row>
                        {
                            isShowPaymentDate===false?(
                                <Row>
                                    <Row style={{ marginBottom: 6 }}>
                                    <Checkbox style={{ marginRight: 10 }} onChange={this.handleIsDeduction.bind(this)}></Checkbox>挂账抵扣：
                                    <Input style={{width: 80,marginRight:4}} 
                                        onBlur={this.inputDeductionValue.bind(this)} 
                                        onChange={this.changeDeductionValue.bind(this)}
                                        value={ isChange? balanceBillAmount: balanceBillTotalAmount}                   
                                        disabled={!isDeduction}
                                        />
                                    <span>剩余可抵扣总金额：<span style={{fontSize:18,fontWeight:"bold"}}>{balanceBillTotalAmount}</span></span>
                                    </Row>
                                    {+isTax?(isDeduction?(<div>
                                    <Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额是否开票：</span>
                                    <RadioGroup onChange={this.deductionIsBill.bind(this)} defaultValue={0}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </RadioGroup> 
                                    </Row>
                                    <Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额需开票金额：
                                    <Input style={{width: 100}} 
                                        onBlur={this.saveDeductionValue.bind(this)} disabled={isOutInv?false:true}/>
                                    </span>                  
                                    </Row>                
                                    </div>):null):null}
                                    {
                                    <Row style={{ marginBottom: 6 }}>
                                        <span style={{ marginLeft: 22 }}>开票总金额: </span>
                                        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{isOutInv?(+totalAmount - balanceBillAmount + +balanceBillOutInvAmount).toFixed(2):(+totalAmount - balanceBillAmount).toFixed(2)}</span>       
                                    </Row>
                                    }               
                                    <Row style={{ marginBottom: 6 }}>
                                    <span style={{ marginLeft: 22 }}>采购应付总额: </span>
                                    <span style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>{isDeduction?(+totalAmount - +balanceBillAmount).toFixed(2):+totalAmount.toFixed(2)}</span>       
                                    </Row>
                                </Row>
                            ):null
                        }
                        
                    </Col>
                </Row>
                <Row>
                    <span style={{ fontSize: 16, color: '#797979', fontWeight: 600 }}>采购制单备注</span>
                    <TextArea
                    value={remark}
                    onChange={this.handleChangeRemark.bind(this)}
                    placeholder="采购要求"
                    style={{ border: '2px dashed #BCBCBC' }}
                    />
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Button type="primary" loading={isSubmitLoading} onClick={this.handleClickSubmitReview.bind(this)}>提交主管审核</Button>
                    <Button
                    style={{ color: '#1890FF', borderColor: '#1890FF', width: '118px', marginLeft: 15 }}
                    onClick={this.handleTriggerGoodsListModal}
                    >
                    取消
                    </Button>
                </Row>
                </Modal>
                <Modal
                    visible={showConfirmModal}
                    title="提示"
                    onOk={this.handleConfirmCheck}
                    onCancel={this.handleCancelConfirm.bind(this,'showConfirmModal')}
                    >
                    该采购单中，部分商品条码信息正处于审核状态，若继续下单，该采购单将会沿用之前的数据，请确认是否继续提交？
                </Modal>
                <Modal
                visible={showModal}
                title="提示"
                onOk={this.handleConfirm}
                onCancel={this.handleCancelConfirm.bind(this,'showModal')}
                >
                当前采购单支付类型与部分条码的结算方式不匹配，请确认是否继续建单
                </Modal>
            </Card>
        </PageHeaderLayout>
       )
   }

}
