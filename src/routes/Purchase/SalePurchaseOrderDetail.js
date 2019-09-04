import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import {
  Row,
  Col,
  Form,
  Card,
  Table,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Tabs,
  Modal,
  message,
  Tooltip,
  Select,
  Alert,
} from 'antd';
import { Link } from 'dva/router';
import { stringify } from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SalePurchaseOrderDetail.less';
import img from '../../assets/u2741.png';
const { TabPane } = Tabs;
const { Option } = Select;

@connect(state => ({
  salePurchaseOrderDetail: state.salePurchaseOrderDetail,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'salePurchaseOrderDetail/getOrderDetail',
      payload: {
        id,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/unmount',
    });
  }

  // tabs 2 --- start ----------------------
  // 点击导入物流信息按钮展示弹窗
  handelShowSubOrderInfo(id, logisticsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/showOrderInfoConfirm',
      payload: {
        id,
        logisticsId: (typeof logisticsId === 'object') ? '' : logisticsId,
      },
    });
  }

  // 取消导入物流信息的弹窗
  handleClickCancelSubOrderInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/cancelSubOrderInfoButton',
    });
  }

  // 修改本次出库数
  handleChangeOutNum(e, rowId, limitNum) {
    const { dispatch } = this.props;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(e.target.value)) {
      return;
    }
    if (+e.target.value > +limitNum) {
      message.error('本次出库数不可超过订购数量, 已自动帮您设置为最大值!', 0.5);
      dispatch({
        type: 'salePurchaseOrderDetail/changeOutNum',
        payload: {
          value: limitNum,
          rowId,
        },
      });
      return;
    }
    dispatch({
      type: 'salePurchaseOrderDetail/changeOutNum',
      payload: {
        value: e.target.value,
        rowId,
      },
    });
  }
  // 修改物流公司
  handleChangeLogisticsCompany(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeLogisticsCompany',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 修改物流单号
  handleChangeLogisticsSn(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeLogisticsSn',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 修改物流运费
  handleChangeLogisticsFare(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeLogisticsFare',
      payload: {
        value: e.target.value,
      },
    });
  }
  handleChangeUnloadFare(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeUnloadFare',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 弹窗确定按钮
  handleClickOkSubOrderInfoButton() {
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { subOrderInfo, subOrderId, logisticsId, logisticsCompany, logisticsSn, unloadFare, logisticsFare } = salePurchaseOrderDetail;
    const goodsList = [];
    for (let i = 0; i < subOrderInfo.goodsList.length; i += 1) {
      const obj = {};
      obj.id = subOrderInfo.goodsList[i].id;
      obj.outNum = subOrderInfo.goodsList[i].outNum;
      goodsList.push(obj);
    }
    if (logisticsId) {
      dispatch({
        type: 'salePurchaseOrderDetail/updateLogistics',
        payload: {
          subOrderId,
          logisticsId,
          logisticsCompany,
          logisticsSn,
          logisticsFare,
          unloadFare,
          goodsList,
          pageId: this.props.match.params.id,
        },
      });
    } else {
      dispatch({
        type: 'salePurchaseOrderDetail/addLogistics',
        payload: {
          subOrderId,
          logisticsCompany,
          logisticsSn,
          logisticsFare,
          unloadFare,
          goodsList,
          pageId: this.props.match.params.id,
        },
      });
    }
  }

  // tabs 3 --- start
  // 点击详情按钮展示弹窗
  handelShowPayInfo(id) {
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { payList } = salePurchaseOrderDetail;
    dispatch({
      type: 'salePurchaseOrderDetail/showPayInfoConfirm',
      payload: {
        id,
        payList,
      },
    });
  }
  // 确认弹窗按钮
  handleClickOkPayInfoButtonbind() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/clickOkPayInfoButto',
    });
  }

  // handelClickAction(url) {
  //   const { dispatch } = this.props;
  //   const { id } = this.props.match.params;
  //   dispatch({
  //     type: 'salePurchaseOrderDetail/clickAction',
  //     payload: {
  //       id,
  //       url,
  //     },
  //   });
  // }
  // 点击action弹窗
  handleClickActionPopUP(url, actionText, backUrl) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/clickActionPopUp',
      payload: {
        url,
        actionText,
        backUrl,
      },
    });
  }
  // 取消action弹窗
  handleCancelActionConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/cancelActionConfirm',
    });
  }
  // 修改action备注
  handleChangeActionRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeActionRemark',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 确定 action 弹窗提交 action
  handleClickOkAction(url) {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'salePurchaseOrderDetail/clickOkAction',
      payload: {
        id,
        url,
      },
    });
  }
  // 下拉改变财务备注
  handleSelectFinanceRemark(financeRemark) {
    const { dispatch,salePurchaseOrderDetail } = this.props;
    const { id } = this.props.match.params;
    const { bankDetailId } = salePurchaseOrderDetail;
    if(+bankDetailId) {
      message.error("只能选择一条财务备注");
      return;
    }
    dispatch({
      type: 'salePurchaseOrderDetail/selectFinanceRemark',
      payload: {
        financeRemark,
        id,
      },
    });
  }
  // 选择支付方式
  handleChangePayType(value) {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'salePurchaseOrderDetail/changePayType',
      payload: {
        id,
        payType: value,
      },
    });
  }
  // 点击修改, 切换是否可以修改采购含税状态
  handleChangeEditState() {
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { isEditState } = salePurchaseOrderDetail;
    dispatch({
      type: 'salePurchaseOrderDetail/changeEditState',
      payload:{
        isEditState: !isEditState,
      }
    });
  }
  // 切换采购含税
  handleChangePurchaseIsTax(id, isTax) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changePurchaseIsTax',
      payload: {
        id,
        isTax,
      },
    });
  }
  handleCloseNoticeBoard=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/changeReducer',
      payload: {
        isShowNoticeModal: false,
      },
    });
  }
  // 点击填充的时候把所选的物流单号填充到下面
  handleAddLogisticInfo=(e)=>{
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { followInfoDetail, followInfo } = salePurchaseOrderDetail;
    followInfo.map(item=>{
      if(item.shippingNo == followInfoDetail[e]) {
        dispatch({
          type: 'salePurchaseOrderDetail/fillLogisticInfo',
          payload: {
            selectedInfo:item,
            logisticSnId:e,
          }
        })
      }
    })
  }
  handleChangeBankInfoType=(e)=>{
    const { dispatch, salePurchaseOrderDetail } = this.props;
    dispatch({
      type: 'salePurchaseOrderDetail/getConfigReducer',
      payload: {
        bankType:e,
        bankDetailId: "",
      },
    });
  }
  handleChangeBankDetail=(e)=>{
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { financeRemark } = salePurchaseOrderDetail;
    if(financeRemark) {
      message.error("只能选择一条财务备注");
      return;
    }
    dispatch({
      type: 'salePurchaseOrderDetail/changeBankInfoId',
      payload: {
        bankDetailId:e,
      },
    });
  }
  handleFillNum=(currentRow)=>{
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { subOrderInfo } = salePurchaseOrderDetail;
    subOrderInfo.goodsList.map(item=>{
      if(+currentRow.id === +item.id) {
        item.outNum = item.awaitOutNum
      }
    })
    dispatch({
      type: 'salePurchaseOrderDetail/changeReducer',
      payload: {
        subOrderInfo,
      },
    })
  }
  handleChangeOrderSn=(e)=>{
    const { dispatch, salePurchaseOrderDetail } = this.props;
    const { followInfo } = salePurchaseOrderDetail;
    let followInfoDetail = {};
    if(e){
      let tempFollowInfo = followInfo.filter(item=>item.orderId == e)
      tempFollowInfo.map((item,index)=>{
        followInfoDetail[index] = item.shippingNo;
        return followInfoDetail;
      })
    }else{
      followInfo.map((item,index)=>{
        followInfoDetail[index] = item.shippingNo;
        return followInfoDetail;
      })
    }
    // const 
    dispatch({
      type: 'salePurchaseOrderDetail/changeReducer',
      payload: {
        followInfoDetail,
      },
    })
  }
  render() {
    const {
      salePurchaseOrderDetail: {
        payTypeMap,
        payType,
        detailType,
        purchaseSn,
        supplier,
        purchaser,
        date,
        totalOrderGoodsList,
        isLoading,
        // 子单状态记录
        subOrderList,
        isGoodsLoading,
        subOrderInfo,
        isShowSubOrderInfoConfirm,
        isSubOrderInfoLoading,
        subOrderId,
        logisticsId,
        logisticsCompany,
        logisticsSn,
        logisticsFare,
        unloadFare,
        // 付款信息
        purchaseAmount,
        alreadyPay,
        awaitConfirm,
        awaitPay,
        payList,
        payInfo,
        isShowPayInfoConfirm,
        isPayInfoLoading,
        actionList,
        pageId,
        tabStatus,
        isShowActionConfirm,
        isActioning,
        actionRemark,
        actionText,
        // isNeedRemark,
        url,
        financeRemark,
        financeRemarks,
        isEditState,
        canEdit,
        expectInvDate,
        expectPayTime,
        expectShippingDate,
        outInvAmount,
        isOutInv,
        balanceBillAmount,
        shouldPayAmount,
        balanceBillOutInvAmount,
        note,
        followInfoDetail,
        isShowNoticeModal,
        noticeOrderList,
        noticeText,
        bankInfoList,
        bankType,
        bankInfoId,
        finalBankInfos,
        bankInfo,
        bankDetailId,
        currentBankInfo,
        isAllCash,
        isAllDirect,
        isAllAgency,
        isTax,
        shippingMethod,
        shippingMethodMap,
        orderSnMap,
        logisticSnId,
      },
    } = this.props;
    console.log("followInfoDetail",followInfoDetail)
    const isCheck = totalOrderGoodsList.some(item=>!item.isCheck);
    let bankInfoDetail = [];
    finalBankInfos.map(item=>{
      if(+item.type === +bankType) {
        bankInfoDetail = item.bankInfoDetail;
      }
    })
    const allSubtotal = totalOrderGoodsList.reduce((pre, next) => {
      return pre + +next.subtotal;
    }, 0);

    const allPurchaseNum = totalOrderGoodsList.reduce((pre, next) => {
      return pre + +next.purchaseNum;
    }, 0);

    const columns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
        fixed: true,
        render: (no, record, index) => {
          if (record.isNotGoods) {
            return <div style={{ width: '100%', textAlign: 'center', fontSize: '14px', color: '#40A9FF' }}>合计</div>;
          }
          return <span>{ no || index + 1}</span>;
        },
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        width: 200,
        render: (goodsSn, record) => {
          if (record.isNotGoods) {
            return null;
          } else {
            return <div className={styles.warning}>{!record.isCheck?<Tooltip title="该条码信息发生变更，正在审核中"><Icon type="warning" style={{color:'#f60'}}/></Tooltip>:""}<span>{goodsSn}</span></div>
          }
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 200,
        render: (goodsName, record) => {
          if (record.isNotGoods) {
            return null;
          } else {
            return <span>{goodsName}</span>;
          }
        },
      },
      {
        title: '结算方式',
        dataIndex: '',
        key: '',
        width:120,
      },
      {
        title: '采购数',
        dataIndex: 'purchaseNum',
        key: 'purchaseNum',
        width:120,
        render: (purchaseNum, record) => {
          if (record.isNotGoods && allPurchaseNum) {
            return allPurchaseNum;
          }
          if (record.isNotGoods && !allPurchaseNum) {
            return null;
          }
          return purchaseNum;
        },
      },
      {
        title: '待发数',
        dataIndex: 'awaitSendNum',
        key: 'awaitSendNum',
        width:120,
        render: (awaitSendNum, record) => {
          if (record.isNotGoods) {
            return null;
          } else {
            return <span style={{ color: '#FF0084' }}>{awaitSendNum}</span>;
          }
        },
      },
      {
        title: '已发数',
        dataIndex: 'alreadySendNum',
        key: 'alreadySendNum',
        width:120,
        render: (alreadySendNum, record) => {
          if (record.isNotGoods) {
            return null;
          } else {
            return <span style={{ color: '#008017' }}>{alreadySendNum}</span>;
          }
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width:120,
        render: (salePrice, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return salePrice;
        },
      },
      {
        title: '零售价/平台单价/折扣',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        render: (marketPrice, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return (
            <div>
              <span style={{ color: '#D91A43' }}>{marketPrice}</span>
              |
              <span style={{ color: '#FF846F' }}>{record.shopPrice}</span>
              |
              <span style={{ color: '#009DD7' }}>{record.saleDiscount}</span>
            </div>
          );
        },
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
                src={img}></img>):null
            }    
        </Tooltip>
        },
      }, 
      {
        title: '销售合计',
        dataIndex: 'saleSubtotal',
        key: 'saleSubtotal',
        render: (subtotal, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return (+record.salePrice * +record.purchaseNum).toFixed(2);
        },
      },
      {
        title: '运费政策',
        dataIndex: 'shippingDesc',
        key: 'shippingDesc',
      },
      {
        title: '销售含税',
        dataIndex: 'saleIsTax',
        key: 'saleIsTax',
        render: (saleIsTax, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return saleIsTax ? '是' : '否';
        },
      },
      {
        title: '采购单价/折扣',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        width:200,
        render: (purchasePrice, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return (
            <div>
              <span style={{ color: '#FF663F' }}>{purchasePrice}</span>
              <span style={{ margin: '0 5px' }}>|</span>
              <span style={{ color: '#009DD7' }}>{record.purchaseDiscount}</span>
            </div>
          );
        },
      },
      {
        title: '采购含税',
        dataIndex: 'purchaseIsTax',
        key: 'purchaseIsTax',
        // filterIcon: <Icon type="edit" onClick={this.handleChangeEditState.bind(this)} />,
        // filterDropdown: <div>11</div>,
        // filterDropdownVisible: false,
        render: (isTax, record) => {
          if (record.isNotGoods) {
            return null;
          }
          if (isEditState) {
            return (
              <Select
                value={isTax}
                onChange={this.handleChangePurchaseIsTax.bind(this, record.id)}
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            );
          }
          return isTax ? '是' : '否';
        },
      },
      {
        title: '采购合计',
        dataIndex: 'subtotal',
        key: 'subtotal',
        render: (subtotal, record) => {
          if (record.isNotGoods && allSubtotal) {
            return allSubtotal.toFixed(2);
          }
          if (record.isNotGoods && !allSubtotal) {
            return null;
          }
          return subtotal;
        },
      },
      {
        title: '毛利率',
        dataIndex: 'rossProfitRate',
        key: 'rossProfitRate',
        render: (rossProfitRate, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return isNaN(rossProfitRate)?<span>{rossProfitRate}</span>:`${Math.round(rossProfitRate * 100)}%`;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (remark, record) => {
          if (record.isNotGoods) {
            return null;
          } else {
            return <span>{remark}</span>;
          }
        },
      },
    ];

    const goodsColumns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
        render: (no, record, index) => {
          return <span>{ no || index + 1}</span>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '是否含税',
        dataIndex: 'purchaseTax',
        key: 'purchaseTax',
        render: (purchaseTax, record) => {
          return <span>{purchaseTax ? '是' : '否'}</span>;
        },
      },
      {
        title: '订购数量',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '本次出库',
        dataIndex: 'outNum',
        key: 'outNum',
        render: (outNum) => {
          return <span>{outNum}</span>;
        },
      },
      {
        title: '待出库',
        dataIndex: 'awaitOutNum',
        key: 'awaitOutNum',
        width: 150,
        render: (awaitOutNum) => {
          return <span style={{ color: '#ff2c2f' }}>{awaitOutNum}</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
    ];

    const goodsChangeColumns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
        render: (no, record, index) => {
          return <span>{ no || index + 1}</span>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width:200,
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '订购数量',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '待出库',
        dataIndex: 'awaitOutNum',
        key: 'awaitOutNum',
        width: 150,
        render: (awaitOutNum, record) => {
          return <span style={{ color: '#ff2c2f' }}>{+record.limitNum - +record.outNum}</span>;
        },
      },
      {
        title: '本次出库',
        dataIndex: 'outNum',
        key: 'outNum',
        render: (outNum, record) => {
          if (subOrderInfo) {
            return (
              <div>
                <Input onChange={event => this.handleChangeOutNum(event, record.id, record.limitNum)} value={outNum} style={{width:100,marginRight:6}}/>
                <Button type="primary" size="small" onClick={this.handleFillNum.bind(this,record)}>全部</Button>
              </div>
            );
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
    ];

    const payColumns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
        render: (no, record, index) => {
          return <span>{ no || index + 1}</span>;
        },
      },
      {
        title: '支付流水单号',
        dataIndex: 'paySn',
        key: 'paySn',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '付款金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },
      {
        title: '支付方式',
        dataIndex: 'payMethod',
        key: 'payMethod',
      },
      {
        title: '收款账户',
        dataIndex: 'receivableAccount',
        key: 'receivableAccount',
      },
      {
        title: '状态',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item>
                    <a onClick={this.handelShowPayInfo.bind(this, record.id)}>
                      详情
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="代发采购订单详情" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs
              defaultActiveKey={(tabStatus && tabStatus === 'subNo') ? '2' : 1}
              tabBarExtraContent={
                actionList ?
                  actionList.map((actionInfo) => {
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
                      default:
                        return (
                          <Button
                            style={{ marginLeft: 10 }}
                            onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                          >
                            {actionInfo.name}
                          </Button>
                        );
                    }
                  }).concat([
                    canEdit ? <Button style={{ marginLeft: 10 }} onClick={this.handleChangeEditState.bind(this)}>{isEditState ? '取消' : '修改'}</Button> : null,
                  ]) :
                  null
              }
            >
              <TabPane tab="订单详情" key="1">
                {
                  isCheck?<Row style={{marginBottom:10}}>
                  <Alert
                    message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，该采购单依然沿用之前的数据。"
                    type="warning"
                    />
                </Row>:""
                }
                {
                  payType == 0&&!isAllCash || payType == 2&&!isAllDirect || payType == 4&&!isAllAgency?
                  <Row style={{marginBottom:10}}>
                  <Alert
                    message="当前采购单支付类型与部分条码的结算方式不匹配，请谨慎审核！"
                    type="warning"
                    />
                  </Row>:""
                }
                <Row style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: '25px', color: '#ff2c2f', marginRight: 20 }}>{detailType}</span>
                  <span style={{ marginRight: 20 }}>采购单号：{purchaseSn}</span>
                  <span style={{ marginRight: 20 }}>供应商：{supplier}</span>
                  <span style={{ marginRight: 20 }}>采购员：{purchaser}</span>
                  <span style={{ marginRight: 20 }}>日期：{date}</span>
                </Row>
                <Table
                  bordered
                  loading={isLoading}
                  rowKey={record => record.id}
                  dataSource={totalOrderGoodsList.concat([{ id: totalOrderGoodsList.length * 10000000, isNotGoods: true }])}
                  columns={columns}
                  scroll={{ x: 2000 }}
                  pagination={false}
                />
                <Row type="flex" justify="end" align="middle" style={{ marginTop: 10 }}>
                  
                </Row>
                <Row>
                  <Col span={20}>
                    <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                      <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                        财务备注：
                      </span>
                      {
                        isEditState ?
                        (
                          <Select value={financeRemark} style={{ width: 400 }} onChange={this.handleSelectFinanceRemark.bind(this)}>
                            {financeRemarks.map((remark) => {
                              return (<Option value={remark}><Tooltip title={remark}>{remark}</Tooltip></Option>);
                            })}
                          </Select>
                        ) :
                          <span>{financeRemark}</span>
                      }
                    </Row>
                    <Row type="flex">
                      <span style={{ marginBottom: 10, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                        采购是否含税：
                      </span>
                      <div style={{marginLeft:20}}>{isTax?"是":"否"}</div>
                    </Row>
                    <Row type="flex">
                      <span style={{ marginBottom: 10, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                      运费方式：
                      </span>
                      <div style={{marginLeft:20}}>{shippingMethodMap[shippingMethod]}</div>
                    </Row>
                    <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                      <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                        付款备注：
                      </span>
                      {
                        isEditState ?
                        (
                          <Row>
                            <Select
                              placeholder="请选择账户类型"
                              value={bankType}
                              // value={finalBankInfos[0]&&finalBankInfos[0].type||bankType}
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
                              value={bankDetailId}
                              onChange={this.handleChangeBankDetail.bind(this)}
                              style={{ width: 500 }}
                              showArrow={+bankType===1?false:true}
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
                        ) :
                          <div style={{marginRight:20}}>
                              {bankInfo}
                            {/* {
                              Object.keys(bankInfo).length>0?<div><span>{bankInfo.type == 1?"对公账户":"对私账户"}</span>
                              <span>开户名称：{bankInfo.bankName}</span>
                              <span>开户行：{bankInfo.bankInfo}</span>
                              <span>银行账户：{bankInfo.bankAccount}</span></div>:""
                            } */}
                          </div>
                      }
                    </Row>
                    <Row style={{ marginBottom: 14, marginTop:10}}>
                      <span style={{ marginBottom: 10, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                        支付类型:
                      </span>
                      <span style={{ marginLeft: 10 }}>
                        {
                          isEditState ?
                          (
                            <Select
                              style={{ width: 200, display: 'inline-block' }}
                              value={payTypeMap[payType]}
                              placeholder="支付类型"
                              onChange={this.handleChangePayType.bind(this)}
                            >
                              {
                                (Object.entries(payTypeMap).map((value) => {
                                  return <Option key={value[0]}>{value[1]}</Option>;
                                }))
                              }
                            </Select>
                          ) :
                            <span>{payTypeMap[payType]}</span>
                        }
                      </span>
                        {
                          payType === 2?(<div style={{ marginBottom: 10, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计付款时间: {expectPayTime}</div>):null
                        }
                        <div style={{ marginBottom: 10, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计发货时间: {expectShippingDate}</div>
                        <div style={{ marginBottom: 10, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计开票时间: {expectInvDate}</div>
                        <Row type="flex">
                          <span style={{ marginBottom: 10, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                            采购备注：
                          </span>
                          <div style={{marginLeft:20}}><pre>{note}</pre></div>
                        </Row>
                    </Row>
                  </Col>
                  <Col span={4}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>                  
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>应付金额：<span style={{fontSize: '18px', fontWeight: 600}}>{"￥"+allSubtotal.toFixed(2)}</span></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>挂账抵扣: <span style={{fontSize: '18px', fontWeight: 600}}>{"￥"+balanceBillAmount}</span></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>抵扣金额是否开票: {isOutInv?"是":"否"}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>抵扣金额需开票金额: <sapn style={{fontSize: '18px', fontWeight: 600}}>{"￥"+ +balanceBillOutInvAmount}</sapn></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>开票总金额:<span style={{fontSize: '18px', fontWeight: 600}}>{"￥"+outInvAmount}</span></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>采购应付总额:<span style={{fontSize: '18px', fontWeight: 600, color: '#F7696B'}}>{"￥"+shouldPayAmount}</span></div>
                  </Row>
                </Col>
                  
                </Row>
              </TabPane>
              <TabPane tab="子单状态记录" key="2">
                {
                  subOrderList.map((item) => {
                    return (
                      <div key={item.id} style={{ marginBottom: '20px' }}>
                        <Table
                          bordered
                          loading={isGoodsLoading}
                          rowKey={record => record.id}
                          dataSource={item.goodsList}
                          columns={goodsColumns}
                          pagination={false}
                          title={() => {
                            return (
                              <Row>
                                <Row style={{ height: 40, lineHeight: '40px', fontSize: '25px', color: '#ff2c2f', marginBottom: 10 }}>{item.status}</Row>
                                <Row style={{ marginBottom: 10 }}>
                                  <span style={{ color: '#868686' }}>子单号：</span>
                                  <span style={{ color: '#1D9ED7' }}>{item.subOrderSn}</span>
                                </Row>
                                <Row>
                                  <span>收货人: {item.receiver}</span>
                                  <span style={{ marginLeft: 20 }}>手机号: {item.mobile}</span>
                                  <span style={{ marginLeft: 20 }}>收货地址: {item.address}</span>
                                  <Button style={{ float: 'right' }} onClick={this.handelShowSubOrderInfo.bind(this, item.id)}>导入物流信息</Button>
                                </Row>
                              </Row>
                            );
                          }}
                          footer={() => (
                            item.logisticsInfoList.map((logisticsInfo) => {
                              return (
                                <div key={logisticsInfo.id} style={{ marginTop: '10px', border: '1px solid #CCCCCC', height: '40px', lineHeight: '40px' }}>
                                  <span style={{ marginLeft: '20px' }}>物流公司: {logisticsInfo.logisticsCompany}</span>
                                  <span style={{ marginLeft: '20px' }}>物流单号: {logisticsInfo.logisticsSn}</span>
                                  <span style={{ marginLeft: '20px' }}>物流运费: {logisticsInfo.logisticsFare}</span>
                                  <Button
                                    style={{ float: 'right', marginTop: '3px', marginRight: '10px' }}
                                    onClick={this.handelShowSubOrderInfo.bind(this, item.id, logisticsInfo.id)}
                                  >
                                    修改
                                  </Button>
                                </div>
                              );
                            })
                          )}
                        />
                      </div>
                    );
                  })
                }
              </TabPane>
              <TabPane tab="付款信息" key="3">
                <Card style={{ backgroundColor: '#F2F2F2', marginBottom: 20 }}>
                  {/* <Row style={{ marginBottom: 20, height: 40, lineHeight: '40px' }}>
                    <span style={{ fontSize: '22px', color: '#666666', fontWeight: '600' }}>付款信息</span>
                  </Row> */}
                  <Row style={{ height: 40, lineHeight: '40px', fontSize: 20, color: '#666666' }}>
                    <span style={{ marginRight: 20 }}>供应商：{supplier}</span>
                    <span style={{ marginRight: 20 }}>采购单号：{purchaseSn}</span>
                    <span style={{ marginRight: 20 }}>采购员：{purchaser}</span>
                  </Row>
                  <Row style={{ height: 40, lineHeight: '40px', fontSize: 20, color: '#666666' }}>
                    <span style={{ marginRight: 20 }}>应付总额：<span style={{ color: '#FF001E' }}>{+purchaseAmount}</span></span>
                    <span style={{ marginRight: 20 }}>已付总额：<span>{+alreadyPay}</span></span>
                    <span style={{ marginRight: 20 }}>挂账抵扣金额：<span style={{ color: '#FF001E' }}>{+balanceBillAmount}</span></span>
                    <span style={{ marginRight: 20 }}>开票总额：<span style={{ color: '#FF001E' }}>{+outInvAmount}</span></span>
                  </Row>
                </Card>
                {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px', fontSize: '20px' }}>
                  <div style={{ display: 'inline-block' }}>
                    采购金额：<span>{+purchaseAmount}</span>
                  </div>
                  <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    已付款：<span>{+alreadyPay}</span>
                  </div>
                  <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    待确认：<span>{+awaitConfirm}</span>
                  </div>
                  <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    待支付：<span>{+awaitPay}</span>
                  </div>
                </Row> */}

                <Table
                  bordered
                  loading={isLoading}
                  rowKey={record => record.id}
                  dataSource={payList}
                  columns={payColumns}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </div>
          <Modal
            width={500}
            title="操作"
            visible={isShowActionConfirm}
            confirmLoading={isActioning}
            onOk={this.handleClickOkAction.bind(this, url)}
            onCancel={this.handleCancelActionConfirm.bind(this)}
          >
          {
            actionText.indexOf("审核") === -1?<div>
              <p style={{ textAlign: 'center' }}>{`请确认是否${actionText}订单`}</p>
              <Input.TextArea
                placeholder="此处添加备注信息"
                style={{ width: 400, marginLeft: 30 }}
                value={actionRemark || null}
                onChange={this.handleChangeActionRemark.bind(this)}
                autosize
              />
          </div>:isCheck?<p>该采购单中，部分商品条码信息正处于审核状态，若继续审核，该采购单将会沿用之前的数据，请确认是否继续审核？</p>:<p>请确认是否审核通过?</p>
          }
            
          </Modal>
          <Modal
            width={1200}
            visible={isShowSubOrderInfoConfirm}
            onOk={this.handleClickOkSubOrderInfoButton.bind(this)}
            okText="保存"
            confirmLoading={isSubOrderInfoLoading}
            onCancel={this.handleClickCancelSubOrderInfoButton.bind(this)}
          >
            {
              subOrderInfo ?
                <div>
                  <div style={{ height: '40px', lineHeight: '40px', fontSize: '25px', color: '#ff2c2f' }}>{subOrderInfo.status}</div>
                  <Row style={{ marginBottom: '10px', marginTop: '20px' }}><span style={{ color: '#868686' }}>子单号：</span><span style={{ color: '#1D9ED7' }}>{subOrderInfo.subOrderSn}</span></Row>
                  <Row style={{ marginBottom: '10px' }}>
                    <span>收货人: {subOrderInfo.receiver}</span>
                    <span style={{ marginLeft: '20px' }}>手机号: {subOrderInfo.mobile}</span>
                    <span style={{ marginLeft: '20px' }}>收货地址: {subOrderInfo.address}</span>
                  </Row>
                  <Table
                    bordered
                    loading={isGoodsLoading}
                    rowKey={record => record.id}
                    dataSource={subOrderInfo.goodsList}
                    columns={goodsChangeColumns}
                    pagination={false}
                  />
                  {
                    logisticsId ?
                      <div>
                        {
                          subOrderInfo.logisticsInfoList.map((logisticsInfo) => {
                            return (
                              logisticsInfo.id === logisticsId ?                                
                                <Row key={logisticsInfo.id} style={{ marginTop: 10 }}>                                  
                                  <span style={{ marginRight: 10 }}>物流公司: </span>
                                  <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsCompany.bind(this)} value={logisticsCompany} />
                                  <span style={{ marginRight: 10 }}>物流单号: </span>
                                  <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsSn.bind(this)} value={logisticsSn} />
                                  <span style={{ marginRight: 10 }}>物流运费: </span>
                                  <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsFare.bind(this)} value={logisticsFare} />
                                </Row>
                              :
                                null
                            );
                          })
                        }
                      </div>
                      :
                      <Row style={{ marginTop: 10 }}>
                        <Row style={{ marginBottom: 10 }}>
                          <span>选择子单号: </span>
                            <Select 
                              style={{ width: '150px' }} 
                              onSelect={this.handleChangeOrderSn}
                              value={orderSnMap[0]&&orderSnMap[0].id}
                            >
                              <Select.Option value="">全部</Select.Option>
                                {
                                  orderSnMap.map(item => (
                                    <Select.Option value={item.id}>{item.subOrderSn}</Select.Option>
                                  ))
                                }
                            </Select>
                            <span style={{marginLeft:10}}>选择物流单号: </span>
                            <Select 
                              style={{ width: '150px' }} 
                              onSelect={this.handleAddLogisticInfo}
                              value={followInfoDetail[logisticSnId]}
                            >
                                {
                                  Object.keys(followInfoDetail).map(key => (
                                      <Select.Option value={key}>{followInfoDetail[key]}</Select.Option>
                                  ))
                                }
                            </Select>
                        </Row>
                        <span style={{ marginRight: 10 }}>物流公司: </span>
                        <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsCompany.bind(this)} value={logisticsCompany} />
                        <span style={{ marginRight: 10 }}>物流单号: </span>
                        <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsSn.bind(this)} value={logisticsSn} />
                        <span style={{ marginRight: 10 }}>物流运费: </span>
                        <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeLogisticsFare.bind(this)} value={logisticsFare} />
                        {/* <span style={{ marginRight: 10 }}>卸货费: </span>
                        <Input style={{ width: 150, marginRight: 15 }} onChange={this.handleChangeUnloadFare.bind(this)} value={unloadFare} /> */}
                      </Row>
                  }
                </div>
              :
                null
            }
          </Modal>
          <Modal
            visible={isShowPayInfoConfirm}
            onCancel={this.handleClickOkPayInfoButtonbind.bind(this)}
            confirmLoading={isPayInfoLoading}
            closable={false}
          >
            <div style={{ height: '60px', lineHeight: '60px', backgroundColor: '#E5E5E5' }}>
              <span style={{ fontSize: '20px', fontWeight: '600', marginLeft: '25px' }}>采购订单付款详情</span>
            </div>
            <div style={{ marginTop: '10px', height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', fontSize: '16px', color: '#959595' }}>采购单号: {purchaseSn}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>支付方式: {payInfo.payMethod}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>付款金额: {payInfo.payAmount}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>对方账户: {payInfo.receivableAccount}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>付款时间: {payInfo.time}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>结算备注: {payInfo.remark}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px', marginTop: '25px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>流水号: {payInfo.paySn}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>采购员: {payInfo.purchaser}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>审核员: {payInfo.auditor}</span>
            </div>
          </Modal>
          <Modal
          visible={isShowNoticeModal}
          title="提示"
          footer={null}
          onCancel={this.handleCloseNoticeBoard}
          >
            <p>{noticeText}</p>
            <p>
               关联销售售后单号
              {
                noticeOrderList.map(item=>{
                  return <span style={{display:'inline-block',marginRight:10}}><Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${item.orderId}`} style={{marginRight:6}}>{item.backOrderSn}</Link></span>
                })
              }
            </p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
