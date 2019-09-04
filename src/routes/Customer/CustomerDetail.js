import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Select, Modal, Table, Button, DatePicker, Dropdown, Menu, Icon, Tabs, Popconfirm, Collapse, Tooltip, notification, Checkbox } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TextArea } = Input;


@connect(state => ({
  customerDetail: state.customerDetail,
}))

export default class customerDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/getConfig',
      payload: {
        customerId: this.props.match.params.id,
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'customerDetail/unmount',
    });
  }
  getOrderList(params = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/getOrderList',
      payload: {
        ...params,
      },
    });
  }
  getCreateServiceTypeValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/getCreateServiceTypeValue',
      payload: {
        createServiceType: e.target.value,
      },
    });
  }
  getServiceContentValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/getServiceContentValue',
      payload: {
        serviceContentInput: e.target.value,
      },
    });
  }
  getServiceTypeValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/getServiceTypeValue',
      payload: {
        serviceTypeInput: value,
      },
    });
  }
  showServiceRecordDetail(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/showServiceRecordDetail',
      payload: {
        viewServiceRecord: record,
        viewServiceRecordId: record.serviceRecordId,
      },
    });
  }
  handleChangeDate(_, dateStrings) {
    this.getOrderList({
      orderStartTime: dateStrings[0],
      orderEndTime: dateStrings[1],
      curPage: 1,
      customerId: this.props.match.params.id,
    });
  }
  // 换页
  handleChangeCurPage(page) {
    this.getOrderList({
      curPage: page,
      customerId: this.props.match.params.id,
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    this.getOrderList({
      pageSize,
      curPage: 1,
      customerId: this.props.match.params.id,
    });
  }
  showNewServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/showNewServiceRecordModal',
    });
  }
  handleCancelServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/handleCancelServiceRecordModal',
    });
  }
  commitCustomerServiceRecord() {
    const { dispatch } = this.props;
    const customerId = this.props.match.params.id;
    const { serviceContentInput, serviceTypeInput, viewServiceRecordId } = this.props.customerDetail;
    if (viewServiceRecordId) {
      dispatch({
        type: 'customerDetail/updateCustomerServiceRecord',
        payload: {
          customerId,
          serviceId: viewServiceRecordId,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    } else {
      dispatch({
        type: 'customerDetail/newCustomerServiceRecord',
        payload: {
          customerId,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    }
  }

  showDeleteRecordConfirm(id) {
    const { dispatch } = this.props;
    const customerId = this.props.match.params.id;
    Modal.confirm({
      title: '确定删除这条客勤日志?',
      onOk() {
        console.log('OK');
        dispatch({
          type: 'customerDetail/deleteRecordConfirm',
          payload: {
            recordId: id,
            customerId,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  showCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/showCreateServiceTypeModal',
    });
  }
  hideCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/hideCreateServiceTypeModal',
    });
  }
  createServiceType() {
    const { dispatch } = this.props;
    const { createServiceType } = this.props.customerDetail;
    dispatch({
      type: 'customerDetail/createServiceType',
      payload: {
        serviceTypeName: createServiceType,
      },
    });
  }
  showDetailImg(e) {
    const { dispatch } = this.props;
    const imgSrc = e.target.src;
    if (imgSrc.indexOf('img.xiaomei360.com') < 7) {
      notification.info({
        message: '信息提示',
        description: '暂未上传资质认证！',
        duration: 2,
      });
      return;
    }
    dispatch({
      type: 'customerDetail/showDetailImage',
      payload: {
        modalImg: imgSrc,
      },
    });
  }
  hideDetailImage() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetail/hideDetailImage',
    });
  }
  handleToggleOperate(active) {
    if (active.length !== 0) {
      this.toggleOperateRecord.childNodes['0'].textContent = '收起';
    } else {
      this.toggleOperateRecord.childNodes['0'].textContent = '展开';
    }
  }
  handleToggleCustomer(active) {
    if (active.length !== 0) {
      this.toggleCustomer.childNodes['0'].textContent = '收起';
    } else {
      this.toggleCustomer.childNodes['0'].textContent = '展开';
    }
  }
  handleToggleTag(active) {
    if (active.length !== 0) {
      this.toggleTags.childNodes['0'].textContent = '收起';
    } else {
      this.toggleTags.childNodes['0'].textContent = '展开';
    }
  }
  render() {
    const {
      customerDetail: {
        customerId,
        customerTag,
        customerInfo,
        operateRecord,
        serviceList,
        orderList,
        total,
        curPage,
        pageSize,
        checkMap,
        statusMap,
        originMap,
        payStatusMap,
        payMethodMap,
        isGetOrderListing,
        orderStartTime,
        orderEndTime,
        customer,
        isShowImg,
        modalImg,
        isShowNewServiceRecordModal,
        serviceTypeMap,
        confirmLoading,
        viewServiceRecordId,
        viewServiceRecord,
        serviceContentInput,
        serviceTypeInput,
        isShowCreateServiceTypeModal,
        customerTagMap,
        detectRecord,
        customerTagRecord,
      },
    } = this.props;
    const orderColumns = [
      {
        title: '订单状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render: checkStatus => checkMap[checkStatus],
      },
      {
        title: '订单号',
        dataIndex: 'orderNum',
        key: 'orderNum',
        render: (orderNum, record) => {
          return (
            <div>
              {<Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{orderNum}</Link>}
              {record.isDiscount ? <span style={{ color: '#fff', padding: '2px 5px', marginLeft: 5, backgroundColor: '#FC1268', fontSize: 12 }}>特价</span> : null}
              {
                (record.checkStatus === 3 || record.isReject)
                  ? (
                    <Tooltip title={record.rejectRemark}>
                      <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                    </Tooltip>
                  )
                  : null
              }
              {record.isAfterSale ? <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#fb5f27', fontSize: 12 }}>售后</span> : null}
            </div>
          );
        },
      },
      {
        title: '订单总额',
        dataIndex: 'allAmount',
        key: 'allAmount',
      },
      {
        title: '实付金额',
        dataIndex: 'realAmount',
        key: 'realAmount',
      },
      {
        title: '付款状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: orderStatus => statusMap[orderStatus],
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '支付方式',
        dataIndex: 'payMethodFormat',
        key: 'payMethodFormat',
        // render: payMethod => payMethodMap[payMethod],
      },
      {
        title: '订单来源',
        dataIndex: 'orderOrigin',
        key: 'orderOrigin',
        render: orderOrigin => originMap[orderOrigin],
      },
    ];
    function expandedRowRender(order) {
      const goodsColumns = [
        {
          title: '主图',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img className={styles.goodsImg} src={img} alt="商品缩略图" />;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '商品条码',
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
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '是否含税',
          dataIndex: 'isTax',
          key: 'isTax',
          width: 90,
          render: (_, record) => {
            return (
              <span>{ record.isTax ? '含税' : '不含税' }</span>
            );
          },
        },
        {
          title: '小计',
          dataIndex: 'subtotal',
          key: 'subtotal',
        },
      ];

      const { goodsList } = order;
      return (
        <Table
          bordered
          rowKey={record => record.id}
          columns={goodsColumns}
          dataSource={goodsList}
          pagination={false}
          scroll={{ x: 500 }}
        />
      );
    }
    const analyseColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '日期',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '异常',
        dataIndex: 'content',
        key: 'content',
      },
      
    ];
    const customerTagColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '变更时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '新用户',
        dataIndex: 'new',
        key: 'new',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '沉默用户',
        dataIndex: 'unPaid',
        key: 'unPaid',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '新客户',
        dataIndex: 'newCustomer',
        key: 'newCustomer',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '普通客户',
        dataIndex: 'ordinary',
        key: 'ordinary',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '优质客户',
        dataIndex: 'quality',
        key: 'quality',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '高危客户',
        dataIndex: 'warning',
        key: 'warning',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '流失客户',
        dataIndex: 'lost',
        key: 'lost',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      },
      {
        title: '召回客户',
        dataIndex: 'callBackCustomer',
        key: 'callBackCustomer',
        render: (value)=> {
          return (
            value?<Checkbox checked={true}/>:""
          );
        },
      }      
    ];
    const operateColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '操作日志',
        dataIndex: 'content',
        key: 'content',
      },
    ];
    const serviceColumns = [
      {
        title: '客勤ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '创建业务员',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '客勤类型',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          return (
            <span>{serviceTypeMap[type]}</span>
          );
        },
      },
      {
        title: '任务内容详情',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '最后修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
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
                    <div onClick={() => this.showServiceRecordDetail(record)}>
                      详情
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div onClick={() => this.showDeleteRecordConfirm(record.id)}>
                      删除
                    </div>
                  </Menu.Item>
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
      <PageHeaderLayout title="客户详情">
        <Card bordered={false} >
          <Tabs size="large" tabBarStyle={{ fontSize: 24 }}>
            <TabPane tab="基础资料" key="1">
              <div className={styles.extraButton}>
                <Link to={(customerId !== -1) ? `/customer/customer-list/add-customer/${customerId}/1` : '#'} >
                  <Button type="primary" ghost>修改客户资料</Button>
                </Link>
              </div>
              <div className={`${styles['customer-label']} ${styles.clearfix}`}>
                <div>
                  {
                     (customerTag.length) ?
                      // array does not exist, is not an array, or is empty
                      customerTag.map(
                        (item) => {
                          return (
                            <Tooltip placement="topLeft" title={customerTagMap[item].desc} key={item}>
                              <span className={globalStyles['tag-base']} style={{ background: customerTagMap[item].color }}>{customerTagMap[item].name}</span>
                            </Tooltip>
                          );
                        }
                      )
                    :
                      (
                        <Tooltip placement="topLeft">
                          <span className={globalStyles['tag-base']}>&nbsp;</span>
                        </Tooltip>
                      )
                  }
                </div>
                <div className={styles['customer-status']}>
                  <p>
                    <span className={`${styles['bold-font']}`}>{customerInfo.checkStatus}</span>
                    <span className={styles['bold-font']}>{customerInfo.customerSource}</span>
                    <span className={styles['bold-font']}>{customerInfo.regClient}</span>
                  </p>
                  <p>
                    <span className={styles['bold-font']}>注册时间:</span>
                    <span className="reg-time">{customerInfo.regTime}</span>
                  </p>
                </div>
              </div>
              {/* 客户描述 */}
              <div className={styles['customer-description']}>
                { customerInfo.customerPayType === '账期客户' ? (
                  <div>
                    <span className={styles['description-one']}>客户类型：<span>{customerInfo.customerPayType}</span></span>
                    <span className={styles['description-one']}>账期条件：<span>{customerInfo.payCondition}</span></span>
                    <span className={styles['description-one']}>合同签订：<span>{customerInfo.hasContract === 0 ? ('否') : ('是')}</span></span>
                  </div>
                ) : (
                  <span className={styles['description-one']}>客户类型：{customerInfo.customerPayType}</span>
                )
              }
              </div>

              <Card style={{ width: '100%' }}>
                <div className={styles['info-part']}>
                  <ul>
                    <li>
                      <h4>登录账号：</h4>
                      <p>{customerInfo.mobile}</p>
                    </li>
                    <li>
                      <h4>客户名称：</h4>
                      <p>{customerInfo.customerName}</p>
                    </li>
                    <li>
                      <h4>性别：</h4>
                      <p>{customerInfo.sex}</p>
                    </li>
                    <li>
                      <h4>职位职称：</h4>
                      <p>{customerInfo.duty}</p>
                    </li>
                    <li>
                      <h4>进口品占比：</h4>
                      <p>{customerInfo.importPercent}</p>
                    </li>
                    <li>
                      <h4>月成交额：</h4>
                      <p>{customerInfo.saleAmountPerMonth}</p>
                    </li>
                  </ul>
                </div>
                <div className={styles['info-part']}>
                  <ul>
                    <li>
                      <h4>店铺名称：</h4>
                      <p>{customerInfo.companyName}</p>
                    </li>
                    <li>
                      <h4>店铺数：</h4>
                      <p>{customerInfo.storeNum}</p>
                    </li>
                    <li>
                      <h4>门店类型：</h4>
                      <p>{customerInfo.customerType}</p>
                    </li>
                    <li>
                      <h4>归属地区：</h4>
                      <p>{customerInfo.area}</p>
                    </li>
                    <li>
                      <h4>所属业务员：</h4>
                      <p>{customerInfo.seller}</p>
                    </li>
                    <li>
                      <h4>了解小美渠道：</h4>
                      <p>{customerInfo.channel}</p>
                    </li>
                  </ul>
                </div>
                <div className={styles['info-part']}>
                  <ul>
                    <li>
                      <h4>账户名：</h4>
                      <p>{customerInfo.userName}</p>
                    </li>
                    <li>
                      <h4>会员等级：</h4>
                      <p>{customerInfo.userRank}</p>
                    </li>
                    <li>
                      <h4>所属体系：</h4>
                      <p>{customerInfo.customerSystem}</p>
                    </li>
                    <li>
                      <h4>客户生日：</h4>
                      <p>{customerInfo.birthday}</p>
                    </li>

                    <li>
                      <h4>其他联系方式：</h4>
                      <p>{customerInfo.contact}</p>
                    </li>
                  </ul>
                </div>
              </Card>
              <Card bordered={false} className={styles.clearfix}>
                <div className={`${styles['div-2']} ${styles['float-left']}`}>
                  <h4>资质认证：</h4>
                  <div className={styles['img-container']}>
                    <img src={customerInfo.shopFront} alt="" onClick={this.showDetailImg.bind(this)} />
                    <img src={customerInfo.license} alt="" onClick={this.showDetailImg.bind(this)} />
                  </div>
                  <div className={styles['img-modal-container']}>
                    <Modal
                      visible={isShowImg}
                      onCancel={this.hideDetailImage.bind(this)}
                      footer={null}
                      bodyStyle={{ }}
                      style={{ position: 'absolute', left: '50%', transform: 'translate(-50%)' }}
                      wrapClassName={styles['img-modal-container']}
                      width="auto"
                      closable={false}
                    >
                      <img src={modalImg} alt="" className={styles['detail-image']} />
                    </Modal>
                  </div>
                </div>
                <div className={`${styles['div-2']} ${styles['float-left']}`}>
                  <h4>印象认知：</h4>
                  <p>{customerInfo.remark}</p>
                </div>
              </Card>
              <Table
                bordered
                title={() => (
                  <div className={styles.title}>
                    <h3>订单信息</h3>
                    <RangePicker
                      className={globalStyles['rangePicker-sift']}
                      format="YYYY-MM-DD"
                      onChange={this.handleChangeDate.bind(this)}
                      value={[orderStartTime ? moment(orderStartTime, 'YYYY-MM-DD') : null, orderEndTime ? moment(orderEndTime, 'YYYY-MM-DD') : null]}
                    />
                  </div>
                )}
                loading={isGetOrderListing}
                rowKey={record => record.orderId}
                columns={orderColumns}
                pagination={{
                  current: curPage,
                  pageSize,
                  showTotal:total => `共 ${total} 个结果`,
                  total,
                  showSizeChanger: true,
                  onShowSizeChange: this.handleChangePageSize.bind(this),
                  onChange: this.handleChangeCurPage.bind(this),
                }}
                expandedRowRender={expandedRowRender}
                dataSource={orderList}
              />
              <Row style={{marginTop:10}}>
                <Card
                  title={<span>客户诊断</span>}
                  bodyStyle={{ padding: 0 }}
                >
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    onChange={this.handleToggleCustomer.bind(this)}
                  >
                    <Panel header={<span ref={(toggleCus) => { this.toggleCustomer = toggleCus; }} className={styles.collapse}>收起</span>} key="1" showArrow={false}>
                      <Table
                        bordered
                        loading={isGetOrderListing}
                        rowKey={record => record.id}
                        columns={analyseColumns}
                        dataSource={detectRecord}
                        pagination={false}
                      />
                    </Panel>
                  </Collapse>
                </Card>
              </Row>
              <Row style={{marginTop:10}}>
                <Card
                  title={<span>客户标签变更记录</span>}
                  bodyStyle={{ padding: 0 }}
                >
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    onChange={this.handleToggleTag.bind(this)}
                  >
                    <Panel header={<span ref={(toggleTag) => { this.toggleTags = toggleTag; }} className={styles.collapse}>收起</span>} key="1" showArrow={false}>
                      <Table
                        bordered
                        loading={isGetOrderListing}
                        rowKey={record => record.id}
                        columns={customerTagColumns}
                        dataSource={customerTagRecord}
                        pagination={false}
                      />
                    </Panel>
                  </Collapse>
                </Card>
              </Row>

              <Row style={{marginTop:10}}>
                <Card
                  title={<span>操作日志</span>}
                  bodyStyle={{ padding: 0}}
                >
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    onChange={this.handleToggleOperate.bind(this)}
                  >
                    <Panel header={<span ref={(toggleRcd) => { this.toggleOperateRecord = toggleRcd; }} className={styles.collapse}>收起</span>} key="1" showArrow={false}>
                      <Table
                        bordered
                        loading={isGetOrderListing}
                        rowKey={record => record.id}
                        columns={operateColumns}
                        dataSource={operateRecord}
                        pagination={false}
                      />
                    </Panel>
                  </Collapse>
                </Card>
              </Row>
            </TabPane>
            <TabPane tab="客勤日志" key="2">
              <div className={styles.extraButton}>
                <Button
                  type="primary"
                  ghost
                  onClick={this.showNewServiceRecordModal.bind(this)}
                >
                新建客勤
                </Button>
              </div>
              <Table
                bordered
                rowKey={record => record.id}
                columns={serviceColumns}
                dataSource={serviceList}
                pagination={false}
              />
              {/* 新建客勤modal */}
              <Modal
                title="客情详情"
                visible={isShowNewServiceRecordModal}
                onOk={this.commitCustomerServiceRecord.bind(this)}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancelServiceRecordModal.bind(this)}
                okText={viewServiceRecordId ? '更新' : '发布'}
                width="50%"
              >
                <div>
                  <div style={{ display: 'inline-block' }}>
                    <Icon type="file-text" style={{ fontSize: '20px', margin: '0 5px' }} />
                    <span>客勤类型</span>
                  </div>
                  <div style={{ display: 'inline-block', marginLeft: '100px' }}>
                    <Select
                      value={serviceTypeMap[serviceTypeInput]}
                      placeholder="请选择客勤类型"
                      style={{ width: 200 }}
                      onChange={this.getServiceTypeValue.bind(this)}
                    >
                      {
                        Object.keys(serviceTypeMap).map(
                          item => (
                            <Option
                              key={item}
                              value={item}
                            >
                              {serviceTypeMap[item]}
                            </Option>
                            )
                          )
                        }
                    </Select>
                    <span className="primary" style={{ marginLeft: '10px', color: '#169BD5', cursor: 'pointer' }} onClick={this.showCreateServiceTypeModal.bind(this)}>新建</span>
                  </div>
                </div>
                <TextArea
                  name="serviceContent"
                  style={{ width: '100%', margin: '15px 0' }}
                  rows={6}
                  placeholder="请在这里输入任务内容详情"
                  value={serviceContentInput}
                  // value={viewServiceRecordId ? viewServiceRecord.serviceContent : ''}
                  onChange={this.getServiceContentValue.bind(this)}
                />
                <div style={{ background: '#F2F2F2', border: '1px solid rgb(169, 169, 169)', height: '100px', padding: '10px 20px' }}>
                  <h3 style={{ color: '#999', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', paddingRight: '10px' }}>绑定客户</h3>
                  <span>(1)</span>
                  <p>{customerInfo.customerName}</p>
                </div>
              </Modal>
              <Modal
                title="新建客勤类型"
                visible={isShowCreateServiceTypeModal}
                confirmLoading={confirmLoading}
                onCancel={this.hideCreateServiceTypeModal.bind(this)}
                onOk={this.createServiceType.bind(this)}
              >
                <Input placeholder="请输入客勤类型" onChange={this.getCreateServiceTypeValue.bind(this)} />
              </Modal>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
