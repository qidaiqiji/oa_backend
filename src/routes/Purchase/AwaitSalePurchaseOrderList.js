import React, { PureComponent } from 'react';
import { connect } from 'dva';
import img from '../../assets/u2741.png';
import Debounce from 'lodash-decorators/debounce';
import {
  Row,
  Col,
  Form,
  Card,
  Table,
  AutoComplete,
  Input,
  Icon,
  DatePicker,
  Select,
  Button,
  Tooltip,
  Modal,
  message,
  Radio,
  Checkbox,
  Alert
} from 'antd';
import { stringify } from 'qs';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitSalePurchaseOrderList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(state => ({
  awaitSalePurchaseOrderList: state.awaitSalePurchaseOrderList,
}))
@Form.create()
export default class AwaitSalePurchaseOrderList extends PureComponent {
  componentDidMount() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { startDate, endDate } = awaitSalePurchaseOrderList;

    dispatch({
      type: 'awaitSalePurchaseOrderList/getOrderList',
      payload: {
        keywords: '',
        supplierId: '',
        startDate,
        endDate,
      },
    });
    dispatch({
      type: 'awaitSalePurchaseOrderList/getConfig',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/unmount',
    });
  }
  // 更改供应商
  handelSelectSupplier(value, goodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updateGoodsSupplier',
      payload: {
        supplierId: value,
        goodsId,
      },
    });
  }
  // 搜索订单号/用户名/手机号/商品名筛选订单
  handleSearchOrderList(value) {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { startDate, endDate, supplierId } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/getOrderList',
      payload: {
        keywords: value,
        startDate,
        endDate,
        supplierId,
      },
    });
  }
  // 日期选择搜索
  dateSearchOnChange = (dates, datesString) => {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { keywords, supplierId } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/getOrderList',
      payload: {
        keywords,
        supplierId,
        startDate: datesString[0],
        endDate: datesString[1],
      },
    });
  }
  // 改变输入框值拉取供应商列表
  @Debounce(200)
  handleSearchSupplyGoods(value) {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { keywords, startDate, endDate } = awaitSalePurchaseOrderList;
    if (!value) {
      dispatch({
        type: 'awaitSalePurchaseOrderList/getOrderList',
        payload: {
          keywords,
          supplierId: value,
          startDate,
          endDate,
        },
      });
      return;
    }
    dispatch({
      type: 'awaitSalePurchaseOrderList/getSiftSupplierList',
      payload: {
        keywords: value,
        // status: -1,
      },
    });
  }
  // 选择供应商进行订单筛选
  handleSelectSupplyGoods(value) {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { keywords, startDate, endDate } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/getOrderList',
      payload: {
        keywords,
        supplierId: value,
        startDate,
        endDate,
      },
    });
  }
  // 勾选商品
  handleCheckSupplyGoods(goodsIds, selectedRows) {
    // 当选择的时候把总单号传过去
    const goodsIdLists =[];
    selectedRows.map((item=>{
      goodsIdLists.push(item.id)
    }))
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/changeSupplyGoodsCheckboxIds',
      payload: {
        supplyGoodsCheckboxIds: goodsIds,
        selectedRows,
        goodsIdLists,
      },
    });
  }
  // 选择支付方式
  handleChangePaymentMethod(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handlePaymentMethod',
      payload: {
        paymentId: value,
        isShowPaymentDate: false
      },
    });
  }
  handleChangePayCondition=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        payCondition: value,
      },
    });
  }
  // 判断是否勾选了挂账抵扣
  handleIsDeduction(e) {
    const isDeduction = e.target.checked;
    const { dispatch, awaitSalePurchaseOrderList, match } = this.props;    
    const { balanceBillAmount, isChange, balanceBillTotalAmount } = awaitSalePurchaseOrderList;    
    if(!isChange){
      dispatch({
        type: 'awaitSalePurchaseOrderList/changeDeductionValue',
        payload: {
          balanceBillAmount: +balanceBillTotalAmount,
        }
      })
    }    
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        isDeduction,
      }
    })
    if(!isDeduction){
      dispatch({
        type: 'awaitSalePurchaseOrderList/changeDeductionValue',
        payload: {
          balanceBillAmount: 0,
        }
      })

    }    
    
  }
  // 填写挂账抵扣金额
  inputDeductionValue(e) {
    const balanceBillAmount = e.target.value;
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { balanceBillTotalAmount, isDeduction } = awaitSalePurchaseOrderList;
    
    if(!isDeduction){
      dispatch({
        type: 'awaitSalePurchaseOrderList/changeDeductionValue',
        payload: {
          balanceBillAmount: 0,
        }
      })
    }else{      
      if(balanceBillAmount <= +balanceBillTotalAmount ){
        dispatch({
          type: 'awaitSalePurchaseOrderList/changeDeductionValue',
          payload: {
            balanceBillAmount,
          }
        })
      }
      else{
        message.warning("挂账抵扣金额超出可用金额，请重新输入");
        dispatch({
          type: 'awaitSalePurchaseOrderList/changeDeductionValue',
          payload: {
            balanceBillAmount: +balanceBillTotalAmount,
          }
        })
        return;
      }
    }
  }
  changeDeductionValue=(e)=>{
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { balanceBillTotalAmount, isDeduction } = awaitSalePurchaseOrderList;
    if(isDeduction){
      if( +balanceBillTotalAmount){
        dispatch({
          type: 'awaitSalePurchaseOrderList/changeDeductionValue',
          payload: {
            balanceBillAmount: e.target.value,
            isChange: true,
          }
        })
      }else{
        message.warning("无可用抵扣金额");
        dispatch({
          type: 'awaitSalePurchaseOrderList/changeDeductionValue',
          payload: {
            balanceBillAmount: +balanceBillTotalAmount,
          }
        })
        return;
      }
    }else{
      dispatch({
        type: 'awaitSalePurchaseOrderList/changeDeductionValue',
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
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { balanceBillOutInvAmount } = awaitSalePurchaseOrderList;    
      dispatch({
        type: 'awaitSalePurchaseOrderList/updatePage',
        payload: {
          isOutInv,
        }
      })
      if(!isOutInv){
        dispatch({
          type: 'awaitSalePurchaseOrderList/updatePage',
          payload: {
            balanceBillOutInvAmount: 0,
          }
        })

      }   
  }
  // 抵扣金额需开票金额
  saveDeductionValue(e) {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { isOutInv, balanceBillAmount} = awaitSalePurchaseOrderList;
    const balanceBillOutInvAmount = e.target.value;
    if(isOutInv) {
       if(+balanceBillOutInvAmount > +balanceBillAmount) {
        message.warning("开票金额超出抵扣金额");
        return;
      }else{
        dispatch({
          type: 'awaitSalePurchaseOrderList/updatePage',
          payload: {
            balanceBillOutInvAmount,
          }
        })
      }
    }else{
      dispatch({
        type: 'awaitSalePurchaseOrderList/updatePage',
        payload: {
          balanceBillOutInvAmount: 0,
        }
      })
    }
  }

  // 筛选采购员
  handleChangeSiftPurchaser(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handleSiftPurchaser',
      payload: {
        siftPurchaserId: value,
      },
    });
  }
  // 筛选销售员
  handleChangeSiftSeller(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handleSiftSeller',
      payload: {
        siftSellerId: value,
      },
    });
  }
  // 改变跟进状态
  handleChangeSiftStatus(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handleSiftStatus',
      payload: {
        siftStatusId: value,
      },
    });
  }
  // 选择采购员
  handleChangePurchaser(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        purchaserId: value,
      },
    });
  }

  // 分配采购员
  handelAssignPurchaserOrder() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { purchaserId, orderIds } = awaitSalePurchaseOrderList;
    if (!purchaserId) {
      message.warning('请选择要分配的采购员');
      return;
    }
    dispatch({
      type: 'awaitSalePurchaseOrderList/assignPurchaserOrder',
      payload: {
        purchaserId,
        goodsIdList: orderIds,
      },
    });
  }

  // 生成采购单弹窗
  handelProducedPurchaserOrder() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { purchaserId, orderIds } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/producedPurchaserOrder',
      payload: {
        purchaserId,
        goodsIdList: orderIds,
      },
    });
  }
   // 点击驳回按钮弹出窗口确认
   handelRejectOrder() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        isShowRejectModal: true,
      },
    });
  }
  // 点击取消时不显示驳回弹窗
  handleTriggerRejectModal() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { remark } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        isShowRejectModal: false,
        remark: "",
      },
    });
  }
  // 点击确定的时候确认驳回，提交备注
  handleConfirmReject() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { remark, goodsIdLists } = awaitSalePurchaseOrderList;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handleConfirmReject',
      payload: {
        isShowRejectModal: false,
        remark,
        goodsIdLists,
      },
    });
  }
  // 存储备注信息
  saveRejectRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/handelsaveRejectRemark',
      payload: {
        remark: e.target.value,
      },
    });

  }
  
  // 取消生成采购单弹窗
  handleTriggerGoodsListModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/cancleTriggerGoodsListModal',
    });
  }
  handleChangeFinanceRemarks(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        financeRemarksIndex: e.target.value,
      },
    });
  }
  // 选择预计发货日期
  handleChangeShipItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        expectShippingDate: dataStrings,
      },
    });
  }
  // 选择预计付款日期
  handleChangePaymentItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        expectPayTime: dataStrings,
      },
    });
  }
  // 日期选择
  handleChangeSiftItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        predictInvDate: dataStrings,
      },
    });
  }

  // 增加销售备注
  addPurchaseRemark=(e)=>{
    const {dispatch, awaitSalePurchaseOrderList} = this.props;
    const {orderInfos} = awaitSalePurchaseOrderList;  
    const goodsId = e.target.id;
    orderInfos.map((item)=>{
      if(+item.id === +goodsId){
        dispatch({
          type: 'awaitSalePurchaseOrderList/addPurchaseRemark',
          payload: {
            purchaseRemark: e.target.value, 
            goodsId       
          },
        });
      }
    })
  }
  changePurchaseRemark=(e)=>{
    const {dispatch, awaitSalePurchaseOrderList} = this.props;
    const {orderInfos} = awaitSalePurchaseOrderList;
    const goodsId = e.target.id;    
    orderInfos.map((item)=>{      
      if(+item.id === +goodsId){
        item.purchaseRemark = e.target.value;
      }
      return item;
    })    
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        orderInfos     
      },
    });
  }
  // 制单备注
  handleChangeRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        remark: e.target.value,
      },
    });
  }
  // 提交主管审核
  handleClickSubmitReview() {
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { paymentId, predictInvDate, 
      isTax, expectShippingDate, 
      isShowPaymentDate, expectPayTime, 
      isDeduction, isOutInv, balanceBillAmount, 
      balanceBillOutInvAmount, isCheck, bankInfoId, 
      financeRemarksIndex, bankType,
      isAllCash,
      isAllDirect,
      isAllAgency,
    } = awaitSalePurchaseOrderList;
    if (!paymentId) {
      message.warning('请选择支付方式');
      return;
    }
    if (!financeRemarksIndex && !bankInfoId) {
      message.warning('请选择一条财务备注');
      return;
    }
    
    if (!expectShippingDate) {
      message.warning('请添加预发货时间');
      return;
    }
    if (+isTax) {
      if (!predictInvDate) {
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
    if (financeRemarksIndex && bankInfoId) {
      message.warning('只能选择一条财务备注');
      dispatch({
        type:"awaitSalePurchaseOrderList/updatePage",
        payload:{
          financeRemarksIndex :"",
          bankInfoId: "",
          bankType: "",
        }
      })
      return;
    } 
    if(isCheck) {
      dispatch({
        type:"awaitSalePurchaseOrderList/updatePage",
        payload:{
          showConfirmModal:true,
        }
      })
    }else if(paymentId == 0&&!isAllCash || paymentId == 2&&!isAllDirect || paymentId == 4&&!isAllAgency){
      dispatch({
        type:"awaitSalePurchaseOrderList/updatePage",
        payload:{
          showModal:true,
        }
      })
  }else{
      dispatch({
        type: 'awaitSalePurchaseOrderList/clickSubmitReview',
      });
    }
    
  }
  handleCancelConfirm=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: "awaitSalePurchaseOrderList/updatePage",
      payload: {
        [type]:false,
      },
    });
  }
  handleConfirmCheck=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/clickSubmitReview',
      payload: {
        showConfirmModal:false,
      },
    });
  }
  handleChangeBankInfoType=(e)=>{
    const { dispatch, awaitSalePurchaseOrderList } = this.props;
    const { finalBankInfos } = awaitSalePurchaseOrderList;
    let bankInfoDetail = [];
      finalBankInfos.map(item=>{
        if(+item.type === +e) {
          bankInfoDetail = item.bankInfoDetail;
        }
    })
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
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
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        bankInfoId:e,
      },
    });
  }
  handleChangeSearchItem=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/updatePage',
      payload: {
        [type]:e.target.value
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitSalePurchaseOrderList/getOrderList',
      payload: {
        [type]:""
      },
    });
  }
  handleChangeIsTax=(e)=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'awaitSalePurchaseOrderList/changeIsTax',
        payload: {
          isTax: e,
          bankType:+e?1:2,
        },
      });
  }
  handleChangeShippingMethod=(e)=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'awaitSalePurchaseOrderList/updatePage',
        payload: {
         shippingMethod:e
        },
      });
  }
  handleConfirm=()=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'awaitSalePurchaseOrderList/clickSubmitReview',
        payload:{
          showModal:false,
        }
      });
  }
  render() {
    const {
      awaitSalePurchaseOrderList: {
        startDate,
        endDate,
        siftSupplierList,
        keywords,
        supplierId,
        orderInfos,
        isLoading,
        orderIds,
        selectedRows,
        purchaserMap,
        purchaserId,
        siftPurchaserId,
        purchaseOrderLoading,
        orderLoading,
        isShowGoodsListModal,
        financeRemarks,
        financeRemarksIndex,
        remark,
        paymentMethod,
        paymentId,
        isSubmitLoading,
        purchaseRemark, 
        isShowPaymentDate,
        isShowRejectModal,
        purchaserFollowStatusMap,
        sellerMap,
        siftSellerId,
        siftStatusId,
        isDeduction,
        balanceBillTotalAmount,
        isOutInv,
        balanceBillOutInvAmount,
        balanceBillAmount,
        purchaseIsTax,
        isChange,
        payType,
        payConditionMap,
        isCheck,
        showConfirmModal,
        payInfoList,
        bankType,
        bankInfoId,
        isTax,
        finalBankInfos,
        bankInfoDetail,
        shippingMethodMap,
        showModal,
      },
    } = this.props;
    const totalAmount = selectedRows.reduce((pre, next) => {
      return pre + (+next.num * (!+next.purchaseIsTax ? +next.purchasePrice : +next.purchaseTaxPrice));
    }, 0);
    const goodsIds =  selectedRows.filter(item => +item.purchaseIsTax === 1).map(item => item.id);

    const renderOption = (item) => {
      return (
        <Option key={item.id} value={item.id.toString()} title={item.name}>
          {item.name}
        </Option>
      );
    };

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderSn',
        width: 100,
        key: 'orderSn',
        render: (value, record) => {
          const obj = {
            // children: record.tag&&record.tag.map(item=>{
            //   return item.name==="售后"?<p><span style={{background:item.color,display:'inline-block'}}>{item.name}</span><span>{value}</span></p>:<span>{value}</span>
            // }),
            children:<span>{value}</span>,
            props: {},
          };
          if (record.isEndIndex) {
            obj.props.rowSpan = record.goodsLength;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '收件人',
        dataIndex: 'consignee',
        key: 'consignee',
        width: 100,
        render: (value, record) => {
          const obj = {
            children: value,
            props: {},
          };
          if (record.isEndIndex) {
            obj.props.rowSpan = record.goodsLength;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierList',
        key: 'supplierList',
        width: 130,
        render: (supplierList, record) => {
          // if (supplierList.length === 1) {
          //   return <span>{supplierList[0].name}</span>;
          // }
          if (supplierList.length > 0) {
            let defaultValue = null;
            for (let i = 0; i < supplierList.length; i += 1) {
              const supplier = supplierList[i];
              if (supplier.isSelect) {
                defaultValue = supplier.id;
              }
            }
            return (
              <Select
                style={{ width: 130 }}
                value={defaultValue}
                onSelect={event => (this.handelSelectSupplier(event, record.id))}
                dropdownMatchSelectWidth={false}
              >
                {
                  supplierList.map((value) => {
                    return <Option key={value.id} value={value.id} title={value.name}>
                        {value.name}
                    </Option>;
                  })
                }
              </Select>
            );
          }
          return null;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 130,
        render:(name, record)=>{
          return <div>
            <p style={{margin:0,width:130}} className={globalStyles.twoLine}><Tooltip title={name}>{name}</Tooltip></p>
            {
              record.tag.map(item=>{
                  return <p style={{margin:0}}>
                  <span style={{background: item.color}} className={globalStyles.tag}>{item.name}</span>
                </p>
              })
            }
          </div>
        }
      },
      {
        title: '条码',
        dataIndex: 'sn',
        key: 'sn',
        width: 150,
      },
      {
        title: '结算方式',
        dataIndex: 'payMethod',
        key: 'payMethod ',
        width: 40,
        render:(payMethod)=>{
            return <p style={{margin:0,width:40}} className={globalStyles.twoLine}>
              <Tooltip>{payMethod}</Tooltip>
            </p>
        }
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num ',
        width: 100,
      },
      {
        title: '运费政策',
        dataIndex: 'shippingDesc',
        key: 'shippingDesc',
        width: 110,
      },
      {
        title: '条码政策',
        key: 'snPolicy',
        dataIndex: 'snPolicy',
        render: (snPolicy) => {
          return <Tooltip title={snPolicy}>
                  {
                    snPolicy?(<img 
                      className={styles.logo}
                      src={img}></img>):null
                  }    
              </Tooltip>
        },
      }, 
      {
        title: '销售含税',
        dataIndex: 'saleIsTax',
        key: 'saleIsTax',
        width: 50,
        render: saleIsTax => (
          <span>{saleIsTax ? '是' : '否'}</span>
        ),
      },
      {
        title: '订单时间',
        dataIndex: 'time',
        key: 'time',
        width: 110,
      },
      {
        title: '采购价',
        dataIndex: 'purchaseTaxPrice',
        key: 'purchaseTaxPrice',
        width: 130,
      },
      {
        title: '采购合计',
        dataIndex: 'purchaseTaxAmount',
        key: 'purchaseTaxAmount',
        width: 140,
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        width: 140
      },
      {
        title: '采购员(分配时间)',
        dataIndex: 'purchaser',
        key: 'purchaser',
        width: 120,
      },
      {
        title: '销售备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 80,
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
      },
      {
        title: '采购跟进备注',
        dataIndex: 'purchaseRemark',
        key: 'purchaseRemark',
        width: 120,
        render: (_,record) => {
         return <Tooltip title={record.purchaseRemark} placement="topLeft">
              <Input style={{ width: 110 }} onBlur = { this.addPurchaseRemark.bind(this) } onChange = { this.changePurchaseRemark.bind(this) } value={record.purchaseRemark} id={record.id}/>
          </Tooltip>
        }
      },
    ];
    const purchaseColumns = [
      {
        title: '销售含税',
        dataIndex: 'saleIsTax',
        key: 'saleIsTax',
        width: 100,
        render: saleIsTax => (
          <span>{saleIsTax ? '是' : '否'}</span>
        ),
      },
      {
        title: '订单号',
        dataIndex: 'orderSn',
        width: 150,
        key: 'orderSn',
        render: (value, record) => {
          return value;
        },
      },
      {
        title: '收件人',
        dataIndex: 'consignee',
        key: 'consignee',
        width: 100,
        render: (value, record) => {
          return value;
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierList',
        key: 'supplierList',
        width: 150,
        render: (supplierList, record) => {
          for (let i = 0; i < supplierList.length; i += 1) {
            const supplier = supplierList[i];
            if (supplier.isSelect) {
              return (
                <span>{supplier.name}</span>
              );
            }
          }
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render:(name)=>{
          return <Tooltip title={name}><p className={globalStyles.twoLine} style={{width:180}}>{name}</p></Tooltip>

        }
      },
      {
        title: '条码',
        dataIndex: 'sn',
        key: 'sn',
        width: 180,
        render:(sn,record)=>{
          return <div>{!record.isCheck?<Tooltip title="该条码信息发生变更，正在审核中"><Icon type="warning" style={{color:'#f60'}}/></Tooltip>:""}<span>{sn}</span></div>
        }
      },
      {
        title: '条码政策',
        key: 'snPolicy',
        dataIndex: 'snPolicy',
        render: (snPolicy) => {
          return <Tooltip title={snPolicy}>
                  {
                    snPolicy?(<img 
                      style={{width:40,height:40}}
                      src={img} alt="条码政策"></img>):null
                  }    
              </Tooltip>
        },
      }, 
      {
        title: '结算方式',
        dataIndex: 'payMethod',
        key: 'payMethod ',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num ',
        width: 100,
      },
      {
        title: '运费政策',
        dataIndex: 'shippingDesc',
        key: 'shippingDesc',
        width: 100,
      },
      {
        title: '订单时间',
        dataIndex: 'time',
        key: 'time',
        width: 110,
      },
      {
        title: '采购价',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        width: 110,
        render: (_, record) => {
          return <span>{+record.purchaseIsTax ? record.purchaseTaxPrice : record.purchasePrice}</span>;
        },
      },
      {
        title: '采购合计',
        dataIndex: 'purchaseAmount',
        key: 'purchaseAmount',
        width: 140,
        render: (_, record) => {
          return <span>{+record.purchaseIsTax ? record.purchaseTaxAmount : record.purchaseAmount}</span>;
        },
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        width: 140
      },
      {
        title: '采购员(分配时间)',
        dataIndex: 'purchaser',
        key: 'purchaser',
        width: 180,
      },
      {
        title: '销售备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 80,
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
      },
    ];

    // const rowSelection2 = {
    //   columnWidth: 120,
    //   selectedRowKeys:goodsIds,
    //   onChange: (selectedRowKeys, selectedRow) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //       type: 'awaitSalePurchaseOrderList/changeIsTax',
    //       payload: {
    //         selectedRow,
    //         selectedRowKeys,
    //       },
    //     });
    //   },
    // };

    const token = localStorage.getItem('token');
    const exportSelect = `http://erp.xiaomei360.com/common/export-daifa-order?${stringify({
      keywords,
      startDate,
      endDate,
      supplierId,
      orderGoodsIds: orderIds,
      token,
    })}`;
    const exportAll = `http://erp.xiaomei360.com/common/export-daifa-order?${stringify({
      keywords,
      startDate,
      endDate,
      supplierId,
      token,
    })}`;
    return (
      <PageHeaderLayout title="待制单" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row
                style={{
                  display: orderIds.length > 0 ? 'none' : 'block',
                }}
              >
                <Search
                  className={globalStyles['select-sift']}
                  style={{width:250}}
                  placeholder="订单号/用户名/手机号/商品名"
                  onChange={this.handleChangeSearchItem.bind(this,"keywords")}
                  onSearch={this.handleSearchOrderList.bind(this)}
                  value={keywords} 
                  suffix={keywords?<ClearIcon 
                      handleClear={this.handleClear.bind(this,"keywords")}
                  />:""}     
                />
                <RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.dateSearchOnChange}
                  defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
                  format="YYYY-MM-DD"
                />
                <AutoComplete
                  className={globalStyles['input-sift']}
                  dataSource={siftSupplierList.map(renderOption)}
                  onSelect={this.handleSelectSupplyGoods.bind(this)}
                  onSearch={this.handleSearchSupplyGoods.bind(this)}
                  placeholder="供应商"
                  defaultActiveFirstOption
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Input
                    suffix={<Icon type="search" />}
                  />
                </AutoComplete>
                <Select
                  style={{ width: 250, marginRight: 10 }}
                  value={purchaserMap[siftPurchaserId]}
                  placeholder="筛选采购员"
                  onChange={this.handleChangeSiftPurchaser.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}

                >
                  <Option value="">全部</Option>
                  {
                    (Object.entries(purchaserMap).map((value) => {
                      return <Option key={value[0]} title={value[1]}>{value[1]}</Option>;
                    }))
                  }
                </Select>

                {/* 新增按销售员筛选 */}
                <Select
                  style={{ width: 200, marginRight: 10 }}
                  value={sellerMap[siftSellerId]}
                  placeholder="筛选销售员"
                  onChange={this.handleChangeSiftSeller.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  {
                    (Object.entries(sellerMap).map((value) => {
                      return <Option key={value[0]} value={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                {/* 新增按跟进状态筛选 */}
                <Select
                  style={{ width: 200, marginRight: 10 }}
                  value={purchaserFollowStatusMap[siftStatusId]}
                  placeholder="跟进状态"
                  onChange={this.handleChangeSiftStatus.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  {
                    (Object.entries(purchaserFollowStatusMap).map((value) => {
                      return <Option key={value[0]} value={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
              </Row>
              <Row
                style={{
                  marginBottom: '10px',
                  display: orderIds.length > 0 ? 'block' : 'none',
                }}
              >
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
                <Select
                  style={{ width: 200, marginRight: 10 }}
                  value={purchaserMap[purchaserId]}
                  placeholder="修改/分配采购员"
                  onChange={this.handleChangePurchaser.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  {
                    (Object.entries(purchaserMap).map((value) => {
                      return <Option key={value[0]} title={value[1]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                <Button style={{ marginRight: 10 }} type="primary" loading={orderLoading} onClick={this.handelAssignPurchaserOrder.bind(this)}>
                  分配订单
                </Button>
                <Button type="primary" loading={purchaseOrderLoading} onClick={this.handelProducedPurchaserOrder.bind(this)}>
                  生成采购单
                </Button>
                <Button type="primary" style={{ marginLeft: 10 }} onClick={this.handelRejectOrder.bind(this)}>
                  驳回
                </Button>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              className={globalStyles.tablestyle}
              rowSelection={{
                selectedRowKeys: orderIds,
                onChange: this.handleCheckSupplyGoods.bind(this),
                getCheckboxProps: record => ({  
                  disabled: record.hasBackOrder
                }),
              }}
              dataSource={orderInfos}
              columns={columns}
              title={() => {
                return (
                  <Row>
                    <a target="_blank" href={exportAll}>
                      <Button type="primary">全部导出</Button>
                    </a>
                    <a target="_blank" href={exportSelect}>
                      <Button type="primary" style={{ marginLeft: '10px' }}>部分导出</Button>
                    </a>
                  </Row>
                );
              }}
              pagination={false}
            />
          </div>
        </Card>
        {/* 显示驳回弹窗 */}
        <Modal
          visible={isShowRejectModal}  
          width={900}
          closable={false}
          title="请确认是否驳回"
          onOk={this.handleConfirmReject.bind(this)}
          onCancel={this.handleTriggerRejectModal.bind(this)}
        >
        <Row style={{marginLeft:50}}>请填写驳回理由</Row>
          <Input style={{width:700, marginLeft:70, marginTop:20}} onBlur={this.saveRejectRemark.bind(this)}/>
        </Modal>
        <Modal
          visible={isShowGoodsListModal}
          // onOk={this.handleClickSubmitReview.bind(this)}
          // onCancel={this.handleTriggerGoodsListModal.bind(this)}
          width={1900}
          closable={false}
          footer={null}
        >
          <Row>
                {
                  isCheck?<Row style={{marginBottom:10}}>
                  <Alert
                    message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，采购单依然沿用之前的数据。"
                    type="warning"
                    showIcon
                  />
                </Row>:""
                }
                <Select
                  style={{ width: 200 }}
                  // value={paymentMethod[paymentId]}
                  placeholder="选择支付方式"
                  onChange={this.handleChangePaymentMethod.bind(this)}
                >
                  {
                    (Object.entries(paymentMethod).map((value) => {
                      return <Option key={value[0]} value={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
              <Row style={{ marginTop: 20 }}>
                <Table
                  bordered
                  style={{
                  marginTop: 20,
                }}
                  // rowSelection={rowSelection2}
                  dataSource={selectedRows}
                  rowKey={record => record.id}
                  columns={purchaseColumns}
                  pagination={false}
                  // className={styles.checkWidth}
                  className={globalStyles.tablestyle}
                />
                {/* <span style={{ position: 'absolute', top: 38, left: 64 }}>含税</span> */}
              </Row>
              <Row style={{ marginTop: 20 }}>
                <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>财务信息</span>
                <RadioGroup
                  options={financeRemarks}
                  onChange={this.handleChangeFinanceRemarks.bind(this)}
                  value={financeRemarksIndex}
                  style={{ marginTop: 20 }}
                  // checked={!checked}
                />
              </Row>
              <Row style={{marginTop:10}}>
                <Col><span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>采购是否含税</span>
                  <Select
                  value={isTax}
                  onChange = {this.handleChangeIsTax}
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
              <Row style={{marginTop:10}}>
                <Col><span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>运费类型：</span>
                  <Select
                  onChange = {this.handleChangeShippingMethod}
                  style={{width:200}}
                  >
                     {
                        (Object.keys(shippingMethodMap).map((item) => {
                          return <Option key={item} value={item}>{shippingMethodMap[item]}</Option>;
                        }))
                      }
                  </Select>
                </Col>
              </Row>
              {
                +payType===2?<Row style={{ marginTop: 20 }}>
                <span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>供应商类型：</span>
                <span>账期供应商</span>
              </Row>:null
              }
              <Col span={12}>
              {isShowPaymentDate ? (
                      <Row style={{ marginBottom: 14, marginTop: 10 }}>
                          {/* <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>
                            账期条件：
                          </span>
                          <Select
                              style={{ width: 200 }}
                              // value={paymentMethod[paymentId]}
                              placeholder="账期条件"
                              onChange={this.handleChangePayCondition.bind(this)}
                            >
                              {
                                (Object.entries(payConditionMap).map((value) => {
                                  return <Option key={value[0]} value={value[0]}>{value[1]}</Option>;
                                }))
                              }
                            </Select> */}
                          <Col style={{ marginTop: 14 }}>
                            <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计付款时间:</span>
                            <DatePicker
                              onChange={this.handleChangePaymentItem}
                            />
                          </Col>                
                      </Row>) : null}
                <Row style={{ marginTop: 20 }}>
                  <Col><span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>预计发货时间</span>
                    <DatePicker
                      onChange={this.handleChangeShipItem}
                    />
                  </Col>
                </Row>
                
              { +isTax ? (
                <Row style={{ marginTop: 20 }}>

                  <Col><span style={{ fontSize: 16, color: '#797979', fontWeight: 600, marginRight: 15 }}>预计开票时间</span>
                    <DatePicker
                      onChange={this.handleChangeSiftItem}
                    />
                  </Col>
                </Row>) : null}
              </Col>
              <Col span={5} offset={7}>
                <Row style={{ marginBottom: 6, marginTop:16 }}>                
                  <span style={{ marginLeft: 22 }}>采购总额: </span>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{totalAmount.toFixed(2)}</span>              
                </Row>
                {
                  isShowPaymentDate===false && ( <Row>
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
                      +isTax ?( <Row style={{ marginBottom: 6 }}>
                        <span style={{ marginLeft: 22 }}>开票总金额: </span>
                        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{isOutInv?(+totalAmount - balanceBillAmount + +balanceBillOutInvAmount).toFixed(2):(+totalAmount - balanceBillAmount).toFixed(2)}</span>       
                      </Row>):null
                    }               
                    <Row style={{ marginBottom: 6 }}>
                      <span style={{ marginLeft: 22 }}>采购应付总额: </span>
                      <span style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>{isDeduction?(+totalAmount - +balanceBillAmount).toFixed(2):+totalAmount.toFixed(2)}</span>       
                    </Row>
                  </Row>)
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
              onClick={this.handleTriggerGoodsListModal.bind(this)}
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
      </PageHeaderLayout>
    );
  }
}
