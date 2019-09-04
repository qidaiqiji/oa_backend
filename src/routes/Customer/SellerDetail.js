import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Card, Tabs, Table, Row, Button, Col, Collapse, Badge, Modal, Input, Radio, DatePicker, Select } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellerDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
@connect(state => ({
  sellerDetail: state.sellerDetail,
}))
export default class SellerDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'sellerDetail/mount',
      payload: {
        userId: id,
      },
    });
    // dispatch({
    //   type: 'sellerDetail/getConfig',
    // });
    dispatch({
      type: 'sellerDetail/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/unmount',
    });
  }
  // 事件
  handleChangePage(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/getCustomerList',
      payload: {
        currentPage: value,
        seller: this.props.match.params.id,
      },
    });
  }
  // 操作相关
  handleTriggerActionModal(url, backUrl) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/triggerActionModal',
      payload: {
        actionUrl: url,
        backUrl,
      },
    });
  }
  handleSearch(type) {
    const { dispatch } = this.props;
    const { customerKeywords, goodsSn } = this.props.sellerDetail;
    switch (type) {
      case 'customerKeywords':
        dispatch({
          type: 'sellerDetail/getCustomerList',
          payload: {
            currentPage: 1,
            seller: this.props.match.params.id,
            customerKeywords,
          },
        });
        break;
      case 'goodsSn':
        dispatch({
          type: 'sellerDetail/getCustomerList',
          payload: {
            currentPage: 1,
            seller: this.props.match.params.id,
            goodsSn,
          },
        });
        break;
      default:
        break;
    }
  }
  handleChange(type, e, dateString) {
    const { dispatch } = this.props;
    switch (type) {
      case 'actionRemark':
      case 'customerKeywords':
      case 'goodsSn':
        dispatch({
          type: 'sellerDetail/change',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'days':
        dispatch({
          type: 'sellerDetail/getSellerData',
          payload: {
            days: e.target.value,
            dateStart: '',
            dateEnd: '',
          },
        });
        break;
      case 'time':
        dispatch({
          type: 'sellerDetail/getSellerData',
          payload: {
            dateStart: dateString[0],
            dateEnd: dateString[1],
            days: '',
          },
        });
        break;
      case 'regTime':
        dispatch({
          type: 'sellerDetail/change',
          payload: {
            regStartDate: dateString[0],
            regEndDate: dateString[1],
          },
        });
        dispatch({
          type: 'sellerDetail/getCustomerList',
          payload: {
            currentPage: 1,
            seller: this.props.match.params.id,
            regStartDate: dateString[0],
            regEndDate: dateString[1],
          },
        });
        break;
      default:
        break;
    }
  }
  handleOkActionModal(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/okActionModal',
      payload: {
        id,
      },
    });
  }
  formatNumber = (num) => {
    return num && num.toString()
      .replace(/\d+/, (s) => {
        return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      });
  }
  handleSelectChanged=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/mount',
      payload: {
        [type]:e
      },
    });
  }
  handleChangeSearchArea=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerDetail/mount',
      payload: {
        totalType:e.target.value,
        areaId:'',
        provinceId:'',
        stateId:'',
        assistantProvinceId:'',
        currentPage:1,
      },
    });
  }

  render() {
    const { sellerDetail: {
      actionList,
      checkStatus,
      entryTime,
      mobile,
      sellerName,
      duty,
      sellerLeader,
      operateRecord,

      total,
      customerList,
      currentPage,
      pageSize,
      isLoading,
      isLoadingMount,

      isShowActionModal,
      isActing,
      actionRemark,
      days,
      dateStart,
      dateEnd,
      regStartDate,
      regEndDate,
      customerKeywords,
      goodsSn,
      sellerData,
      totalType,
      salesAreaMap,
      provinceMap,
      stateMap,
      sellerMap,
      assistantProvinceId,
      areaId,
      provinceId,
      salerProvinceMap
    } } = this.props;
    const orderColumns = [
      {
        title: 'ID',
        key: 'customerId',
        dataIndex: 'customerId',
      },
      {
        title: '客户名称',
        key: 'customerName',
        dataIndex: 'customerName',
        render: (customerName, record) => {
          return (
            <Link to={`/customer/customer-list/customer-detail/${record.customerId}`}>
              <span style={{ color: '#169bd5' }}>{customerName}</span>
            </Link>
          );
        },
      },
      {
        title: '职务',
        key: 'duty',
        dataIndex: 'duty',
      },
      {
        title: '客户类型',
        key: 'customerType',
        dataIndex: 'customerType',
      },
      {
        title: '客户标签',
        key: 'customerTag',
        dataIndex: 'customerTag',
      },
      {
        title: '店铺名',
        key: 'companyName',
        dataIndex: 'companyName',
      },
      {
        title: '省份区域',
        key: 'area',
        dataIndex: 'area',
      },
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
      },
    ];
    const operaRecordColumns = [
      {
        title: '序号',
        key: 'no',
        dataIndex: 'no',
        width: 80,
        align: 'center',
        render: (_, record, index) => {
          return <span>{+index + 1}</span>;
        },
      },
      {
        title: '操作人',
        key: 'operator',
        dataIndex: 'operator',
        width: 250,
        align: 'center',
      },
      {
        title: '时间',
        key: 'time',
        dataIndex: 'time',
        width: 250,
        align: 'center',
      },
      {
        title: '操作日志',
        key: 'content',
        dataIndex: 'content',
      },
    ];
    const exportOrder = `http://erp.xiaomei360.com/sellerDetail/export-selected-order?${
      stringify({ orderIds: [this.props.match.params.id] })
    }`;
    return (
      <PageHeaderLayout title="销售员详情">
        <Card bordered={false}>
          <Tabs
            tabBarExtraContent={(
              actionList ?
                actionList.map((actionInfo) => {
                  switch (+actionInfo.type) {
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
                            style={{ marginLeft: 15 }}
                            onClick={this.handleTriggerActionModal.bind(this, actionInfo.url, actionInfo.backUrl)}
                          >
                            {actionInfo.name}
                          </Button>
                        );
                    }
                }).concat([
                  <a target="_blank" href={exportOrder}>
                    <Button style={{ marginLeft: 10 }}>导出</Button>
                  </a>,
                ])
                :
                null
            )}
          >
            <Tabs.TabPane tab="基础资料" key="0">
              <Card bordered={false} loading={isLoadingMount}>
                <Row type="flex" justify="end" style={{ marginBottom: 20 }}>
                  <Badge status="success" text={checkStatus} />
                </Row>
                <Card>
                  <Row>
                    <Col md={6}>
                      <span className={styles['detail-title']}>登录账号：</span>
                      <span>{mobile}</span>
                    </Col>
                    <Col md={4}>
                      <span className={styles['detail-title']}>销售员：</span>
                      <span>{sellerName}</span>
                    </Col>
                    <Col md={4}>
                      <span className={styles['detail-title']}>职务：</span>
                      <span>{duty}</span>
                    </Col>
                    <Col md={5}>
                      <span className={styles['detail-title']}>绑定主管：</span>
                      <span>{(typeof sellerLeader === 'object') && (sellerLeader !== null) ? '无' : sellerLeader}</span>
                    </Col>
                    <Col md={5}>
                      <span className={styles['detail-title']}>入职时间：</span>
                      <span>{entryTime}</span>
                    </Col>
                  </Row>
                </Card>
                <Card bordered={false}>
                  <Radio.Group value={days} onChange={this.handleChange.bind(this, 'days')} buttonStyle="solid" >
                    <Radio.Button value="7">近7天</Radio.Button>
                    <Radio.Button value="15">近15天</Radio.Button>
                    <Radio.Button value="30">近30天</Radio.Button>
                  </Radio.Group>
                  <RangePicker
                    className={`${globalStyles['rangePicker-sift']} ${styles.rangeDate}`}
                    format="YYYY-MM-DD"
                    onChange={this.handleChange.bind(this, 'time')}
                    value={[dateStart ? moment(dateStart, 'YYYY-MM-DD') : null, dateEnd ? moment(dateEnd, 'YYYY-MM-DD') : null]}
                  />
                  <Radio.Group value={totalType} onChange={this.handleChangeSearchArea} buttonStyle="solid" style={{marginRight:10}}>
                    <Radio.Button value="all">总</Radio.Button>
                    <Radio.Button value="area">按区域</Radio.Button>
                    <Radio.Button value="province">按省份</Radio.Button>
                    <Radio.Button value="state">按城区</Radio.Button>
                    <Radio.Button value="assistant">按内勤</Radio.Button>
                  </Radio.Group>
                  {
                    totalType == 'area'?<span>
                      负责的区域：
                      <Select 
                      className={globalStyles['select-sift']}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      value={salesAreaMap[areaId]}
                      onChange={this.handleSelectChanged.bind(this,'areaId')}
                      filterOption={(input, option) => {
                        return option.props.children.indexOf(input) >= 0;
                      }}
                      >
                        {
                          Object.keys(salesAreaMap).map((areaId) => {
                            return (
                              <Select.Option value={areaId}>{salesAreaMap[areaId]}</Select.Option>
                            );
                          })
                        }
                      </Select>
                    </span>:''
                  }
                  {
                    totalType == 'province'?<span>
                      负责的省份：
                      <Select 
                      className={globalStyles['select-sift']}
                      allowClear
                      value={provinceMap[provinceId]}
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleSelectChanged.bind(this,'provinceId')}
                      filterOption={(input, option) => {
                        return option.props.children.indexOf(input) >= 0;
                      }}
                      >
                        {
                          Object.keys(provinceMap).map((areaId) => {
                            return (
                              <Select.Option value={areaId}>{provinceMap[areaId]}</Select.Option>
                            );
                          })
                        }
                      </Select>
                    </span>:''
                  }
                  {/* {
                    totalType == 'state'?<span>
                      负责的城区：
                      <Select 
                      className={globalStyles['select-sift']}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      value={stateMap[stateId]}
                      onChange={this.handleSelectChanged.bind(this,'stateId')}
                      filterOption={(input, option) => {
                        return option.props.children.indexOf(input) >= 0;
                      }}
                      >
                        {
                          Object.keys(stateMap).map((areaId) => {
                            return (
                              <Select.Option value={areaId}>{stateMap[areaId]}</Select.Option>
                            );
                          })
                        }
                      </Select>
                    </span>:''
                  } */}
                  {
                    totalType == 'assistant'?<span>
                      内勤的省份：
                      <Select 
                      className={globalStyles['select-sift']}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      value={salerProvinceMap[assistantProvinceId]} 
                      onChange={this.handleSelectChanged.bind(this,'assistantProvinceId')}
                      filterOption={(input, option) => {
                        return option.props.children.indexOf(input) >= 0;
                      }}
                      >
                        {
                          Object.keys(salerProvinceMap).map((areaId) => {
                            return (
                              <Select.Option value={areaId}>{salerProvinceMap[areaId]}</Select.Option>
                            );
                          })
                        }
                      </Select>
                    </span>:''
                  }
                  <Row gutter={50}>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>销售额</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.saleAmount ? sellerData.saleAmount : 0)}</p>
                        <p style={{ color: '#ccc', fontSize: '14px' }}>订单数<span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold', marginLeft: '15px' }}>{sellerData.orderNum ? sellerData.orderNum : 0}</span></p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>售后金额</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.backAmount ? sellerData.backAmount : 0)}</p>
                        <p style={{ color: '#ccc', fontSize: '14px' }}>售后单数<span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold', marginLeft: '15px' }}>{sellerData.backOrderNum ? sellerData.backOrderNum : 0}</span></p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>实际订单总额</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.realAmount ? sellerData.realAmount : 0)}</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>账期销售额</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.creditSaleAmount ? sellerData.creditSaleAmount : 0)}</p>
                        <p style={{ color: '#ccc', fontSize: '14px' }}>账期单数<span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold', marginLeft: '15px' }}>{sellerData.creditOrderNum ? sellerData.creditOrderNum : 0}</span></p>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={50}>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>下单用户数量</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.payUserNum ? sellerData.payUserNum : 0)}</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>用户审核客勤数</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.serviceRemarkNum ? sellerData.serviceRemarkNum : 0)}</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>审核通过数</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.checkUserNum ? sellerData.checkUserNum : 0)}</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className={`${styles.sellerInfo} gutter-row`} >
                        <h5>账期回款数</h5>
                        <p className={styles.infoAmount}>{this.formatNumber(sellerData.creditReceiveAmount ? sellerData.creditReceiveAmount : 0)}</p>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Row style={{ marginTop: 80 }}>
                  <Row>
                    <Col span={2}>
                      <h3>绑定客户</h3>
                    </Col>
                    <Col span={4}>
                      <Search
                        placeholder="客户名称/手机号/门店名称"
                        value={customerKeywords}
                        onChange={this.handleChange.bind(this, 'customerKeywords')}
                        onSearch={this.handleSearch.bind(this, 'customerKeywords')}
                      />
                    </Col>
                    <Col span={4} style={{ marginLeft: '20px' }}>
                      <Search
                        placeholder="商品条码"
                        value={goodsSn}
                        onChange={this.handleChange.bind(this, 'goodsSn')}
                        onSearch={this.handleSearch.bind(this, 'goodsSn')}
                      />
                    </Col>
                    <Col span={4}>
                      <RangePicker
                        className={`${globalStyles['rangePicker-sift']} ${styles.rangeDate}`}
                        format="YYYY-MM-DD"
                        onChange={this.handleChange.bind(this, 'regTime')}
                        value={[regStartDate ? moment(regStartDate, 'YYYY-MM-DD') : null, regEndDate ? moment(regEndDate, 'YYYY-MM-DD') : null]}
                      />
                    </Col>
                  </Row>
                  <Table
                    bordered
                    dataSource={customerList}
                    columns={orderColumns}
                    loading={isLoading}
                    rowKey={record => record.customerId}
                    pagination={{
                      total,
                      current: currentPage,
                      pageSize,
                      showSizeChanger: false,
                      onChange: this.handleChangePage.bind(this),
                      showTotal:total => `共 ${total} 个结果`,
                    }}
                  />
                </Row>
                <Collapse style={{ marginTop: 50 }}>
                  <Panel header="操作日志">
                    <Table
                      bordered
                      dataSource={operateRecord}
                      columns={operaRecordColumns}
                      pagination={false}
                      rowKey={record => record.id}
                    />
                  </Panel>
                </Collapse>
                {/* 操作 modal */}
                <Modal
                  title="确认"
                  visible={isShowActionModal}
                  confirmLoading={isActing}
                  onOk={this.handleOkActionModal.bind(this, this.props.match.params.id)}
                  onCancel={this.handleTriggerActionModal.bind(this, null, null)}
                >
                  <p style={{ textAlign: 'center' }}>请确认是否做此操作？</p>
                  <Input
                    value={actionRemark}
                    onChange={this.handleChange.bind(this, 'actionRemark')}
                    placeholder="操作备注"
                  />
                </Modal>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
