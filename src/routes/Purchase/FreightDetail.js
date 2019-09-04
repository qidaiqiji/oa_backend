import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, DatePicker, Select, Row, Col, Button, Icon, Tooltip, Upload, Tabs, Dropdown, Menu, Form, Modal } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FreightDetail.less';
const TabPane = Tabs.TabPane;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
@connect(state => ({
  freightDetail: state.freightDetail,
}))
@Form.create()
export default class FreightDetail extends PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/getDetailInfo',
      payload: {
        shippingFeeId: id,
        isTableLoading: true,
      }
    })
    dispatch({
      type: 'freightDetail/getConfig',
    })

  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/unmountReducer',
    })
  }
  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'freightDetail/handleCommit',
          payload: {
            values,
          }
        })
      }
    });
  }
  handleUploadCertificeta = () => {
    const { dispatch,form } = this.props;
    form.resetFields();
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        uploadModal: true,
      }
    })
  }
  handleCloseModal = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        [type]: false,
      }
    })
  }
  handleAction = (actionRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        actionRecord,
        actionModal: true,
      }
    })
  }
  handleChangeRejectRemark = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        rejectRemark: e.target.value,
      }
    })
  }
  handleConfirmAction = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/confirmAction',
    })
  }
  handleShowDeleteModal = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        deleteRecord: record,
        showDeleteModal: true,
      }
    });
  }
  handleDeleteRecord = () => {
    const { dispatch, freightDetail } = this.props;
    const { deleteRecord } = freightDetail;
    dispatch({
      type: 'freightDetail/deleteRecord',
      payload: {
        id: deleteRecord.id,
        showDeleteModal: false,
      }
    });
  }
  handleShowRecordDetailModal = (detailRecord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightDetail/updatePageReducer',
      payload: {
        detailRecord,
        isShowPayInfoConfirm: true,
      }
    })
  }
  render() {
    const {
      form,
      freightDetail: {
        isTableLoading,
        total,
        id,
        status,
        supplierName,
        purchaser,
        createTime,
        payType,
        bankInfo,
        remark,
        shippingInfoList,
        relatePurchaseOrderIdList,
        alreadyPayAmount,
        amount,
        recordList,
        buttonLoading,
        statusMap,
        totalAmount,
        payTypeMap,
        uploadModal,
        purchaserMap,
        collectAccountMap,
        payMethod,
        collectAccountId,
        transactionSn,
        payAmount,
        actionList,
        actionModal,
        actionRecord,
        waitPayAmount,
        showDeleteModal,
        isShowPayInfoConfirm,
        detailRecord,
      },
    } = this.props;
    const commonUrl = '/purchase/purchase-order-management/common-purchase-list/common-purchase-detail';
    const saleUrl = '/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail';
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const remarkItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    }
    const columns = [
      {
        title: '费用类型',
        key: 'type',
        dataIndex: 'type',
        render: () => {
          return <span>运费</span>
        }
      },
      {
        title: '支付流水单号',
        key: 'transactionSn',
        dataIndex: 'transactionSn',
      },
      {
        title: '关联采购单号',
        key: 'purchaseOrderList',
        dataIndex: 'purchaseOrderList',
        render: (purchaseOrderList) => {
          return purchaseOrderList.map(item => (
            <Link to={item.isSale ? `${commonUrl}/${item.id}` : `${saleUrl}/${item.id}`}>{`${item.id} `}</Link>
          ))
        }
      },
      {
        title: '支付时间',
        key: 'createTime',
        dataIndex: 'createTime',
      },
      {
        title: '付款金额',
        key: 'money',
        dataIndex: 'money',
      },
      {
        title: '支付方式',
        key: 'payType',
        dataIndex: 'payType',
      },
      {
        title: '付款账户',
        key: 'financialAccount',
        dataIndex: 'financialAccount',
      },
      {
        title: '财务备注',
        key: 'remark',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        render: (_, record) => {
          return <Dropdown
            placement="bottomCenter"
            overlay={(
              <Menu>
                <Menu.Item>
                  <div onClick={this.handleShowDeleteModal.bind(this, record)}>
                    <Icon type="delete" />作废
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div onClick={this.handleShowRecordDetailModal.bind(this, record)}>
                    <Icon type="bars" />详情
                  </div>
                </Menu.Item>
              </Menu>
            )}
          >
            <Icon type="ellipsis" />
          </Dropdown>
        }
      },
    ]
    return (
      <PageHeaderLayout title="应付运费详情">
        <Card bordered={false} loading={isTableLoading}>
          <Tabs
            tabBarExtraContent={
              <div className={styles.buttonbox}>
                {
                  actionList.map(item => {
                    return <Button onClick={this.handleAction.bind(this, item)} style={{ marginRight: 10 }}>{item.name}</Button>
                  })
                }
              </div>
            }
          >
            <TabPane tab="运费详情" key="1">
              <Row className={styles.line}>
                <div style={{ color: 'red', fontSize: '18px' }}>{statusMap[status]}</div>
                <div>应付运费单号: <span>{id}</span></div>
                <div>供应商: <span>{supplierName}</span></div>
                <div>采购员: <span>{purchaserMap[purchaser]}</span></div>
                <div>申请日期: <span>{createTime}</span></div>
              </Row>
              {
                shippingInfoList.map(item => {
                  return <Card key={item.id} style={{ marginBottom: 10 }}>
                    <Row>
                      <div style={{ display: 'inline-block', fontSize: 18, marginRight: 20 }}>运费信息</div>
                      <span style={{ display: 'inline-block', marginRight: 20 }}>关联采购单号:<Link to={`${commonUrl}/${item.purchaseOrderId}`}>{`${item.purchaseOrderId} `}</Link></span>
                    </Row>
                    {
                      item.purchaseShippingList.map(shippingItem => {
                        return <Row className={styles.line}>
                          <div>物流单号: <span>{shippingItem.shippingNo}</span></div>
                          <div>物流公司: <span>{shippingItem.shippingCompany}</span></div>
                          <div>基础运费: <span>{shippingItem.amount}</span></div>
                          <div>归属运费: <span>{shippingItem.payAmount}</span></div>
                        </Row>
                      })
                    }
                    <Row className={styles.marginBottom}>
                      <span style={{ color: "#1890ff" }}>运费凭证</span>
                    </Row>

                    <Row className={styles.marginBottom}>
                      {
                        item.shippingImgList && item.shippingImgList.map(imgInfo => {
                          return <span className={styles.imgBox}>
                            <img src={imgInfo.imgUrl} />
                          </span>
                        })
                      }
                    </Row>
                    <Row className={styles.marginBottom}>
                      <div>运费总额: <span style={{ fontSize: 20, color: 'red' }}>{item.totalAmount}</span></div>
                    </Row>
                    <Row className={styles.marginBottom}>
                      <Col span={1}>备注：</Col>
                      <Col span={10}>
                        <pre>{item.remark}</pre>
                      </Col>
                    </Row>
                  </Card>
                })
              }
              <div style={{ marginTop: 30 }}>
                <Row className={styles.foot}>
                  <Row>
                    <Col span={2}>应付运费总额</Col>
                    <Col span={20}><span style={{ color: 'red', fontSize: 20 }}>{totalAmount}</span></Col>
                  </Row>
                  <Row>
                    <Col span={2}>支付类型</Col>
                    <Col span={20}><span>{payTypeMap[payType]}</span></Col>
                  </Row>
                  <Row>
                    <Col span={2}>财务信息</Col>
                    <Col span={20}><span>{bankInfo}</span></Col>
                  </Row>
                  <Row>
                    <Col span={2}>申请运费备注</Col>
                    <Col span={20}><span>{remark}</span></Col>
                  </Row>
                </Row>
              </div>
            </TabPane>
            <TabPane tab="付款记录" key="2">
              <div className={styles.title}>
                <Row className={styles.line}>
                  <div>应付运费单号: <span>{id}</span></div>
                  <div>供应商: <span>{supplierName}</span></div>
                  <div>采购员: <span>{purchaserMap[purchaser]}</span></div>
                  <div>关联采购单号:
                    {
                      relatePurchaseOrderIdList.map(item => (
                        <Link to={item.isSale ? `${commonUrl}/${item.id}` : `${saleUrl}/${item.id}`}>{`${item.id} `}</Link>
                      ))
                    }
                  </div>
                </Row>
                <Row className={styles.line}>
                  <Col span={18}>
                    <div>应付运费总额: <span style={{ color: "red" }}>{totalAmount}</span></div>
                    <div>已付总额: <span>{alreadyPayAmount}</span></div>
                    <div>剩余未付总额: <span>{waitPayAmount}</span></div>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={this.handleUploadCertificeta}>上传付款凭证</Button>
                  </Col>
                </Row>
              </div>
              <Table
                bordered
                dataSource={recordList}
                columns={columns}
                loading={isTableLoading}
                rowKey={record => record.id}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          visible={uploadModal}
          title="添加收款凭证"
          onCancel={this.handleCloseModal.bind(this, 'uploadModal')}
          width={600}
          onOk={this.handleSubmit}
        >
          <Row className={styles.topLine}>
            <div>
              待收款金额: <span style={{ color: 'red' }}>{waitPayAmount}</span>
            </div>
            <div>
              运费金额: <span>{totalAmount}</span>
            </div>
            <div>
              已支付: <span>{alreadyPayAmount}</span>
            </div>
            <div>
              付款方式: <span>{payTypeMap[payType]}</span>
            </div>
          </Row>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={20}>
                <Form.Item {...formItemLayout} label="支付方式">
                  {
                    getFieldDecorator('payMethod', {
                      initialValue: payMethod,
                      rules: [
                        {
                          required: true, message: '请选择支付方式',
                        }
                      ]
                    })(
                      <Select
                        placeholder="请选择支付方式"
                        style={{ width: 200 }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                      >
                        {
                          Object.keys(payTypeMap).map(item => {
                            return <Option key={item} value={item}>{payTypeMap[item]}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item {...formItemLayout} label="付款账户">
                  {
                    getFieldDecorator('collectAccountId', {
                      initialValue: collectAccountId,
                      rules: [
                        {
                          required: true, message: '请选择付款账户',
                        }
                      ]
                    })(
                      <Select
                        placeholder="请选择付款账户"
                        style={{ width: 200 }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                      >
                        {
                          collectAccountMap.map(item => {
                            return <Option key={item.id} value={item.id}>{item.accountInfo}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item {...formItemLayout} label="银行流水">
                  {
                    getFieldDecorator('transactionSn', {
                      initialValue: transactionSn,
                      rules: [
                        {
                          required: true, message: '请输入银行流水',
                        },
                      ]
                    })(
                      <Input style={{ width: 200 }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item {...formItemLayout} label="付款金额">
                  {
                    getFieldDecorator('payAmount', {
                      initialValue: payAmount,
                      rules: [
                        {
                          required: true, message: '请输入金额',
                        },
                      ]
                    })(
                      <Input style={{ width: 200 }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item {...remarkItemLayout} label="备注">
                {
                  getFieldDecorator('remark', {
                    // initialValue:remark, 
                  })(
                    <TextArea rows={4} style={{ width: 500 }} />
                  )
                }
              </Form.Item>
            </Row>
          </Form>
        </Modal>
        <Modal
          visible={actionModal}
          title="确认"
          onCancel={this.handleCloseModal.bind(this, 'actionModal')}
          onOk={this.handleConfirmAction}
        >
          {`请确认是否${actionRecord.name}`}
          {
            actionRecord.name && actionRecord.name.indexOf("驳回") > -1 ?
              <TextArea rows={4}
                onChange={this.handleChangeRejectRemark}
                placeholder="请填写驳回备注"
              /> : ''
          }
        </Modal>
        <Modal
          title="确认"
          visible={showDeleteModal}
          onOk={this.handleDeleteRecord}
          onCancel={this.handleCloseModal.bind(this, 'showDeleteModal')}
        >
          请确认是否作废？
          </Modal>
        <Modal
          width={1000}
          visible={isShowPayInfoConfirm}
          onCancel={this.handleCloseModal.bind(this, 'isShowPayInfoConfirm')}
          footer={null}
        >
          <div style={{ height: '60px', lineHeight: '60px', backgroundColor: '#E5E5E5' }}>
            <span style={{ fontSize: '20px', fontWeight: '600', marginLeft: '25px' }}>采购订单付款详情</span>
          </div>
          <Row className={styles.detail}>
            <span>费用类型: 运费</span>
          </Row>
          <Row className={styles.detail}>
            <span>支付时间: {detailRecord.createTime}</span>
          </Row>
          <Row className={styles.detail}>
            <span>支付流水单号: {detailRecord.transactionSn}</span>
          </Row>
          <Row className={styles.detail}>
            <span>付款金额: {detailRecord.money}</span>
          </Row>
          <Row className={styles.detail}>
            <span>付款账户:{detailRecord.financialAccount}</span>
          </Row>
          <Row className={styles.detail}>
            <span>财务备注:{detailRecord.remark}</span>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
