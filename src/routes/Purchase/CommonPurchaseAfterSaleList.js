import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Modal, Table, Button, message, DatePicker, Dropdown, Menu, Icon, Tooltip, Tabs } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './commonPurchaseAfterSaleList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  commonPurchaseAfterSaleList: state.commonPurchaseAfterSaleList,
}))
export default class commonPurchaseAfterSaleList extends PureComponent {
  componentDidMount() {
    const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
    });
    dispatch({
        type: 'commonPurchaseAfterSaleList/getConfig',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'commonPurchaseAfterSaleList/unmount',
    });
  }

  handleChangePage(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
      payload: {
        curPage: page,
      },
    });
  }
  handleChangePageSize(page, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  handleChange(key, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/updatePageReducer',
      payload: {
        [key]: value,
      },
    });
  }
handleChangeItems=(type,e)=>{
    const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/updatePageReducer',
      payload:{
          [type]:e.target.value,
      }
    });
}
handleSearchItems=(type,e)=>{
    const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
      payload:{
          [type]:e,
          curPage: 1,
      }
    });
}
handleChangeDate=(date,dateString)=>{
    const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
      payload:{
        startDate:dateString[0],
        endDate: dateString[1],
        curPage: 1,
      }
    });
}
handleSelectPurchaser=(selectedId,e)=>{
  const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/selectPurchaser',
      payload:{
        selectedId,
        purchaserId:e,
      }
    });
}
handleClear=(type)=>{
  const {dispatch,} = this.props;
    dispatch({
      type: 'commonPurchaseAfterSaleList/getOrderList',
      payload:{
       [type]:""
      }
    });
}
  render() {
    const {
      commonPurchaseAfterSaleList: {
        purchaserCheckMap,
        orderTypeMap,
        orderList,
        checkStatus,
        orderType,
        startDate,
        endDate,
        orderSn,
        customer,
        goodsSn,
        curPage,
        pageSize,
        total,
        selectedRowKeys,
        isLoading,
        // refundTypeMap,
        // refundType,
        // sellerMap,
        // sellerId,
        purchaserMap,
        purchaseOrderSn
      },
    } = this.props;
    const orderColumns = [
      {
        title: '售后单状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render: (recordCheckStatus) => {
          return purchaserCheckMap[recordCheckStatus];
        },
      },
      {
        title: '销售售后类型',
        dataIndex: 'type',
        key: 'type',
        render: (value) => {
          return orderTypeMap[value];
        },
      },
      {
        title: '退单号',
        dataIndex: 'backOrderSn',
        key: 'backOrderSn',
        width:150,
        render: (recordBackOrderSn, record) => {
          return [
            <Link to={`/sale/sale-order/after-sale-order-list/after-sale-order-detail/${record.id}`}>{recordBackOrderSn}</Link>,
            record.isReject ?
              (
                <Tooltip title={record.rejectRemark}>
                  <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                </Tooltip>
              ) :
              null,
          ];
        },
      },
      {
        title: '关联总单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        width:150,
      },
      {
        title: '关联采购单号',
        dataIndex: 'purchaseOrderSn',
        key: 'purchaseOrderSn',
        width:200,
      },
      {
        title: '收件人',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '采购员',
        dataIndex: 'purchaserId',
        key: 'purchaserId',
        width:200,
        render:(purchaserId,record)=>{
            return <Select
            style={{width:200}}
            value={purchaserMap[purchaserId]}
            onChange={this.handleSelectPurchaser.bind(this,record.id)}
            >
                {
                    Object.keys(purchaserMap).map(purchaser => (
                    <Option key={purchaser} value={purchaser}>{purchaserMap[purchaser]}</Option>
                    ))
                }
            </Select>
        }
      },
      {
        title: '制单时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
    ];
    const expendRenderGoods = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          render: (goodsThumb) => {
            return <img style={{ width: 50, heihgt: 50 }} src={goodsThumb} />;
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
          title: '销售单价',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '售后数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '销售售后金额',
          dataIndex: 'subTotal',
          key: 'subTotal',
        },
        {
          title: '销售是否含税',
          dataIndex: 'isTax',
          key: 'isTax',
          render: (isTax) => {
            return <span>{isTax ? '是' : '否'}</span>;
          },
        },
        // {
        //   title: '备注',
        //   dataIndex: 'remark',
        //   key: 'remark',
        //   width: 100,
        //   render: remark => (
        //     <Tooltip title={remark}>
        //       <span className={globalStyles['ellipsis-col']}>{remark}</span>
        //     </Tooltip>
        //   ),
        // },
      ];
      const { goodsList } = order;
      return (
        <Table
          bordered
          loading={isLoading}
          dataSource={goodsList}
          rowKey={record => record.id}
          columns={goodsColumns}
          className={globalStyles.tablestyle}
          pagination={false}
        />
      );
    };
    return (
      <PageHeaderLayout title="代发售后采购审核列表">
        <Card bordered={false}>
          <Row type="flex" align="middle">
            售后单状态：
            <Select
              className={globalStyles['select-sift']}
              value={purchaserCheckMap[checkStatus]}
              placeholder="退单状态"
              onChange={this.handleSearchItems.bind(this, 'checkStatus')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {/* <Option key={-1} value={-1}>全部售后单状态</Option> */}
              {
                Object.keys(purchaserCheckMap).map(checkStatusId => (
                  <Option key={checkStatusId} value={checkStatusId}>{purchaserCheckMap[checkStatusId]}</Option>
                ))
              }
            </Select>
            <Select
              className={globalStyles['select-sift']}
              value={orderType}
              placeholder="售后类型"
              onChange={this.handleSearchItems.bind(this, 'orderType')}
              style={{width:250}}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option key={-1} value={-1}>全部售后类型</Option>
              {
                Object.keys(orderTypeMap).map(orderTypeId => (
                  <Option value={orderTypeId}>
                    <Tooltip title={orderTypeMap[orderTypeId]}>
                      {orderTypeMap[orderTypeId]}
                    </Tooltip>
                  </Option>
                ))
              }
            </Select>
            
            <Input.Search
              className={globalStyles['input-sift']}
              onChange={this.handleChangeItems.bind(this, 'orderSn')}
              onSearch={this.handleSearchItems.bind(this, 'orderSn')}
              placeholder="退货单号/关联单号"
              value={orderSn}
              suffix={orderSn?<ClearIcon 
                  handleClear={this.handleClear.bind(this,"orderSn")}
              />:""}
            />
            <Input.Search
              className={globalStyles['input-sift']}
              value={customer}
              onChange={this.handleChangeItems.bind(this, 'customer')}
              onSearch={this.handleSearchItems.bind(this, 'customer')}
              placeholder="收件人/手机号"
              suffix={customer?<ClearIcon 
                handleClear={this.handleClear.bind(this,"customer")}
              />:""}
            />
            <Input.Search
              className={globalStyles['input-sift']}
              value={goodsSn}
              onChange={this.handleChangeItems.bind(this, 'goodsSn')}
              onSearch={this.handleSearchItems.bind(this, 'goodsSn')}
              placeholder="商品条码"
              suffix={goodsSn?<ClearIcon 
                handleClear={this.handleClear.bind(this,"goodsSn")}
              />:""}
            />
           
            制单时间：
            <RangePicker
              className={globalStyles['rangePicker-sift']}
              value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
              onChange={this.handleChangeDate.bind(this)}
              allowClear
            />
           
          </Row>
          <Row style={{marginTop:10}}>
            <Input.Search
            placeholder="采购单号"
            className={globalStyles['input-sift']}
            onChange={this.handleChangeItems.bind(this, 'purchaseOrderSn')}
            onSearch={this.handleSearchItems.bind(this, 'purchaseOrderSn')}
            value={purchaseOrderSn}
            suffix={purchaseOrderSn?<ClearIcon 
              handleClear={this.handleClear.bind(this,"purchaseOrderSn")}
            />:""}
            />
          </Row>
          <Table
            bordered
            style={{ marginTop: 20 }}
            loading={isLoading}
            // title={() => (<Link to="/sale/sale-order/after-sale-order-list/after-sale-order-add"><Button type="primary">新建售后单</Button></Link>)}
            rowKey={record => record.id}
            columns={orderColumns}
            dataSource={orderList}
            expandedRowRender={expendRenderGoods}
            className={globalStyles.tablestyle}
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
