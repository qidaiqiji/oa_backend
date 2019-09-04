import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Modal, Table, Button, message, DatePicker, Dropdown, Menu, Icon, Tooltip, Tabs } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AfterSaleOrderList.less';
import globalStyles from '../../assets/style/global.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  afterSaleOrderList: state.afterSaleOrderList,
}))
export default class AfterSaleOrderList extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      afterSaleOrderList: {
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        pageSize,
        curPage,
        refundType,
        sellerId,
        payTimeStart,
        payTimeEnd,
        isMerchant,
      },
    } = this.props;
    dispatch({
      type: 'afterSaleOrderList/mount',
      payload: {
        curPage,
        pageSize,
        checkStatus,
        orderType,
        refundType,
        startDate,
        endDate,
        orderSn,
        customer,
        sellerId,
        payTimeStart,
        payTimeEnd,
        isMerchant,
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'afterSaleOrderList/unmount',
    });
  }
  handleSearchOrderList() {
    const { dispatch } = this.props;
    const {
      afterSaleOrderList: {
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        pageSize,
        refundType,
        sellerId,
        payTimeStart,
        payTimeEnd,
        isMerchant,
        backOrderType,
      },
    } = this.props;
    dispatch({
      type: 'afterSaleOrderList/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        refundType,
        sellerId,
        payTimeStart,
        payTimeEnd,
        isMerchant,
        backOrderType,
      },
    });
  }
  handleChangePage(page) {
    const { dispatch } = this.props;
    const {
      afterSaleOrderList: {
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        pageSize,
        goodsSn,
        isMerchant,
      },
    } = this.props;
    dispatch({
      type: 'afterSaleOrderList/getOrderList',
      payload: {
        curPage: page,
        pageSize,
        checkStatus,
        orderType,
        selectedRowKeys: [],
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        isMerchant,
      },
    });
  }
  handleChangePageSize(page, pageSize) {
    const { dispatch } = this.props;
    const {
      afterSaleOrderList: {
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        isMerchant,
      },
    } = this.props;
    dispatch({
      type: 'afterSaleOrderList/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
        checkStatus,
        orderType,
        startDate,
        endDate,
        selectedRowKeys: [],
        orderSn,
        customer,
        goodsSn,
        isMerchant,
      },
    });
  }
  handleChange(key, e, dataString) {
    const { dispatch } = this.props;
    switch (key) {
      case 'checkStatus':
      case 'orderType':
      case 'refundType':
      case 'selectedRowKeys':
      case 'sellerId':
      case 'backOrderType':
        dispatch({
          type: 'afterSaleOrderList/change',
          payload: {
            [key]: e,
          },
        });
      break;
      case 'customer':
      case 'orderSn':
      case 'goodsSn':
        dispatch({
          type: 'afterSaleOrderList/change',
          payload: {
            [key]: e.target.value,
          },
        });
      break;
      case 'date':
        dispatch({
          type: 'afterSaleOrderList/change',
          payload: {
            startDate: dataString[0],
            endDate:dataString[1], 
          },
        });
      break;
      case 'payTime':
        dispatch({
          type: 'afterSaleOrderList/change',
          payload: {
            payTimeStart: dataString[0],
            payTimeEnd:dataString[1], 
          },
        });
      break;
    }
    
  }
  render() {
    const {
      afterSaleOrderList: {
        checkStatusMap,
        orderTypeMap,
        orderList,
        checkStatus,
        orderType,
        date,
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        payTimeStart,
        payTimeEnd,
        curPage,
        pageSize,
        total,
        selectedRowKeys,
        isLoading,
        refundTypeMap,
        refundType,
        sellerMap,
        sellerId,
        actionList,
        backOrderTypeMap,
      },
    } = this.props;
    const exportAllUrl = `http://erp.xiaomei360.com/common/export-back-order-all?${stringify({
      // checkStatus,
      // orderType,
      checkStatus,
      orderSn,
      customer,
      orderType,
      startDate,
      endDate,
    })}`;
    const exportSelectedUrl = `http://erp.xiaomei360.com/common/export-back-order?${stringify({
      orderListId: selectedRowKeys,
    })}`;
    const orderColumns = [
      {
        title: '订单状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render: (recordCheckStatus) => {
          return checkStatusMap[recordCheckStatus];
        },
      },
      {
        title: '售后类型',
        dataIndex: 'type',
        key: 'type',
        width:120,
        render: (value) => {
          return orderTypeMap[value];
        },
      },
      {
        title: '售后类别',
        dataIndex: 'backOrderType',
        key: 'backOrderType',
        render: (value) => {
          return backOrderTypeMap[value];
        },
      },
      {
        title: '退单号',
        dataIndex: 'backOrderSn',
        key: 'backOrderSn',
        render: (recordBackOrderSn, record) => {
          return [
            <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}/${record.backOrderType}`}>{recordBackOrderSn}</Link>,
            record.isReject ?
              (
                <Tooltip title={record.rejectRemark}>
                  <div>
                    <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                  </div>
                </Tooltip>
              ) :
              null,
          ];
        },
      },
      {
        title: '关联单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
      {
        title: '制单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:100,
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width:100,
      },
      {
        title: '售后金额',
        dataIndex: 'amount',
        key: 'amount',
        width:110,
      },
      {
        title: '退款方式',
        dataIndex: 'refundType',
        key: 'refundType',
        render:(refundType)=>{
          return <span>{refundTypeMap[refundType]}</span>
        }
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        width:100,
        render:(seller)=>{
          return <span>{sellerMap[seller]}</span>
        }
      },
      {
        title: '客户名',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
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
                    <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}`}>
                      <div>
                        详情
                      </div>
                    </Link>
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
    const expendRenderGoods = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          render: (goodsThumb) => {
            return <img style={{ width: 50, heihgt: 50 }} src={goodsThumb}/>;
          },
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
          title: '售后数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '售后金额',
          dataIndex: 'subTotal',
          key: 'subTotal',
        },
        {
          title: '是否含税',
          dataIndex: 'isTax',
          key: 'isTax',
          render: (isTax) => {
            return <span>{isTax ? '是' : '否'}</span>;
          },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 100,
          render: remark => (
            <Tooltip title={remark}>
              <span className={globalStyles['ellipsis-col']}>{remark}</span>
            </Tooltip>
          ),
        },
      ];
      const { goodsList } = order;
      return (
        <Table
          bordered
          loading={isLoading}
          dataSource={goodsList}
          rowKey={record => record.id}
          columns={goodsColumns}
          pagination={false}
        />
      );
    };
    return (
      <PageHeaderLayout title="售后单列表">
        <Card bordered={false}>
          <Row type="flex" align="middle">
            <Select
              className={globalStyles['select-sift']}
              value={checkStatus}
              placeholder="退单状态"
              onSelect={this.handleChange.bind(this, 'checkStatus')}
            >
              <Option key={-1} value={-1}>全部退单状态</Option>
              {
                Object.keys(checkStatusMap).map(checkStatusId => (
                  <Option key={checkStatusId} value={checkStatusId}>{checkStatusMap[checkStatusId]}</Option>
                ))
              }
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={orderType}
              placeholder="售后类型"
              onSelect={this.handleChange.bind(this, 'orderType')}
            >
              <Option key={-1} value={-1}>全部售后类型</Option>
              {
                Object.keys(orderTypeMap).map(orderTypeId => (
                  <Option key={orderTypeId} value={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>
                ))
              }
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={refundType}
              placeholder="退款方式"
              onSelect={this.handleChange.bind(this, 'refundType')}
            >
              <Option key={-1} value={-1}>全部退款方式</Option>
              {
                Object.keys(refundTypeMap).map(refundTypeId => (
                  <Option key={refundTypeId} value={refundTypeId}>{refundTypeMap[refundTypeId]}</Option>
                ))
              }
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={sellerId}
              placeholder="销售员"
              onSelect={this.handleChange.bind(this, 'sellerId')}
            >
              <Option key={-1} value={-1}>全部销售员</Option>
              {
                Object.keys(sellerMap).map(sellerId => (
                  <Option key={sellerId} value={sellerId}>{sellerMap[sellerId]}</Option>
                ))
              }
            </Select>
            <Input
              className={globalStyles['input-sift']}
              value={orderSn}
              onChange={this.handleChange.bind(this, 'orderSn')}
              placeholder="退货单号/关联单号"
            />
            <Input
              className={globalStyles['input-sift']}
              value={customer}
              onChange={this.handleChange.bind(this, 'customer')}
              placeholder="客户名/手机号"
            />
            <Input
              className={globalStyles['input-sift']}
              value={goodsSn}
              onChange={this.handleChange.bind(this, 'goodsSn')}
              placeholder="商品条码"
            />
            <Col align="end" span={3}>
              {
                actionList.map(item=>{
                  return <a href={item.url} target="_blank" style={{display:"inline-block",marginLeft:40}}><Button type="primary">导出</Button></a>
                })
              }
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{}}>
            制单时间：
            <RangePicker
              className={globalStyles['rangePicker-sift']}
              value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
              onChange={this.handleChange.bind(this, 'date')}
              allowClear
            />
            付款时间：
            <RangePicker
              className={globalStyles['rangePicker-sift']}
              value={[payTimeStart ? moment(payTimeStart, 'YYYY-MM-DD') : '', payTimeEnd ? moment(payTimeEnd, 'YYYY-MM-DD') : '']}
              onChange={this.handleChange.bind(this, 'payTime')}
              // allowClear
            />
            <Select
              className={globalStyles['select-sift']}
              onChange={this.handleChange.bind(this, 'backOrderType')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option key={-1} value={-1}>全部售后类别</Option>
              {
                Object.keys(backOrderTypeMap).map(item => (
                  <Option key={item} value={item}>{backOrderTypeMap[item]}</Option>
                ))
              }
            </Select>
            <Col align="end" span={10}>
              <Button
                style={{ verticalAlign: 'top', marginBottom: '10px' }}
                icon="search"
                type="primary"
                onClick={this.handleSearchOrderList.bind(this)}
              >
                搜索
              </Button>
            </Col>
          </Row>
          <Table
            bordered  
            style={{ marginTop: 20 }}
            loading={isLoading}
            className={globalStyles.tablestyle}
            title={() => (
              <Row>
                <Link to={{
                  pathname:'/sale/sale-order/after-sale-order-list/after-sale-order-add',
                  query:{
                    type:0,
                  }
                }}><Button type="primary" style={{marginRight:10}}>新建正常售后单</Button></Link>
                 <Link to={{
                  pathname:'/sale/sale-order/after-sale-order-list/after-sale-order-add',
                  query:{
                    type:1,
                  }
                }}><Button type="primary">新建开票后售后单</Button></Link>
              </Row>
            )}
            footer={() => {
              return (
                <Row>
                  <a target="_blank" href={exportAllUrl}><Button type="primary">导出全部</Button></a>
                  <a target="_blank" href={exportSelectedUrl} style={{ marginLeft: 10 }}><Button type="primary" disabled={selectedRowKeys.length === 0}>导出所选</Button></a>
                </Row>
              );
            }}
            rowKey={record => record.id}
            columns={orderColumns}
            dataSource={orderList}
            expandedRowRender={expendRenderGoods}
            rowSelection={{
              selectedRowKeys,
              onChange: this.handleChange.bind(this, 'selectedRowKeys'),
            }}
            pagination={{
              current: curPage,
              pageSize,
              onChange: this.handleChangePage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showSizeChanger: false,
              showQuickJumper: false,
              total,
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
