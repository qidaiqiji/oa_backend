import React, { PureComponent } from 'react';
// import { stringify } from 'qs';
// import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import img from '../../assets/u2741.png';
import {
  Card, InputNumber, Select,
  DatePicker,
  Input,
  Table,
  Button,
  Modal,
  Tabs,
  Tooltip,
  Col,
  Row,
  message,
  Checkbox,
  Radio,
  Icon,
} from 'antd';
const RadioGroup = Radio.Group;
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
@connect(state => ({
  dealAccountList: state.dealAccountList,
}))
export default class DealAccountList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const supplierId = this.props.match.params.id;
    dispatch({
      type: 'dealAccountList/getDirectList',
      payload: {
        supplierId,
      },
    });
    dispatch({
      type: 'dealAccountList/getAgencyList',
      payload: {
        supplierId,
      },
    });
    dispatch({
      type: 'dealAccountList/getSelectList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/unmount',
    });
  }
  handleDateChange(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'payData':
        dispatch({
          type: 'dealAccountList/getList',
          payload: {
            expectPayTimeStart: dataStrings[0],
            expectPayTimeEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'purchaseData':
        dispatch({
          type: 'dealAccountList/getList',
          payload: {
            purchaseTimeStart: dataStrings[0],
            purchaseTimeEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
        case 'agencyPayData':
        dispatch({
          type: 'dealAccountList/getList',
          payload: {
            agencyExpectPayTimeStart: dataStrings[0],
            agencyExpectPayTimeEnd: dataStrings[1],
            agencyCurrentPage:1,
          },
        });
        break;
        case 'agencyPurchaseData':
        dispatch({
          type: 'dealAccountList/getList',
          payload: {
            agencyPurchaseTimeStart: dataStrings[0],
            agencyPurchaseTimeEnd: dataStrings[1],
            agencyCurrentPage:1,
          },
        });
        break;
        case 'saleDate':
        dispatch({
          type: 'dealAccountList/searchSelectedRows',
          payload: {
            startDate: dataStrings[0],
            endDate: dataStrings[1],
          },
        });
        break;
    }
  }
  handleInputTextChanged(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  handleInputTextSearch(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleSelected(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/searchList',
      payload: {
        [type]: e,
        currentPage: 1,
        agencyCurrentPage:1,
      },
    });
  }
  //   切换每页条数回调
  handleChangePageSize(type,_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getList',
      payload: {
        [type]:pageSize,
        currentPage: 1,
      },
    });
  }
  // 换页回调
  handleChangePage(type,currentPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getList',
      payload: {
        [type]:currentPage,
      },
    });
  }
  //   提交对账单
  handleOkEditAccountList() {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRows, accountRemark, selectedRowIds } = this.props.dealAccountList;
    const goodsList = [];
    selectedRows.forEach((item) => {
      goodsList.push({ 
        purchasePrice: item.purchasePrice, 
        applyNumber: item.editNum, 
        id: item.id, 
        purchaseOrderId: item.purchaseOrderId,
        hasSendBackTotalNum:item.hasSendBackTotalNum,
        saleNum:item.saleNum,
        totalSaleNum:item.totalSaleNum,
        noSendBackTotalNum:item.noSendBackTotalNum,
        isDiscount:item.isDiscount,
       });
    });
    dispatch({
      type: 'dealAccountList/changeConfirmAccount',
      payload: {
        goodsList,
        accountRemark,
        financeRemark: selectedRows[0].financeRemark,
        bankType:selectedRows[0].bankDetail.type,
        bankInfoId:selectedRows[0].bankInfoId
      },
    });
    dispatch({
      type: 'dealAccountList/changeCancelAccount',
      payload: {
        isShowList: false,
      },
    });
  }
  // 取消弹框
  handleCancelAccountList(type) {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRowIds, selectedRows } = this.props.dealAccountList;
    dispatch({
      type: 'dealAccountList/changeCancelAccount',
      payload: {
        [type]: false,
        editRow:{}
        // inputRealPriceTotal: '',
      },
    });
  }
  // 文本框失去焦点
  handleOkRemark(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  // 选择勾选商品
  handleSelectRows(selectedRowIds, selectedRows) {
    const { dispatch } = this.props;
    let selectTotalAmount = selectedRows.reduce((pre,next)=>{
      return +pre + +(next.realAmount)
    },0)
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        selectedRowIds,
        selectedRows,
        selectTotalAmount,
      },
    });
  }
  //   改变采购数量numberPur
  handleNumberChange(editRow,e) {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRows } = dealAccountList;
    editRow.editNum = e;
    selectedRows.map(item=>{
      if(item.id == editRow.id) {
        item.editNum = editRow.editNum;
        item.realAmount = (item.editNum*item.purchasePrice).toFixed(2)
      }
    })
    let purchaseTotalSure = selectedRows.reduce((pre,next)=>{
      return pre + (+next.realAmount)
    },0)
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        editRow,
        selectedRows,
        purchaseTotalSure,
      },
    });
  }
  // 点击售后的确定按钮
  handleOkSureService() {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRows } = dealAccountList;
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        isShowList: true,
        isShowSureExpire: false,
        isShowSureService: false,
      },
    });
  }
  // 对点击的未到期弹框点确定
  handleOkSureExpire() {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRows } = dealAccountList;
    const hasExpire = false;
    let hasService = false;
    selectedRows.map((item, index) => {
      if (item.isBackSuccess != true) {
        hasService = true;
      }
    });
    if ((hasExpire == false) && (hasService == false)) {
      dispatch({
        type: 'dealAccountList/searchSelectedRows',
        payload: {
          isShowList: true,
          isShowSureExpire: false,
          isShowSureService: false,
        },
      });
    } else if ((hasExpire == false) && (hasService == true)) {
      dispatch({
        type: 'dealAccountList/getListResolved',
        payload: {
          isShowList: false,
          isShowSureExpire: false,
          isShowSureService: true,
        },
      });
    }
  }
  // 对账单弹窗是否弹出
  handelAccountList() {
    const { dispatch, dealAccountList } = this.props;
    const { selectedRows } = dealAccountList;
    let hasExpire = false;
    let hasService = false;
    // 财务备注不一致时不能生成对账单
    const length = selectedRows.length;
    const hasBankInfoId = selectedRows.every(item=>+item.bankInfoId)
    
    if(hasBankInfoId) {
      for(let i = 0;i<length;i++) {
        for(let j = 1;j<i;j++) {
          if(selectedRows[i].bankInfoId != selectedRows[j].bankInfoId) {
            message.warn("所选商品的财务备注不一致，请核对后再生成对账单!")
            return;
          }
        }
      }
    }else{
      for(let i = 0;i<length;i++) {
        for(let j = 1;j<i;j++) {
          if(selectedRows[i].financeRemark != selectedRows[j].financeRemark) {
            message.warn("所选商品的财务备注不一致，请核对后再生成对账单!")
            return;
          }
          
        }
      }
    }
    // 未到期弹框是否弹出过
    selectedRows.map((item, index) => {
      //   已经到期为0
      if (item.isExpire == 1) {
        hasExpire = true;
      }
      if (item.isBackSuccess != true) {
        hasService = true;
      }
    });
    if ((hasExpire == false) && (hasService == false)) {
      //  生成待提交列表弹窗
      dispatch({
        type: 'dealAccountList/searchSelectedRows',
        payload: {
          isShowList: true,
          isShowSureExpire: false,
          isShowSureService: false,
        },
      });
    } else if ((hasExpire == false) && (hasService == true)) {
      //  生成售后弹窗
      dispatch({
        type: 'dealAccountList/getListResolved',
        payload: {
          // isShowList: false,
          isShowSureExpire: false,
          isShowSureService: true,
        },
      });
    } else if ((hasExpire == true)) {
      dispatch({
        type: 'dealAccountList/getListResolved',
        payload: {
          // isShowList: false,
          isShowSureExpire: true,
          // isShowSureService: false,
        },
      });
    }
  }
  handleChangeTab=(activeKey)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'dealAccountList/getListResolved',
      payload:{
        activeKey
      }
    })
  }
  handleChangeIsDeduction=(e)=>{
    const { dispatch, dealAccountList } = this.props;
    const { balanceBillAmount } = dealAccountList;
    dispatch({
      type:'dealAccountList/getListResolved',
      payload:{
        isDeduction:e.target.checked,
        balanceBillAmount:e.target.checked?balanceBillAmount:'',
      }
    })
  }
  handleChangeDeductionValue=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'dealAccountList/getListResolved',
      payload:{
        balanceBillOutInvAmount:e.target.value,
      }
    })
  }
  inputDeductionValue=()=>{
    const { dispatch, dealAccountList } = this.props;
    const { balanceBillTotalAmount, balanceBillAmount } = dealAccountList;
    if(+balanceBillAmount>+balanceBillTotalAmount) {
      message.error("剩余可抵扣金额不足");
        dispatch({
        type:'dealAccountList/getListResolved',
        payload:{
          balanceBillAmount:balanceBillTotalAmount,
        }
      })
    }
  }
  deductionIsBill=(e)=>{
    const { dispatch, dealAccountList } = this.props;
    const { balanceBillOutInvAmount } = dealAccountList;
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        isOutInv:e.target.value,
        balanceBillOutInvAmount:e.target.value?balanceBillOutInvAmount:''
      }
    })
  }
  changeDeductionValue=(e)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'dealAccountList/getListResolved',
      payload: {
        balanceBillAmount:e.target.value,
      }
    })
  }
  saveDeductionValue(e) {
    const { dispatch, dealAccountList } = this.props;
    const { balanceBillAmount,balanceBillOutInvAmount } = dealAccountList;
      if(balanceBillOutInvAmount > +balanceBillAmount) {
        message.warning("开票金额超出抵扣金额");
        dispatch({
          type: 'dealAccountList/getListResolved',
          payload: {
            balanceBillOutInvAmount:balanceBillAmount,
          }
        })
        return;
      }else{
        dispatch({
          type: 'dealAccountList/getListResolved',
          payload: {
            balanceBillOutInvAmount:e.target.value,
          }
        })
      }
  }
  render() {
    const {
      dealAccountList: {
        expectPayTimeStart,
        expectPayTimeEnd,
        purchaseTimeStart,
        purchaseTimeEnd,
        selectedRows,
        awaitPayTotalMoney,
        purchaseGoodsList,
        isShowList,
        inputRealPriceTotal,
        isShowSureExpire,
        isShowSureService,
        pageSize,
        currentPage,
        total,
        supplierId,
        supplierName,
        payCreditTypeMap,
        purchaseTypeMap,
        selectedRowIds,
        actionList,
        agencyCurrentPage,
        agencyPageSize,
        agencyPurchaseGoodsList,
        agencyTotal,
        activeKey,
        agencyExpectPayTimeEnd,
        agencyExpectPayTimeStart,
        agencyAwaitPayTotalMoney,
        agencySupplierName,
        startDate,
        endDate,
        balanceBillTotalAmount,
        isDeduction,
        balanceBillOutInvAmount,
        isOutInv,
        balanceBillAmount,
        purchaseTotalSure,
        selectTotalAmount,
        notApplyAmount,
        appliedNotPayMoney,
        agencyNotApplyAmount,
        agencyAppliedAmount,
      },
    } = this.props;
    // const purchaseTotalSure = selectedRows.reduce((pre,next)=>{
    //   return pre + (+next.realPayNow)
    // },0)
    // let bankDetail = {};
    // bankDetail = selectedRows.length>0&&selectedRows[0].bankInfo;
    // console.log("bankDetail",bankDetail)
    const payTimeCol = {
      title: '预计付款时间',
      dataIndex: 'expectPayTime',
      key: 'expectPayTime',
      width: 100,
      fixed: 'left',
      render: (expectPayTime, record) => {
        if (record.isExpire == 1) {
          return <span style={{ color: 'black' }}>{expectPayTime}</span>;
        } else if (record.isExpire == 0) {
          return <span style={{ color: 'red' }}>{expectPayTime}</span>;
        }
      },
    };
    const orderSnCol = {
      title: '采购单号',
      dataIndex: 'purchaseOrderId',
      key: 'purchaseOrderId',
      width: 70,
      fixed: 'left',
      render: (purchaseOrderId, record) => {
        if (record.purchaseTypeName == "代发采购") {
          return (<Tooltip title={purchaseOrderId} placement="topLeft">
            <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.purchaseOrderId}`}>{record.purchaseOrderId}</Link>
            <p style={{ margin:0 }}>
              {
                record.tag.map(item => {
                  if (item.name === "售后") {
                    return <span style={{ background: item.color, color: '#fff', display: 'inline-block' }}>{item.name}</span>
                  }
                  if (item.name === "打折") {
                    return <span style={{ background: item.color, color: '#fff', display: 'inline-block' }}>{item.name}</span>
                  }
                })
              }
            </p>
          </Tooltip>);
        } else {
          return (<Tooltip title={purchaseOrderId} placement="topLeft">
            <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${record.purchaseOrderId}`}>{record.purchaseOrderId}</Link>
            <p style={{ margin:0 }}>
              {
                record.tag.map(item => {
                  if (item.name === "售后") {
                    return <span style={{ background: item.color, color: '#fff', display: 'inline-block' }}>{item.name}</span>
                  }
                  if (item.name === "打折") {
                    return <span style={{ background: item.color, color: '#fff', display: 'inline-block' }}>{item.name}</span>
                  }
                })
              }
            </p>
          </Tooltip>);
        }
      },
    };
    const proName = {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 210,
      fixed: 'left',
    };
    const goodsSn = {
      title: '条形码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
      width: 150,
      fixed: 'left',
    };
    const salePrice = {
      title: '销售价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 75,
      fixed: 'left',
    };
    const marketPrice = {
      title: '零售价/平台价/折扣',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      width: 180,
      render: (marketPrice, record) => {
        return (
          <div className="retailcolor">
            <span style={{ color: 'red' }}>{record.marketPrice}</span>/
            <span style={{ color: '#FF7634' }}>{record.shopPrice}</span>/
            <span style={{ color: 'green' }}>{record.saleDiscount}</span>
          </div>
        );
      },
    };
    const purchasePrice = {
      title: '采购单价/折扣',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 130,
      render: (purchasePrice, record) => {
        return (
          <div>
            <span style={{ color: 'red' }}>{record.purchasePrice}</span>/
            <span style={{ color: '#FF7634' }}>{record.purchaseDiscount}</span>
          </div>
        );
      },
    };
    const profitRate = {
      title: '毛利率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      width: 80,
    };
    const isTax = {
      title: '采购含税',
      dataIndex: 'isTax',
      key: 'isTax',
      width: 100,
      render: isTax => (
        <span>{(isTax == '是') ? '是' : '否'}</span>
      ),
    };
    const snPolicy = {
      title: '条码政策',
      key: 'snPolicy',
      dataIndex: 'snPolicy',
      width:70,
      render: (snPolicy,record) => {
        return <Tooltip title={snPolicy}>
            {
              snPolicy?(<img style={{width:40,height:40}}
                src={img}></img>):null
            }    
        </Tooltip>
      },
    };
    const realNumOut = {
      title: <div>
        待结算数量 <Tooltip title="待结算数量=原数量-售后数量-已申请数量-已核销数量"><Icon type="question-circle"/></Tooltip>
      </div>,
      dataIndex: 'realNum',
      key: 'realNum',
      width: 150,
      render: (realNum, record) => (
        [
          <Tooltip title={record.realNumRemark && record.realNumRemark.map(item => (<p>{item}</p>))} placement="topLeft" >
            <span style={{ color: record.realNumColor }}>{record.realNum}</span>
          </Tooltip>,
        ]
      ),
    };
    const saleNum = {
      title: '销量',
      dataIndex: 'saleNum',
      key: 'saleNum',
      width: 100,
      render:(saleNum,record)=>{
        return <Tooltip title={
          <div>
            <div>原销量：{record.totalSaleNum}</div>
            <div>出库前售后数量：{record.noSendBackTotalNum}</div>
            <div>出库后售后数量：{record.hasSendBackTotalNum}</div>
          </div>
        }>
            <span>{saleNum}</span>
        </Tooltip>
      }
    };
    const realNumDialog = {
      title: '待结算数量',
      dataIndex: 'realNum',
      key: 'realNum',
      width: 150,
      render: (realNum, record) => (
        [
          <Tooltip title={record.realNumRemark && record.realNumRemark.map(item => (<p>{item}</p>))} placement="topLeft" >
            <InputNumber
              max={record.realNum}
              min={1}
              value={record.editNum}
              onChange={this.handleNumberChange.bind(this, record)}
            />
          </Tooltip>,
        ]
      ),
    };
    const realAmountOut = {
      title: <div>
        待结算金额 <Tooltip title="待结算金额=原采购金额-售后金额-已申请金额-已核销金额"><Icon type="question-circle"/></Tooltip>
      </div>,
      dataIndex: 'realAmount',
      key: 'realAmount',
      width: 150,
      render: (realAmount, record) => (
        [
          <Tooltip title={record.realAmountRemark && record.realAmountRemark.map(item => (<p>{item}</p>))} placement="topLeft" >
            <span style={{ color: record.realAmountColor }}>{parseFloat(record.realAmount).toFixed(2)}</span>
          </Tooltip>,
        ]
      ),
    };
    const lastPayTime = {
      title: '上期结算时间',
      dataIndex: 'lastPayTime',
      key: 'lastPayTime',
      width:100,
    };
    const purchaseTime = {
      title: '采购时间',
      dataIndex: 'purchaseTime',
      key: 'purchaseTime',
      width: 100,
    };
    const consignee =
    {
      title: '收件人',
      dataIndex: 'consignee',
      key: 'consignee',
      width: 100,

    };
    const orderSn = {
      title: '子单号',
      dataIndex: 'orderSn',
      key: 'orderSn',
      width: 100,
    };
    const payMethod = {
      title: '结算方式',
      dataIndex: 'payMethod',
      key: 'payMethod',
      width: 100,
      render:(payMethod)=>{
        return <span>{payCreditTypeMap[payMethod]}</span>
      }
    };
    const purchaseType = {
      title: '采购单类型',
      dataIndex: 'purchaseTypeName',
      key: 'purchaseTypeName',
      // width: 120,
    };
    const outColumns = [
      payTimeCol,
      orderSnCol,
      proName,
      goodsSn,
      salePrice,
      marketPrice,
      purchasePrice,
      profitRate,
      // saleNum,
      isTax,
      payMethod,
      snPolicy,
      realNumOut,
      realAmountOut,
      lastPayTime,
      purchaseTime,
      consignee,
      orderSn,
      purchaseType,
    ];
    const dialogColumns = [
      payTimeCol,
      orderSnCol,
      proName,
      goodsSn,
      salePrice,
      marketPrice,
      purchasePrice,
      profitRate,
      saleNum,
      payMethod,
      isTax,
      snPolicy,
      realNumDialog,
      realAmountOut,
      lastPayTime,
      purchaseTime,
      consignee,
      orderSn,
      purchaseType,
    ];
    return (
      <PageHeaderLayout title="待对账列表" 
      iconType="question-circle"
      tips={
        <div>
            <p>账期采购单流转条件：</p>
            <p>1.支付方式为账期支付</p>
            <p>2.财务审核通过的账期单才可流转至此</p>
        </div>
        }
      >
        <Card bordered={false}>
          <Tabs onChange={this.handleChangeTab} activeKey={activeKey}>
            <TabPane tab="购销" key="1">
              <Row style={{ marginBottom: '10px' }}>
                <Col span={10}>
                  <span style={{ marginRight: '30px' }}>待结算总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{awaitPayTotalMoney}</b></span>
                  <span style={{ marginRight: '30px' }}>待申请总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{notApplyAmount}</b></span>
                  <span style={{ marginRight: '30px' }}>已申请待结算总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{appliedNotPayMoney}</b></span>
                  <span style={{ marginRight: '30px' }}>供应商:<b style={{ paddingLeft: '5px', color: '#000', fontSize: '16px' }}>{supplierName}</b></span>
                </Col>

                <Col span={12}>
                  <Button type="primary" style={{ float: 'right' }} onClick={this.handelAccountList.bind(this)}>生成对账单</Button>
                  <p style={{ float: 'right', display: 'inline-block', lineHeight: '32px', marginRight: '10px', marginBottom: '0' }}>已选总金额:<span style={{ paddingLeft: '5px', color: 'red', fontSize: '16px' }}>{parseFloat(selectTotalAmount).toFixed(2)}</span></p>
                </Col>
                <Col span={2} justify="end">
                  {
                    actionList ?
                      actionList.map(actionInfo => {
                        switch (actionInfo.type) {
                          case 1:
                            return (
                              <Link to={actionInfo.url}>
                                <Button style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </Link>
                            );
                          case 2:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                              >
                                <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </a>
                            );
                          case 3:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                              >
                                <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </a>
                            );
                        }
                      }) : null
                  }
                </Col>

              </Row>
              <Row>
                <span style={{ display: 'inline-block', lineHeight: '32px', marginRight: '5px' }}>预计付款时间</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[expectPayTimeStart ? moment(expectPayTimeStart, 'YYYY-MM-DD') : '', expectPayTimeEnd
                    ? moment(expectPayTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.handleDateChange.bind(this, 'payData')}
                />
                <span style={{ display: 'inline-block', lineHeight: '32px', marginRight: '5px' }}>采购时间</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[purchaseTimeStart ? moment(purchaseTimeStart, 'YYYY-MM-DD') : '', purchaseTimeEnd ? moment(purchaseTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.handleDateChange.bind(this, 'purchaseData')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入采购单号/子单号"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'orderSn')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="商品名称/条码"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'goodsKeywords')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="收件人"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'consignee')}
                />
                <Select
                  placeholder="采购类型"
                  className={globalStyles['select-sift']}
                  onChange={this.handleSelected.bind(this, 'purchaseType')}
                  allowClear
                >
                  <Select.Option value={''}>全部</Select.Option>
                  {Object.keys(purchaseTypeMap).map(key => (
                    <Select.Option value={key}>{purchaseTypeMap[key]}</Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder="结算方式"
                  className={globalStyles['select-sift']}
                  onChange={this.handleSelected.bind(this, 'payMethod')}
                  allowClear
                >
                  <Select.Option value={''}>全部</Select.Option>
                  {Object.keys(payCreditTypeMap).map(key => (
                    <Select.Option value={key}>{payCreditTypeMap[key]}</Select.Option>
                  ))}

                </Select>
              </Row>
              <Table
                style={{ marginTop: '20px' }}
                bordered
                dataSource={purchaseGoodsList}
                columns={outColumns}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                scroll={{ x: 2200, y:800 }}
                rowSelection={{
                  selectedRowKeys: selectedRowIds,
                  onChange: this.handleSelectRows.bind(this),
                }}
                pagination={{
                  current: currentPage,
                  pageSize,
                  pageSizeOptions: ["10", "20", "40", "50", "100"],
                  onChange: this.handleChangePage.bind(this,'currentPage'),
                  onShowSizeChange: this.handleChangePageSize.bind(this,'pageSize'),
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total,
                  showTotal:total => `共 ${total} 个结果`,
                }}
              />
            </TabPane>
            <TabPane tab="代销" key="2">
            <Row style={{ marginBottom: '10px' }}>
                <Col span={10}>
                  <span style={{ marginRight: '30px' }}>待结算总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{agencyAwaitPayTotalMoney}</b></span>
                  <span style={{ marginRight: '30px' }}>待申请总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{agencyNotApplyAmount}</b></span>
                  <span style={{ marginRight: '30px' }}>已申请待结算总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{agencyAppliedAmount}</b></span>
                  <span style={{ marginRight: '30px' }}>供应商:<b style={{ paddingLeft: '5px', color: '#000', fontSize: '16px' }}>{agencySupplierName}</b></span>
                </Col>

                <Col span={12}>
                  <Button type="primary" style={{ float: 'right' }} onClick={this.handelAccountList.bind(this)}>生成对账单</Button>
                  <p style={{ float: 'right', display: 'inline-block', lineHeight: '32px', marginRight: '10px', marginBottom: '0' }}>已选总金额:<span style={{ paddingLeft: '5px', color: 'red', fontSize: '16px' }}>{parseFloat(selectTotalAmount).toFixed(2)}</span></p>
                </Col>
                <Col span={2} justify="end">
                  {
                    actionList ?
                      actionList.map(actionInfo => {
                        switch (actionInfo.type) {
                          case 1:
                            return (
                              <Link to={actionInfo.url}>
                                <Button style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </Link>
                            );
                          case 2:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                              >
                                <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </a>
                            );
                          case 3:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                              >
                                <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </a>
                            );
                        }
                      }) : null
                  }
                </Col>

              </Row>
              <Row>
                <span style={{ display: 'inline-block', lineHeight: '32px', marginRight: '5px' }}>预计付款时间</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[agencyExpectPayTimeStart ? moment(agencyExpectPayTimeStart, 'YYYY-MM-DD') : '', agencyExpectPayTimeEnd
                    ? moment(agencyExpectPayTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.handleDateChange.bind(this, 'agencyPayData')}
                />
                <span style={{ display: 'inline-block', lineHeight: '32px', marginRight: '5px' }}>采购时间</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[purchaseTimeStart ? moment(purchaseTimeStart, 'YYYY-MM-DD') : '', purchaseTimeEnd ? moment(purchaseTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.handleDateChange.bind(this, 'agencyPurchaseData')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入采购单号/子单号"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'agencyOrderSn')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="商品名称/条码"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'agencyGoodsKeywords')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="收件人"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'agencyConsignee')}
                />
                <Select
                  placeholder="采购类型"
                  className={globalStyles['select-sift']}
                  onChange={this.handleSelected.bind(this, 'agencyPurchaseType')}
                  dropdownMatchSelectWidth={false}
                  allowClear
                >
                  <Select.Option value={''}>全部</Select.Option>
                  {Object.keys(purchaseTypeMap).map(key => (
                    <Select.Option value={key}>{purchaseTypeMap[key]}</Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder="结算方式"
                  className={globalStyles['select-sift']}
                  onChange={this.handleSelected.bind(this, 'agencyPayType')}
                  dropdownMatchSelectWidth={false}
                  allowClear
                >
                  <Select.Option value={''}>全部</Select.Option>
                  {Object.keys(payCreditTypeMap).map(key => (
                    <Select.Option value={key}>{payCreditTypeMap[key]}</Select.Option>
                  ))}

                </Select>
              </Row>
              <Table
                style={{ marginTop: '20px' }}
                bordered
                dataSource={agencyPurchaseGoodsList}
                columns={outColumns}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                scroll={{ x: 2050, y:800 }}
                rowSelection={{
                  selectedRowKeys: selectedRowIds,
                  onChange: this.handleSelectRows.bind(this),
                }}
                pagination={{
                  current: agencyCurrentPage,
                  pageSize:agencyPageSize,
                  pageSizeOptions: ["10", "20", "40", "50", "100"],
                  onChange: this.handleChangePage.bind(this,'agencyCurrentPage'),
                  onShowSizeChange: this.handleChangePageSize.bind(this,'agencyPageSize'),
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total:agencyTotal,
                }}
              />
            </TabPane>
          </Tabs>
          
          {/* 未到期 */}
          <Modal
            visible={isShowSureExpire}
            // confirmLoading={isEditingRemark}
            onOk={this.handleOkSureExpire.bind(this)}
            onCancel={this.handleCancelAccountList.bind(this, 'isShowSureExpire')}
          >
            <p style={{ textAlign: 'center' }}>提示</p>
            <p style={{ textAlign: 'center' }}>您选择的sku中包含未到期的商品，请确定是否继续生成对账单</p>
          </Modal>
          {/* 有售后单未通过审核 */}
          <Modal
            visible={isShowSureService}
            // confirmLoading={isEditingRemark}
            footer={null}
            onCancel={this.handleCancelAccountList.bind(this, 'isShowSureService')}
          >
            <p style={{ textAlign: 'center' }}>提示</p>
            <p style={{ textAlign: 'center' }}>您选择的sku有售后单未通过财务审核，需完结售后之后才可生成对账单</p>
          </Modal>
          <Modal
            width={1900}
            visible={isShowList}
            okText="确认生成对账单"
            closable={false}
            maskClosable={false}
            // confirmLoading={isEditingRemark}
            onOk={this.handleOkEditAccountList.bind(this)}
            onCancel={this.handleCancelAccountList.bind(this, 'isShowList')}
          >
            <Row>
              按销售时间搜索：
              <RangePicker
               value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate
               ? moment(endDate, 'YYYY-MM-DD') : '']}
                onChange={this.handleDateChange.bind(this, 'saleDate')}
              />
            </Row>
            <Table
              bordered
              scroll={{ x: 2200,}}
              style={{
                marginTop: 20,
              }}
              dataSource={selectedRows}
              rowKey={record => record.id}
              columns={dialogColumns}
              className={globalStyles.tablestyle}
              pagination={false}
            />
            <Row style={{marginTop:20}}>
              <Col span={18}>
                <Row style={{margin:'10px 0'}}>
                  <TextArea
                    value={selectedRows[0]&&selectedRows[0].financeRemark}
                    autosize={{ minRows: 2, maxRows: 6 }}
                    style={{ width: 500, marginTop: '20px', marginLeft: '20px' }}
                  />
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>付款信息:</span>
                  <Select
                    style={{ width: 150,marginRight:10 }}
                    value={selectedRows[0]&&selectedRows[0].bankDetail.typeName}
                  >
                    {
                    //  <Select.Option>
                    //    {bankDetail.type==1?"对公账户":"对私账户"}
                    //   </Select.Option>
                    }
                  </Select>
                  <Select
                    style={{ width: 500 }}
                    value={selectedRows[0]&&selectedRows[0].bankDetail.bankInfo}
                  >
                    {
                      // <Select.Option>
                      //      {bankDetail.bankInfo}
                      // </Select.Option>
                    }
                  </Select>
                </Row>
                <Row style={{marginTop:10}}>
                  <TextArea
                  placeholder="请输入采购备注"
                  autosize={{ minRows: 2, maxRows: 6 }}
                  onBlur={this.handleOkRemark.bind(this, 'accountRemark')}
                  style={{ width: 500, marginTop: '20px' }}
                  />
                </Row>
              </Col>
              <Col span={6}>
                <Row style={{ marginBottom: 10 }}>采购总额:<b style={{ paddingLeft: '5px', color: '#000', fontSize: '20px' }}>{purchaseTotalSure.toFixed(2)}</b></Row>
                <Row style={{ marginBottom: 10 }}><Checkbox style={{ marginRight: 10 }} 
                onChange={this.handleChangeIsDeduction.bind(this)} 
                ></Checkbox>
                挂账抵扣： 
                <Input style={{width: 80,marginRight:4}} 
                  onBlur={this.inputDeductionValue.bind(this)} 
                  onChange={this.changeDeductionValue}
                  disabled={!isDeduction}
                  value={balanceBillAmount}
                  />
                <span>剩余可抵扣总金额：<span style={{fontSize:18,fontWeight:"bold"}}>
                  {balanceBillTotalAmount}
                </span></span>
                </Row>
                {
                  isDeduction?<div>
                    <Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额是否开票：</span>
                      <RadioGroup 
                      onChange={this.deductionIsBill.bind(this)} 
                      defaultValue={isOutInv}
                      >
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup> 
                    </Row>

                    <Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额需开票金额：
                      <Input style={{width: 100}} 
                        onChange={this.handleChangeDeductionValue.bind(this)} 
                        onBlur={this.saveDeductionValue.bind(this)}
                        disabled={!isOutInv} 
                        value={balanceBillOutInvAmount}
                        />
                    </span>                  
                    </Row>
                  </div>:""
                }
                <Row style={{ marginBottom: 10 }}>
                <span style={{ marginLeft: 22 }}>开票总金额: </span>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
                  {
                    (+purchaseTotalSure + +balanceBillOutInvAmount).toFixed(2)
                  }
                </span>           
                </Row>
                <Row style={{ marginBottom: 10 }}>
                <span style={{ marginLeft: 22 }}>采购应付总额: </span>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>
                  {(+purchaseTotalSure - +balanceBillAmount).toFixed(2)}
                </span>       
                </Row>
              </Col>
            </Row>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}

