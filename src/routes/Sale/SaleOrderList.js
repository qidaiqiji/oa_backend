import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Card, Input, Select, Table, Button, DatePicker, Dropdown, Menu, Icon, Tooltip,Col } from 'antd';
import { Link } from 'dva/router';
import { stringify } from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SaleOrderList.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;
const { RangePicker } = DatePicker;


@connect(state => ({
  saleOrderList: state.saleOrderList,
}))
export default class SaleOrderDetail extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     checkStatus: -1,
  //     orderStatus: -1,
  //     orderOrigin: -1,
  //     orderStartTime: moment().add(-30, 'days'),
  //     orderEndTime: moment(),
  //     customer: '',
  //     consignee: '',
  //     selectedRows: [],
  //     curPage: 1,
  //     pageSize: 10,
  //   };
  // }
  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    // const { checkStatus, orderStatus, orderOrigin, orderStartTime, orderEndTime, customer, consignee } = this.state;
    dispatch({
      type: 'saleOrderList/getConfig',
      payload: {},
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'saleOrderList/unmount',
    });
  }
  getOrderList(params = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderList/getOrderList',
      payload: {
        ...params,
      },
    });
  }

  // 改变 订单状态 筛选项
  handleChangeSyncItem(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'orderStatus':
      case 'checkStatus':
      case 'orderOrigin':
      case 'selectedRows':
        dispatch({
          type: 'saleOrderList/getOrderList',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      case 'date':
        dispatch({
          type: 'saleOrderList/getOrderList',
          payload: {
            orderStartTime: rest[1][0],
            orderEndTime: rest[1][1],
          },
        });
        break;
      case 'payTime':
        dispatch({
          type: 'saleOrderList/getOrderList',
          payload: {
            payTimeStart: rest[1][0],
            payTimeEnd: rest[1][1],
          },
        });
      break;
      case 'customer':
      case 'consignee':
      case 'orderId':
        dispatch({
          type: 'saleOrderList/getOrderList',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      default:
        break;
    }
  }
  // 换页
  handleChangeCurPage(page) {
    this.getOrderList({
      curPage: page,
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    this.getOrderList({
      pageSize,
      curPage: 1,
    });
  }
  handleChangeKeyWords=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderList/changeSyncItemReducer',
      payload: {
        [type]:e.target.value,
      },
    });
  }
  render() {
    const {
      saleOrderList: {
        orderList,
        total,
        checkMap,
        statusMap,
        originMap,
        payStatusMap,
        payMethodMap,
        isGetOrderListing,

        checkStatus,
        orderStatus,
        orderOrigin,
        orderStartTime,
        orderEndTime,
        customer,
        consignee,
        curPage,
        pageSize,
        selectedRows,
        payTimeStart,
        payTimeEnd,
        orderId,
        token,
      },
    } = this.props;
    const exportAllUrl = `http://erp.xiaomei360.com/common/export-order-group-list?${stringify({
      orderStatus,
      orderOrigin,
      orderStartTime,
      orderEndTime,
      customer,
      consignee,
      payTimeStart,
      payTimeEnd,
      orderId,
      token,
    })}`;

    const exportSelectedUrl = `http://erp.xiaomei360.com/common/export-order-group-from-ids?${stringify({
      ids: selectedRows,
      token,
    })}`;
    const columns = [
      {
        title: '总单ID',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '审核状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render: checkStatus => checkMap[checkStatus],
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        // filterDropdown: (
        //   <Input
        //     placeholder="Search name"
        //   />
        // ),
        // filterIcon: <Icon type="smile-o" />,
        render: orderStatus => statusMap[orderStatus],
      },
      {
        title: '订单号',
        dataIndex: 'orderNum',
        key: 'orderNum',
        width:150,
        render: (orderNum, record) => {
          return (
            <div>   
              {
                ( record.onSaleReject)
                  ? (
                    <Tooltip title={record.onSaleRejectRemark}>
                      <p style={{ color: '#fff', margin: 0, padding: '2px 5px', background: 'blue', fontSize: 12,width:60,textAlign:"center" }}>售中驳回</p>
                    </Tooltip>
                  )
                  : null
              }           
              <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{orderNum}</Link> 
              {
                (record.checkStatus === 3 || record.isReject)
                  ? (
                    <Tooltip title={record.rejectRemark}>
                      <span style={{ color: '#fff', padding: '2px 5px', background: 'red', fontSize: 12 }}>驳回</span>
                    </Tooltip>
                  )
                  : null
              }          
              {record.isDiscount ? <span style={{ color: '#fff', padding: '2px 5px', marginLeft: 5, backgroundColor: '#FC1268', fontSize: 12 }}>特价</span> : null}              
              {record.isAfterSale ? <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#fb5f27', fontSize: 12 }}>售后</span> : null}
              
            </div>
          );
        },
      },
      {
        title: '用户名',
        dataIndex: 'customerName',
        key: 'customerName',
        width:150,
      },
      {
        title: '客户标签',
        dataIndex: 'userTag',
        key: 'userTag',
        width:150,
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
      // {
      //   title: '付款状态',
      //   dataIndex: 'payStatus',
      //   key: 'payStatus',
      //   render: payStatus => payStatusMap[payStatus],
      // },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:110,
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width:110,
      },
      {
        title: '支付方式',
        dataIndex: 'payMethod',
        key: 'payMethod',
        render: payMethod => payMethodMap[payMethod],
      },
      {
        title: '订单来源',
        dataIndex: 'orderOrigin',
        key: 'orderOrigin',
        render: orderOrigin => originMap[orderOrigin],
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 120,
        render: (remark, record) => {
          return (
            <Tooltip
              title={remark}
            >
              <span className={styles.col}>{remark}</span>
            </Tooltip>
          );
        },
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
                    <Link to={`sale-order-list/sale-order-detail/${record.orderId}`}>
                      <Icon type="search" /> 详情
                    </Link>
                  </Menu.Item>
                  {
                  (record.status === 2 || record.status === 11 || record.status === 13) && (
                    <Menu.Item>
                      <Link to={`sale-order-list/sale-order-add/${record.orderId}`}>
                        <Icon type="setting" /> 修改
                      </Link>
                    </Menu.Item>
                  )
                }
                  {
                  record.status === 2 && (
                    <Menu.Item>
                      <div onClick={() => { this.handleShowCheckConfirm(record.no, record.id); }}>
                        <Icon type="check" /> 通过
                      </div>
                    </Menu.Item>
                  )
                }
                  {
                  record.status === 2 && (
                    <Menu.Item>
                      <div onClick={() => { this.handleShowRejectConfirm(record.no, record.id); }}>
                        <Icon type="close" /> 驳回
                      </div>
                    </Menu.Item>
                  )
                }
                  {
                  (record.status === 2 || record.status === 11) && (
                    <Menu.Item>
                      <div onClick={() => { this.handleShowDeleteConfirm(record.no, record.id); }}>
                        <Icon type="delete" /> 撤销
                      </div>
                    </Menu.Item>
                  )
                }
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
    function expandedRowRender(order) {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img className={styles.goodsImg} src={img}/>;
          },
        },
        {
          title: '商品名',
          dataIndex: 'name',
          key: 'name',
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

    return (
      <PageHeaderLayout title="销售单列表">
        <Card bordered={false}>
          <Row style={{ position: 'relative' }}>
            <Select
              className={globalStyles['select-sift']}
              value={checkStatus}
              onSelect={this.handleChangeSyncItem.bind(this, 'checkStatus')}
            >
              <Option key={-1} value={-1}>全部审核状态</Option>
              {Object.keys(checkMap).map(checkId => (
                <Option key={checkId} value={checkId}>{checkMap[checkId]}</Option>
              ))}
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={orderStatus}
              onSelect={this.handleChangeSyncItem.bind(this, 'orderStatus')}
            >
              <Option key={-1} value={-1}>全部订单状态</Option>
              {Object.keys(statusMap).map(statusId => (
                <Option key={statusId} value={statusId}>{statusMap[statusId]}</Option>
              ))}
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={orderOrigin}
              onSelect={this.handleChangeSyncItem.bind(this, 'orderOrigin')}
            >
              <Option key={-1} value={-1}>全部订单来源</Option>
              {Object.keys(originMap).map(originId => (
                <Option key={originId} value={originId}>{originMap[originId]}</Option>
              ))}
            </Select>
            <Input.Search
              className={globalStyles['input-sift']}
              // value={consignee}
              onSearch={this.handleChangeSyncItem.bind(this, 'orderId')}
              onChange={this.handleChangeKeyWords.bind(this, 'orderId')}
              placeholder="总单ID"
            />
            <Input.Search
              className={globalStyles['input-sift']}
              // value={customer}
              onSearch={this.handleChangeSyncItem.bind(this, 'customer')}
              onChange={this.handleChangeKeyWords.bind(this, 'customer')}
              placeholder="订单号/子单号/客户名/手机号"
            />
            <Input.Search
              className={globalStyles['input-sift']}
              // value={consignee}
              onSearch={this.handleChangeSyncItem.bind(this, 'consignee')}
              onChange={this.handleChangeKeyWords.bind(this, 'consignee')}
              placeholder="收货人/手机号"
            />
           
            {/* <Button onClick={this.getOrderList.bind(this, { curPage: 1 })} type="primary">搜索</Button> */}
          </Row>
          <Row>
            <Col span={6}>
              按创建时间搜索：
              <RangePicker
                  value={[orderStartTime ? moment(orderStartTime, 'YYYY-MM-DD') : '', orderEndTime ? moment(orderEndTime, 'YYYY-MM-DD') : '']}
                  onChange={this.handleChangeSyncItem.bind(this, 'date')}
                  className={globalStyles['rangePicker-sift']}
                />
            </Col>
            <Col>
            按支付时间搜索：
              <RangePicker
                  value={[payTimeStart ? moment(payTimeStart, 'YYYY-MM-DD') : '', payTimeEnd ? moment(payTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.handleChangeSyncItem.bind(this, 'payTime')}
                  className={globalStyles['rangePicker-sift']}
                />
            </Col>
          </Row>
          <Table
            bordered
            title={() => (
              <Link to="sale-order-list/sale-order-add">
                <Button type="primary" icon="plus">
                  新建订单
                </Button>
              </Link>
            )}
            loading={isGetOrderListing}
            rowSelection={{
              onChange: this.handleChangeSyncItem.bind(this, 'selectedRows'),
              selectedRowKeys: selectedRows,
            }}
            rowKey={record => record.orderId}
            columns={columns}
            pagination={{
              current: curPage,
              pageSize,
              total,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangeCurPage.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
            expandedRowRender={expandedRowRender}
            dataSource={orderList}
            footer={() =>
              (
                <Row>
                  <a href={exportAllUrl} target="_blank">
                    <Button type="primary">导出全部</Button>
                  </a>
                  <a href={exportSelectedUrl} target="_blank">
                    <Button disabled={selectedRows.length === 0} type="primary" style={{ marginLeft: 20 }}>导出选中</Button>
                  </a>
                </Row>
              )
            }
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
