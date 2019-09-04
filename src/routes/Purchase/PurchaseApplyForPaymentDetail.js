import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import {
  Row,
  Col,
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
  Select,
  DatePicker,
  Collapse,
  Tooltip,
  Alert,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseApplyForPaymentDetail.less';
import globalStyles from '../../assets/style/global.less';
import RedBox from 'redbox-react';
import img from '../../assets/u2741.png';
const { TabPane } = Tabs;
const { Option } = Select;

@connect(state => ({
  purchaseApplyForPaymentDetail: state.purchaseApplyForPaymentDetail,
}))
export default class PurchaseApplyForPaymentDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/getOrderDetail',
      payload: {
        id,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/unmount',
    });
  }

  // tabs 3 --- start ----------------------
  // 点击详情按钮展示弹窗
  handelShowPayInfo(id) {
    const { dispatch, purchaseApplyForPaymentDetail } = this.props;
    const { payInfo } = purchaseApplyForPaymentDetail;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/showPayInfoConfirm',
      payload: {
        id,
        payInfo,
      },
    });
  }
  // 点击作废显示弹窗
  handelDeletePayInfo=(deleteId,type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/changReducer',
      payload:{
        deleteId,
        type,
        isShowDeleteModal:true,
      }
    });
  }
  // 确认作废
  handleConfirmDelete=()=>{
    const { dispatch, purchaseApplyForPaymentDetail } = this.props;
    const { deleteId, type } = purchaseApplyForPaymentDetail;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/confirmDelete',
      payload:{
        deleteId,
        type,
        id:this.props.match.params.id,
        isShowDeleteModal:false,
      }
    });
  }
  // 取消
  handleCancelDelete=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/changReducer',
      payload:{
        isShowDeleteModal:false,
      }
    });
  }
  // 确认弹窗按钮
  handleClickOkPayInfoButtonbind() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/clickOkPayInfoButto',
    });
  }
  // 打开添加付款凭证弹窗
  handleTriggerGenConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/triggerGenConfirm',
    });
  }
  handleChange(key, value) {
    const { dispatch } = this.props;
    const { payInfo } = this.props.purchaseApplyForPaymentDetail;
    if (key === 'payAmount') {
      if (+payInfo.awaitPay < +value.target.value) {
        message.error('付款金额不可大于代付金额!', 0.5);
        return;
      }
    }
    if (typeof value === 'object') {
      dispatch({
        type: 'purchaseApplyForPaymentDetail/change',
        payload: {
          [key]: value.target.value,
        },
      });
    } else {
      dispatch({
        type: 'purchaseApplyForPaymentDetail/change',
        payload: {
          [key]: value,
        },
      });
    }
  }
  handleChangeTime(key, _, dateString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/change',
      payload: {
        [key]: dateString,
      },
    });
  }
  handleClickOkGen() {
    const { dispatch } = this.props;
    const {
      purchaseApplyForPaymentDetail: {
        payMethod,
        payId,
        checkType,
        amount,
        payAmount,
        payTime,
        transactionSn,
        backTime,
        remark,
        collectAccount,
      },
    } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/clickOkGenConfirm',
      payload: {
        totalOrderId: this.props.match.params.id,
        payMethod,
        payId,
        checkType,
        amount,
        payAmount,
        payTime,
        transactionSn,
        backTime,
        remark,
        collectAccount,
      },
    });
  }

  // 点击action弹窗
  handleClickActionPopUP(url, actionText, backUrl) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/clickActionPopUp',
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
      type: 'purchaseApplyForPaymentDetail/cancelActionConfirm',
    });
  }
  // 修改action备注
  handleChangeActionRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/changeActionRemark',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 确定action弹窗提交action
  handleClickOkAction(url) {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'purchaseApplyForPaymentDetail/clickOkAction',
      payload: {
        id,
        url,
      },
    });
  }

  render() {
    const {
      purchaseApplyForPaymentDetail: {
        pageId,
        isLoading,
        // 付款信息
        payInfo,
        payItems,
        // 详情信息
        detail,
        // 子单
        purchaseOrderList,
        transactionSn,
        isShowPayInfoConfirm,
        isShowGenConfirm,
        isGening,
        payMethod,
        collectAccountMap,
        purchaseAmount,
        collectAccount,
        payAmount,
        payMethodMap,
        // actionList
        actionList,
        isShowActionConfirm,
        isActioning,
        actionRemark,
        actionText,
        isNeedRemark,
        url,
        payableTotalAmount,
        receivableTotalAmount,
        receivableTotal,
        isSale,
        isCredit,
        isShowDeleteModal,
        isAllCash,
        isAllDirect,
        isAllAgency,
      },
    } = this.props;
    const isCheck = detail.goodsList.some(item=>!item.isCheck);
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
        dataIndex: 'amountType',
        key: 'amountType',
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
        title: '付款账户',
        dataIndex: 'receivableAccount',
        key: 'receivableAccount',
        width:600,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
                    <Icon type="bars" /> 
                      详情
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={this.handelDeletePayInfo.bind(this, record.id,record.payMethod)}>
                    <Icon type="delete" />
                      作废
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
    const goodsThumb = {
      title: '商品图',
      dataIndex: 'goodsThumb',
      key: 'goodsThumb',
      width: 90,
      fixed: 'left',
      render: (src, record) => (
        <img src={src} style={{ width: 55, height: 55 }} />
      ),
    };
    const expectPayTimeCol = {
      title: '预计付款时间',
      dataIndex: 'expectPayTime',
      key: 'expectPayTime',
      width:110,
    };
    const goodsSn = {
      title: '商品条码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
      width: 140,
    };
    const goodsName =  {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 300,
    };
   
    const purchaseNum = {
      title: '采购数',
      dataIndex: 'purchaseNum',
      key: 'purchaseNum',
      width:150,
      render: (purchaseNum) => {
        return <span>{purchaseNum}</span>;
      },
    };
    const salePrice = {
      title: '销售价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width:100,
      render: (salePrice) => {
        return <span>{salePrice}</span>;
      },
    };
    const salePriceInfo = {
      title: '零售价/平台单价/折扣',
      dataIndex: 'salePriceInfo',
      key: 'salePriceInfo',
      width:200,
      render: (_, record) => {
        return <p><span style={{ color: '#cc0000' }}>{record.retailPrice}</span>/<span style={{ color: '#FF6633' }}>{record.platformUnitPrice}</span>/<span style={{ color: '#009dda' }}>{record.saleDiscount}</span></p>;
      },
    };
    const saleSubtotal ={
      title: '销售合计',
      dataIndex: 'saleSubtotal',
      key: 'saleSubtotal',
      width:100,
      render: (saleSubtotal) => {
        return <span>{saleSubtotal}</span>;
      },
    };
    const purchaseIsTax = {
      title: '采购含税',
      dataIndex: 'purchaseIsTax',
      key: 'purchaseIsTax',
      width:100,
      render: (purchaseIsTax) => {
        return <span>{purchaseIsTax ? '是' : '否'}</span>;
      },
    };
    const snPolicy = {
      title: '条码政策',
      key: 'snPolicy',
      dataIndex: 'snPolicy',
      width:100,
      render: (snPolicy) => {
        return <Tooltip title={snPolicy}>
            {
              snPolicy?(<img style={{width:40,height:40}}
                src={img}></img>):null
            }    
        </Tooltip>
      },
    };
    const subPurchaseIsTax = {
      title: '销售含税',
      dataIndex: 'purchaseIsTax',
      key: 'purchaseIsTax',
      width:100,
      render: (purchaseIsTax) => {
        return <span>{purchaseIsTax ? '是' : '否'}</span>;
      },
    };
    const purchasePriceInfo = {
      title: '采购单价/折扣',
      dataIndex: 'purchasePriceInfo',
      key: 'purchasePriceInfo',
      width:150,
      render: (_, record) => {
        return <p><span style={{ color: '#FF6633' }}>{record.purchasePrice}</span>/<span style={{ color: '#009DDA' }}>{record.purchaseDiscount}</span></p>;
      },
    };
    const rebatPrice = {
      title: '返利后进价',
      dataIndex: 'rebatPrice',
      key: 'rebatPrice',
      width:150,
    };
    const subtotal = {
      title: '采购小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width:100,
      render: (subtotal) => {
        return subtotal;
      },
    };
    const rate = {
      title: '毛利率',
      dataIndex: 'rate',
      key: 'rate',
      width:100,
    };
    const profit = {
      title: '利润额/率',
      dataIndex: 'profit',
      key: 'profit',
      width:100,
      render:(profit,record)=>{
        return <span style={{color:"red"}}>{`${profit}/`}<span style={{color:"green"}}>{record.profitRate}</span></span>

      }
    };
    const shippingDesc = {
        title: '客户运费政策',
        dataIndex: 'shippingDesc',
        key: 'shippingDesc',
        width:100,
        render: (shippingDesc) => {
          return <span>{shippingDesc}</span>;
        },
    };
    const saleIsTax =  {
        title: '销售含税',
        dataIndex: 'saleIsTax',
        key: 'saleIsTax',
        width:100,
        render: (saleIsTax) => {
          return <span>{saleIsTax ? '是' : '否'}</span>;
        },
    };
    const awaitNumSale = {
        title: '待出库',
        dataIndex: 'awaitNum',
        key: 'awaitNum',
        width:100,
        render: (awaitNum) => {
          return <span style={{ color: '#FF348D' }}>{awaitNum}</span>;
        },
      };
      const sentNumSale =  {
        title: '已出库',
        dataIndex: 'sentNum',
        key: 'sentNum',
        width:100,
        render: (sentNum) => {
          return <span style={{ color: '#308000' }}>{sentNum}</span>;
        },
      };
      const awaitNum = {
        title: '待入库数量',
        dataIndex: 'awaitNum',
        key: 'awaitNum',
        width:100,
        render: (awaitNum) => {
          return <span style={{ color: '#FF348D' }}>{awaitNum}</span>;
        },
      };
      const sentNum =  {
        title: '已入库数量',
        dataIndex: 'sentNum',
        key: 'sentNum',
        width:100,
        render: (sentNum) => {
          return <span style={{ color: '#308000' }}>{sentNum}</span>;
        },
      };
      const remark = {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (remark) => {
          return (
            <Tooltip title={remark}>
              <span className={globalStyles['ellipsis-col']}>{remark}</span>
            </Tooltip>
          );
        },
      };
      const purchaseOrderId = {
        title: '采购单号',
        dataIndex: 'purchaseOrderId',
        key: 'purchaseOrderId',
        width:100,
        render:(purchaseOrderId,record)=>{
          const url = +record.purchaseType===0?`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderId}`:`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderId}`
          return <Link to={url}>{purchaseOrderId}</Link>
        }
      };
      const purchaseTime = {
        title: '采购时间',
        dataIndex: 'purchaseTime',
        key: 'purchaseTime',
        width:110,
      };
      const consignee = {
        title: '收件人',
        dataIndex: 'consignee',
        key: 'consignee',
        width:100,
      };
      const orderSn = {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        width:100,
      };
      const purchaseType = {
        title: '采购单类型',
        dataIndex: 'purchaseTypeName',
        key: 'purchaseTypeName',
        width:100,
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
      const appliedNum = {
          title: '本期结算数量',
          dataIndex: 'appliedNum',
          key: 'appliedNum',
          width:100,
          render: (appliedNum,record) => {
            return <Tooltip 
            title={<div>{record.appliedNumRemark&&record.appliedNumRemark.map(item => (<div>{item}</div>))}</div>}
            >
              <span style={{color:record.appliedNumColor&&record.appliedNumColor[0]}}>{appliedNum}</span>
            </Tooltip>
          },
      };
      const appliedAmount =  {
          title: '本期结算金额',
          dataIndex: 'appliedAmount',
          key: 'appliedAmount',
          width:100,
          render: (appliedAmount,record) => {
            return <Tooltip 
            title={<div>{record.appliedAmountRemark&&record.appliedAmountRemark.map(item => (<div>{item}</div>))}</div>}
            >
              <span style={{color:record.appliedAmountColor&&record.appliedAmountColor[0]}}>{appliedAmount}</span>
            </Tooltip>
          },
      };
      const lastPayTime = {
        title: '上期结算时间',
        dataIndex: 'lastPayTime',
        key: 'lastPayTime',
        width:100,
      };
      const payCondition =  {
        title: '账期条件',
        dataIndex: 'payCondition',
        key: 'payCondition',
        width:100,
      };
      const payMentMethod =  {
        title: '结算方式',
        dataIndex: 'payMethod',
        key: 'payMethod',
        width:100,
      };
    const detailColumns = [
      goodsThumb,
      goodsSn,
      goodsName,
      purchaseNum,
      salePrice,
      salePriceInfo,
      profit,
      saleSubtotal,
      shippingDesc,
      saleIsTax,
      payMentMethod,
      snPolicy,
      purchaseIsTax,
      purchasePriceInfo,
      rebatPrice,
      subtotal,
      rate,
      awaitNumSale,
      sentNumSale,
      remark,

    ];
    const conventionalColumns = [
      goodsThumb,
      goodsSn,
      goodsName,
      purchaseNum,
      salePriceInfo,
      profit,
      purchaseIsTax,
      payMentMethod,
      snPolicy,
      purchasePriceInfo,
      rebatPrice,
      subtotal,
      awaitNum,
      sentNum,
      remark,
    ];
    const billColumns = [
      goodsSn,
      goodsName,
      expectPayTimeCol,
      purchaseOrderId,
      salePrice,
      salePriceInfo,
      profit,
      saleNum,
      purchasePriceInfo,
      rate,
      purchaseIsTax,
      payMentMethod,
      snPolicy,
      appliedNum,
      appliedAmount,
      lastPayTime,
      purchaseTime,
      payMentMethod,
      consignee,
      orderSn,
      purchaseType,
      remark,
    ];
    // 暂时使用后端的 {+payInfo.purchaseAmount}
    // const totalSubtotal = detail.goodsList.reduce((pre, next) => {
    //   const num1 = +next.price;
    //   const num2 = +next.num;
    //   let a1 = 0;
    //   let a2 = 0;
    //   let m = 0;
    //   if (+num1 % 1 !== 0) {
    //     a1 = (num1.toString()).split('.')[1].length;
    //   }
    //   if (+num2 % 1 !== 0) {
    //     a2 = (num2.toString()).split('.')[1].length;
    //   }
    //   m = 10 ** Math.max(a1, a2);
    //   return +pre + (((+num1 * m) * (+num2 * m)) / (m * m));
    // }, 0);
    const num = {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
    };
    const calNum = {
      title: '结算数量',
      dataIndex: 'appliedNum',
      key: 'appliedNum',
    };
    const unit = {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      };
    const remarks = {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      width:200,
    };
    const subOrderGoodsColumns = [
      goodsThumb,
      goodsName,
      goodsSn,
      num,
      subPurchaseIsTax,
      unit,
      remarks,
    ];
    const creditGoodsColumns = [
      goodsThumb,
      goodsName,
      goodsSn,
      num,
      calNum,
      subPurchaseIsTax,
      unit,
      remarks,
    ]
    return (
      <PageHeaderLayout title="采购申请货款详情" className={styles.addPageHeader}>
        <Card bordered={false} loading={isLoading}>
          <div className={styles.tableList}>
            <Tabs
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
                            style={{ marginLeft: '15px' }}
                            onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                          >
                            {actionInfo.name}
                          </Button>
                        );
                    }
                  }) :
                  null
              }
            >
              <TabPane tab="采购单详情" key="1">
                {
                  isCheck?<Row style={{marginBottom:10}}>
                  <Alert
                    message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，该采购单依然沿用之前的数据。"
                    type="warning"
                    />
                </Row>:""
                }
                {
                  detail.payType == 0&&!isAllCash || detail.payType == 2&&!isAllDirect || detail.payType == 4&&!isAllAgency?
                  <Row style={{marginBottom:10}}>
                  <Alert
                    message="当前采购单支付类型与部分条码的结算方式不匹配，请谨慎审核！"
                    type="warning"
                    />
                  </Row>:""
                }
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  <span style={{ marginRight: 40, fontSize: 20, color: '#FC403B' }}>{detail.status}</span>
                  <span style={{ marginRight: 40 }}>供应商:{detail.supplier}</span>
                  <span style={{ marginRight: 40 }}>采购员:{detail.purchaser}</span>
                  <span style={{ marginRight: 40 }}>创建时间:{detail.time}</span>
                  {
                    isCredit?<span style={{ marginRight: 40 }}>所选销售周期:{}</span>:''
                  }
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  采购单号:{
                    isSale?<Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${detail.purchaseOrderSn}`}>{detail.purchaseOrderSn}</Link>:
                    <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${detail.purchaseOrderSn}`}>{detail.purchaseOrderSn}</Link>
                  }
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  关联子订单:{detail.subOrderSnStr}
                </Row>
                <Table
                  bordered
                  dataSource={detail.goodsList}
                  columns={isCredit?billColumns:(isSale ? detailColumns : conventionalColumns)}
                  className={globalStyles.tablestyle}
                  pagination={false}
                  scroll={{ x: isCredit?2500:2000 }}
                  rowKey={record => record.id}
                  footer={() => (
                    [
                      <Row type="flex" justify="end" align="left">
                        <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>采购总额: <span style={{  fontWeight: '600' }}>{(+payInfo.purchaseAmount).toFixed(2)}</span></div>
                      </Row>,
                      <Row type="flex" justify="end" align="left">
                       <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>挂账抵扣: <span style={{ fontWeight: '600' }}>{+payInfo.balanceBillAmount}</span></div>
                      </Row>, 
                      isCredit?<div>
                        <Row type="flex" justify="end" align="left">
                          <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>抵扣金额是否开票: <span style={{ fontWeight: '600' }}>{(+payInfo.totalPurchaseAmount).toFixed(2)}</span></div>
                        </Row>
                        <Row type="flex" justify="end" align="left">
                          <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>抵扣金额需开票金额: <span style={{  fontWeight: '600' }}>{(+payInfo.totalPurchaseAmount).toFixed(2)}</span></div>
                        </Row>
                      </div>:'',
                      <Row type="flex" justify="end" align="left">
                      <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>开票总金额: <span style={{ fontWeight: '600' }}>{(+payInfo.totalPurchaseAmount).toFixed(2)}</span></div>
                     </Row>,

                      <Row type="flex" justify="end" align="left">
                       <div style={{fontSize:18, fontWeight: '600', width: 250, textAlign:'left'}}>采购应付总额: <span style={{ color: '#FF3333', fontWeight: '600' }}>{(+payInfo.totalPurchaseAmount).toFixed(2)}</span></div>
                      </Row>,
                      <Row>
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>财务备注</span> {detail.financeRemark}
                      </Row>,
                    //   <Row>
                    //   <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>付款信息</span> {detail.bankInfo}
                      
                    // </Row>,
                      <Row>
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>支付类型</span> {payMethodMap[detail.payType]}
                      </Row>,
                      <Row type="flex">
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>采购制单备注</span>
                        <div style={{ display: 'inline-block' }}>
                          {
                            detail.noteList&&detail.noteList.length > 0 ?
                              detail.noteList.map((item) => {
                                return <pre>{item}</pre>;
                              })
                            :
                              null
                          }
                        </div>
                      </Row>,
                    ]
                  )}
                />
              </TabPane>
              <TabPane tab="子单状态信息" key="2">
                {/* <Row style={{ marginBottom: 20, fontSize: 20, color: '#FC403B' }}>{detail.status}</Row> */}
                <Collapse defaultActiveKey={['0']}>
                  {purchaseOrderList.map((purchaseOrder, index) => (
                    purchaseOrder.isCommon
                      ? (
                        // <Collapse.Panel header={`采购单号: ${purchaseOrder.sn}  时间:${purchaseOrder.time}  状态:${purchaseOrder.status} 预计发货时间:` }  key={index}>
                         <Collapse.Panel header={<p style={{margin:0}}>采购单号:<span className={styles['title']}>{purchaseOrder.sn}</span>
                              时间: <span className={styles['title']}>{purchaseOrder.time}</span>
                              状态: <span className={styles['title']}>{purchaseOrder.status}</span>
                              预计发货时间: <span className={styles['title']}>{purchaseOrder.expectShippingDate}</span>
                         </p>}  key={index}>
                          <Table
                            bordered
                            rowKey={record => record.id}
                            dataSource={purchaseOrder.goodsList}
                            columns={isCredit?creditGoodsColumns:subOrderGoodsColumns}
                            pagination={false}
                            title={() => (
                              [
                                <Row>
                                  <span>收货人: {purchaseOrder.receiver}</span>
                                  <span style={{ marginLeft: 20 }}>手机号: {purchaseOrder.mobile}</span>
                                  <span style={{ marginLeft: 20 }}>收货地址: {purchaseOrder.address}</span>
                                </Row>,
                              ]
                            )}
                          />
                        </Collapse.Panel>
                      ) : (
                        <Collapse.Panel header={<p style={{margin:0}}>采购单号:<span className={styles['title']}>{purchaseOrder.sn}</span>
                        时间: <span className={styles['title']}>{purchaseOrder.time}</span>
                        预计发货时间: <span className={styles['title']}>{purchaseOrder.expectShippingDate}</span>
                      </p>}  key={index}>
                          {
                            purchaseOrder.subOrderList&&purchaseOrder.subOrderList.map(subOrder => (
                              <Table
                                bordered
                                style={{ marginBottom: 25 }}
                                rowKey={record => record.id}
                                dataSource={subOrder.goodsList}
                                className={globalStyles.tablestyle}
                                columns={isCredit?creditGoodsColumns:subOrderGoodsColumns}
                                pagination={false}
                                title={() => (
                                  [
                                    <Row>
                                      子单号: {subOrder.subOrderSn}
                                    </Row>,
                                    <Row>
                                      <span>收货人: {subOrder.receiver}</span>
                                      <span style={{ marginLeft: 20 }}>手机号: {subOrder.mobile}</span>
                                      <span style={{ marginLeft: 20 }}>收货地址: {subOrder.address}</span>
                                    </Row>,
                                  ]
                                )}
                              />
                            ))
                          }
                        </Collapse.Panel>
                      )
                  ))}
                </Collapse>
              </TabPane>
              <TabPane tab="付款信息" key="3">
                <div style={{ backgroundColor: '#F2F2F2', marginBottom: '20px' }}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px', fontSize: '16px', color: '#666666' }}>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      采购单号：<span>{payInfo.purchaseSn}</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      供应商：<span>{payInfo.supplier}</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      采购员：<span>{payInfo.purchaser}</span>
                    </div>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px', fontSize: '16px' }}>
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                      应付货款：<span style={{ fontWeight: '600' }}>{payInfo.payable}</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '6px' }}>
                      应付运费：<span style={{ fontWeight: '600' }}>{payInfo.shippingFee}(线下报销)</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '6px' }}>
                      应付卸货费：<span style={{ fontWeight: '600' }}>{payInfo.unloadFare}(线下报销)</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '6px' }}>
                      应付总额: <span style={{ fontWeight: '600', color: '#FF0E4C' }}>{payInfo.payAmount }</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '6px' }}>
                      已付总额：<span style={{ fontWeight: '600', color: '#FF0E4C' }}>{payInfo.alreadyPay}</span>
                    </div>
                    {
                      isCredit?null:(<div style={{ display: 'inline-block', marginLeft: '6px' }}>
                      挂账抵扣金额：<span style={{ fontWeight: '600', color: '#FF0E4C' }}>{payInfo.balanceBillAmount}</span>
                    </div>)
                    }
                    
                  </Row>
                  <Button onClick={this.handleTriggerGenConfirm.bind(this)} type="primary" style={{ display: 'inline-block', position: 'absolute', top: 120, right: 20 }}>添加付款凭证</Button>
                </div>

                <Table
                  bordered
                  loading={isLoading}
                  columns={payColumns}
                  className={globalStyles.tablestyle}
                  rowKey={record => record.id}
                  dataSource={payInfo.payList}
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
            </div>:isCheck?<p>该采购单中，部分商品条码信息正处于审核状态，若继续审核，该采购单将会沿用之前的数据，请确认是否继续审核？</p>:<p style={{ textAlign: 'center' }}>请确认是否审核通过？</p>
          }
          </Modal>
          <Modal
            width={1000}
            visible={isShowPayInfoConfirm}
            onCancel={this.handleClickOkPayInfoButtonbind.bind(this)}
            closable={false}
            footer={null}
          >
            <div style={{ height: '60px', lineHeight: '60px', backgroundColor: '#E5E5E5' }}>
              <span style={{ fontSize: '20px', fontWeight: '600', marginLeft: '25px' }}>采购订单付款详情</span>
            </div>
            <div style={{ marginTop: '10px', height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', fontSize: '16px', color: '#959595' }}>采购单号: {payInfo.purchaseSn}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>支付方式: {payItems.payMethod}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>付款金额: {payItems.payAmount}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>对方账户: {payItems.receivableAccount}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>付款时间: {payItems.time}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>结算备注: {payItems.remark}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px', marginTop: '25px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>流水号: {payItems.paySn}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>采购员: {payItems.purchaser}</span>
            </div>
          </Modal>
          <Modal
          title="作废"
          visible={isShowDeleteModal}
          onOk={this.handleConfirmDelete}
          onCancel={this.handleCancelDelete}
          >
          <p style={{textAlign:"center"}}>
            请确认是否作废
          </p>
          </Modal>
          <Modal
            width={800}
            title="添加收款凭证"
            visible={isShowGenConfirm}
            confirmLoading={isGening}
            onOk={this.handleClickOkGen.bind(this)}
            onCancel={this.handleTriggerGenConfirm.bind(this)}
          >
            <Card
              style={{ backgroundColor: '#FFFFF6' }}
              bodyStyle={{ padding: 10 }}
              bordered={false}
            >
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#F77576' }}>待支付: {payInfo.awaitPay}</span>
              <span style={{ margin: '0 10px', fontSize: 18, fontWeight: 'bold', color: '#333333' }}>订单金额: {+payInfo.totalPurchaseAmount}</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333333' }}>已支付: {payInfo.alreadyPay}</span>
              <span style={{ margin: '0 10px', fontSize: 18, fontWeight: 'bold', color: '#333333' }}>付款方式: &nbsp;
                {
                  payMethod === 0 && '现付现结'
                }
                {
                  payMethod === 1 && '挂账对冲'
                }
                {
                  payMethod === 2 && '账期支付'
                }
                {
                  payMethod !== 0 && payMethod !== 1 && payMethod !== 2 && '无'
                }
              </span>
            </Card>
            <Card
              style={{ backgroundColor: '#F2F2F2' }}
              bodyStyle={{ padding: 10 }}
              bordered={false}
            >
              <span style={{ fontSize: 20 }}>供应商资金明细 : </span>
              <span style={{ margin: '0 10px', color: '#949494' }}>挂账应收总金额 :</span>
              <span style={{ margin: '0 10px', color: 'green' }}>{receivableTotalAmount.toLocaleString()}</span>
              <span style={{ margin: '0 10px', color: '#949494' }}>账期应付总金额 :</span>
              <span style={{ margin: '0 10px', color: 'red' }}>{payableTotalAmount.toLocaleString()}</span>
              <span style={{ margin: '0 10px', color: '#949494' }}>总应收额 :</span>
              <span style={{ margin: '0 10px', color: 'orange' }}>{receivableTotal.toLocaleString()}</span>
            </Card>
            <Row gutter={{ md: 24 }}>
              <Col md={12}>
                <Row style={{ margin: '8px 0' }}>
                  <span>支付方式:</span>
                  <Select value={isCredit?2:payMethod} 
                  onChange={this.handleChange.bind(this, 'payMethod')} 
                  style={{ width: 200, margin: '0 12px' }} 
                  dropdownMatchSelectWidth={false}
                  disabled={isCredit} 
                  >
                    <Option key={-1} value={-1}>请选择支付方式</Option>
                    <Option key={0} value={0}>现付现结</Option>
                    <Option key={1} value={1}>挂账对冲</Option>
                    <Option key={2} value={2}>账期支付</Option>
                  </Select>
                </Row>
                {
                  payMethod === 0 && (
                    [
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款账户:</span>
                        <Select onChange={this.handleChange.bind(this, 'collectAccount')} 
                        value={collectAccount} 
                        style={{ width: 200, margin: '0 12px' }}
                        dropdownMatchSelectWidth={false}
                        >
                          <Option key={-1} value={-1}>请选择收款账户</Option>
                          {collectAccountMap.map((item) => {
                            return <Option value={item.id} key={item.id}>{item.accountInfo}</Option>;
                          })}
                        </Select>
                      </Row>,
                      <Row style={{ margin: '8px 0' }}>
                        <span>银行流水:</span>
                        <Input value={transactionSn} onChange={this.handleChange.bind(this, 'transactionSn')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款金额:</span>
                        <Input value={payAmount} onChange={this.handleChange.bind(this, 'payAmount')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                    ]
                  )
                }
                {
                  isCredit && (
                    [
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款账户:</span>
                        <Select onChange={this.handleChange.bind(this, 'collectAccount')} value={collectAccount} style={{ width: 115, margin: '0 12px' }}>
                          <Option key={-1} value={-1}>请选择收款账户</Option>
                          {collectAccountMap.map((item) => {
                            return <Option value={item.id} key={item.id}>{item.accountInfo}</Option>;
                          })}
                        </Select>
                      </Row>,
                      <Row style={{ margin: '8px 0' }}>
                        <span>银行流水:</span>
                        <Input value={transactionSn} onChange={this.handleChange.bind(this, 'transactionSn')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                    ]
                  )
                }
                {
                  payMethod !== 0 && (
                    [
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款金额:</span>
                        <Input value={payAmount} onChange={this.handleChange.bind(this, 'payAmount')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                      payMethod === 2 &&
                      <Row style={{ margin: '8px 0' }}>
                        <span>预期回款时间: </span>
                        <DatePicker format="YYYY-MM-DD" onChange={this.handleChangeTime.bind(this, 'backTime')} style={{ width: 230, margin: '0 12px' }} />
                      </Row>,
                    ]
                  )
                }
              </Col>
              <Col md={12}>
                <Row style={{ margin: '8px 0' }}>
                  <span style={{ verticalAlign: 'top' }}>备注: </span>
                  <Input.TextArea onChange={this.handleChange.bind(this, 'remark')} style={{ width: 320 }} />
                </Row>
              </Col>
            </Row>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
