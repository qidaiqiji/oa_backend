import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, DatePicker, Select, Table, Dropdown, Menu, Row, Icon, Tooltip, message, Divider, Button, Col, Modal, InputNumber } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PendingFollowUpForm.less';
import globalStyles from '../../assets/style/global.less';
import Search from '../../../node_modules/antd/lib/input/Search';
import moment from 'moment';

const { RangePicker } = DatePicker;
@connect(state => ({
  pendingFollowUpForm: state.pendingFollowUpForm,
}))
export default class PendingFollowUpForm extends PureComponent {
  componentDidMount() {
    const { dispatch, pendingFollowUpForm } = this.props;
    dispatch({
      type: 'pendingFollowUpForm/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pendingFollowUpForm/unmount',
    });
  }
  changesellrRemark(value, id, e) {
    const { dispatch } = this.props;
    const { list } = this.props.pendingFollowUpForm;
    list.map((itme) => {
      if (id === itme.id) {
        console.log(itme.sellerRemark);
        console.log(e.target.value);
        itme.sellerRemark = e.target.value;
        console.log(list);
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            outInvOrderId: id,
            remark: e.target.value,
            list,
          },
        });
      }
    });
  }
  remarks(value, id, e) {
    const { dispatch } = this.props;
    const { list } = this.props.pendingFollowUpForm;
    list.map((itme) => {
      if (id === itme.id) {
        itme.sellerRemark = value;
        dispatch({
          type: 'pendingFollowUpForm/remarks',
          payload: {
            outInvOrderId: id,
            remark: e.target.value,
            list,
          },
        });
      }
    });
    console.log(value);
    console.log(id);
  }
  handleChangeSiftItem(type, e, dataStrings) {
    console.log(`type = ${type}, e = ${e}, dataStrings = ${dataStrings}`);
    const { dispatch } = this.props;
    switch (type) {
      case 'outInvOrderSn':
      case 'orderSn':
      case 'goodsSn':
      case 'customerKeywords':
      case 'sellerRemark':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'sellerId':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      case 'createDate':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            createDateStart: dataStrings[0],
            createDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      case 'orderCreateDate':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            orderCreateDateStart: dataStrings[0],
            orderCreateDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      case 'orderPayDate':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            orderPayDateStart: dataStrings[0],
            orderPayDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      case 'pageSize':
        
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            [type]: dataStrings,
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      case 'currentPage':
      case 'isSuitDetail':
      case 'status':
        dispatch({
          type: 'pendingFollowUpForm/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'pendingFollowUpForm/getList',
        });
        break;
      default:
        break;
    }
  }
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pendingFollowUpForm/getList',
      payload:{
        currentPage:1,
      }
    });
  }

  render() {
    const {
      pendingFollowUpForm: {
        outInvOrderId,
        actionList,
        total,
        outcomeInvOrderList,
        id,
        status,
        invSn,
        createTime,
        customerName,
        companyName,
        invAmount,
        isSuitDetail,
        seller,
        sellerRemark,
        invOrderGoodsList,
        groupSn,
        orderCreateTime,
        goodsName,
        goodsSn,
        num,
        salePrice,
        saleAmount,
        payTime,
        orderSn,
        customerKeywords,
        sellerMap,
        outInvOrderSn,
        sellerId,
        createDateStart,
        createDateEnd,
        orderCreateDateStart,
        orderCreateDateEnd,
        orderPayDateStart,
        orderPayDateEnd,
        list,
        currentPage,
        pageSize,
        outcomeInvOrderStatusMap,
        InvSuitDetailMap,
        loading,
      },
    } = this.props;

    const columns = [
      {
        title: '开票状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (value, record) => {
          return (
            value === '已开票' ?
              <div>
                {
                record.tag ? record.tag.map((item) => {
                    return (
                      <Tooltip
                        title={record.tag.map((item) => {
                      return (
                        <div>{ item.remark }</div>
                      );
                    })}
                    >
                        <span className={styles.span} style={{ background: item.color, pageSize: 14, marginRight: 5, color: '#fff' }}>{item.name}</span>
                      </Tooltip>
                    );
                }) : ''
              }
                <span>
                  {value}
                </span>
              </div>


              : <div>
                {
                  record.tag ? record.tag.map((item) => {
                    return (
                      <Tooltip
                        title={record.tag.map((item) => {
                      return (
                        <div>{ item.remark }</div>
                      );
                    })}
                    >
                        <span className={styles.span} style={{ background: item.color, pageSize: 14, marginRight: 5, color: '#fff' }}>{item.name}</span>
                      </Tooltip>
                    );
                  }) : ''
                  }
                <span style={{ color: 'red' }}>
                  {value}
                </span>
                </div>
          );
        },
      },
      {
        title: '开票单号',
        dataIndex: 'invSn',
        key: 'invSn',
        align: 'center',
        render: (value, record) => {
          return <Link to={`/sale/sale-invoice/pending-follow-form/await-invoice-detail/${record.id}`}>{value}</Link>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '客户名',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
      },
      {
        title: '收件人',
        dataIndex: 'consignee',
        key: 'consignee',
        align: 'center',
        render: (_, record) => {
          return (
            record.consignee&&record.consignee.map((item)=>{
              return <p style={{margin: 0}}>{item}</p>
            })
          );
        },
      },
      {
        title: '门店名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '应开票金额',
        dataIndex: 'invAmount',
        key: 'invAmount',
        align: 'center',
        render: (value, record) => {
          return (
            <div style={{ color: 'red' }}>
              {value}
            </div>
          );
        },
      },
      {
        title: '是否对应明细',
        dataIndex: 'isSuitDetail',
        key: 'isSuitDetail',
        align: 'center',
      },
      {
        title: '业务员',
        dataIndex: 'seller',
        key: 'seller',
        align: 'center',
      },
      {
        title: '销售备注',
        dataIndex: 'sellerRemark',
        key: 'sellerRemark',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip
              placement="leftTop"
              title={record.sellerRemark}
              arrowPointAtCenter
            >
              <div className={styles.sellerRemark} style={{ width: 150 }}>
                <Input
                  value={record.sellerRemark}
                  onPressEnter={this.remarks.bind(this, record.sellerRemark, record.id)}
                  onChange={this.changesellrRemark.bind(this, record.sellerRemark, record.id)}
                />
              </div>
            </Tooltip>
          );
        },
      },
    ];
    const expandedRowRender = (list) => {
      const { invOrderGoodsList } = list;
      const columns = [
        {
          title: '总单号',
          dataIndex: 'groupSn',
          key: 'groupSn',
          align: 'center',
          render: (value, record) => {
            return (
              <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{value}</Link>
            );
          },
        },
        {
          title: '下单时间',
          dataIndex: 'orderCreateTime',
          key: 'orderCreateTime',
          align: 'center',
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          align: 'center',
        },
        {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
        },
        {
          title: '销售价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          align: 'center',
        },
        {
          title: '销售合计',
          dataIndex: 'saleAmount',
          key: 'saleAmount',
          align: 'center',
          render: (value, record) => {
            return (
              <div style={{ color: 'red' }}>{value}</div>
            );
          },
        },
        {
          title: '收款时间',
          dataIndex: 'payTime',
          key: 'payTime',
          align: 'center',
        },
        {
          title: '子单号',
          dataIndex: 'orderSn',
          key: 'orderSn',
          align: 'center',
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={invOrderGoodsList}
          pagination={false}
        />
      );
    };
    return (
      <PageHeaderLayout title="待开票跟进表">
        <Card bordered={false}>
          <Row>
            <Col>
              <Select
                value={outcomeInvOrderStatusMap[status]}
                className={globalStyles['select-sift']}
                placeholder="选择开票状态"
                style={{ marginRight: 30, width: 150 }}
                onChange={this.handleChangeSiftItem.bind(this, 'status')}
            >
                {
                  Object.keys(outcomeInvOrderStatusMap).map((status) => {
                    return (
                      <Option value={status}>{outcomeInvOrderStatusMap[status]}</Option>
                    );
                  })
                }
              </Select>
              <Search
                value={outInvOrderSn}
                placeholder="开票单号"
                className={globalStyles['select-sift']}
                style={{ width: 200, marginRight: 30 }}
                onChange={this.handleChangeSiftItem.bind(this, 'outInvOrderSn')}
                onSearch={this.handleGetOrderList.bind(this)}
            />
              <Search
                value={orderSn}
                placeholder="总单号/子单号"
                className={globalStyles['select-sift']}
                style={{ width: 180, marginRight: 30 }}
                onChange={this.handleChangeSiftItem.bind(this, 'orderSn')}
                onSearch={this.handleGetOrderList.bind(this)}
            />
              <Search
                value={goodsSn}
                placeholder="商品名称/条码"
                className={globalStyles['select-sift']}
                style={{ width: 180, marginRight: 30 }}
                onChange={this.handleChangeSiftItem.bind(this, 'goodsSn')}
                onSearch={this.handleGetOrderList.bind(this)}
            />
              <Search
                value={customerKeywords}
                placeholder="客户名/手机号/门店名称/收件人"
                className={globalStyles['select-sift']}
                style={{ width: 240, marginRight: 30 }}
                onChange={this.handleChangeSiftItem.bind(this, 'customerKeywords')}
                onSearch={this.handleGetOrderList.bind(this)}
            />
              <Select
                value={sellerMap[sellerId]}
                className={globalStyles['select-sift']}
                placeholder="请选择业务员"
                style={{ marginRight: 30, width: 150 }}
                onChange={this.handleChangeSiftItem.bind(this, 'sellerId')}
            >
                <Option value={0}>选择业务员</Option>
                {
                  Object.keys(sellerMap).map((sellerId) => {
                    return (
                      <Option value={sellerId}>{sellerMap[sellerId]}</Option>
                    );
                  })
                }
              </Select>
            是否对应明细：
              <Select
                value={InvSuitDetailMap[isSuitDetail]}
                className={globalStyles['select-sift']}
                style={{ marginRight: 30, width: 150 }}
                onChange={this.handleChangeSiftItem.bind(this, 'isSuitDetail')}
            >
                {
                  Object.keys(InvSuitDetailMap).map((isSuitDetail) => {
                    return (
                      <Option value={isSuitDetail}>{InvSuitDetailMap[isSuitDetail]}</Option>
                    );
                  })
                }
              </Select>
              {
                actionList.map((actionInfo) => {
                  switch (Number(actionInfo.type)) {
                    case 2:
                      return (
                        <a
                          href={actionInfo.url}
                          target="_blank"
                        >
                          <Button type="primary" className={styles.button}>{actionInfo.name}</Button>
                        </a>
                      );
                      default:
                      break;
                  }
                })
              }
            </Col>
          </Row>
          <Row style={{ marginBottom: 30, marginTop: 20 }}>
          下单时间：  <RangePicker
            value={[orderCreateDateStart ? moment(orderCreateDateStart, 'YYYY-MM-DD') : '', orderCreateDateEnd ? moment(orderCreateDateEnd, 'YYYY-MM-DD') : '']}
            className={styles.time}
            onChange={this.handleChangeSiftItem.bind(this, 'orderCreateDate')}
            style={{ marginRight: 20 }}
          />
          创建时间  <RangePicker
            value={[createDateStart ? moment(createDateStart, 'YYYY-MM-DD') : '', createDateEnd ? moment(createDateEnd, 'YYYY-MM-DD') : '']}
            className={styles.time}
            onChange={this.handleChangeSiftItem.bind(this, 'createDate')}
            style={{ marginRight: 20 }}
          />
          收款时间：  <RangePicker
            value={[orderPayDateStart ? moment(orderPayDateStart, 'YYYY-MM-DD') : '', orderPayDateEnd ? moment(orderPayDateEnd, 'YYYY-MM-DD') : '']}
            className={styles.time}
            onChange={this.handleChangeSiftItem.bind(this, 'orderPayDate')}
            style={{ marginRight: 20 }}
          />
          </Row>
          <Table
            columns={columns}
            dataSource={list}
            bordered
            loading={loading}
            expandedRowRender={expandedRowRender}
            pagination={{
              total,
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
              onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
              showTotal:total => `共 ${total} 个结果`,
          }}
        />
        </Card>
      </PageHeaderLayout>
    );
  }
}
