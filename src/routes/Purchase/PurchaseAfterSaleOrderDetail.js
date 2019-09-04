import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Tabs, Table, Row, Button, Modal, Col, Checkbox, DatePicker, Collapse, Dropdown, Menu, Icon, Select, Input, message } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseAfterSaleOrderDetail.less';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
import { getUrl } from '../../utils/request';
const { Panel } = Collapse;
const { Option } = Select;

@connect(state => ({
  purchaseAfterSaleOrderDetail: state.purchaseAfterSaleOrderDetail,
}))
export default class PurchaseAfterSaleOrderDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id: purchaseBackOrderId,type } = this.props.match.params;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/mount',
      payload: {
        purchaseBackOrderId,
        backOrderType:type,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/unmount',
    });
  }
  handleTriggerRefundOrderOrder(id = null) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/triggerRefundOrderDetail',
      payload: {
        id,
        isShowPayInfoConfirm:true,
      },
    });
  }
  handleClickOkPayInfoButtonbind=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/changeReducer',
      payload: {
        isShowPayInfoConfirm:false,
      },
    });
  }
  handleTriggerOrderAction(id = null, url = null, backUrl = null, text = null, e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/triggerOrderAction',
      payload: {
        orderId: id,
        actionUrl: url,
        backUrl,
        text,
      },
    });
  }
  handleStartupOrderAction() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/startupOrderAction',
    });
  }
  handleTriggerAddRefundModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/triggerAddRefundModal',
    });
  }
  // 点击作废
  handleClickRemoveButton=(deleteId,type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/changeReducer',
      payload:{
        deleteId,
        type,
        isDelete:true,
      }
    });
  }
  // 确认作废
  handleConfirmDelete=()=>{
    const { dispatch, purchaseAfterSaleOrderDetail } = this.props;
    const { deleteId, type } = purchaseAfterSaleOrderDetail;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/confirmDelete',
      payload:{
        deleteId,
        type,
        id:this.props.match.params.id,
        isDelete:true,
      }
    });
  }
  handleCancelDelete=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/changeReducer',
      payload:{
        isDelete:false,
      }
    });
  }
  handleConfirmAction=(orderId,actionUrl)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/startupOrderAction',
      payload:{
        orderId,
        actionUrl,
      }
    });
  }
  handleAddRefund() {
    const { dispatch, purchaseAfterSaleOrderDetail } = this.props;
    const { collectAccount, collectMoney } = purchaseAfterSaleOrderDetail;
    if(+collectAccount === -1) {
      message.warning("请填写收款账户");
      return;
    }else if(!collectMoney) {
      message.warning("请填写收款金额");
      return;
    }
    dispatch({
      type: 'purchaseAfterSaleOrderDetail/addRefund',
      payload: {
        purchaseBackOrderId: this.props.match.params.id,
      },
    });
  }
  handleChange(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'collectAccount':
      // case 'payMethod':
        dispatch({
          type: 'purchaseAfterSaleOrderDetail/change',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      case 'collectMoney':
      case 'payAccount':
      case 'rejectRemark':
      case 'financeRemark':
      case 'transactionSn':
        dispatch({
          type: 'purchaseAfterSaleOrderDetail/change',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      case 'collectDate':
        dispatch({
          type: 'purchaseAfterSaleOrderDetail/change',
          payload: {
            [type]: rest[1],
          },
        });
        break;
      default:
        break;
    }
  }
  render() {
    const {
      purchaseAfterSaleOrderDetail: {
        // 添加凭证弹窗相关
        payMethod,
        payMethodMap,
        collectAccountMap,
        collectAccount,
        collectMoney,
        collectDate,
        payAccount,
        isShowAddRefundModal,
        isAddingRefund,

        // 基本数据相关
        status,
        sn,
        relatedPurchaseOrderSn,
        relatedPurchaseOrderStatus,
        supplierName,
        purchaserName,
        isReturnGoods,
        isSpecial,
        specialPrice,
        receiptMethod,
        totalMoney,
        receiptedMoney,
        receivable,
        awaitReceiptMoney,
        remark,
        address,
        consigneeName,
        mobile,
        actionList,
        rejectRemark,
        payRemark,
        operaRecordList,
        goodsList,
        refundOrderList,

        // 页面加载中
        isOrderLoading,
        // 流水详情相关
        isShowRefundOrderDetail,
        selectRefundOrder,

        // 操作(审核等)相关
        isShowActionModal,
        isLoadingActionModal,
        text,
        deleteId,
        isDelete,
        isCommon,
        isShowPayInfoConfirm,
        relateInInvFollowList,
        backOrderType
      },
    } = this.props;
    const exportOrder = `${getUrl(API_ENV)}/common/export-purchase-back-order-detail?${
      stringify({ id: [this.props.match.params.id] })
    }`;
    const goodsColumns = [
      {
        render: (_, record, i) => {
          return {
            children: !record.isEnd ? i + 1 : <div style={{ textAlign: 'center' }}>总计</div>,
            props: {
              colSpan: !record.isEnd ? 1 : 7,
            },
          };
        },
      },
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (imgSrc, record) => {
          return {
            children: <img src={imgSrc} className={globalStyles['table-goods-img']} />,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => {
          return {
            children: name,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '商品条码',
        dataIndex: 'sn',
        key: 'sn',
        render: (goodsSn, record) => {
          return {
            children: goodsSn,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        render: (unit, record) => {
          return {
            children: unit,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '是否含税',
        key: 'isTax',
        dataIndex: 'isTax',
        render: (isTax, record) => {
          return {
            children: <span>{isTax ? '是' : '否'}</span>,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (price, record) => {
          return {
            children: price,
            props: {
              colSpan: !record.isEnd ? 1 : 0,
            },
          };
        },
      },
      {
        title: '退货数',
        dataIndex: 'returnNum',
        key: 'returnNum',
        render: (returnNum, record) => {
          return record.returnNum;
        },
      },
      {
        title: '退货金额',
        dataIndex: 'returnMoney',
        key: 'returnMoney',
        render: (_, record) => {
          return record.returnMoney;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
    const refundOrderColumns = [
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '收款时间',
        dataIndex: 'receiveTime',
        key: 'receiveTime',
      },
      {
        title: '收款金额',
        dataIndex: 'money',
        key: 'money',
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '银行流水',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '收款方账户信息',
        dataIndex: 'receiptAccount',
        key: 'receiptAccount',
      },
      // {
      //   title: '收款流水号',
      //   dataIndex: 'sn',
      //   key: 'sn',
      // },
      // {
      //   title: '付款方名称',
      //   dataIndex: 'receiptName',
      //   key: 'receiptName',
      // },
      {
        title: '付款方账户信息',
        dataIndex: 'withholdAccount',
        key: 'withholdAccount',
      },
      {
        title: '财务备注',
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
              overlay={(
                <Menu>
                  <Menu.Item>
                    <div onClick={this.handleTriggerRefundOrderOrder.bind(this, record.id)}>
                      <Icon type="bars" />详情
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div onClick={this.handleClickRemoveButton.bind(this, record.id, record.payType)}>
                      <Icon type="delete" /> 作废
                    </div>
                  </Menu.Item>
                </Menu>
              )}
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];
    const operaRecordColumns = [
      {
        title: '操作员',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: '操作时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        key: 'content',
      },
    ];
    const allSubtotal = goodsList.reduce((pre, next) => {
      return pre + (+next.subtotal);
    }, 0);
    const allReturnNum = goodsList.reduce((pre, next) => {
      return pre + (+next.returnNum);
    }, 0);
    const allReturnMoney = goodsList.reduce((pre, next) => {
      return pre + (+next.returnMoney);
    }, 0);
    let newGoodsList = null;
    if (goodsList.length !== 0) {
      newGoodsList = goodsList.concat({
        returnNum: allReturnNum,
        subtotal: allSubtotal,
        returnMoney: allReturnMoney,
        isEnd: true,
      });
    } else {
      newGoodsList = goodsList;
    }
    const commonLinkUrl = "/purchase/purchase-order-management/common-purchase-list/common-purchase-detail";
    const saleLinkUrl = "/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail";
    return (
      <PageHeaderLayout title={backOrderType==0?"正常售后单详情":"开票后售后单详情"}>
        <Card bordered={false} loading={isOrderLoading}>
          <Tabs
            tabBarExtraContent={(
                actionList.map(action => (
                  action.text.indexOf("出库单") > 0?<Button style={{ marginLeft: 10 }} onClick={this.handleConfirmAction.bind(this,this.props.match.params.id,action.url)}>{action.text}</Button>:
                  <Button style={{ marginLeft: 10 }} onClick={this.handleTriggerOrderAction.bind(this, this.props.match.params.id, action.url, action.backUrl, action.text)}>{action.text}</Button>
                )).concat([
                  <a target="_blank" href={exportOrder}>
                    <Button style={{ marginLeft: 10 }}>导出</Button>
                  </a>,
                ])
              )}
          >
            <Tabs.TabPane tab="订单详情" key="0">
              <Card>
                <Row type="flex" align="middle" style={{ height: 40, fontSize: 20, color: '#FC6638' }}>{status}</Row>
                <Row>
                  <span style={{ marginRight: 10 }}>退单号：{sn}</span>
                  <span>关联采购单号：{
                    <Link to={isCommon?`${commonLinkUrl}/${relatedPurchaseOrderSn}`:`${saleLinkUrl}/${relatedPurchaseOrderSn}`}>{relatedPurchaseOrderSn}</Link>
                  }</span>
                </Row>
              </Card>
              {
                backOrderType==1&&relateInInvFollowList.length>0?<Row style={{margin:'10px 0'}}>
                <Alert
                  message={<div>
                    <span>关联采购单为已开票订单，请谨慎做售后操作。 关联来票号:</span>
                    {
                        relateInInvFollowList.map(item=>(
                          <span key={item}>{`${item} / `}</span>
                        ))
                    }
                  </div>}
                  type="warning"
                  />
                </Row>:''
              }
              <Row type="flex" align="middle" style={{ height: 80 }}>
                <span style={{ marginRight: 10 }}>关联采购单状态：{relatedPurchaseOrderStatus}</span>
                <span style={{ marginRight: 10 }}>供应商：{supplierName}</span>
                <span style={{ marginRight: 10 }}>手机号：{mobile}</span>
                <span style={{ marginRight: 10 }}>是否退货：{isReturnGoods}</span>
                <span>采购员：{purchaserName}</span>
              </Row>
              <Table
                bordered
                pagination={false}
                rowKey={record => record.id}
                columns={goodsColumns}
                dataSource={newGoodsList}
                footer={() => {
                  return (
                    [
                      <Row type="flex" align="middle" justify="end">
                        <Checkbox
                          disabled
                          checked={isSpecial}
                        >
                          已通过协商, 申请获批退款金额:
                          {specialPrice}
                          元
                        </Checkbox>
                      </Row>,
                      <Row type="flex" align="middle" justify="end" style={{ marginRight: 5, marginTop: 10 }}>
                        应退总额: {isSpecial ? specialPrice.toString() : allReturnMoney.toString()}
                      </Row>,
                    ]
                  );
                }}
              />
              <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                <Col style={{ width: '100px' }}>收款方式:</Col>
                <Col>
                  {receiptMethod}
                </Col>
              </Row>
              {
                isReturnGoods && isReturnGoods !== '仅退款' &&
                <Row type="flex" align="top" style={{ marginTop: 10 }}>
                  <Col style={{ width: '100px' }}>收货信息:</Col>
                  <Col>
                    <Col>收货人: {consigneeName}</Col>
                    <Col>手机号: {mobile}</Col>
                    <Col>收货地址: {address}</Col>
                  </Col>
                </Row>
              }
              <Row type="flex" align="top" style={{ marginTop: 10 }}>
                <Col style={{ width: '100px' }}>制单备注:</Col>
                <Col>
                  <pre>{remark}</pre>
                </Col>
              </Row>
              <Collapse style={{ marginTop: 20 }}>
                <Panel header="操作日志">
                  <Table
                    bordered
                    dataSource={operaRecordList}
                    columns={operaRecordColumns}
                    pagination={false}
                    rowKey={record => record.id}
                  />
                </Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="收款信息" key="1">
              <Card>
                <Row type="flex" align="middle" style={{ height: 40, fontSize: 20, color: '#7C7C7C' }}>收款信息</Row>
                <Row>
                  <span style={{ marginRight: 10 }}>供应商：{supplierName}</span>
                  <span style={{ marginRight: 10 }}>退单号：{sn}</span>
                  <span>关联采购单号：{
                    <Link to={isCommon?`${commonLinkUrl}/${relatedPurchaseOrderSn}`:`${saleLinkUrl}/${relatedPurchaseOrderSn}`}>{relatedPurchaseOrderSn}</Link>
                  }</span>
                </Row>
              </Card>
              <Row type="flex" align="middle" style={{ height: 80 }}>
                <span style={{ marginRight: 10 }}>应收金额：{isSpecial ? specialPrice.toString() : allReturnMoney.toString()}</span>
                <span style={{ marginRight: 10 }}>已收金额：{Number(receiptedMoney).toFixed(2)}</span>
                <span style={{ marginRight: 10 }}>待收款：{Number(awaitReceiptMoney).toFixed(2)}</span>
              </Row>
              <Table
                title={() => (
                  receiptMethod=="账期抵扣" || receiptMethod=="余额挂账"?"":
                  <Row type="flex" justify="end" align="middle">
                    <Button onClick={this.handleTriggerAddRefundModal.bind(this)} type="primary">添加收款凭证</Button>
                  </Row>
                )}
                bordered
                pagination={false}
                rowKey={record => record.id}
                columns={refundOrderColumns}
                dataSource={refundOrderList}
              />
            </Tabs.TabPane>
          </Tabs>
          <Modal
            confirmLoading={isLoadingActionModal}
            visible={isShowActionModal}
            onOk={this.handleStartupOrderAction.bind(this)}
            onCancel={this.handleTriggerOrderAction.bind(this, null, null, null, null)}
            title="操作"
          >
          {
            text&&text.indexOf("审核")=== -1 && text&&text.indexOf("作废") === -1?<div>
              <p>{`请确认是否${text}?`}</p>
              <Input
              placeholder="备注"
              value={rejectRemark}
              onChange={this.handleChange.bind(this, 'rejectRemark')}
            />
            </div>:<p style={{textAlign:"center"}}>{`请确认是否${text}?`}</p>
          }
          </Modal>
          <Modal
            width={800}
            visible={isShowAddRefundModal}
            confirmLoading={isAddingRefund}
            onOk={this.handleAddRefund.bind(this)}
            onCancel={this.handleTriggerAddRefundModal.bind(this)}
            title="添加收款凭证"
          >
            <Row style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#F77576' }}>待收款: {Number(awaitReceiptMoney).toFixed(2)}</span>
              <span style={{ margin: '0 10px', fontSize: 18, fontWeight: 'bold', color: '#333333' }}>应收金额: {isSpecial ? specialPrice.toString() : allReturnMoney.toString()}</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333333' }}>已收金额: {Number(receiptedMoney).toFixed(2)}</span>
            </Row>
            <Row gutter={{ md: 24 }} type="flex">
              <Col span={12}>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  {/* <span>支付方式:</span> */}
                  {/* <Input
                    value={receiptMethod}
                    disabled
                  /> */}
                  {/* <Select
                    value={payMethod}
                    style={{ width: 300, marginLeft: 10 }}
                    onChange={this.handleChange.bind(this, 'payMethod')}
                  >
                    <Option key={-1} value={-1}>请选择</Option>
                    <Option key={0} value={0}>现款现结</Option>
                    <Option key={1} value={1}>余额挂账</Option>
                    <Option key={2} value={2}>账期抵扣</Option>
                  </Select> */}
                  <span>收款方式:{receiptMethod}</span>
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <Col span={7}>
                    <span style={{color:"red"}}>*</span><span>收款账户:</span>
                  </Col>
                  <Col span={17}>
                    <Select
                      value={collectAccount}
                      style={{ marginLeft: 10 }}
                      onChange={this.handleChange.bind(this, 'collectAccount')}
                    >
                      <Option value={-1}>请选择</Option>
                      {
                        collectAccountMap.map(item => (
                          <Option value={item.id} key={item.id}>{item.accountInfo}</Option>
                        ))
                      }
                    </Select>
                  </Col>
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <Col span={7}><span style={{color:"red"}}>*</span><span>收款金额:</span></Col>
                  <Col span={17}>
                    <Input
                      style={{ marginLeft: 10 }}
                      value={collectMoney}
                      onChange={this.handleChange.bind(this, 'collectMoney')}
                    />
                  </Col>
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <Col span={7}><span>收款时间:</span></Col>
                  <Col span={17}>
                    <DatePicker
                      value={collectDate ? moment(collectDate, 'YYYY-MM-DD HH:mm:ss') : ''}
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={this.handleChange.bind(this, 'collectDate')}
                      style={{ marginLeft: 10 }}
                      showTime
                    />
                  </Col>
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <Col span={7}><span>银行流水:</span></Col>
                  <Col span={17}>
                    <Input
                      style={{ marginLeft: 10 }}
                      onChange={this.handleChange.bind(this, 'transactionSn')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={7}><span>付款方账户信息:</span></Col>
                  <Col span={17}>
                    <Input.TextArea
                      onChange={this.handleChange.bind(this, 'payAccount')}
                      style={{ marginLeft: 10 }}
                      value={payAccount}
                    />
                  </Col>
                </Row>
                {/* <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <span>付款账户:</span>
                  <Input
                    onChange={this.handleChange.bind(this, 'payAccount')}
                    style={{ width: 300, marginLeft: 10 }}
                    value={payAccount}
                  />
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
                  <span>付款备注:</span>
                  <Input.TextArea
                    onChange={this.handleChange.bind(this, 'payRemark')}
                    style={{ width: 300, marginLeft: 10 }}
                    value={payRemark}
                  />
                </Row> */}
            </Col>
            <Col span={12}>
            <Row>
              <span style={{ verticalAlign: 'top', lineHight: 1 }}>财务备注: </span>
              <Input.TextArea
              autosize={{ minRows: 3, maxRows: 9 }} 
              style={{ width: 290, marginLeft: 5 }} 
              placeholder="请输入财务备注" 
              onChange={this.handleChange.bind(this, 'financeRemark')}
              />
            </Row>
            </Col>
          </Row>
          </Modal>
          <Modal
          visible={isDelete}
          onOk={this.handleConfirmDelete.bind(this)}
          onCancel={this.handleCancelDelete.bind(this)}
          title="作废"
          >
          <p style={{textAlign:"center"}}>请确认是否作废?</p>
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
              <span style={{ marginLeft: '25px', fontSize: '16px', color: '#959595' }}>退单号: {sn}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>支付方式: {selectRefundOrder.payType}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>付款金额: {selectRefundOrder.money}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>对方账户: {selectRefundOrder.receiptAccount}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>收款时间: {selectRefundOrder.receiveTime}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>财务备注: {selectRefundOrder.remark}</span>
            </div>
            <div style={{ height: '40px', lineHeight: '40px', marginTop: '25px' }}>
              <span style={{ marginLeft: '25px', color: '#959595' }}>流水号: {selectRefundOrder.sn}</span>
            </div>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
