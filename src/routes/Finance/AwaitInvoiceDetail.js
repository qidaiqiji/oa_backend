import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitInvoiceDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
@connect(state => ({
  awaitInvoiceDetail: state.awaitInvoiceDetail,
}))
export default class awaitInvoiceDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id, detail } = this.props.match.params;
    const isSale = (detail === 'await-invoice-detail');
    dispatch({
      type: 'awaitInvoiceDetail/mount',
      payload: {
        id,
      },
    });
    dispatch({
      type: 'awaitInvoiceDetail/updateState',
      payload: {
        id,
        isSale,
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'awaitInvoiceDetail/unmount',
    });
  }
  handleCreateInvoice(invoiceId) {
    const { dispatch } = this.props;
    const { id } = this.props.awaitInvoiceDetail;
    console.log('开票');
    const ids = [].concat(invoiceId);
    dispatch({
      type: 'awaitInvoiceDetail/invoiceOutStorage',
      payload: {
        ids,
      },
    }).then(() => {
      dispatch({
        type: 'awaitInvoiceDetail/getAwaitInvoiceDetailData',
        payload: {
          id,
        },
      });
    });
  }
  handleUpdateInvoice(invoiceId) {
    const { dispatch } = this.props;
    const { id, updateInvList, awaitInvDetailData } = this.props.awaitInvoiceDetail;
    const { awaitInvList } = awaitInvDetailData;
    const index = awaitInvList.findIndex(element => element.id === invoiceId);
    if (+invoiceId === +updateInvList.invId) {
      // awaitInvList[index].edit = false;
      dispatch({
        type: 'awaitInvoiceDetail/updateInvoiceInfo',
        payload: {
          ...updateInvList,
        },
      }).then(() => {
        dispatch({
          type: 'awaitInvoiceDetail/getAwaitInvoiceDetailData',
          payload: {
            id,
          },
        });
      });
    } else {
      console.log(invoiceId);
      awaitInvList[index].edit = false;
      dispatch({
        type: 'awaitInvoiceDetail/updateState',
        payload: {
          awaitInvDetailData,
        },
      });
    }
  }
  handleOperator(url, backUrl) {
    const { dispatch } = this.props;
    console.log(typeof backUrl);
    if (typeof backUrl === 'string') {
      dispatch({
        type: 'awaitInvoiceDetail/updateState',
        payload: {
          backUrl,
        },
      });
    }
    dispatch({
      type: 'awaitInvoiceDetail/handleOperatorRequest',
      payload: {
        url,
      },
    });
  }
  handlePost(url) {
    const { dispatch } = this.props;
    console.log(url);
    dispatch({
      type: 'awaitInvoiceDetail/handlePostRequest',
      payload: {
        url,
      },
    });
  }
  // 显示action弹窗
  handleClickActionPopUP(url, actionText, backUrl) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitInvoiceDetail/updateState',
      payload: {
        url,
        actionText,
        backUrl,
        isShowActionConfirm: true,
      },
    });
  }
  // 取消action弹窗
  handleCancelActionConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitInvoiceDetail/updateState',
      payload: {
        isShowActionConfirm: false,
      },
    });
  }
  // 确定 action 弹窗提交 action
  handleClickOkAction(url) {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'awaitInvoiceDetail/clickOkAction',
      payload: {
        id,
        url,
      },
    });
  }
  handleChangeInputValue(type, e) {
    const { dispatch } = this.props;
    console.log(type);
    console.log(e);
    switch (type) {
      case 'actionRemark':
        dispatch({
          type: 'awaitInvoiceDetail/updateState',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      default:
        break;
    }
  }
  handleChangeInvoiceInfo(type, id, e, dateString) {
    const { dispatch } = this.props;
    const { updateInvList, awaitInvDetailData } = this.props.awaitInvoiceDetail;
    const { awaitInvList } = awaitInvDetailData;
    const index = awaitInvList.findIndex(element => element.id === id);
    const updateData = Object.assign({}, updateInvList);
    console.log(type);
    console.log(id);
    console.log(e);
    switch (type) {
      case 'invNo':
        updateData.invSn = e.target.value;
        updateData.financeRemark = awaitInvList[index].financeRemark ? awaitInvList[index].financeRemark : updateData.financeRemark;
        updateData.invId = id;
        updateData.invDate = awaitInvList[index].invDate ? awaitInvList[index].invDate : updateData.invDate;
        console.log(updateData);
        console.log(awaitInvList[index].invDate);
        dispatch({
          type: 'awaitInvoiceDetail/updateState',
          payload: {
            updateInvList: updateData,
          },
        });
        break;
      case 'invDate':
        updateData.invSn = awaitInvList[index].invNo ? awaitInvList[index].invNo : updateData.invSn;
        updateData.financeRemark = awaitInvList[index].financeRemark ? awaitInvList[index].financeRemark : updateData.financeRemark;
        updateData.invDate = dateString;
        updateData.invId = id;
        dispatch({
          type: 'awaitInvoiceDetail/updateState',
          payload: {
            updateInvList: updateData,
          },
        });
        break;
        case 'financeRemark':
        updateData.financeRemark = e.target.value;
        updateData.invSn = awaitInvList[index].invNo ? awaitInvList[index].invNo : updateData.invSn;
        updateData.invId = id;
        updateData.invDate = awaitInvList[index].invDate ? awaitInvList[index].invDate : updateData.invDate;
        dispatch({
          type: 'awaitInvoiceDetail/updateState',
          payload: {
            updateInvList: updateData,
          },
        });
        break;

      default:
        break;
    }
  }
  handleClickEditIcon(id) {
    const { dispatch } = this.props;
    const { awaitInvDetailData } = this.props.awaitInvoiceDetail;
    const { awaitInvList } = awaitInvDetailData;
    const index = awaitInvList.findIndex(element => element.id === id);
    console.log(id);
    awaitInvList[index].edit = true;
    dispatch({
      type: 'awaitInvoiceDetail/updateState',
      payload: {
        awaitInvDetailData,
      },
    });
  }
  render() {
    const {
      // 数据
      awaitInvDetailData: {
        suitInvGoodsList,
        notSuitInvGoodsList,
        awaitInvList,
        storageInvList,
      },
      awaitInvDetailData,
      // 控制样式
      isLoading,
      isShowActionConfirm,
      url,
      actionRemark,
      actionText,
      isSale,

    } = this.props.awaitInvoiceDetail;
    console.log("awaitInvDetailData",awaitInvDetailData)
    const createInvoiceOutAllId = awaitInvList.map(invoiceInfo => invoiceInfo.id);
    // 对应明细列表
    const suitInvColumn = [
      {
        title: '总单号',
        dataIndex: 'groupSn',
        key: 'groupSn',
        align: 'center',
        render: (value, record) => {
          return <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.id}`}>{value}</Link>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        width: '100px',
      },
      {
        title: '销售单价',
        dataIndex: 'salePrice',
        align: 'center',
        key: 'salePrice',
        render: (_,record) => {
          return <span>{record.priceWarning?(<span style={{ color: 'red'}}><Icon type="warning" theme="outlined" style={{color:"orange"}}/>{record.salePrice}</span>):(<span>{record.salePrice}</span>)}</span>          
        },
        
      },
      {
        title: '销售合计',
        dataIndex: 'saleAmount',
        align: 'center',
        key: 'saleAmount',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        align: 'center',
        key: 'orderSn',
      },
    ];
    // 不对应明细列表
    const notSuitInvColumn = [
      {
        title: '总单号',
        dataIndex: 'groupSn',
        key: 'groupSn',
        align: 'center',
        render: (value, record) => {
          return <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.id}`}>{value}</Link>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        align: 'center',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '替代商品名称',
        dataIndex: 'marketGoodsName',
        key: 'marketGoodsName',
        align: 'center',
      },
      {
        title: '发票商品条码',
        dataIndex: 'invGoodsSn',
        key: 'invGoodsSn',
        align: 'center',
      },
      {
        title:'可开票价',
        dataIndex:'minPrice',
        key:'minPrice',
        align:'center',
      },
      {
        title: '销售数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        width: '100px',
      },
      {
        title: '销售单价',
        dataIndex: 'salePrice',
        align: 'center',
        key: 'salePrice',
        render: (_,record) => {
          return <span>{record.priceWarning?(<span style={{ color: 'red'}}><Icon type="warning" theme="outlined" style={{color:"orange"}}/>{record.salePrice}</span>):(<span>{record.salePrice}</span>)}</span>          
        },
      },
      {
        title: '销售合计',
        dataIndex: 'saleAmount',
        align: 'center',
        key: 'saleAmount',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        align: 'center',
        key: 'orderSn',
      },
    ];
    // 待开票列表
    const awaitInvColumn = [
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        align: 'center',
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        align: 'center',
        width: '100px',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        align: 'center',
        key: 'unit',
        width: '80px',
      },
      {
        title: '数量',
        dataIndex: 'num',
        align: 'center',
        key: 'num',
      },
      {
        title: '单价',
        dataIndex: 'invPrice',
        align: 'center',
        key: 'invPrice',
      },
      {
        title: '金额',
        dataIndex: 'invAmount',
        align: 'center',
        key: 'invAmount',
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        align: 'center',
        key: 'taxAmount',
      },
      {
        title: '价税合计',
        dataIndex: 'totalAmount',
        align: 'center',
        key: 'totalAmount',
        render: (value) => {
          return <span style={{ color: 'red' }}>{value}</span>;
        },
      },
    ];

    return (
      <PageHeaderLayout title="待开票详情">
        <Card bordered={false} >
          <Tabs size="large" tabBarStyle={{ fontSize: 24 }} >
            <TabPane tab="待开票详情" key="1">
              <div className={styles.extraButton}>
                {
                  awaitInvDetailData.actionList ?
                    awaitInvDetailData.actionList.map((actionInfo) => {
                        switch (+actionInfo.type) {
                          case 1:
                            return (
                              <Button
                                style={{ marginLeft: 10 }}
                                type="primary"
                                key={actionInfo.url}
                                onClick={this.handlePost.bind(this, actionInfo.url)}
                              >
                                {actionInfo.name}
                              </Button>
                            );
                          case 2:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                              >
                                <Button type="primary" style={{ marginLeft: 10 }} key={actionInfo.url} >{actionInfo.name}</Button>
                              </a>
                            );
                            break;
                          case 4:
                            return (
                              <Popconfirm
                                title={`确认${actionInfo.name}?`}
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={actionInfo.backUrl ? this.handleOperator.bind(this, actionInfo.url, actionInfo.backUrl) : this.handleOperator.bind(this, actionInfo.url)}
                              >
                                <Button
                                  style={{ marginLeft: 10 }}
                                  type="primary"
                                >
                                  {actionInfo.name}
                                </Button>
                              </Popconfirm>
                            );
                            break;
                          default:
                            return (
                              actionInfo.backUrl ?
                                <Button
                                  style={{ marginLeft: 10 }}
                                  type="primary"
                                  key={actionInfo.url}
                                  onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                                >
                                  {actionInfo.name}
                                </Button>
                                :
                                <Button
                                  style={{ marginLeft: 10 }}
                                  type="primary"
                                  onClick={this.handleOperator.bind(this, actionInfo.url)}
                                >
                                  {actionInfo.name}
                                </Button>
                            );
                      }
                    }) : null
                }
              </div>
              <Card bordered={false} style={{ background: '#f2f2f2' }}>
                <Row gutter={16} >
                  <Col span={2} className={styles.amountStyle} >
                    {awaitInvDetailData.status}
                  </Col>
                  <Col span={4} >
                    应开票金额：<span className={styles.amountStyle} >{awaitInvDetailData.invAmount}</span>
                  </Col>
                  <Col span={4} >
                    申请开票号：<span className={styles.largeSize}>{awaitInvDetailData.invSn}</span>
                  </Col>
                </Row>
                <Row gutter={16} >
                  <Col span={3} >
                    客户名：<span className={styles.largeSize}>{awaitInvDetailData.customerName}</span>
                  </Col>
                  <Col span={6} >
                    门店名称：<span className={styles.largeSize}>{awaitInvDetailData.companyName}</span>
                  </Col>
                  <Col span={4} >
                    业务员：<span className={styles.largeSize}>{awaitInvDetailData.seller}</span>
                  </Col>
                </Row>
                <Row gutter={16} style={{ background: '#ffffe5', padding: '20px 10px', margin: '10px 0' }} >
                  <Row gutter={16} >
                    <Col span={6} >
                      是否对应明细：<span className={styles.largeSize} style={{ marginLeft: '10px' }}>{awaitInvDetailData.isSuitDetail}</span>
                    </Col>
                    <Col span={6} >
                      发票类型：<span style={{ marginLeft: '10px', color:awaitInvDetailData.invInfo&&awaitInvDetailData.invInfo.color}} >{ awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.invType : ''}</span>
                    </Col>
                  </Row>
                  <Row gutter={16} >
                    <Col span={6} >
                      开票公司名称：<span style={{ marginLeft: '10px' }}>{awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.invCompany : ''}</span>
                    </Col>
                    <Col span={6} >
                      纳税人标识号：<span style={{ marginLeft: '10px' }} >{ awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.companyTaxId : ''}</span>
                    </Col>
                    <Col span={6} >
                      开户银行：<span style={{ marginLeft: '10px' }} >{ awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.bank : ''}</span>
                    </Col>
                    <Col span={6} >
                      银行账号：<span style={{ marginLeft: '10px' }} >{ awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.bankAccount : ''}</span>
                    </Col>
                  </Row>
                  <Row gutter={16} >
                    <Col span={9} >
                      地址/电话：
                      <span style={{ marginLeft: '10px' }}>
                        <span>{awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.address : ''}</span>/
                        <span>{awaitInvDetailData.invInfo ? awaitInvDetailData.invInfo.phoneNumber : ''}</span>
                      </span>
                    </Col>
                    <Col span={6} >
                      销售备注：<span style={{ marginLeft: '10px' }} >{ awaitInvDetailData.sellerRemark}</span>
                    </Col>
                  </Row>
                </Row>
              </Card>
              {/* 对应明细开票 */}
              <Row gutter={16} >
                <Col span={9} style={{ color: '#008000', fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>
                  对应明细开票
                </Col>
              </Row>
              <Table
                bordered
                dataSource={suitInvGoodsList}
                columns={suitInvColumn}
                loading={isLoading}
                size="small"
                rowKey={record => record.id}
                pagination={false}
              />
              {/* 不对应明细开票 */}
              <Row gutter={16} >
                <Col span={9} style={{ color: 'red', fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>
                  不对应明细开票
                </Col>
              </Row>
              <Table
                bordered
                dataSource={notSuitInvGoodsList}
                columns={notSuitInvColumn}
                loading={isLoading}
                size="small"
                rowKey={record => record.id}
                pagination={false}
              />
              {/* actionList弹窗 */}
              <Modal
                width={500}
                title={`请确认是否${actionText}？`}
                visible={isShowActionConfirm}
                // confirmLoading={isActioning}
                onOk={this.handleClickOkAction.bind(this, url)}
                onCancel={this.handleCancelActionConfirm.bind(this)}
              >
                <Input.TextArea
                  placeholder="此处添加备注信息"
                  style={{ width: 400, marginLeft: 30 }}
                  value={actionRemark || null}
                  onChange={this.handleChangeInputValue.bind(this, 'actionRemark')}
                  autosize
                />
              </Modal>
            </TabPane>
            <TabPane tab="分票明细" key="2">
              <div className={styles.extraButton}>
                {
                  awaitInvDetailData.actionList ?
                  awaitInvDetailData.actionList.map((actionInfo) => {
                      switch (+actionInfo.type) {
                        case 1:
                          return (
                            <Button
                              style={{ marginLeft: 10 }}
                              type="primary"
                              key={actionInfo.url}
                              onClick={this.handlePost.bind(this, actionInfo.url)}
                            >
                              {actionInfo.name}
                            </Button>
                          );
                        case 2:
                          return (
                            <a
                              href={actionInfo.url}
                              target="_blank"
                            >
                              <Button type="primary" style={{ marginLeft: 10 }} key={actionInfo.url} >{actionInfo.name}</Button>
                            </a>
                          );
                          break;
                        case 4:
                          return (
                            <Popconfirm
                              title={`确认${actionInfo.name}?`}
                              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                              onConfirm={actionInfo.backUrl ? this.handleOperator.bind(this, actionInfo.url, actionInfo.backUrl) : this.handleOperator.bind(this, actionInfo.url)}
                            >
                              <Button
                                style={{ marginLeft: 10 }}
                                type="primary"
                              >
                                {actionInfo.name}
                              </Button>
                            </Popconfirm>
                          );
                          break;
                        default:
                          return (
                            actionInfo.backUrl ?
                              <Button
                                style={{ marginLeft: 10 }}
                                type="primary"
                                key={actionInfo.url}
                                onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                              >
                                {actionInfo.name}
                              </Button>
                              :
                              <Button
                                style={{ marginLeft: 10 }}
                                type="primary"
                                onClick={this.handleOperator.bind(this, actionInfo.url)}
                              >
                                {actionInfo.name}
                              </Button>
                          );
                    }
                  }) : null
                }
              </div>
              <Card bordered={false} style={{ background: '#f2f2f2' }}>
                <Row gutter={16} >
                  <Col span={2} className={styles.amountStyle} >
                    {awaitInvDetailData.status}
                  </Col>
                  <Col span={4} >
                    应开票金额：<span className={styles.amountStyle} >{awaitInvDetailData.invAmount}</span>
                  </Col>
                  <Col span={4} >
                    申请开票号：<span className={styles.largeSize}>{awaitInvDetailData.invSn}</span>
                  </Col>
                </Row>
                <Row gutter={16} >
                  <Col span={3} >
                    客户名：<span className={styles.largeSize}>{awaitInvDetailData.customerName}</span>
                  </Col>
                  <Col span={6} >
                    门店名称：<span className={styles.largeSize}>{awaitInvDetailData.companyName}</span>
                  </Col>
                  <Col span={4} >
                    业务员：<span className={styles.largeSize}>{awaitInvDetailData.seller}</span>
                  </Col>
                  <Col span={4} >
                    发票张数：<span className={styles.amountStyle}>{awaitInvDetailData.invNum}</span>
                  </Col>
                </Row>
              </Card>
              {
                isSale ? '' :
                <Card
                  title={
                    <div className={styles.largeSize} >
                      <span>待开票（{awaitInvList.length}）</span>
                      <Button type="primary" style={{ float: 'right', marginRight: 20 }} onClick={this.handleCreateInvoice.bind(this, createInvoiceOutAllId)} >全部开票</Button>
                    </div>
                  }
                  style={{ margin: '20px 0' }}
                >
                  {
                    awaitInvList.length > 0 ?
                      awaitInvList.map((awaitInvInfo) => {
                        return (
                          <Card bordered={false} key={awaitInvInfo.id}>
                            <Row gutter={16} >
                              <Col span={3} >
                                发票金额：<span className={styles.amountStyle}>{awaitInvInfo.invAmount}</span>
                              </Col>
                              <Col span={5} >
                                发票号：
                                {
                                  (awaitInvInfo.invNo === '' && awaitInvInfo.invDate === '' && awaitInvInfo.financeRemark === '') || awaitInvInfo.edit ?
                                    <Input
                                      placeholder="发票号"
                                      onBlur={this.handleChangeInvoiceInfo.bind(this, 'invNo', awaitInvInfo.id)}
                                      onPressEnter={this.handleChangeInvoiceInfo.bind(this, 'invNo', awaitInvInfo.id)}
                                      defaultValue={awaitInvInfo.invNo}
                                      style={{ width: 200 }}
                                    /> : <span className={styles.largeSize}>{awaitInvInfo.invNo}</span>
                                }
                              </Col>
                              <Col span={5} >
                                发票日期：
                                {
                                  (awaitInvInfo.invNo === '' && awaitInvInfo.invDate === '' && awaitInvInfo.financeRemark === '') || awaitInvInfo.edit ?
                                    <DatePicker
                                      onChange={this.handleChangeInvoiceInfo.bind(this, 'invDate', awaitInvInfo.id)}
                                      defaultValue={awaitInvInfo.invDate ? moment(awaitInvInfo.invDate, 'YYYY-MM-DD') : null}
                                    />
                                    : <span className={styles.largeSize}>{awaitInvInfo.invDate}</span>
                                }
                              </Col>
                              <Col span={5} >
                                备注:
                                {
                                  (awaitInvInfo.invNo === '' && awaitInvInfo.invDate === '' && awaitInvInfo.financeRemark === '') || awaitInvInfo.edit ?
                                  <Input
                                    placeholder="备注"
                                    onBlur={this.handleChangeInvoiceInfo.bind(this, 'financeRemark', awaitInvInfo.id)}
                                    onPressEnter={this.handleChangeInvoiceInfo.bind(this, 'financeRemark', awaitInvInfo.id)}
                                    defaultValue={awaitInvInfo.financeRemark}
                                    style={{ width: 200 }}
                                  /> : <span className={styles.largeSize}>{awaitInvInfo.financeRemark}</span>
                                }
                              </Col>
                              <Col span={4} >
                                {
                                  (awaitInvInfo.invNo !== '' || awaitInvInfo.invDate !== '' && awaitInvInfo.financeRemark === '') && !awaitInvInfo.edit ?
                                    <Icon
                                      type="form"
                                      theme="outlined"
                                      style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                                      onClick={this.handleClickEditIcon.bind(this, awaitInvInfo.id)}
                                    />
                                    : ''
                                }
                              </Col>
                              <Col span={1} offset={5}>
                                {
                                  (awaitInvInfo.invNo === '' && awaitInvInfo.invDate === '' && awaitInvInfo.financeRemark === '') || awaitInvInfo.edit ?
                                    <Button type="primary" onClick={this.handleUpdateInvoice.bind(this, awaitInvInfo.id)} >确定</Button>
                                    :
                                    <Button type="primary" onClick={this.handleCreateInvoice.bind(this, awaitInvInfo.id)} >开票</Button>
                                }
                              </Col>
                            </Row>
                            <Table
                              bordered
                              dataSource={awaitInvInfo.invGoodsList}
                              columns={awaitInvColumn}
                              loading={isLoading}
                              size="small"
                              rowKey={record => record.id}
                              pagination={false}
                              style={{ marginTop: '10px' }}
                            />
                          </Card>
                        );
                      }) : ''
                  }
                </Card>
              }
              <Card
                title={
                  <div className={styles.largeSize} >
                    <span>已开票（{storageInvList.length}）</span>
                  </div>
                }
                style={{ margin: '20px 0' }}
              >
                {
                  storageInvList.length > 0 ?
                    storageInvList.map((invInfo) => {
                      return (
                        <Card bordered={false} key={invInfo.id}>
                          <Row gutter={16} >
                            <Col span={4} >
                              发票金额：<span className={styles.amountStyle}>{invInfo.invAmount}</span>
                            </Col>
                            <Col span={5} >
                              发票号：<span className={styles.largeSize}>{invInfo.invNo}</span>
                            </Col>
                            <Col span={5} >
                              发票日期：<span className={styles.largeSize}>{invInfo.invDate}</span>
                            </Col>
                            <Col span={5} >
                              备注: <span className={styles.largeSize}>{invInfo.financeRemark}</span>
                            </Col>
                          </Row>
                          <Table
                            bordered
                            dataSource={invInfo.invGoodsList}
                            columns={awaitInvColumn}
                            loading={isLoading}
                            size="small"
                            rowKey={record => record.id}
                            pagination={false}
                            style={{ marginTop: '10px' }}
                          />
                        </Card>
                      );
                    }) : ''
                }
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
