import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Card, Table, Input, DatePicker, Select, AutoComplete, Row, Button, Dropdown, Menu, Icon, Tooltip } from 'antd';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseAfterSaleOrderList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(state => ({
  purchaseAfterSaleOrderList: state.purchaseAfterSaleOrderList,
}))
export default class PurchaseAfterSaleOrderList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/unmount',
    });
  }

  handleChangeSiftItem(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'curPage':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            [type]: rest[1],
            curPage: 1,
          },
        });
        break;
      case 'orderType':
      case 'orderStatus':
      case 'payType':
      case 'purchaser':
      case 'backOrderType':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            [type]: rest[0],
            curPage: 1,
          },
        });
        break;
      case 'date':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            startDate: rest[1][0],
            endDate: rest[1][1],
            curPage: 1,
          },
        });
        break;
        case 'receiveAmountTime':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            receiveAmountTimeStart: rest[1][0],
            receiveAmountTimeEnd: rest[1][1],
            curPage: 1,
          },
        });
        break;
      case 'keywords':
        dispatch({
          type: 'purchaseAfterSaleOrderList/changeSiftItem',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      case 'supplierId':
        dispatch({
          type: 'purchaseAfterSaleOrderList/getOrderList',
          payload: {
            [type]: rest[0],
            curPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  // 修改筛选项
  @Debounce(200)
  handleChangeSupplierKeywords(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/changeSupplierKeywords',
      payload: {
        supplierKeywords: value,
      },
    });
  }
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/getOrderList',
      payload:{
        curPage:1,
      }
    });
  }
  handleChangeSelectOrderIds(selectOrderIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/changeSelectOrderIds',
      payload: {
        selectOrderIds,
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderList/getOrderList',
      payload: {
        [type]:"",
      },
    });
  }
  render() {
    const {
      purchaseAfterSaleOrderList: {
        orderStatusMap,
        orderTypeMap,
        curPage,
        pageSize,
        orderStatus,
        orderType,
        startDate,
        endDate,
        keywords,
        supplierId,
        // supplierKeywords,
        total,
        backOrderList,
        supplierSuggests,
        selectOrderIds,
        isLoading,
        payTypeMap,
        payType,
        purchaserMap,
        purchaser,
        actionList,
        receiveAmountTimeStart,
        receiveAmountTimeEnd,
        backOrderTypeMap
      },
    } = this.props;
    const exportAllOrder = `http://erp.xiaomei360.com/purchaseAfterSaleOrderList/export-all-order?${
      stringify({
        orderStatus,
        orderType,
        startDate,
        endDate,
        keywords,
        supplierId,
      })
    }`;
    const exportSelectedOrder = `http://erp.xiaomei360.com/purchaseAfterSaleOrderList/export-selected-order${
      stringify({ orderIds: selectOrderIds })
    }`;
    const supplierSuggestsOptions = supplierSuggests.map((supplier) => {
      return (
        <Option value={supplier.id.toString()}>{supplier.name}</Option>
      );
    });
    const orderColumns = [
      {
        title: '售后单状态',
        key: 'status',
        dataIndex: 'status',
      },
      {
        title: '售后单号',
        key: 'sn',
        dataIndex: 'sn',
        width:80,
        render: (sn, record) => {
          return (
            [
              <Link to={`/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail/${sn}/${record.backOrderType}`}>{sn}</Link>,
              record.isReject ?
                <p>
                  <Tooltip title={record.rejectRemark}>
                    <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                  </Tooltip>
                </p> :
                null,
            ]
          );
        },
      },
      {
        title: '售后类型',
        key: 'type',
        dataIndex: 'type',
        render:(type)=>{
          return <span>{orderTypeMap[type]}</span>
        }
      },
      {
        title: '售后类别',
        key: 'backOrderType',
        dataIndex: 'backOrderType',
        render:(backOrderType)=>{
          return <span>{backOrderTypeMap[backOrderType]}</span>
        }
      },
      {
        title: '收款方式',
        key: 'payType',
        dataIndex: 'payType',
        width:110,
        render:(payType)=>{
          return <span>{payTypeMap[payType]}</span>
        }
      },
      {
        title: '财务收款时间',
        key: 'receiveAmountTime',
        dataIndex: 'receiveAmountTime',
        width:100,
      },
      {
        title: '关联采购单号',
        key: 'relatedPurchaseOrderSn',
        dataIndex: 'relatedPurchaseOrderSn',
      },
      {
        title: '供应商',
        key: 'supplier',
        dataIndex: 'supplier',
      },
      {
        title: '采购员',
        key: 'purchaser',
        dataIndex: 'purchaser',
        width:130,
        render:(purchaser)=>{
          return <span>{purchaserMap[purchaser]}</span>
        }
      },
      {
        title: '退款总额',
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
      },
      {
        title: '创建时间',
        key: 'time',
        dataIndex: 'time',
        width:100,
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              placement="bottomCenter"
              overlay={(
                <Menu>
                  <Menu.Item>
                    <Link to={`/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail/${record.id}`}>
                      <Icon type="bars" />详情
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
    const expandGoodsTable = (order) => {
      const orderGoodsColumns = [
        {
          title: '主图',
          key: 'img',
          dataIndex: 'img',
          render: (imgSrc, record) => {
            return <img src={imgSrc} alt={record.name} style={{ width: 55, height: 55 }} />;
          },
        },
        {
          title: '商品名称',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '商品条码',
          key: 'sn',
          dataIndex: 'sn',
        },
        {
          title: '单位',
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: '是否含税',
          key: 'isTax',
          dataIndex: 'isTax',
          render: (isTax) => {
            return <span>{isTax ? '是' : '否'}</span>;
          },
        },
        {
          title: '单价',
          key: 'price',
          dataIndex: 'price',
        },
        {
          title: '退货数量',
          key: 'returnNum',
          dataIndex: 'returnNum',
        },
        {
          title: '退货金额',
          key: 'returnMoney',
          dataIndex: 'returnMoney',
        },
        {
          title: '备注',
          key: 'remark',
          dataIndex: 'remark',
        },
      ];
      return (
        <Table
          bordered
          dataSource={order.backGoodsList}
          pagination={false}
          columns={orderGoodsColumns}
          rowKey={record => record.id}
          className={globalStyles.tablestyle}
        />
      );
    };
    return (
      <PageHeaderLayout title="采购售后单列表">
        <Card bordered={false}>
          <Row>
            <Select
              value={orderStatus}
              className={globalStyles['select-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'orderStatus')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value={-1}>全部退单状态</Option>
              {
                Object.keys(orderStatusMap).map((orderStatusId) => {
                  return (
                    <Option value={orderStatusId}>{orderStatusMap[orderStatusId]}</Option>
                  );
                })
              }
            </Select>
            <Select
              value={orderType}
              className={globalStyles['select-sift']}
              style={{marginRight:0}}
              onChange={this.handleChangeSiftItem.bind(this, 'orderType')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value={-1}>全部退单类型</Option>
              {
                Object.keys(orderTypeMap).map((orderTypeId) => {
                  return (
                    <Option value={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>
                  );
                })
              }
            </Select>
            <Tooltip title="入库前退货退款（不会产生出库单），入库后退货退款（会产生出库单)"><Icon type="question-circle" style={{marginRight:10}}/></Tooltip>
            <Select
              value={payType}
              className={globalStyles['select-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'payType')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value={-1}>全部收款方式</Option>
              {
                Object.keys(payTypeMap).map((payTypeId) => {
                  return (
                    <Option value={payTypeId}>{payTypeMap[payTypeId]}</Option>
                  );
                })
              }
            </Select>
            <Select
              value={purchaser}
              className={globalStyles['select-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'purchaser')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value={-1}>全部采购员</Option>
              {
                Object.keys(purchaserMap).map((purchaserId) => {
                  return (
                    <Option value={purchaserId}>{purchaserMap[purchaserId]}</Option>
                  );
                })
              }
            </Select>
            <Search
              className={globalStyles['input-sift']}
              placeholder="退货单号/关联单号/用户"
              onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
              onSearch={this.handleGetOrderList.bind(this)}
              value={keywords}
              suffix={keywords?<ClearIcon 
                  handleClear={this.handleClear.bind(this,"keywords")}
              />:""}
            />
            <AutoComplete
              className={globalStyles['input-sift']}
              placeholder="请输入供应商"
              dataSource={supplierSuggestsOptions}
              // value={supplierKeywords}
              onSearch={this.handleChangeSupplierKeywords.bind(this)}
              onSelect={this.handleChangeSiftItem.bind(this, 'supplierId')}
              allowClear
              dropdownMatchSelectWidth={false}              
            >
              <Search />
            </AutoComplete>
            <Select
              className={globalStyles['select-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'backOrderType')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value={"-1"}>全部售后类别</Option>
              {
                Object.keys(backOrderTypeMap).map((backType) => {
                  return (
                    <Option value={backType}>{backOrderTypeMap[backType]}</Option>
                  );
                })
              }
            </Select>
            
            {
              actionList.map(item=>{
                return <a href={item.url} target="_blank" style={{display:'inline-block',marginLeft:20}}><Button type="primary">{item.name}</Button></a>
              })
            }
          </Row>
          <Row>
            <RangePicker
              value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
              format="YYYY-MM-DD"
              onChange={this.handleChangeSiftItem.bind(this, 'date')}
              className={globalStyles['rangePicker-sift']}
            />
          </Row>
          <Table
            bordered
            expandedRowRender={expandGoodsTable}
            dataSource={backOrderList}
            columns={orderColumns}
            loading={isLoading}
            className={globalStyles.tablestyle}
            rowKey={record => record.id}
            className={globalStyles.tablestyle}
            pagination={{
              total,
              current: curPage,
              pageSize,
              showSizeChanger: true,
              onChange: this.handleChangeSiftItem.bind(this, 'curPage'),
              onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
              showTotal:total => `共 ${total} 个结果`,
            }}
            rowSelection={{
              selectedRowKeys: selectOrderIds,
              onChange: this.handleChangeSelectOrderIds.bind(this),
            }}
            title={() => {
              return (
                [
                  <Link to="/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-edit/0">
                    <Button type="primary" style={{marginRight:20}}>新建正常售后单</Button>
                  </Link>,
                  <Link to="/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-edit/1">
                    <Button type="primary">新建开票后售后单</Button>
                  </Link>,
                ]
              );
            }}
            footer={() => {
              return (
                [
                  <a href={exportAllOrder} target="_blank">
                    <Button type="primary" style={{ marginRight: 10 }}>导出全部</Button>
                  </a>,
                  <a href={exportSelectedOrder} target="_blank">
                    <Button type="primary" disabled={selectOrderIds.length === 0}>导出选中</Button>
                  </a>,
                ]
              );
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
