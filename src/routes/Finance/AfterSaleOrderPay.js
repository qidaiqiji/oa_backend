import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Dropdown, Menu, Row, Select, Tooltip, Tabs, Checkbox, Modal } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AfterSaleOrderPay.less';
import globalStyles from '../../assets/style/global.less';
import RedBox from 'redbox-react';
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  afterSaleOrderPay: state.afterSaleOrderPay,
}))
export default class AfterSaleOrderPay extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/gwtConfig',
    });
    dispatch({
      type: 'afterSaleOrderPay/getOrderList',
    });
    dispatch({
      type: 'afterSaleOrderPay/getInvoicedList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/unmount',
    });
  }
  // 同步改变的项
  handleChangeSyncItem(type, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/changeSiftItem',
      payload: {
        [type]: value.target.value,
      },
    });
  }
  // 改变日期
  handleChangeDate(type, dates, dateStrings) {
    const { dispatch } = this.props;
    switch(type) {
      case 'date' :
        dispatch({
          type: 'afterSaleOrderPay/getList',
          payload: {
            startDate: dateStrings[0],
            endDate: dateStrings[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'payTime' :
        dispatch({
          type: 'afterSaleOrderPay/getList',
          payload: {
            payTimeStart: dateStrings[0],
            payTimeEnd: dateStrings[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'invoicedDate' :
        dispatch({
          type: 'afterSaleOrderPay/getList',
          payload: {
            invoicedDateStart: dateStrings[0],
            invoicedDateEnd: dateStrings[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'invoicedPayTime' :
        dispatch({
          type: 'afterSaleOrderPay/getList',
          payload: {
            invoicedPayTimeStart: dateStrings[0],
            invoicedPayTimeEnd: dateStrings[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
    }
  }
  // 改变售后类型
  handleChangeItem(type,value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/getList',
      payload: {
        [type]: value,
        curPage: 1,
        invoicedCurPage:1,
      },
    });
  }
  // // 关键字输入框按下回车
  // handlePressKeywords() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'afterSaleOrderPay/getList',
  //     payload: {
  //       curPage: 1,
  //     },
  //   });
  // }
  // 改变页码
  handleChangeCurPage(type,curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/getList',
      payload: {
        [type]:curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(type,curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/getList',
      payload: {
        curPage: 1,
        invoicedCurPage:1,
        [type]:pageSize,
      },
    });
  }
  handleChangeActiveKey=(activeKey)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/getOrderListPending',
      payload: {
        activeKey
      },
    });
  }
  handleCheck=(checkId,e)=>{
    const checked = e.target.checked;
    const { dispatch } = this.props;
    if(checked) {
      dispatch({
        type: 'afterSaleOrderPay/changeSiftItemReducer',
        payload: {
          checkId,
          showModal:true,
        },
      });
    }
  }
  handleConfirmCheck=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/confirmCheck',
    });
  }
  handleCloseModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderPay/changeSiftItemReducer',
      payload:{
        showModal:false,
      }
    });
  }
  render() {
    const {
      afterSaleOrderPay: {
        orderTypeMap,
        customer,
        startDate,
        endDate,
        curPage,
        pageSize,
        total,
        orderType,
        orderList,
        isTableLoading,
        refundTypeMap,
        refundType,
        sellerMap,
        sellerId,
        invoicedStartDate,
        invoicedEndDate,
        invoicedPayTimeStart,
        invoicedPayTimeEnd,
        payTimeStart,
        payTimeEnd,
        invoicedOrderType,
        invoicedRefundType,
        invoicedSellerId,
        activeKey,
        invoicedOrderList,
        invoicedTotal,
        invoicedCurPage,
        invoicedPageSize,
        showModal,
        returnInvStockMap,
        financialCheckStatusMap,
        checkStatusMap
      },
    } = this.props;
    const commonColumns = [
      {
        title: '售后类型',
        dataIndex: 'type',
        key: 'type',
        width:130,
        render:(type)=>{
          return <span>{orderTypeMap[type]}</span>
        }
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
        title: '关联订单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
      {
        title: '用户名',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '退款金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        render:(seller)=>{
          return <span>{sellerMap[seller]}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:100,
      },
      {
        title: '财务付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width:100,
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
              overlay={(
                <Menu>
                  <Menu.Item>
                    <Link
                      to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}`}
                    >
                      上传付款凭证
                    </Link>
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
    const normalColumns = [
      {
        title: '售后单状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        width:130,
        render:(checkStatus)=>{
          return <span>{checkStatusMap[checkStatus]}</span>
        }
      },
      {
        title: '售后单号',
        dataIndex: 'backOrderSn',
        key: 'backOrderSn',
        render:(backOrderSn,record)=>{
          return <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}`}>{backOrderSn}</Link>
        }
      },
    ];
    const invoicedColumns = [
      {
        title: '售后单状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render:(checkStatus)=>{
          return <span>{checkStatusMap[checkStatus]}</span>
        }
      },
      {
        title: '售后单号',
        dataIndex: 'backOrderSn',
        key: 'backOrderSn',
        render:(backOrderSn,record)=>{
          return <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}`}>{backOrderSn}</Link>
        }
      },
      {
        title: '发票库存状态',
        dataIndex: 'isReturnInvStock',
        key: 'isReturnInvStock',
        width:150,
        render:(isReturnInvStock,record)=>{
          return <div>
            {
              !isReturnInvStock?<Checkbox onChange={this.handleCheck.bind(this,record.id)}></Checkbox>:''
            }
            <span className={isReturnInvStock?styles.color:''}>{returnInvStockMap[isReturnInvStock]}</span>
          </div>
        }
      },
      {
        title: '关联开票号',
        dataIndex: 'relateOutInvFollowList',
        key: 'relateOutInvFollowList',
        width:150,
        render:(relateOutInvFollowList)=>{
          return <div>
            {
              relateOutInvFollowList.map(item=>(
                <p style={{margin:0}}><Link to={`/finance/finance-invoice/invoice-after-sale-list/after-sale-add/${item.id}`} key={item.inInvSn}>{`${item.inInvSn} / `}</Link></p>
              ))
            }
          </div>
        }
      },
    ]
    const expandedGoodsRender = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          render: (imgSrc) => {
            return <img style={{ width: 50, heihgt: 50 }} src={imgSrc}/>;
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
          title: '商品数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
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
          title: '单价',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '小计',
          dataIndex: 'subTotal',
          key: 'subTotal',
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
      return (
        <Table
          bordered
          columns={goodsColumns}
          dataSource={order.goodsList}
          pagination={false}
          rowKey={record => record.id}
        />
      );
    };

    return (
      <PageHeaderLayout title="销售售后应付">
        <Card bordered={false}>
          <Tabs onChange={this.handleChangeActiveKey} activeKey={activeKey}>
              <TabPane tab="正常售后" key="1">
                  <Row>
                    <Select
                      onChange={this.handleChangeItem.bind(this,"checkStatus")}
                      className={globalStyles['select-sift']}
                      placeholder="请选择售后单状态"
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={[1,6]}>全部售后单状态</Option>
                      {
                        Object.keys(financialCheckStatusMap).map(item => (
                          <Option value={item}>{financialCheckStatusMap[item]}</Option>
                        ))
                      }
                    </Select>
                    <Search
                      value={customer}
                      placeholder="用户名/手机号/退单号/关联单号"
                      style={{width:300,marginRight:10}}
                      onChange={this.handleChangeSyncItem.bind(this, 'customer')}
                      onSearch={this.handleChangeItem.bind(this,'customer')}
                    />
                    
                    <Select
                      onChange={this.handleChangeItem.bind(this,"orderType")}
                      className={globalStyles['select-sift']}
                      placeholder="请选择售后类型"
                      value={orderType}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部售后类型</Option>
                      {
                        Object.keys(orderTypeMap).map(orderTypeId => (
                          <Option value={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>
                        ))
                      }
                    </Select>
                    请选择退款方式：
                    <Select
                      onChange={this.handleChangeItem.bind(this,"refundType")}
                      className={globalStyles['select-sift']}
                      placeholder="请选择退款方式"
                      value={refundType}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部</Option>
                      {
                        Object.keys(refundTypeMap).map(refundTypeId => (
                          <Option value={refundTypeId}>{refundTypeMap[refundTypeId]}</Option>
                        ))
                      }
                    </Select>
                    请选择销售员：
                    <Select
                      onChange={this.handleChangeItem.bind(this,"sellerId")}
                      className={globalStyles['select-sift']}
                      placeholder="请选择销售员"
                      value={sellerId}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部</Option>
                      {
                        Object.keys(sellerMap).map(sellerId => (
                          <Option value={sellerId}>{sellerMap[sellerId]}</Option>
                        ))
                      }
                    </Select>
                  </Row>
                  <Row>
                    创建时间：<RangePicker
                      value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'date')}
                    />
                    财务付款时间：
                    <RangePicker
                      value={[payTimeStart ? moment(payTimeStart, 'YYYY-MM-DD') : '', payTimeEnd ? moment(payTimeEnd, 'YYYY-MM-DD') : '']}
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'payTime')}
                    />
                  </Row>
                  <Table
                    bordered
                    columns={[...normalColumns,...commonColumns]}
                    rowKey={record => record.id}
                    dataSource={orderList}
                    loading={isTableLoading}
                    expandedRowRender={expandedGoodsRender}
                    className={globalStyles.tablestyle}
                    pagination={{
                      total,
                      current: curPage,
                      pageSize,
                      showSizeChanger: true,
                      onChange: this.handleChangeCurPage.bind(this,'curPage'),
                      onShowSizeChange: this.handleChangePageSize.bind(this,'pageSize'),
                    }}
                  />
              </TabPane>
              <TabPane tab="开票后售后" key="2">
                  <Row>
                    <Select
                      onChange={this.handleChangeItem.bind(this,"invoicedCheckStatus")}
                      className={globalStyles['select-sift']}
                      placeholder="请选择售后单状态"
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部售后单状态</Option>
                      {
                        Object.keys(financialCheckStatusMap).map(item => (
                          <Option value={item}>{financialCheckStatusMap[item]}</Option>
                        ))
                      }
                    </Select>
                    <Search
                      placeholder="用户名/手机号/退单号/关联单号"
                      style={{width:300,marginRight:10}}
                      onChange={this.handleChangeSyncItem.bind(this, 'invoicedCustomer')}
                      onSearch={this.handleChangeItem.bind(this,'invoicedCustomer')}
                    />
                    
                    <Select
                      onChange={this.handleChangeItem.bind(this,"invoicedOrderType")}
                      className={globalStyles['select-sift']}
                      value={invoicedOrderType}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部售后类型</Option>
                      {
                        Object.keys(orderTypeMap).map(orderTypeId => (
                          <Option value={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>
                        ))
                      }
                    </Select>
                    请选择退款方式：
                    <Select
                      onChange={this.handleChangeItem.bind(this,"invoicedRefundType")}
                      className={globalStyles['select-sift']}
                      value={invoicedRefundType}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部</Option>
                      {
                        Object.keys(refundTypeMap).map(refundTypeId => (
                          <Option value={refundTypeId}>{refundTypeMap[refundTypeId]}</Option>
                        ))
                      }
                    </Select>
                    请选择销售员：
                    <Select
                      onChange={this.handleChangeItem.bind(this,"invoicedSellerId")}
                      className={globalStyles['select-sift']}
                      value={invoicedSellerId}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value={-1}>全部</Option>
                      {
                        Object.keys(sellerMap).map(sellerId => (
                          <Option value={sellerId}>{sellerMap[sellerId]}</Option>
                        ))
                      }
                    </Select>
                    <Select
                      className={globalStyles['select-sift']}
                      placeholder="请选择发票库存状态"
                      style={{width:250}}
                      onChange={this.handleChangeItem.bind(this,'invStockStatus')}
                    >
                      <Option value={""}>全部发票库存状态</Option>
                      {
                        Object.keys(returnInvStockMap).map((item) => {
                          return <Option key={item} value={item}>{returnInvStockMap[item]}</Option>;
                        })
                      }
                    </Select>
                  </Row>
                  <Row>
                    创建时间：
                    <RangePicker
                      value={[invoicedStartDate ? moment(invoicedStartDate, 'YYYY-MM-DD') : '', invoicedEndDate ? moment(invoicedEndDate, 'YYYY-MM-DD') : '']}
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'invoicedDate')}
                    />
                    财务付款时间：
                    <RangePicker
                      value={[invoicedPayTimeStart ? moment(invoicedPayTimeStart, 'YYYY-MM-DD') : '', invoicedPayTimeEnd ? moment(invoicedPayTimeEnd, 'YYYY-MM-DD') : '']}
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'invoicedPayTime')}
                    />
                  </Row>
                  <Table
                    bordered
                    columns={[...invoicedColumns,...commonColumns]}
                    rowKey={record => record.id}
                    dataSource={invoicedOrderList}
                    loading={isTableLoading}
                    expandedRowRender={expandedGoodsRender}
                    className={globalStyles.tablestyle}
                    pagination={{
                      total:invoicedTotal,
                      current: invoicedCurPage,
                      pageSize:invoicedPageSize,
                      showSizeChanger: true,
                      onChange: this.handleChangeCurPage.bind(this,'invoicedCurPage'),
                      onShowSizeChange: this.handleChangePageSize.bind(this,'invoicedPageSize'),
                    }}
                  />
              </TabPane>
          </Tabs>
          <Modal 
          title="提示"
          visible={showModal}
          onOk={this.handleConfirmCheck}
          onCancel={this.handleCloseModal}
          >
              该售后单关联的发票库存确认是否已还原？
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
