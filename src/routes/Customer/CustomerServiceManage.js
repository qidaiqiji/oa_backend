import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Card, Input, Select, Modal, Table, Button, message, DatePicker, Dropdown, Menu, Icon, Tabs, Popconfirm, Collapse, Tooltip } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerServiceManage.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

@connect(state => ({
  customerServiceManage: state.customerServiceManage,
}))

export default class customerServiceManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getConfig',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'customerServiceManage/unmount',
    });
  }
  getServiceList(params = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getServiceList',
      payload: {
        ...params,
      },
    });
  }
  getServiceTypeValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getServiceTypeValue',
      payload: {
        serviceTypeInput: value,
      },
    });
  }
  getServiceContentValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getServiceContentValue',
      payload: {
        serviceContentInput: e.target.value,
      },
    });
  }
  getServiceCustomerValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getServiceCustomerValue',
      payload: {
        customerSelected: value,
      },
    });
  }
  @Debounce(200)
  getServiceCustomerInput(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getServiceCustomerInput',
      payload: {
        customerKeywords: value,
      },
    });
  }
  getCreateServiceTypeValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/getCreateServiceTypeValue',
      payload: {
        createServiceType: e.target.value,
      },
    });
  }
  showNewServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/showNewServiceRecordModal',
    });
  }
  handleCancelServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/handleCancelServiceRecordModal',
    });
  }
  commitCustomerServiceRecord() {
    const { dispatch } = this.props;
    const { serviceContentInput, serviceTypeInput, customerSelected, viewServiceRecordId } = this.props.customerServiceManage;
    if (isNaN(Number(customerSelected))) {
      dispatch({
        type: 'customerServiceManage/updateCustomerServiceRecord',
        payload: {
          serviceId: viewServiceRecordId,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    } else {
      dispatch({
        type: 'customerServiceManage/newCustomerServiceRecord',
        payload: {
          customerId: customerSelected,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    }
  }
  showDeleteRecordConfirm(id) {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定删除这条客勤日志?',
      onOk() {
        dispatch({
          type: 'customerServiceManage/deleteRecordConfirm',
          payload: {
            recordId: id,
          },
        });
      },
      onCancel() {
      },
    });
  }
  showCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/showCreateServiceTypeModal',
    });
  }
  hideCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/hideCreateServiceTypeModal',
    });
  }
  createServiceType() {
    const { dispatch } = this.props;
    const { createServiceType } = this.props.customerServiceManage;
    dispatch({
      type: 'customerServiceManage/createServiceType',
      payload: {
        serviceTypeName: createServiceType,
      },
    });
  }
  showServiceRecordDetail(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/showServiceRecordDetail',
      payload: {
        viewServiceRecord: record,
        viewServiceRecordId: record.id,
      },
    });
  }
  handleChangeDate(_, dateStrings) {
    this.getServiceList({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
      currentPage: 1,
    });
  }
  handleSearch(value) {
    this.getServiceList({
      keywords: value,
      currentPage: 1,
    });
  }
  handleInputChange(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerServiceManage/handleInputChange',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  changeSeller(value) {
    this.getServiceList({
      seller: value,
      currentPage: 1,
    });
  }
  changeServiceType(value) {
    this.getServiceList({
      serviceType: value,
      currentPage: 1,
    });
  }
  changeSellerTeam(value) {
    this.getServiceList({
      sellerTeam: value,
      currentPage: 1,
    });
  }
  // 换页
  handleChangeCurPage(page) {
    this.getServiceList({
      currentPage: page,
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    this.getServiceList({
      pageSize,
      currentPage: 1,
    });
  }
  render() {
    const {
      customerServiceManage: {
        serviceList,
        isShowNewServiceRecordModal,
        confirmLoading,
        serviceTypeMap,
        sellerMap,
        sellerTeamMap,
        viewServiceRecordId,
        viewServiceRecord,
        serviceTypeInput,
        serviceContentInput,
        currentPage,
        pageSize,
        total,
        customerList,
        customerSelected,
        isShowCreateServiceTypeModal,
        isGetServiceListing,
        startDate,
        endDate,
        hiddenItem,
      },
    } = this.props;

    const serviceColumns = [
      {
        title: '客勤ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
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
      <PageHeaderLayout title="客勤管理">
        <Card bordered={false}>
          <div>
            <Row>
              <Col span={4} style={{ margin: '0 10px' }}>
                <Search
                  placeholder="请输入客勤ID或客户名称"
                  onSearch={this.handleSearch.bind(this)}
                  enterButton
                  width="20%"
                  onChange={this.handleInputChange.bind(this)}
                />
              </Col>
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                format="YYYY-MM-DD"
                style={{ margin: '0 10px' }}
                value={[startDate ? moment(startDate, 'YYYY-MM-DD') : null, endDate ? moment(endDate, 'YYYY-MM-DD') : null]}
                onChange={this.handleChangeDate.bind(this)}
              />
              {
                hiddenItem.seller ? '' :
                <Select
                  placeholder="请选择业务员"
                  style={{ width: 200, margin: '0 10px' }}
                  onChange={this.changeSeller.bind(this)}
                >
                  {
                    Object.keys(sellerMap).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {sellerMap[item]}
                        </Option>
                        )
                    )
                  }
                </Select>
              }
              <Select
                placeholder="请选择客勤类型"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.changeServiceType.bind(this)}
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
              {
                hiddenItem.sellerTeam ? '' :
                <Select
                  placeholder="请选择销售组"
                  style={{ width: 200, margin: '0 10px' }}
                  onChange={this.changeSellerTeam.bind(this)}
                >
                  {
                    Object.keys(sellerTeamMap).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {sellerTeamMap[item]}
                        </Option>
                        )
                    )
                  }
                </Select>
              }

              <Button
                type="primary"
                style={{ float: 'right' }}
                onClick={this.showNewServiceRecordModal.bind(this)}
              >
                <Icon type="plus" />
                新建客勤
              </Button>
            </Row>
          </div>
          <Table
            bordered
            rowKey={record => record.id}
            columns={serviceColumns}
            dataSource={serviceList}
            style={{ marginTop: '20px' }}
            loading={isGetServiceListing}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showTotal:total => `共 ${total} 个结果`,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangeCurPage.bind(this),
            }}
          />
          <Modal
            title="客勤详情"
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
              onChange={this.getServiceContentValue.bind(this)}
            />
            <div style={{ background: '#F2F2F2', border: '1px solid rgb(169, 169, 169)', height: '100px', padding: '10px 20px' }}>
              <h3 style={{ color: '#999', fontWeight: 'bold', fontSize: '16px', paddingRight: '10px' }}>绑定客户</h3>
              <Select
                value={customerSelected}
                style={{ width: '50%' }}
                showSearch
                optionFilterProp="children"
                disabled={!!viewServiceRecordId}
                onChange={this.getServiceCustomerValue.bind(this)}
                onSearch={this.getServiceCustomerInput.bind(this)}
                filterOption={false}
                // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  customerList.map((item) => {
                    return (
                      <Option
                        key={item.customerId}
                        value={item.customerId}
                      >
                        {item.customerName}
                      </Option>
                    );
                  })
                }
              </Select>
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
