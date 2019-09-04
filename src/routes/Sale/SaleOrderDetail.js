import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Input, Select, Modal, Table, Button, message, DatePicker, Dropdown, Menu, Icon, Tabs, Popconfirm, Collapse, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SaleOrderDetail.less';
import { reqGetOrderInfo } from '../../services/noDirectSendOrderList';
import { stringify } from 'qs';
import globalStyles from '../../assets/style/global.less';
const { Option } = Select;


@connect(state => ({
  saleOrderDetail: state.saleOrderDetail,
}))
export default class SaleOrderDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collectionId: null,
      isShowCollectionDetail: false,
      isShowOperaRecord: false,
    };
  }
  componentDidMount() {
    if (this.props.location.query !== undefined) {
      const { status } = this.props.location.query;
      const tabStatus = (status && status === 'subNo') ? '2' : '1';
      this.props.dispatch({
        type: 'saleOrderDetail/didMount',
        payload: {
          id: this.props.match.params.id,
          tabStatus,
        },
      });
    } else {
      this.props.dispatch({
        type: 'saleOrderDetail/didMount',
        payload: {
          id: this.props.match.params.id,
        },
      });
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'saleOrderDetail/unmount',
    });
  }
  handleChange(key, value) {
    const { dispatch } = this.props;
    const { deliveryTime } = this.props.saleOrderDetail.totalOrder;
    if (key === 'payMethod' && +value === 1) {
      dispatch({
        type: 'saleOrderDetail/change',
        payload: {
          backTime: deliveryTime,
        },
      });
    }
    if (typeof value === 'object') {
      dispatch({
        type: 'saleOrderDetail/change',
        payload: {
          [key]: value.target.value,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderDetail/change',
        payload: {
          [key]: value,
        },
      });
    }
  }
  handleChangeTime(key, _, dateString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/change',
      payload: {
        [key]: dateString,
      },
    });
  }
  handleClickOkGen() {
    const { dispatch } = this.props;
    const {
      saleOrderDetail: {
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
      type: 'saleOrderDetail/clickOkGenConfirm',
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
  handleTriggerGenConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/triggerGenConfirm',
    });
  }
  handleClickOkDelete() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'saleOrderDetail/clickOkDeleteConfirmButton',
      payload: {
        id,
        totalOrderId: id,
      },
    });
  }
  handleClickOkObsolete() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'saleOrderDetail/clickOkObsoleteConfirmButton',
      payload: {
        id,
        totalOrderId: id,
      },
    });
  }
  handleTriggerDetail(id, e) {
    this.setState({
      collectionId: id,
      isShowCollectionDetail: !this.state.isShowCollectionDetail,
    });
  }
  handleTriggerObsoleteCollection(id, type) {
    const { dispatch } = this.props;
    // this.setState({
    //   collectionId: id,
    //   collectionType: type,
    //   // collectionPayAmount: amount,
    // });
    dispatch({
      type: 'saleOrderDetail/triggerObsoleteCollection',
      payload: {
        collectionId: id,
        collectionType: type,
      },
    });
  }
  handleTriggerDeleteCollection(id, type) {
    const { dispatch } = this.props;
    // this.setState({
    //   collectionId: id,
    //   collectionType: type,
    //   // collectionPayAmount: amount,
    // });
    dispatch({
      type: 'saleOrderDetail/triggerDeleteCollection',
      payload: {
        collectionId: id,
        collectionType: type,
      },
    });
  }
  handleClickOkDeleteCollection() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/clickOkDeleteCollection',
      payload: {
        id: this.props.saleOrderDetail.collectionId,
        type: this.props.saleOrderDetail.collectionType,
        // payAmount: this.state.collectionPayAmount,
        totalOrderId: this.props.match.params.id,
      },
    });
  }
  handleClickOkObsoleteCollection() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/clickOkObsoleteCollection',
      payload: {
        id: this.props.saleOrderDetail.collectionId,
        type: this.props.saleOrderDetail.collectionType,
        totalOrderId: this.props.match.params.id,
      },
    });
  }
  handleClickOkCheck() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'saleOrderDetail/clickOkCheckConfirmButton',
      payload: {
        id,
        checkType: this.state.checkType,
        totalOrderId: id,
      },
    });
  }

  handleClickOkReject() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'saleOrderDetail/clickOkRejectConfirmButton',
      payload: {
        id,
        checkType: this.state.checkType,
        totalOrderId: id,
      },
    });
  }
  handleChangeRejectRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/changeRejectRemark',
      payload: {
        rejectRemark: e.target.value,
      },
    });
  }
  triggerConfirm(e) {
    const { dispatch } = this.props;
    const { id, name } = e.target;
    const key = `isShow${id}Confirm`;
    if (id) {
      this.setState({
        checkType: name,
      });
      dispatch({
        type: 'saleOrderDetail/clickTriggerConfirmButton',
        payload: {
          key,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderDetail/clickTriggerConfirmButton',
      });
    }
  }
  handleTriggerOperaRecord(e) {
    this.setState({
      isShowOperaRecord: !this.state.isShowOperaRecord,
    });
  }
  handleClickChangeLogistics(subOrderId, fareInfo) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/clickChangeLogistics',
      payload: {
        subOrderId,
        fareInfo,
      },
    });
  }
  handleCancelReject(subOrderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/handleRePush',
      payload: {
        orderId: subOrderId,
        isShowRePushModel: true,
      },
    });
  }
  handleOkChangeLogistics() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'saleOrderDetail/okChangeLogistics',
      payload: {
        id,
      },
    });
  }

  handleTriggerEditSubOrderRemarkModal(subOrderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/triggerEditSubOrderRemarkModal',
      payload: {
        selectedSubOrderId: subOrderId,
      },
    });
  }
  handleOkEditSubOrderRemarkModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/okEditSubOrderRemarkModal',
    });
  }
  handleChangeSubOrderRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/changeSubOrderRemark',
      payload: {
        subOrderRemark: e.target.value,
      },
    });
  }

  // 修改activeKey的值
  handleChangeActiveKey(activeKey) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/changeActiveKey',
      payload: {
        tabStatus: activeKey,
      },
    });
  }
  handleTriggerDelay(id, isDelay) {
    const { dispatch } = this.props;
    if (+isDelay) {
      dispatch({
        type: 'saleOrderDetail/cancelDelay',
        payload: {
          orderId: id,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderDetail/delay',
        payload: {
          orderId: id,
        },
      });
    }
  }
  // 存储重新推送的备注
  handleSaveRePushRemark=(e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/saveRePushRemark',
      payload: {
        resendRemark: e.target.value,
      },
    });
  }
  handleConfirmRePush=(e) => {
    const { dispatch, saleOrderDetail } = this.props;
    const { orderId, resendRemark } = saleOrderDetail;
    dispatch({
      type: 'saleOrderDetail/handleCancelReject',
      payload: {
        orderId,
        resendRemark,
        isShowRePushModel: false,
      },
    });
  }
  handleCancelRePush=(e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderDetail/handleCancelRejectReducer',
      payload: {
        isShowRePushModel: false,
      },
    });
  }
  render() {
    const {
      saleOrderDetail: {
        isLoading,
        payMethodMap,
        payIdMap,
        collectAccountMap,
        statusMap,
        totalOrder,
        rejectRemark,
        subOrders,
        collections,
        operaRecord,
        isShowObsoleteConfirm,
        isShowRejectConfirm,
        isShowCheckConfirm,
        isShowDeleteConfirm,
        isChecking,
        isRejecting,
        isObsoleteing,
        isDeleting,
        isShowGenConfirm,
        isGening,
        isShowDeleteCollectionConfirm,
        isShowObsoleteCollectionConfirm,
        isDeletingCollection,
        isObsoleteingCollection,
        // 子单修改
        isShowEditSubOrderRemarkModal,
        isEditingSubOrderRemark,
        subOrderRemark,

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
        tabStatus,
        isShowRePushModel,
        merchantOrderNo,
        merchantName,
        actionList
      },
    } = this.props;
    const token = localStorage.getItem('token');
    const {
      // payMethod,
      // collectAccount,
      // collectionId,
      // payId,
      collectionId,
      isShowCollectionDetail,
      isShowOperaRecord,
      // payAmount,
      // payTime,
      // backDate,
    } = this.state;
    const columns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (img) => {
          return <img className={styles.goodsImg} src={img} />;
        },
      },
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width:200,
        render: (name, record) => {
          return (<span>
                <Tooltip placement="topLeft" title={record.rejectRemark}>
                {
                  record.isReject?(<p style={{ color: '#fff', margin: 0, padding: '2px 5px', background: 'blue', fontSize: 12,width:60,textAlign:"center" }}>售中驳回</p>):null
                }
                </Tooltip>
                <p style={{margin:0,width:180}} className={globalStyles.twoLine}>{record.name}</p>
                {/* // <Tooltip placement="topLeft" title={record.rejectRemark}>
                //   {record.isReject? (<span style={{ color: '#fff', margin: 0, padding: '2px 5px', background: 'red', fontSize: 12 }}>驳回</span>) : null}
                // </Tooltip> */}
            </span>);
        },
      },
      {
        title: '商品编码',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (value, record) => {
          if (+value < +record.onlinePrice) {
            return (
              <span style={{ color: record.priceColor, fontWeight: '700' }}>{value}</span>
            );
          } else if (+value > +record.onlinePrice) {
            return (
              <span style={{ color: record.priceColor, fontWeight: '700' }}>{value}</span>
            );
          } else return (<span>{value}</span>);
        },
      },
      {
        title: '线上价',
        dataIndex: 'onlinePrice',
        key: 'onlinePrice',
      },
      {
        title: '成本价',
        dataIndex: 'cost',
        key: 'cost',
      },
      {
        title: '利润额',
        dataIndex: 'profit',
        key: 'profit',
        width:80,
        render:(profit)=>{
          return<span className={+profit>0?styles.red:styles.green}>{`${profit}`}</span>
        }
      },
      {
        title: '利润率',
        dataIndex: 'profitRate',
        key: 'profitRate',
        width:80,
        render:(profitRate)=>{
          return<span className={+profitRate>0?styles.blue:styles.green}>{profitRate}</span>
        }
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
      },
      {
        title: '折扣',
        dataIndex: 'discount',
        key: 'discount',
      },
      {
        title: '返利后进价',
        dataIndex: 'rebatePurchasePrice',
        key: 'rebatePurchasePrice',
        width:80,
      },
      {
        title: '返利后利润额/率',
        dataIndex: 'rebateProfit',
        key: 'rebateProfit',
        width:80,
        render:(rebateProfit,record)=>{
          return <p style={{margin:0}}>
            <span className={+rebateProfit>0?styles.red:styles.green}>{`${rebateProfit}/`}</span>
            <span className={+rebateProfit>0?styles.blue:styles.green}>{record.rebateProfitRate}</span>
          </p>
        }
      },
      {
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        width: 90,
        render: (isTax, record) => {
          return (
            <span>{ record.isTax ? '含税' : '不含税' }</span>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        render: (number, record) => {
          return (
            [
              <span>{number}</span>,
              record.isStockout ?
                (
                  <Tooltip title={`可用量: ${record.canUseNum}`}>
                    <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>缺货</span>
                  </Tooltip>
                ) :
                null,
            ]
          );
        },
      },
      {
        title: '小计',
        dataIndex: 'subtotal',
        key: 'subtotal',
      },
      {
        title: '活动信息',
        dataIndex: 'activityName',
        key: 'activityName',
        width:80,
        render:(activityName)=>{
          return <Tooltip title={activityName}><p style={{width:70,overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',margin:0}}>{activityName}</p></Tooltip>
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:100,
        render:(remark)=>{
          return <Tooltip title={remark}><p style={{width:100,overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',margin:0}}>{remark}</p></Tooltip>
        }
      },
    ];
    const subOrderColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (img) => {
          return <img className={styles.goodsImg} src={img} />;
        },
      },
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width:180,
        render: (name, record) => {
          return (<span>
            <Tooltip placement="topLeft" title={record.rejectRemark}>
              {
                record.isReject?(<p style={{ color: '#fff', margin: 0, padding: '2px 5px', background: 'blue', fontSize: 12,width:60,textAlign:"center" }}>售中驳回</p>):null
              }
              </Tooltip>
            <p style={{margin:0,width:160}} className={globalStyles.twoLine}>{record.name}</p>
            {/* <Tooltip placement="topLeft" title={record.rejectRemark}>
              {record.isRejec ? (<span style={{ color: '#fff', margin: 0, padding: '2px 5px', background: 'red', fontSize: 12 }}>驳回</span>) : null}
            </Tooltip> */}
                </span>);
        },
      },
      {
        title: '商品编码',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      // {
      //   title: '规格',
      //   dataIndex: 'standard',
      //   key: 'standard',
      // },
      {
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        width: 90,
        render: (isTax, record) => {
          return (
            <span>{ record.isTax ? '含税' : '不含税' }</span>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '已出库数量',
        dataIndex: 'outStoreNum',
        key: 'outStoreNum',
      },
      {
        title: '待出库数量',
        dataIndex: 'awaitOutStoreNum',
        key: 'awaitOutStoreNum',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:200,
        render:(remark)=>{
          return <Tooltip title={remark}><p style={{width:200,overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',margin:0}}>{remark}</p></Tooltip>
        }
      },
    ];
    const operaRecordColumns = [
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
      {
        title: '操作者',
        dataIndex: 'action',
        key: 'action',
      },
      {
        title: '操作时间',
        dataIndex: 'operaTime',
        key: 'operaTime',
      },
      {
        title: '操作动作',
        dataIndex: 'actionNote',
        key: 'actionNote',
      },
      // {
      //   title: '订单状态',
      //   dataIndex: 'orderStatus',
      //   key: 'orderStatus',
      // },
      // {
      //   title: '付款状态',
      //   dataIndex: 'payStatus',
      //   key: 'payStatus',
      // },
      // {
      //   title: '发货状态',
      //   dataIndex: 'shippingStatus',
      //   key: 'shippingStatus',
      // },
    ];
    const collectionColumns = [
      // {
      //   title: '支付流水单号',
      //   dataIndex: 'payNo',
      //   key: 'payNo',
      // },
      {
        title: '时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '支付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },
      // {
      //   title: '支付方式',
      //   dataIndex: 'payMethod',
      //   key: 'payMethod',
      // },
      {
        title: '收款账户',
        dataIndex: 'collectAccount',
        key: 'collectAccount',
        render: collectionCollectAccount => collectionCollectAccount,
      },
      {
        title: '状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <div onClick={this.handleTriggerDetail.bind(this, record.id)}>详情</div>
                  </Menu.Item>
                  {/* {
                    !record.isReject && (
                      <Menu.Item>
                        <div onClick={this.handleTriggerObsoleteCollection.bind(this, record.id, record.type)}>作废</div>
                      </Menu.Item>
                    )
                  } */}
                  <Menu.Item>
                      <div onClick={this.handleTriggerDeleteCollection.bind(this, record.id, record.type)}>作废</div>
                  </Menu.Item>
                  {/* {
                    record.isReject && (
                      
                    )
                  } */}
                </Menu>
              }
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];
    let collection = null;
    for (let i = 0; i < collections.length; i += 1) {
      if (collectionId === collections[i].id) {
        collection = collections[i];
        break;
      }
    }
    return (
      <PageHeaderLayout title="销售订单详情">
        <Card bordered={false}>
          <Tabs
            activeKey={tabStatus}
            onChange={this.handleChangeActiveKey.bind(this)}
            tabBarExtraContent={[
              actionList.map(item=>{
                if(item.name.indexOf("订单详情导出")>=0){
                  return <Button href={item.url} target="_blank">{item.name}</Button>
                }
              }),
              <a target="_blank" href={`http://erp.xiaomei360.com/common/export-order-group-from-ids?${stringify({
                "ids[0]":`${this.props.match.params.id}`,
                  token,
              })}`}><Button style={{ marginRight: 6 }}>导出</Button></a>,
              <Link to={{
                  pathname: `/sale/sale-order/after-sale-order-list/after-sale-order-add`,
                  query: {
                    orderId: totalOrder.id,
                    userId: totalOrder.userId,
                    orderSn: totalOrder.totalOrderNo,
                    type:0,
                  },
                }}
              >
               {/* <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-add/${totalOrder.id}/${totalOrder.userId}/${totalOrder.totalOrderNo}`}> */}
              {
                totalOrder.merchantOrderNo?null:<Button style={{ marginRight: 6 }}>新建正常售后单</Button>
              }
              </Link>,
              <Link to={{
                pathname: `/sale/sale-order/after-sale-order-list/after-sale-order-add`,
                query: {
                  orderId: totalOrder.id,
                  userId: totalOrder.userId,
                  orderSn: totalOrder.totalOrderNo,
                  type:1,
                },
              }}
            >
             {/* <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-add/${totalOrder.id}/${totalOrder.userId}/${totalOrder.totalOrderNo}`}> */}
            {
              totalOrder.merchantOrderNo?null:<Button style={{ marginRight: 6 }}>新建开票后售后单</Button>
            }
              
            </Link>,
              totalOrder.canEdit && <Link to={`/sale/sale-order/sale-order-list/sale-order-add/${this.props.match.params.id}`}><Button style={{ marginRight: 6 }}>修改</Button></Link>,
              totalOrder.canObsolete && <Button id="Obsolete" onClick={this.triggerConfirm.bind(this)} style={{ marginRight: 6 }}>作废</Button>,
              totalOrder.canDelete && <Button id="Delete" onClick={this.triggerConfirm.bind(this)} style={{ marginRight: 6 }}>删除</Button>,
              totalOrder.canBossReject && <Button id="Reject" name="Boss" onClick={this.triggerConfirm.bind(this)} style={{ marginRight: 6 }}>主管驳回</Button>,
              totalOrder.canFinanceReject && <Button id="Reject" name="Finance" onClick={this.triggerConfirm.bind(this)} style={{ marginRight: 6 }}>财务驳回</Button>,
              totalOrder.canBossCheck && <Button id="Check" name="Boss" onClick={this.triggerConfirm.bind(this)} style={{ marginRight: 6 }}>主管审核</Button>,
              totalOrder.canFinanceCheck && <Button id="Check" name="Finance" onClick={this.triggerConfirm.bind(this)}>财务审核</Button>,
            ]}
          >
            <Tabs.TabPane tab="订单详情" key="1">
              <Card bodyStyle={{
                padding: 10,
                backgroundColor: '#FFFFF1',
              }}
              >
                <Row style={{ color: '#FC6621', fontSize: 24, fontWeight: 'bold' }}>{statusMap[totalOrder.totalOrderStatus]}</Row>
                {
                  totalOrder.merchantOrderNo?(
                    <div>
                      <Row style={{ marginTop: 6, marginBottom: 6 }}>
                        <span style={{ marginRight: 6 }}>商户订单号: {totalOrder.merchantOrderNo}</span>
                      </Row>
                      <Row style={{ marginTop: 6, marginBottom: 6 }}>
                        <span style={{ marginRight: 6 }}>商户名称 : {totalOrder.merchantName}</span>
                      </Row>
                    </div>
                  ):null
                }
                
                <Row style={{ marginTop: 6, marginBottom: 6 }}>
                  <span style={{ marginRight: 6 }}>订单总单: {totalOrder.totalOrderNo}</span>
                  {totalOrder.isDiscount && <span style={{ marginRight: 6, color: '#fff', padding: '2px 5px', backgroundColor: '#FC1268', fontSize: 12 }}>特价</span>}
                  {totalOrder.isRejected && <span style={{ color: '#fff', padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>}
                </Row>
                <Row>
                  <span>关联子单: </span>
                  {subOrders.map((subOrder) => {
                    return <span style={{ color: '#42A9DB', marginRight: 6 }}>{subOrder.subOrderNo}</span>;
                  })}
                </Row>
              </Card>
              <Table
                bordered
                loading={isLoading}
                dataSource={totalOrder.goodsList}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                pagination={false}
                columns={columns}
                style={{
                  marginTop: 20,
                }}
                title={() => (
                  <Row style={{ marginBottom: 10 }}>
                    <span style={{ marginRight: 10 }}>客户员: {totalOrder.customer}</span>
                    <span>业务员: {totalOrder.salesman}</span>
                  </Row>
                )}
                footer={() => (
                  [
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                      <Col offset={20} md={4} style={{ backgroundColor: '#F2F2F2' }}>
                        商品数量: {totalOrder.allGoodsNum}
                      </Col>
                    </Row>,
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                      <Col offset={20} md={4} style={{ backgroundColor: '#F2F2F2' }}>
                        实际总额: ￥{totalOrder.actualAmount}
                      </Col>
                    </Row>,
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                      <Col offset={20} md={4} style={{ backgroundColor: '#F2F2F2' }}>
                        订单特批价: ￥{totalOrder.specialAmount}
                      </Col>
                    </Row>,
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                    <Col offset={20} md={4} style={{ backgroundColor: '#F2F2F2' }}>
                      订单总成本: ￥{totalOrder.totalCost}
                    </Col>
                  </Row>,
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                    <Col offset={20} md={4} style={{ backgroundColor: '#F2F2F2' }}>
                        总利润额/率: <span className={+totalOrder.totalProfit>0?styles.red:styles.green}>{`${totalOrder.totalProfit}/`}</span>
                        <span className={+totalOrder.totalProfit>0?styles.blue:styles.green}>{totalOrder.totalProfitRate}</span>
                    </Col>
                  </Row>,
                    <Row gutter={{ md: 24 }} style={{ marginTop: 8, marginRight: 0 }}>
                      <Col offset={20} md={4} style={{ border: '1px solid #797979', padding: 10, backgroundColor: '#FFFECE' }}>
                        应付总额: ￥{totalOrder.allAmount}
                      </Col>
                    </Row>,
                  ]
                )}
              />
              <Card style={{ marginTop: 20 }} bodyStyle={{ padding: 10 }}>
                <Row>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>运费信息: </span>
                  {totalOrder.express}
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>收货信息: </span>
                  {totalOrder.consignee ?
                    (
                      [
                        <span style={{ marginRight: 10 }}>收货人: {totalOrder.consignee.name || ''}</span>,
                        <span style={{ marginRight: 10 }}>手机号: {totalOrder.consignee.mobile || ''}</span>,
                        <span>收货地址: {totalOrder.consignee.address || ''}</span>,
                      ]
                    ) : null
                  }
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>到期回款时间: </span>
                  {totalOrder.deliveryTime}
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>支付信息: </span>
                  {totalOrder.payInfo ?
                    (
                      [
                        <span>支付方式: {totalOrder.payInfo.payMethod || ''}</span>,
                      ]
                    ) : null
                  }
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>发票信息: </span>
                  {totalOrder.invoiceInfo.invoiceType !== '不开票' ?
                    (
                      [
                        <span> 发票类型: {totalOrder.invoiceInfo.invoiceType || ''}</span>,
                        <span> 发票抬头: {totalOrder.invoiceInfo.companyName || ''}</span>,
                        <span> 企业税号: {totalOrder.invoiceInfo.companyTaxID || ''}</span>,
                        <span> 单位地址: {totalOrder.invoiceInfo.address || ''}</span>,
                        <span> 开户银行: {totalOrder.invoiceInfo.bank || ''}</span>,
                        <span> 银行账户: {totalOrder.invoiceInfo.bankAccount || ''}</span>,
                        <span> 联系电话: {totalOrder.invoiceInfo.phoneNumber || ''}</span>,
                      ]
                    ) : (
                      <span>发票类型: 不开票</span>
                    )
                  }
                </Row>
                <Row style={{ marginTop: 8 }} type="flex">
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>制单备注: </span>
                  <div style={{marginLeft:20}}>
                    <pre>{totalOrder.remark}</pre>
                  </div>
                </Row>
              </Card>
              <Collapse style={{ marginTop: 20 }}>
                <Collapse.Panel header="操作日志">
                  <Table
                    bordered
                    rowKey={record => record.id}
                    pagination={false}
                    loading={isLoading}
                    columns={operaRecordColumns}
                    dataSource={operaRecord}
                  />
                </Collapse.Panel>
              </Collapse>
              <Modal
                visible={isShowRePushModel}
                title="重新推送"
                onOk={this.handleConfirmRePush}
                onCancel={this.handleCancelRePush}
              >
                <Input onBlur={this.handleSaveRePushRemark} />


              </Modal>
            </Tabs.TabPane>
            <Tabs.TabPane tab="子单状态记录" key="2">
              <Card bodyStyle={{
                padding: 10,
                backgroundColor: '#FFFFF1',
              }}
              >
                <Row style={{ color: '#FC6621', fontSize: 24, fontWeight: 'bold' }}>{statusMap[totalOrder.totalOrderStatus]}</Row>
                <Row style={{ marginTop: 6, marginBottom: 6 }}>
                  <span style={{ marginRight: 20 }}>客户: {totalOrder.customer}</span>
                  <span style={{ marginRight: 20 }}>收货人: {totalOrder.consignee && totalOrder.consignee.name}</span>
                  <span style={{ marginRight: 20 }}>手机号: {totalOrder.consignee && totalOrder.consignee.mobile}</span>
                  <span style={{ marginRight: 20 }}>收货地址: {totalOrder.consignee && totalOrder.consignee.address}</span>
                </Row>
              </Card>
              {subOrders.map((subOrder) => {
                return (
                  <Table
                    style={{ marginTop: 20 }}
                    bordered
                    loading={isLoading}
                    rowKey={record => record.subOrderId}
                    columns={subOrderColumns}
                    dataSource={subOrder.goodsList}
                    pagination={false}
                    scroll={{ x: 500 }}
                    title={() => (
                      [
                        <Row style={{ position: 'relative' }} type="flex" align="middle">
                          <span>子单号: {subOrder.subOrderNo}</span>
                          <span style={{ marginLeft: 12 }}>订单类型: {subOrder.subOrderType}</span>
                          <span style={{ marginLeft: 12, display: subOrder.outStoreNo ? 'inline' : 'none' }}>出库单号: {subOrder.outStoreNo}</span>
                          <span style={{ marginLeft: 12 }}>邮费政策: {(+subOrder.subOrderFareInfo === 2 || +subOrder.subOrderFareInfo === 4) ? '包邮' : '到付'}</span>
                          {
                            (subOrder.isDelayShipping === -1) ? '' :
                            <Popconfirm
                              title={subOrder.isDelayShipping ? '请确认是否取消延迟?' : '请确认是否延迟发货?'}
                              onConfirm={this.handleTriggerDelay.bind(this, subOrder.subOrderId, subOrder.isDelayShipping)}
                            >
                              <Button
                                className={subOrder.isDelayShipping ? styles.cancelDelayButton : styles.delayButton}
                              >
                                {subOrder.isDelayShipping ? '取消延迟' : '延迟发货'}
                              </Button>
                            </Popconfirm>
                          }
                          {
                            subOrder.goodsList.map((item) => {
                              if (+item.isReject) {
                                return (<Button
                                  style={{ position: 'absolute', right: 150 }}
                                  onClick={this.handleCancelReject.bind(this, subOrder.subOrderId)}
                                >
                                  重新推送
                                </Button>);
                              }
                            })

                          }

                          <Popconfirm
                            title="请确认是否切换运费政策?"
                            onConfirm={this.handleOkChangeLogistics.bind(this, subOrder.subOrderId, subOrder.subOrderFareInfo)}
                          >
                            <Button
                              style={{ position: 'absolute', right: 0 }}
                              onClick={this.handleClickChangeLogistics.bind(this, subOrder.subOrderId, subOrder.subOrderFareInfo)}
                            >
                              切换运费政策
                            </Button>
                          </Popconfirm>
                        </Row>,
                        <Row>
                          {
                            subOrder.shippingInfo.shippingStatus?
                            <div>
                                <Row style={{ marginTop:10 }} type="flex" align="middle">
                                  <Col span={3}>发货状态:<span style={{color:"red"}}>{subOrder.shippingInfo.shippingStatus}</span></Col>
                                </Row>
                                {
                                  subOrder.shippingInfo.shippingDetail&&subOrder.shippingInfo.shippingDetail.map(item=>{
                                      return <Row style={{width:900, marginTop:10}}>
                                        <Col span={5}>物流公司:{item.shippingCompany}</Col>
                                        <Col span={19}>物流单号:{item.shippingNo}<span style={{color:"red",display:"inline-block",marginLeft:10}}>{subOrder.shippingInfo.remark?`(${subOrder.shippingInfo.remark})`:""}</span></Col>                           
                                    </Row>
                                  })
                                }
                            </div>
                            :null
                          }
                        </Row>,
                        <Row style={{ position: 'relative',marginTop:20 }} type="flex" align="middle">
                          <span>订单备注: {subOrder.remark}</span>
                          <Button
                            style={{ position: 'absolute', right: 0 }}
                            onClick={this.handleTriggerEditSubOrderRemarkModal.bind(this, subOrder.subOrderId)}
                          >
                            修改备注
                          </Button>
                        </Row>,
                      ]
                    )}
                  />
                );
              })}
            </Tabs.TabPane>
            <Tabs.TabPane tab="收款信息" key="3">
              <Card bodyStyle={{
                padding: 10,
                backgroundColor: '#FFFFF1',
              }}
              >
                <Row style={{ fontSize: 18, fontWeight: 'bold' }}>收款信息</Row>
                <Row style={{ marginTop: 6, marginBottom: 6 }}>
                  <span style={{ marginRight: 20 }}>客户: {totalOrder.customer}</span>
                  <span style={{ marginRight: 20 }}>总单号: {totalOrder.totalOrderNo}</span>
                </Row>
              </Card>
              <Table
                bordered
                style={{
                  marginTop: 20,
                }}
                title={() => {
                  return (
                    <Row style={{ position: 'relative', height: 40 }} type="flex" align="middle">
                      <span style={{ marginRight: 10 }}>订单金额: {totalOrder.allAmount}</span>
                      <span style={{ marginRight: 10 }}>已付款: {totalOrder.paidAmount} </span>
                      {/* <span style={{ marginRight: 10 }}>待确认: {totalOrder.awaitSureAmount}</span> */}
                      <span style={{ marginRight: 10 }}>待支付: {totalOrder.awaitPayAmount}</span>
                      <Button onClick={this.handleTriggerGenConfirm.bind(this)} type="primary" style={{ position: 'absolute', right: 0 }}>添加收款凭证</Button>
                    </Row>
                  );
                }}
                loading={isLoading}
                rowClassName={record => record.isReject && styles.rejectRow}
                rowKey={record => record.id}
                columns={collectionColumns}
                dataSource={collections}
                pagination={false}
                scroll={{ x: 500 }}
              />
            </Tabs.TabPane>
          </Tabs>
          <Modal
            title="确认"
            confirmLoading={isObsoleteing}
            visible={isShowObsoleteConfirm}
            onCancel={this.triggerConfirm.bind(this)}
            onOk={this.handleClickOkObsolete.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否作废该订单?</p>
          </Modal>
          <Modal
            title="确认"
            confirmLoading={isRejecting}
            visible={isShowRejectConfirm}
            onCancel={this.triggerConfirm.bind(this)}
            onOk={this.handleClickOkReject.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否驳回该订单?</p>
            <Input
              placeholder="驳回备注"
              value={rejectRemark}
              onChange={this.handleChangeRejectRemark.bind(this)}
            />
          </Modal>
          <Modal
            title="确认"
            id="Obsolete"
            confirmLoading={isChecking}
            visible={isShowCheckConfirm}
            onCancel={this.triggerConfirm.bind(this)}
            onOk={this.handleClickOkCheck.bind(this)}
          >
            {this.state.checkType === 'Finance' && +amount > +totalOrder.awaitPayAmount ? <span style={{ textAlign: 'center', color: '#f00' }}>请确认是否通过该订单? 付款金额大于待付金额, 多余的{(amount - totalOrder.awaitPayAmount).toFixed(2)}金额将自动挂账!</span> : <p style={{ textAlign: 'center' }}>请确认是否通过该订单?</p>}

          </Modal>
          <Modal
            title="确认"
            id="Obsolete"
            confirmLoading={isDeleting}
            visible={isShowDeleteConfirm}
            onCancel={this.triggerConfirm.bind(this)}
            onOk={this.handleClickOkDelete.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否删除该订单?</p>
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
            >
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#F77576' }}>待支付: {totalOrder.awaitPayAmount}</span>
              <span style={{ margin: '0 10px', fontSize: 18, fontWeight: 'bold', color: '#333333' }}>订单金额: {totalOrder.allAmount}</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333333' }}>已支付: {totalOrder.paidAmount}</span>
            </Card>
            <Row gutter={{ md: 24 }}>
              <Col md={12}>
                <Row style={{ margin: '8px 0' }}>
                  <span>支付方式:</span>
                  <Select value={payMethod} onChange={this.handleChange.bind(this, 'payMethod')} style={{ width: 115, margin: '0 12px' }}>
                    <Option key={-1} value={-1}>请选择支付方式</Option>
                    <Option key={0} value={0}>现付现结</Option>
                    <Option key={1} value={1}>账期预付</Option>
                    <Option key={2} value={2}>挂账对冲</Option>
                  </Select>
                </Row>
                {
                  payMethod === 0 && (
                    [
                      <Row style={{ margin: '8px 0' }}>
                        <span>收款账户:</span>
                        <Select onChange={this.handleChange.bind(this, 'collectAccount')} value={collectAccount} style={{ width: 115, margin: '0 12px' }}>
                          <Option key={-1} value={-1}>请选择收款账户</Option>
                          {collectAccountMap.map((collectAccount) => {
                            return <Option value={collectAccount.id} key={collectAccount.id}>{collectAccount.accountInfo}</Option>;
                          })}
                        </Select>
                      </Row>,
                      <Row style={{ margin: '8px 0' }}>
                        <span>银行流水:</span>
                        <Input value={transactionSn} onChange={this.handleChange.bind(this, 'transactionSn')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款金额:</span>
                        <Input value={amount} onChange={this.handleChange.bind(this, 'amount')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                      +amount > +totalOrder.awaitPayAmount ? <Row style={{ color: 'red' }}>付款金额大于待付金额, 多余的{(amount - totalOrder.awaitPayAmount).toFixed(2)}金额将自动挂账!</Row> : null,
                    ]
                  )
                }
                {
                  payMethod !== 0 && (
                    [
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款金额:</span>
                        <Input value={amount} onChange={this.handleChange.bind(this, 'amount')} style={{ width: 160, margin: '0 12px' }} />
                      </Row>,
                      // payMethod === 1 &&
                      // <Row style={{ margin: '8px 0' }}>
                      //   <span>预期回款时间: </span>
                      //   <DatePicker format="YYYY-MM-DD" disabled onChange={this.handleChangeTime.bind(this, 'backTime')} style={{ width: 230, margin: '0 12px' }} value={moment(totalOrder.deliveryTime)} />
                      // </Row>,
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
          <Modal
            title="订单付款详情"
            visible={isShowCollectionDetail}
            onCancel={this.handleTriggerDetail.bind(this, 0)}
            onOk={this.handleTriggerDetail.bind(this, 0)}
          >
            <Row style={{ marginTop: 8 }}>总单号: {totalOrder.totalOrderNo}</Row>
            <Row style={{ marginTop: 8 }}>付款金额: {collection && collection.payAmount}</Row>
            <Row style={{ marginTop: 8 }}>收款账户: {collection && collection.collectAccount}</Row>
            <Row style={{ marginTop: 8 }}>付款时间: {collection && collection.payTime}</Row>
            <Row style={{ marginTop: 8 }}>结算备注: {collection && collection.remark}</Row>
            <Row style={{ marginTop: 8 }}>业务员: {collection && collection.salesman}</Row>
          </Modal>
          <Modal
            title="确认"
            visible={isShowObsoleteCollectionConfirm}
            confirmLoading={isObsoleteingCollection}
            onCancel={this.handleTriggerObsoleteCollection.bind(this)}
            onOk={this.handleClickOkObsoleteCollection.bind(this)}
          >
            <p>请确认是否作废该收款信息?</p>
          </Modal>
          <Modal
            title="确认"
            visible={isShowDeleteCollectionConfirm}
            confirmLoading={isDeletingCollection}
            onCancel={this.handleTriggerDeleteCollection.bind(this)}
            onOk={this.handleClickOkDeleteCollection.bind(this)}
          >
            <p>请确认是否删除该收款信息?</p>
          </Modal>
          <Modal
            title="修改子单备注"
            visible={isShowEditSubOrderRemarkModal}
            confirmLoading={isEditingSubOrderRemark}
            onCancel={this.handleTriggerEditSubOrderRemarkModal.bind(this, null)}
            onOk={this.handleOkEditSubOrderRemarkModal.bind(this)}
          >
            <Input
              placeholder="修改的备注"
              value={subOrderRemark}
              onChange={this.handleChangeSubOrderRemark.bind(this)}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
