import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card, Input, Table, Button, DatePicker, Checkbox, Select } from 'antd';
import { stringify } from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsStatisticsList.less';

@connect(state => ({
  goodsStatisticsList: state.goodsStatisticsList,
}))
export default class GoodsStatisticsList extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      goodsStatisticsList: {
        curPage,
        startDate,
        endDate,
        goods,
        userKeywords,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        orderSn,
      },
    } = this.props;
    dispatch({
      type: 'goodsStatisticsList/mount',
      payload: {
        curPage,
        startDate,
        endDate,
        goods,
        userKeywords,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        orderSn
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'goodsStatisticsList/unmount',
    });
  }
  handleChangeCheckbox(type, e) {
    const {
      dispatch,
      goodsStatisticsList: {
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
      },
    } = this.props;
    const { value: id } = e.target;
    dispatch({
      type: 'goodsStatisticsList/changeCheckbox',
      payload: {
        type,
        id,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
      },
    });
  }
  handleChangeInput(type, ...rest) {
    const {
      dispatch,
    } = this.props;
    switch (type) {
      case 'date':
        dispatch({
          type: 'goodsStatisticsList/changeInput',
          payload: {
            startDate: rest[1][0],
            endDate: rest[1][1],
          },
        });
        break;
      case 'payDate':
      dispatch({
        type: 'goodsStatisticsList/changeInput',
        payload: {
          payStartDate: rest[1][0],
          payEndDate: rest[1][1],
        },
      });
      break;
      default:
        dispatch({
          type: 'goodsStatisticsList/changeInput',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
    }
  }
  handleReset() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStatisticsList/reset',
    });
  }
  handleSearch() {
    const {
      dispatch,
      goodsStatisticsList: {
        // curPage,
        startDate,
        endDate,
        goods,
        userKeywords,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        saler,
        payStartDate,
        payEndDate,
        orderSn
      },
    } = this.props;
    dispatch({
      type: 'goodsStatisticsList/search',
      payload: {
        curPage: 1,
        startDate,
        endDate,
        goods,
        userKeywords,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        saler,
        payStartDate,
        payEndDate,
        orderSn
      },
    });
  }
  handleChangePage(curPage) {
    const {
      dispatch,
      goodsStatisticsList: {
        startDate,
        endDate,
        goods,
        userKeywords,
        orderSn,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        saler,
        payStartDate,
        payEndDate,
      },
    } = this.props;
    dispatch({
      type: 'goodsStatisticsList/changePage',
      payload: {
        curPage,
        startDate,
        endDate,
        goods,
        userKeywords,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        saler,
        payStartDate,
        payEndDate,
        orderSn
      },
    });
  }
  handleChangeSaler=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStatisticsList/changeInputSync',
      payload: {
        saler: e,
      },
    });
  }

  render() {
    const {
      goodsStatisticsList: {
        checkStatusMap,
        payStatusMap,
        goodsTypeMap,
        total,

        orderTotalNumber,
        goodsTotalNumber,
        totalAmount,
        goodsList,

        isLoading,
        isLoadingConfig,
        curPage,
        startDate,
        endDate,
        goods,
        userKeywords,
        orderSn,
        selectCheckStatus,
        selectPayStatus,
        selectGoodsType,
        pageSize,
        sellerMap,
        showSaler,
        saler,
        payStartDate,
        payEndDate
      },
    } = this.props;
    const goodsColumns = [
      {
        title: '订单状态',
        key: 'checkStatus',
        dataIndex: 'checkStatus',
        render: checkStatus => checkStatusMap[checkStatus],
      },
      {
        title: '用户',
        key: 'customer',
        dataIndex: 'customer',
      },
      {
        title: '订单号',
        key: 'orderSn',
        dataIndex: 'orderSn',
        render: (orderSn, record) => {
          return (
            <div>
              <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{orderSn}</Link>
              {record.isSpecial === 1 && <span style={{ marginLeft: 5, display: 'inline-block', padding: 3, backgroundColor: '#FC1268', color: '#fff' }}>特价</span>}
            </div>
          );
        },
      },
      {
        title: '商品条码',
        key: 'goodsSn',
        dataIndex: 'goodsSn',
      },
      {
        title: '商品名',
        key: 'goodsName',
        dataIndex: 'goodsName',
      },
      {
        title: '单价',
        key: 'price',
        dataIndex: 'price',
      },
      {
        title: '单位',
        key: 'unit',
        dataIndex: 'unit',
      },
      {
        title: '商品数量',
        key: 'goodsNumber',
        dataIndex: 'goodsNumber',
      },
      {
        title: '小计',
        key: 'subtotal',
        dataIndex: 'subtotal',
      },
    ];
    const token = localStorage.getItem('token');
    const exportUrl = `http://erp.xiaomei360.com/common/export-order-goods-list?${stringify({
      startDate,
      endDate,
      goods,
      userKeywords,
      orderSn,
      selectCheckStatus,
      selectPayStatus,
      selectGoodsType,
      payStartDate,
      payEndDate,
      saler,
      token
    })}`;
    return (
      <PageHeaderLayout title="订单商品列表">
        <Card bordered={false}>
          <Card loading={isLoadingConfig}>
            <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginTop: 10 }}>
              <Col md={3} style={{ fontSize: 20 }}>高级筛选</Col>
              <Col style={{ textAlign: 'end' }} md={3} offset={18}><a target="_blank" rel="noopener noreferrer" href={exportUrl}>导出</a></Col>
            </Row>
            <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginTop: 10 }}>
              <Col md={5}>
                <span>下单时间: </span>
                <DatePicker.RangePicker
                  allowClear
                  style={{ width: 215 }}
                  format="YYYY-MM-DD"
                  value={[startDate?moment(startDate, 'YYYY-MM-DD'):null, endDate?moment(endDate, 'YYYY-MM-DD'):null]}
                  onChange={this.handleChangeInput.bind(this, 'date')}
                />
              </Col>
              <Col md={5}>
                <span>付款时间: </span>
                <DatePicker.RangePicker
                  allowClear
                  style={{ width: 200 }}
                  format="YYYY-MM-DD"
                  value={[payStartDate?moment(payStartDate, 'YYYY-MM-DD'):null, payEndDate?moment(payEndDate, 'YYYY-MM-DD'):null]}
                  onChange={this.handleChangeInput.bind(this, 'payDate')}
                />
              </Col>
              <Col md={5}>
                <span>商品名称: </span>
                <Input style={{ width: 215 }} value={goods} onChange={this.handleChangeInput.bind(this, 'goods')} placeholder="请输入商品名称/条码/关键字" />
              </Col>
              {
                showSaler&&<Col md={5}>
                <span>销售员: </span>
                <Select
                style={{width:200}}
                value={saler}
                onChange={this.handleChangeSaler}
                >
                  <Select.Option value="">全部</Select.Option>
                  {
                    Object.keys(sellerMap).map(item=>(
                      <Select.Option value={item}>{sellerMap[item]}</Select.Option>
                    ))
                  }
                </Select>
              </Col>
              }
            </Row>
            <Row style={{marginTop:10}}>
              <Col md={7} style={{marginTop:10}}>
                <span>客户名称/手机号: </span>
                <Input style={{ width: 215 }} value={userKeywords} onChange={this.handleChangeInput.bind(this, 'userKeywords')} placeholder="请输入用户注册手机号" />
              </Col>
              <Col md={5} style={{marginTop:10}}>
                <span>总/子单号: </span>
                <Input style={{ width: 215 }} value={orderSn} onChange={this.handleChangeInput.bind(this, 'orderSn')} placeholder="请输入单号" />
              </Col>
            </Row>
            <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginTop: 10 }}>
              <Col style={{ width: 120 }}>订单审核状态: </Col>
              <Col><Checkbox checked={selectCheckStatus.indexOf(-1) > -1} value={-1} onChange={this.handleChangeCheckbox.bind(this, 'selectCheckStatus')} /> 全选</Col>
              {
                Object.keys(checkStatusMap).map((checkStatusId) => {
                  return <Col><Checkbox checked={selectCheckStatus.indexOf(checkStatusId) > -1} onChange={this.handleChangeCheckbox.bind(this, 'selectCheckStatus')} value={checkStatusId} /> {checkStatusMap[checkStatusId]}</Col>;
                })
              }
            </Row>
            <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginTop: 10 }}>
              <Col style={{ width: 120 }}>订单支付状态: </Col>
              <Col><Checkbox checked={selectPayStatus.indexOf(-1) > -1} value={-1} onChange={this.handleChangeCheckbox.bind(this, 'selectPayStatus')} /> 全选</Col>
              {
                Object.keys(payStatusMap).map((payStatusId) => {
                  return <Col><Checkbox checked={selectPayStatus.indexOf(payStatusId) > -1} onChange={this.handleChangeCheckbox.bind(this, 'selectPayStatus')} value={payStatusId} /> {payStatusMap[payStatusId]}</Col>;
                })
              }
            </Row>
            <Row gutter={{ md: 24 }} type="flex" align="middle" style={{ marginTop: 10 }}>
              <Col style={{ width: 120 }}>商品类型: </Col>
              <Col><Checkbox checked={selectGoodsType.indexOf(-1) > -1} value={-1} onChange={this.handleChangeCheckbox.bind(this, 'selectGoodsType')} /> 全选</Col>
              {
                Object.keys(goodsTypeMap).map((goodsTypeId) => {
                  return <Col><Checkbox checked={selectGoodsType.indexOf(goodsTypeId) > -1} onChange={this.handleChangeCheckbox.bind(this, 'selectGoodsType')} value={goodsTypeId} /> {goodsTypeMap[goodsTypeId]}</Col>;
                })
              }
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.handleSearch.bind(this)}>确认</Button>
              <Button onClick={this.handleReset.bind(this)} style={{ marginLeft: 20 }}>重置</Button>
            </Row>
          </Card>
          <Row gutter={{ md: 24 }} type="flex" align="middle" justify="space-between" style={{ marginLeft: 0, marginRight: 0, marginTop: 20, marginBottom: 20 }}>
            <Col md={7} style={{ textAlign: 'center', height: 86, backgroundColor: '#FED6B1' }}>
              <p style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>{orderTotalNumber || 0}</p>
              <p>订单总数</p>
            </Col>
            <Col md={7} style={{ textAlign: 'center', height: 86, backgroundColor: '#84E3E5' }}>
              <p style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>{goodsTotalNumber || 0}</p>
              <p>商品总数</p>
            </Col>
            <Col md={7} style={{ textAlign: 'center', height: 86, backgroundColor: '#EBC2CE' }}>
              <p style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>{totalAmount || 0}</p>
              <p>总金额</p>
            </Col>
          </Row>
          <Table
            bordered
            rowKey={record => record.id}
            columns={goodsColumns}
            dataSource={goodsList}
            loading={isLoading}
            pagination={{
              total,
              current: curPage,
              pageSize,
              onChange: this.handleChangePage.bind(this),
              showSizeChanger: false,
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
