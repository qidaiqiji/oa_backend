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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseOrderPayDetail.less';
import globalStyles from '../../assets/style/global.less';

const { TabPane } = Tabs;
const { Option } = Select;

@connect(state => ({
  purchaseOrderPayDetail: state.purchaseOrderPayDetail,
}))
export default class PurchaseOrderPayDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'purchaseOrderPayDetail/getOrderDetail',
      payload: {
        id,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/unmount',
    });
  }

  // tabs 3 --- start ----------------------
  // 点击详情按钮展示弹窗
  handelShowPayInfo(id) {
    const { dispatch, purchaseOrderPayDetail } = this.props;
    const { payInfo } = purchaseOrderPayDetail;
    dispatch({
      type: 'purchaseOrderPayDetail/showPayInfoConfirm',
      payload: {
        id,
        payInfo,
      },
    });
  }
  // 确认弹窗按钮
  handleClickOkPayInfoButtonbind() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/clickOkPayInfoButto',
    });
  }
  // 打开添加付款凭证弹窗
  handleTriggerGenConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/triggerGenConfirm',
    });
  }
  handleChange(key, value) {
    const { dispatch } = this.props;
    const { payInfo } = this.props.purchaseOrderPayDetail;
    if (key === 'payAmount') {
      if (+payInfo.awaitPay < +value.target.value) {
        message.error('付款金额不可大于代付金额!', 0.5);
        return;
      }
    }
    if (typeof value === 'object') {
      dispatch({
        type: 'purchaseOrderPayDetail/change',
        payload: {
          [key]: value.target.value,
        },
      });
    } else {
      dispatch({
        type: 'purchaseOrderPayDetail/change',
        payload: {
          [key]: value,
        },
      });
    }
  }
  handleChangeTime(key, _, dateString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/change',
      payload: {
        [key]: dateString,
      },
    });
  }
  handleClickOkGen() {
    const { dispatch } = this.props;
    const {
      purchaseOrderPayDetail: {
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
      type: 'purchaseOrderPayDetail/clickOkGenConfirm',
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
  handleClickActionPopUP(url, actionText) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/clickActionPopUp',
      payload: {
        url,
        actionText,
      },
    });
  }
  // 取消action弹窗
  handleCancelActionConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/cancelActionConfirm',
    });
  }
  // 修改action备注
  handleChangeActionRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPayDetail/changeActionRemark',
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
      type: 'purchaseOrderPayDetail/clickOkAction',
      payload: {
        id,
        url,
      },
    });
  }

  render() {
    const {
      purchaseOrderPayDetail: {
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
      },
    } = this.props;

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
        title: '付款账户',
        dataIndex: 'receivableAccount',
        key: 'receivableAccount',
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
    const detailColumns = [
      {
        title: '商品图',
        dataIndex: 'goodsThumb',
        key: 'goodsThumb',
        width: 90,
        fixed: 'left',
        render: (src, record) => (
          <img src={src} style={{ width: 55, height: 55 }} />
        ),
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        width: 140,
        render: (goodsSn) => {
          return <span>{goodsSn}</span>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 300,
        render: (goodsName) => {
          return <span>{goodsName}</span>;
        },
      },
      {
        title: '采购数',
        dataIndex: 'purchaseNum',
        key: 'purchaseNum',
        render: (purchaseNum) => {
          return <span>{purchaseNum}</span>;
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: (salePrice) => {
          return <span>{salePrice}</span>;
        },
      },
      {
        title: '零售价/平台单价/折扣',
        dataIndex: 'salePriceInfo',
        key: 'salePriceInfo',
        render: (_, record) => {
          return <p><span style={{ color: '#cc0000' }}>{record.retailPrice}</span>/<span style={{ color: '#FF6633' }}>{record.platformUnitPrice}</span>/<span style={{ color: '#009dda' }}>{record.saleDiscount}</span></p>;
        },
      },
      {
        title: '销售合计',
        dataIndex: 'saleSubtotal',
        key: 'saleSubtotal',
        render: (saleSubtotal) => {
          return <span>{saleSubtotal}</span>;
        },
      },
      {
        title: '客户运费政策',
        dataIndex: 'shippingDesc',
        key: 'shippingDesc',
        render: (shippingDesc) => {
          return <span>{shippingDesc}</span>;
        },
      },
      {
        title: '销售含税',
        dataIndex: 'saleIsTax',
        key: 'saleIsTax',
        render: (saleIsTax) => {
          return <span>{saleIsTax ? '是' : '否'}</span>;
        },
      },
      {
        title: '采购含税',
        dataIndex: 'purchaseIsTax',
        key: 'purchaseIsTax',
        render: (purchaseIsTax) => {
          return <span>{purchaseIsTax ? '是' : '否'}</span>;
        },
      },
      {
        title: '采购单价/折扣',
        dataIndex: 'purchasePriceInfo',
        key: 'purchasePriceInfo',
        render: (_, record) => {
          return <p><span style={{ color: '#FF6633' }}>{record.purchasePrice}</span>/<span style={{ color: '#009DDA' }}>{record.purchaseDiscount}</span></p>;
        },
      },
      {
        title: '采购合计',
        dataIndex: 'subtotal',
        key: 'subtotal',
        render: (subtotal) => {
          return subtotal;
        },
      },
      {
        title: '毛利率',
        dataIndex: 'rate',
        key: 'rate',
      },
      {
        title: '待发数',
        dataIndex: 'awaitNum',
        key: 'awaitNum',
        render: (awaitNum) => {
          return <span style={{ color: '#FF348D' }}>{awaitNum}</span>;
        },
      },
      {
        title: '已发数',
        dataIndex: 'sentNum',
        key: 'sentNum',
        render: (sentNum) => {
          return <span style={{ color: '#308000' }}>{sentNum}</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        fixed: 'right',
        render: (remark) => {
          return (
            <Tooltip title={remark}>
              <span className={globalStyles['ellipsis-col']}>{remark}</span>
            </Tooltip>
          );
        },
      },
    ];
    const conventionalColumns = [
      {
        title: '商品图',
        dataIndex: 'goodsThumb',
        key: 'goodsThumb',
        render: (src, record) => (
          <img src={src} style={{ width: 55, height: 55 }} />
        ),
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        render: (goodsSn) => {
          return <span>{goodsSn}</span>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (goodsName) => {
          return <span>{goodsName}</span>;
        },
      },
      {
        title: '采购数',
        dataIndex: 'purchaseNum',
        key: 'purchaseNum',
        render: (purchaseNum) => {
          return <span>{purchaseNum}</span>;
        },
      },
      {
        title: '零售价/平台单价/折扣',
        dataIndex: 'salePriceInfo',
        key: 'salePriceInfo',
        render: (_, record) => {
          return <p><span style={{ color: '#cc0000' }}>{record.retailPrice}</span>/<span style={{ color: '#FF6633' }}>{record.platformUnitPrice}</span>/<span style={{ color: '#009dda' }}>{record.saleDiscount}</span></p>;
        },
      },
      {
        title: '采购含税',
        dataIndex: 'purchaseIsTax',
        key: 'purchaseIsTax',
        render: (purchaseIsTax) => {
          return <span>{purchaseIsTax ? '是' : '否'}</span>;
        },
      },
      {
        title: '采购单价/折扣',
        dataIndex: 'purchasePriceInfo',
        key: 'purchasePriceInfo',
        render: (_, record) => {
          return <p><span style={{ color: '#FF6633' }}>{record.purchasePrice}</span>/<span style={{ color: '#009DDA' }}>{record.purchaseDiscount}</span></p>;
        },
      },
      {
        title: '采购合计',
        dataIndex: 'subtotal',
        key: 'subtotal',
        render: (subtotal) => {
          return subtotal;
        },
      },
      {
        title: '待发数',
        dataIndex: 'awaitNum',
        key: 'awaitNum',
        render: (awaitNum) => {
          return <span style={{ color: '#FF348D' }}>{awaitNum}</span>;
        },
      },
      {
        title: '已发数',
        dataIndex: 'sentNum',
        key: 'sentNum',
        render: (sentNum) => {
          return <span style={{ color: '#308000' }}>{sentNum}</span>;
        },
      },
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
    const subOrderGoodsColumns = [
      {
        title: '商品图',
        dataIndex: 'goodsThumb',
        key: 'goodsThumb',
        render: (src, record) => (
          <img src={src} style={{ width: 55, height: 55 }} />
        ),
      },
      {
        title: '商品名',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品编码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        render: isTax => (
          <span>{isTax ? '是' : '否'}</span>
        ),
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
      },
    ];
    return (
      <PageHeaderLayout title="采购应付详情" className={styles.addPageHeader}>
        <Card bordered={false} loading={isLoading}>
          <div className={styles.tableList}>
            <Tabs
              tabBarExtraContent={
                actionList && actionList.length > 0 ?
                  actionList.map((actionInfo) => {
                    return (
                      <Button
                        style={{ marginLeft: '15px' }}
                        onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name)}
                      >
                        {actionInfo.name}
                      </Button>
                    );
                  })
                :
                  null
              }
            >
              <TabPane tab="采购单详情" key="1">
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  <span style={{ marginRight: 40, fontSize: 20, color: '#FC403B' }}>{detail.status}</span>
                  <span style={{ marginRight: 40 }}>供应商:{detail.supplier}</span>
                  <span style={{ marginRight: 40 }}>采购员:{detail.purchaser}</span>
                  <span>日期:{detail.time}</span>
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  采购单号:{detail.purchaseOrderSn}
                </Row>
                <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                  关联子订单:{detail.subOrderSnStr}
                </Row>
                <Table
                  bordered
                  dataSource={detail.goodsList}
                  columns={isSale ? detailColumns : conventionalColumns}
                  pagination={false}
                  scroll={{ x: isSale ? 1850 : '' }}
                  rowKey={record => record.id}
                  footer={() => (
                    [
                      <Row type="flex" justify="end" align="middle">
                        应付金额: <span style={{ color: '#FF3333', fontWeight: '600' }}>{+payInfo.purchaseAmount}</span>
                      </Row>,
                      <Row>
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>财务备注</span> {detail.financeRemark}
                      </Row>,
                      <Row>
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>支付类型</span> {payMethodMap[detail.payType]}
                      </Row>,
                      <Row>
                        <span style={{ color: '#797979', fontSize: '18px', fontWeight: '600', marginRight: 10 }}>采购制单备注</span>
                        <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                          {
                            detail.noteList.length > 0 ?
                              detail.noteList.map((item) => {
                                return <p>{item}</p>;
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
                        <Collapse.Panel header={`采购单号: ${purchaseOrder.sn} 状态: ${purchaseOrder.status} 时间: ${purchaseOrder.time}`} key={index}>
                          <Table
                            bordered
                            rowKey={record => record.id}
                            dataSource={purchaseOrder.goodsList}
                            columns={subOrderGoodsColumns}
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
                        <Collapse.Panel header={`采购单号: ${purchaseOrder.sn} 时间: ${purchaseOrder.time}`}>
                          {
                            purchaseOrder.subOrderList.map(subOrder => (
                              <Table
                                bordered
                                style={{ marginBottom: 25 }}
                                rowKey={record => record.id}
                                dataSource={subOrder.goodsList}
                                columns={subOrderGoodsColumns}
                                scroll={{ x: 1900 }}
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
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px' }}>
                    <div style={{ display: 'inline-block', marginLeft: '20px', marginTop: '10px' }}>
                      <span style={{ fontSize: '22px', color: '#666666', fontWeight: '600' }}>付款信息</span>
                    </div>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px', fontSize: '20px', color: '#666666' }}>
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
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 20, height: '40px', lineHeight: '40px', fontSize: '20px' }}>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      应付货款：<span style={{ fontWeight: '600' }}>{payInfo.payable}</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      应付运费：<span style={{ fontWeight: '600' }}>{payInfo.shippingFee}(线下报销)</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      应付卸货费：<span style={{ fontWeight: '600' }}>{payInfo.unloadFare}(线下报销)</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      应付总额: <span style={{ fontWeight: '600', color: '#FF0E4C' }}>{payInfo.payAmount }</span>
                    </div>
                    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                      已付总额：<span style={{ fontWeight: '600', color: '#FF0E4C' }}>{payInfo.alreadyPay}</span>
                    </div>
                  </Row>
                  <Button onClick={this.handleTriggerGenConfirm.bind(this)} type="primary" style={{ display: 'inline-block', position: 'absolute', top: 120, right: 20 }}>添加付款凭证</Button>
                </div>

                <Table
                  bordered
                  loading={isLoading}
                  columns={payColumns}
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
            <Input.TextArea
              placeholder="此处添加备注信息"
              style={{ width: 400, marginLeft: 30 }}
              value={actionRemark || null}
              onChange={this.handleChangeActionRemark.bind(this)}
              autosize
            />
            <p style={{ textAlign: 'center' }}>{`请确认是否${actionText}订单`}</p>
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
              <span style={{ margin: '0 10px', fontSize: 18, fontWeight: 'bold', color: '#333333' }}>订单金额: {+payInfo.purchaseAmount}</span>
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
                  <Select value={payMethod} onChange={this.handleChange.bind(this, 'payMethod')} style={{ width: 115, margin: '0 12px' }}>
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
                      <Row style={{ margin: '8px 0' }}>
                        <span>付款金额:</span>
                        <Input value={payAmount} onChange={this.handleChange.bind(this, 'payAmount')} style={{ width: 160, margin: '0 12px' }} />
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
