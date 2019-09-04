import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Input, Select, Modal, Table, DatePicker, Button, Dropdown, Menu, Icon, Tabs, Checkbox } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AfterSaleOrderDetail.less';

const { Option } = Select;

@connect(state => ({
  afterSaleOrderDetail: state.afterSaleOrderDetail,
}))
export default class AfterSaleOrderDetail extends PureComponent {
  componentDidMount() {
    console.log("ccc",this.props.match.params.type)
    this.props.dispatch({
      type: 'afterSaleOrderDetail/mount',
      payload: {
        id: this.props.match.params.id,
        backOrderType:this.props.match.params.type,
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'afterSaleOrderDetail/unmount',
    });
  }
  handleTriggerActionModal(actionUrl, actionId, actionText) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/triggerActionModal',
      payload: {
        actionUrl,
        actionId,
        actionText,
      },
    });
  }
  handleOkActionModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/okActionModal',
    });
  }

  handleClickTriggerRefundModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickTriggerRefundModal',
    });
  }
  handleClickOkRefundModal() {
    const {
      dispatch,
      afterSaleOrderDetail: {
        withholdAccount,
        refundTo,
        payAmount,
        payDate,
        refundRemark,
        receivableCard,
        transactionSn,
      },
    } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickOkRefundModal',
      payload: {
        backOrderId: +this.props.match.params.id,
        withholdAccount: +withholdAccount,
        refundTo,
        payAmount,
        payDate,
        refundRemark,
        transactionSn,
        receivableCard,
      },
    });
  }
  handleChange(key, value) {
    const { dispatch } = this.props;
    let realValue = null;
    switch (key) {
      // case 'refundTo':
      case 'withholdAccount':
        realValue = value;
        break;
      case 'payDate':
        realValue = value.format('YYYY-MM-DD');
        break;
      default:
        realValue = value.target.value;
        break;
    }
    dispatch({
      type: 'afterSaleOrderDetail/change',
      payload: {
        [key]: realValue,
      },
    });
  }
  handleClickTriggerOperaRecord() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickTriggerOperaRecord',
    });
  }
  handleClickTriggerRefundDetailModal(index) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickTriggerRefundDetailModal',
      payload: {
        streamIndex: index,
      },
    });
  }
  handleClickTriggerCancelStreamModal(refundStreamId, refundStreamType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickTriggerCancelStreamModal',
      payload: {
        refundStreamId,
        refundStreamType,
      },
    });
  }
  handleClickOkCancelStreamModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickOkCancelStreamModal',
      payload: {
        backOrderId: +this.props.match.params.id,
        refundStreamId: this.props.afterSaleOrderDetail.refundStreamId,
        refundStreamType: this.props.afterSaleOrderDetail.refundStreamType,
      },
    });
  }
  handleClickTriggerDeleteStreamModal(refundStreamId, refundStreamType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickTriggerDeleteStreamModal',
      payload: {
        refundStreamId,
        refundStreamType,
      },
    });
  }
  handleClickOkDeleteStreamModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/clickOkDeleteStreamModal',
      payload: {
        backOrderId: +this.props.match.params.id,
        refundStreamId: this.props.afterSaleOrderDetail.refundStreamId,
        refundStreamType: this.props.afterSaleOrderDetail.refundStreamType,
      },
    });
  }
  handleCloseNoticeBoard = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderDetail/changeReducer',
      payload: {
        isShowNoticeModal: false,
      },
    });
  }
  render() {
    const {
      afterSaleOrderDetail: {
        withholdAccountMap,
        canEdit,
        isReturn,
        isReject,
        // 以下为订单相关信息
        checkStatus,
        backOrderSn,
        orderSn,
        customer,
        orderStatus,
        type,
        mobile,
        isSpecial,
        specialPrice,
        refundType,
        saler,
        refundInfoContent,
        remark,
        refundInfo,
        // refundPrice,
        goodsList,
        operationList,
        refundStream,

        // ui
        isLoading,
        isShowOperaRecord,
        isOperaing,
        isShowRefundModal,
        isShowRefundDetailModal,
        isShowCancelStreamModal,
        isShowDeleteStreamModal,

        withholdAccount,
        // refundTo,
        payAmount,
        payDate,
        refundRemark,
        // refundId,
        streamIndex,

        // 操作相关
        actionList,
        isShowActionModal,
        isActing,
        actionRemark,
        actionText,
        merchantBackOrderRemark,
        merchantBackOrderSn,
        merchantName,
        merchantOrderSn,
        isPurchaseOrder,
        isShowNoticeModal,
        noticeText,
        noticeOrderList,
        purchaseOrderSn,
        managerCheckRemark,
        depotCheckRemark,
        purchaserCheckRemark,
        financeCheckRemark
      },
    } = this.props;
    const forwardUrl = isPurchaseOrder ? "/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail" :
      "/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail";
    const exportOrder = `http://erp.xiaomei360.com/common/export-back-order?${stringify({
      id: [this.props.match.params.id],
    })}`;
    
    const goodsColumns = [
      {
        title: '商品图',
        dataIndex: 'goodsThumb',
        key: 'goodsThumb',
        render: (goodsThumb, record) => {
          return !record.isTotal
            ? <img src={goodsThumb} style={{ width: 55, height: 55 }} />
            : {
              children: '总计',
              props: {
                colSpan: 6,
              },
            };
        },
      },
      {
        title: '商品名',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (goodsName, record) => {
          return !record.isTotal
            ? goodsName
            : {
              props: {
                colSpan: 0,
              },
            };
        },
      },
      {
        title: '商品条形码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        render: (goodsName, record) => {
          return !record.isTotal
            ? goodsName
            : {
              props: {
                colSpan: 0,
              },
            };
        },
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        render: (goodsName, record) => {
          return !record.isTotal
            ? goodsName
            : {
              props: {
                colSpan: 0,
              },
            };
        },
      },
      {
        title: '是否含税',
        key: 'isTax',
        dataIndex: 'isTax',
        render: (isTax, record) => {
          return !record.isTotal
            ? <span>{isTax ? '是' : '否'}</span>
            : {
              props: {
                colSpan: 0,
              },
            };
        },
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (goodsName, record) => {
          return !record.isTotal
            ? goodsName
            : {
              props: {
                colSpan: 0,
              },
            };
        },
      },
      // {
      //   title: '剩余可退数量',
      //   dataIndex: 'restNumber',
      //   key: 'restNumber',
      //   render: (goodsName, record) => {
      //     return !record.isTotal
      //       ? goodsName
      //       : {
      //         props: {
      //           colSpan: 0,
      //         },
      //       };
      //   },
      // },
      // {
      //   title: '小计',
      //   dataIndex: 'subtotal',
      //   key: 'subtotal',
      // },
      {
        title: '售后数',
        dataIndex: 'backNumber',
        key: 'backNumber',
      },
      {
        title: '售后金额',
        dataIndex: 'backSubtotal',
        key: 'backSubtotal',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
    const goodsTotal = {
      recId: '我必然是唯一',
      isTotal: true,
      // subtotal: goodsList.map(goods => goods.subtotal).reduce((pre, next) => +pre + +next, 0),
      backNumber: goodsList.map(goods => goods.backNumber).reduce((pre, next) => +pre + +next, 0),
      backSubtotal: (goodsList.map(goods => goods.backSubtotal).reduce((pre, next) => +pre + +next, 0)).toFixed(2),
    };
    const operaColumns = [
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
    const refundStreamColumns = [
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '付款金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '退款方式',
        dataIndex: 'refundType',
        key: 'refundType',
      },
      {
        title: '银行流水',
        dataIndex: 'transactionSn',
        key: 'transactionSn',
      },
      {
        title: '付款方账户信息',
        dataIndex: 'financialAccount',
        key: 'financialAccount',
      },
      {
        title: '收款方账户信息',
        dataIndex: 'payeeAccount',
        key: 'payeeAccount',
      },
      // {
      //   title: '收款方账户',
      //   dataIndex: 'payeeAccount',
      //   key: 'payeeAccount',
      // },
      // {
      //   title: '收款方账户名',
      //   dataIndex: 'payeeName',
      //   key: 'payeeName',
      // },
      // {
      //   title: '扣款账户',
      //   dataIndex: 'financialAccount',
      //   key: 'financialAccount',
      // },
      {
        title: '财务备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record, index) => {
          return (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <div onClick={this.handleClickTriggerRefundDetailModal.bind(this, index)}>
                      详情
                    </div>
                  </Menu.Item>
                  {/* {
                    record.isCancel && ( */}
                  <Menu.Item>
                    <div onClick={this.handleClickTriggerDeleteStreamModal.bind(this, record.streamId, record.type)}>
                      删除
                      </div>
                  </Menu.Item>
                  {/* )
                  } */}
                  {/* {
                    !record.isCancel && (
                      <Menu.Item>
                        <div onClick={this.handleClickTriggerCancelStreamModal.bind(this, record.streamId, record.type)}>
                          作废
                        </div>
                      </Menu.Item>
                    )
                  } */}
                </Menu>
              }
              placement="bottomRight"
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title={backOrderType==1?"开票后售后单详情":"正常售后单详情"}>
        <Card bordered={false}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={
              actionList.map((action) => {
                if (action.name.indexOf("导出") < 0) {
                  return (
                    <Button
                      onClick={this.handleTriggerActionModal.bind(this, action.url, this.props.match.params.id, action.name)}
                      style={{ marginLeft: 10 }}
                    >
                      {action.name}
                    </Button>
                  );
                }
              }).concat([
                <a href={exportOrder} target="_blank"><Button style={{ marginLeft: 10 }}>导出</Button></a>,
                canEdit && <Link to={{
                  pathname: `/sale/sale-order/after-sale-order-list/after-sale-order-add`,
                  query: {
                    id: this.props.match.params.id,
                    type:backOrderType,
                  },
                }}
              ><Button style={{ marginLeft: 10 }}>修改</Button></Link>,
              ])
            }
          >
            <Tabs.TabPane tab="订单详情" key="1">
              <Card bodyStyle={{ paddingLeft: 10, backgroundColor: '#FFFFF1' }}>
                <p style={{ fontSize: 24, color: 'rgb(252, 102, 33)', fontWeight: 'bold' }}>{checkStatus}</p>
                <Row>
                  <span>退单号: {backOrderSn}{isReject && <span style={{ marginLeft: 5, diplay: 'inline-block', padding: 3, backgroundColor: '#CA27FB', color: '#fff' }}>驳回</span>}</span>
                  <span style={{ marginLeft: 12 }}>关联销售单号: <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${orderSn.id}`}>{orderSn.sn}</Link></span>
                  <span style={{ marginLeft: 12 }}>关联采购单号:
                  {
                      purchaseOrderSn.map(item => {
                        return <span style={{ display: 'inline-block', marginRight: 10 }}><Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${item.purchaseOrderSn}`}>{`${item.purchaseOrderSn}`}</Link></span>
                      })
                    }
                  </span>
                  <span style={{ marginLeft: 12 }}>关联采购单状态:
                  {
                      purchaseOrderSn.map(item => {
                        return <span style={{ display: 'inline-block', marginRight: 10 }}>{`${item.purchaseOrderSn}(${item.payStatus})`}</span>
                      })
                    }
                  </span>
                  {
                    merchantName ? <span style={{ marginLeft: 12 }}>商户名称: {merchantName}</span> : ''
                  }
                  {
                    merchantOrderSn ? <span style={{ marginLeft: 12 }}>商户订单编号: {merchantOrderSn}</span> : ''
                  }
                  {
                    merchantBackOrderSn ? <span style={{ marginLeft: 12 }}>商户售后单编号: {merchantBackOrderSn}</span> : ''
                  }
                  {
                    merchantBackOrderRemark ? <span style={{ marginLeft: 12 }}>商户备注: {merchantBackOrderRemark}</span> : ''
                  }
                </Row>
                {
                  backOrderType==1&&relateInInvFollowList.length>0?<Row style={{marginBottom:10}}>
                  <Alert
                    message={<div>
                      <span>关联采购单为已开票订单，请谨慎做售后操作。 关联来票号:</span>
                      {
                        relateInInvFollowList.map(item=>(
                          <Link to="#" key={item.inInvSn}>{item.inInvSn}</Link>
                        ))
                      }
                    </div>}
                    type="warning"
                    />
                  </Row>:""
                }
              </Card>
              <div style={{ marginTop: 15, marginBottom: 15 }}>
                <span style={{ marginRight: 10 }}>关联订单状态: <span style={{ color: '#ff6600' }}>{orderStatus}</span></span>
                <span style={{ marginRight: 10 }}>售后类型: <span style={{ color: 'red' }}>{type}</span></span>
                <span style={{ marginRight: 10 }}>客户: {customer}</span>
                <span style={{ marginRight: 10 }}>手机号: {mobile}</span>
                <span style={{ marginRight: 10 }}>是否退货: {isReturn ? '是' : '否'}</span>
                <span style={{ marginRight: 10 }}>业务员: {saler}</span>
              </div>
              <Table
                bordered
                loading={isLoading}
                rowKey={record => record.recId}
                dataSource={goodsList.concat([goodsTotal])}
                columns={goodsColumns}
                pagination={false}
              />
              <Row type="flex" justify="end" style={{ marginTop: 10 }}>
                <Col>
                  <Checkbox checked={isSpecial} disabled />
                  <span>已通过协商，申请获批退款金额: {specialPrice}元</span>
                </Col>
              </Row>
              <Row type="flex" justify="end">
                <Col style={{ padding: 15, marginTop: 6, border: '1px solid #989898', backgroundColor: '#FFFFF2' }}>
                  <span>应退总额: {isSpecial ? (+specialPrice).toFixed(2) : (+goodsTotal.backSubtotal).toFixed(2)}</span>
                </Col>
              </Row>
              <Row>
                <Row>退款方式: {refundType}</Row>
                <Row>退款账户: {refundInfoContent}</Row>
                <Row>退款备注: {remark}</Row>
                <Row>销售主管备注: {managerCheckRemark}</Row>
                <Row>仓库备注: {depotCheckRemark}</Row>
                <Row>采购备注: {purchaserCheckRemark}</Row>
                <Row>财务备注: {financeCheckRemark}</Row>
              </Row>
              <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginLeft: 0, marginRight: 0, marginTop: 10, padding: 10, border: '1px solid #989898' }}>
                <Col md={6} style={{ fontSize: 18, fontWeight: 'bold' }}>操作日志</Col>
                <Col md={6} offset={12} style={{ textAlign: 'end' }}>
                  <Button onClick={this.handleClickTriggerOperaRecord.bind(this)} icon={isShowOperaRecord ? 'down' : 'up'} >{isShowOperaRecord ? '收起' : '展开'}</Button>
                </Col>
              </Row>
              <Row style={{ display: isShowOperaRecord ? 'block' : 'none' }}>
                <Table
                  bordered
                  rowKey={record => record.id}
                  isLoading={isLoading}
                  dataSource={operationList}
                  columns={operaColumns}
                  pagination={false}
                />
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="退款信息" key="2">
              <Card bodyStyle={{ paddingLeft: 10, backgroundColor: '#FFFFF1' }}>
                <p style={{ fontSize: 24, color: 'rgb(252, 102, 33)', fontWeight: 'bold' }}>退货信息</p>
                <Row>
                  <span>客户: {customer}</span>
                  <span style={{ marginLeft: 12 }}>退单号: {backOrderSn}</span>
                  <span style={{ marginLeft: 12 }}>关联销售单号: {orderSn.sn}</span>
                </Row>
              </Card>
              <Table
                bordered
                title={() => {
                  return (
                    <Row style={{ position: 'relative' }} type="flex" align="middle">
                      <span style={{ marginRight: 10 }}>退款金额: {refundInfo.refundAmount}</span>
                      <span style={{ marginRight: 10 }}>已退金额: {refundInfo.refundedAmount}</span>
                      <span style={{ marginRight: 10 }}>待退金额: {Number(refundInfo.awaitRefundAmount).toFixed(2)}</span>
                      {
                        refundType === "账期抵扣" || refundType === "余额挂账" ? "" : <Button style={{ position: 'absolute', right: 0 }} onClick={this.handleClickTriggerRefundModal.bind(this)} type="primary">添加退款凭证</Button>
                      }
                    </Row>
                  );
                }}
                style={{ marginTop: 10 }}
                isLoading={isLoading}
                rowClassName={record => record.isCancel && styles.rejectRow}
                rowKey={record => record.streamId}
                dataSource={refundStream}
                columns={refundStreamColumns}
                pagination={false}
              />
            </Tabs.TabPane>
          </Tabs>
          <Modal
            confirmLoading={isActing}
            visible={isShowActionModal}
            onCancel={this.handleTriggerActionModal.bind(this, null, null, null)}
            onOk={this.handleOkActionModal.bind(this)}
            value={actionRemark}
            title="操作"
          >
            {
              <div>
                {
                  actionText && actionText.indexOf("审核") === -1 ?
                    <p>请确认是否驳回？</p>
                    : <p>请确认是否审核通过？</p>
                }
                <Input
                  value={actionRemark}
                  onChange={this.handleChange.bind(this, 'actionRemark')}
                  placeholder="备注"
                />
              </div>
            }
          </Modal>
          <Modal
            width={800}
            title="添加退款记录"
            visible={isShowRefundModal}
            confirmLoading={isOperaing}
            onCancel={this.handleClickTriggerRefundModal.bind(this)}
            onOk={this.handleClickOkRefundModal.bind(this)}
          >
            <Row type="flex" align="middle" style={{ marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>
              <span style={{ marginRight: 10 }}>待退款: <span style={{ color: "red" }}>{Number(refundInfo.awaitRefundAmount).toFixed(2)}</span></span>
              <span style={{ marginRight: 10 }}>订单金额: {refundInfo.refundAmount}</span>
              <span style={{ marginRight: 10 }}>已退款: {refundInfo.refundedAmount}</span>
            </Row>
            <Row gutter={{ md: 24 }} type="flex">
              <Col md={12}>
                {/* <Row>
                  <span>退款到: </span>
                  <Input style={{ width: 250, marginLeft: 14 }} value={refundTo} placeholder="999.99" onChange={this.handleChange.bind(this, 'refundTo')} />
                </Row> */}
                <Row>退款方式：{refundType}</Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={7}><span style={{ color: "red" }}>*</span><span>付款帐户: </span></Col>
                  <Col span={17}>
                    <Select style={{ width: 250, marginLeft: 14 }} placeholder="请选择扣款账户" value={withholdAccount === -1 ? undefined : withholdAccount} onSelect={this.handleChange.bind(this, 'withholdAccount')}>
                      {/* <Option key={-1} value={-1}>请选择</Option> */}
                      {
                        withholdAccountMap.map((withholdAccount) => {
                          return <Option key={withholdAccount.id} value={withholdAccount.id}>{withholdAccount.accountInfo}</Option>;
                        })
                      }
                    </Select>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={7}><span style={{ color: "red" }}>*</span><span>付款金额: </span></Col>
                  <Col span={7}>
                    <Input style={{ width: 250, marginLeft: 14 }} value={payAmount} placeholder="999.99" onChange={this.handleChange.bind(this, 'payAmount')} />
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={7}><span>付款时间: </span></Col>
                  <Col span={17}>
                    <DatePicker style={{ width: 250, marginLeft: 14 }} value={payDate ? moment(payDate) : ''} onChange={this.handleChange.bind(this, 'payDate')} />
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={7}><span>银行流水: </span></Col>
                  <Col span={17}>
                    <Input style={{ width: 250 }} onChange={this.handleChange.bind(this, 'transactionSn')} />
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={7}><span>收款方账户信息: </span></Col>
                  <Col span={17}>
                    <Input.TextArea style={{ width: 250 }} onChange={this.handleChange.bind(this, 'receivableCard')} />
                  </Col>
                </Row>
                {/* <Row style={{ marginTop: 10 }}>
                  <span>收款方姓名: </span>
                  <Input style={{ width: 250 }} value={receivableName} placeholder="刘某" onChange={this.handleChange.bind(this, 'receivableName')} />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <span>收款方银行: </span>
                  <Input style={{ width: 250 }} value={receivableBank} placeholder="中国建设银行" onChange={this.handleChange.bind(this, 'receivableBank')} />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <span>收款方卡号: </span>
                  <Input style={{ width: 250 }} value={receivableCard} placeholder="66225566998856320322" onChange={this.handleChange.bind(this, 'receivableCard')} />
                </Row> */}
              </Col>
              <Col md={12}>
                <Row>
                  <span style={{ verticalAlign: 'top', lineHight: 1 }}>财务备注: </span>
                  <Input.TextArea autosize={{ minRows: 3, maxRows: 9 }} style={{ width: 290, marginLeft: 5 }} value={refundRemark} placeholder="客户支付类型，特殊申请信息，账期政策等，协商处理结果写到这里，方便财务对其审核相关业务事项。" onChange={this.handleChange.bind(this, 'refundRemark')} />
                </Row>
              </Col>
            </Row>
          </Modal>
          <Modal
            title="删除退款流水"
            visible={isShowDeleteStreamModal}
            confirmLoading={isOperaing}
            onCancel={this.handleClickTriggerDeleteStreamModal.bind(this)}
            onOk={this.handleClickOkDeleteStreamModal.bind(this)}
          >
            <p>请确认是否删除?</p>
          </Modal>
          <Modal
            title="作废退款流水"
            confirmLoading={isOperaing}
            visible={isShowCancelStreamModal}
            onCancel={this.handleClickTriggerCancelStreamModal.bind(this)}
            onOk={this.handleClickOkCancelStreamModal.bind(this)}
          >
            <p>请确认是否作废?</p>
          </Modal>
          <Modal
            title="退款详情"
            visible={isShowRefundDetailModal}
            onCancel={this.handleClickTriggerRefundDetailModal.bind(this)}
            onOk={this.handleClickTriggerRefundDetailModal.bind(this)}
          >
            <Row>总单号: {orderSn.sn}</Row>
            <Row>收款方姓名: {refundStream[streamIndex] && refundStream[streamIndex].payeeName}</Row>
            <Row>付款金额: {refundStream[streamIndex] && refundStream[streamIndex].amount}</Row>
            <Row>收款方银行: {refundStream[streamIndex] && refundStream[streamIndex].payeeAccount}</Row>
            {/* <Row>收款方卡号: </Row> */}
            <Row>付款时间: {refundStream[streamIndex] && refundStream[streamIndex].time}</Row>
            <Row>结算备注: {refundStream[streamIndex] && refundStream[streamIndex].remark}</Row>
            {/* <Row>流水号: </Row> */}
            <Row>业务员: {saler}</Row>
            {/* <Row>审核员: </Row> */}
          </Modal>
          <Modal
            visible={isShowNoticeModal}
            title="提示"
            footer={null}
            onCancel={this.handleCloseNoticeBoard}
          >
            <p>{noticeText}</p>
            <p>
              {
                isPurchaseOrder ? "关联采购单号：" : "关联采购售后单号："
              }
              {
                noticeOrderList.map(item => {
                  return <Link to={`${forwardUrl}/${item}`} style={{ marginRight: 6 }}>{item}</Link>
                })
              }
            </p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
