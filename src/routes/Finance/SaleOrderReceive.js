import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Table, Dropdown, Menu, Row, Icon, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SaleOrderReceive.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { RangePicker } = DatePicker;

@connect(state => ({
  saleOrderReceive: state.saleOrderReceive,
}))
export default class SaleOrderReceive extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/unmount',
    });
  }
  // 同步改变的项
  handleChangeSiftItem(type, value) {
    const { dispatch } = this.props;
    switch (type) {
      case 'customer':
        dispatch({
          type: 'saleOrderReceive/changeSiftItem',
          payload: {
            [type]: value.target.value,
          },
        });
        break;
      default:
        break;
    }
  }
  // 改变日期
  handleChangeDate(dates, datestrings) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/getOrderList',
      payload: {
        orderStartTime: datestrings[0],
        orderEndTime: datestrings[1],
      },
    });
  }
  // 关键字输入框按下回车
  handlePressKeywords() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/getOrderList',
      payload: {
        curPage:1,
      }
    });
  }
  // 改变页码
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/getOrderList',
      payload: {
        curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderReceive/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  render() {
    const {
      saleOrderReceive: {
        customer,
        orderStartTime,
        orderEndTime,
        curPage,
        pageSize,
        total,
        orderList,
        isTableLoading,
      },
    } = this.props;
    const orderListColumns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
        key: 'orderNum',
        render:(orderNum,record)=>{
          return  <Link
            to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}
            >
              {orderNum}
          </Link>
        }
      },
      {
        title: '用户名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '总金额',
        dataIndex: 'allAmount',
        key: 'allAmount',
      },
      {
        title: '实付金额',
        dataIndex: 'realAmount',
        key: 'realAmount',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
                      to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}
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
    const expandedGoodsRender = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'img',
          key: 'img',
          render: (imgSrc, record) => {
            return <img style={{ width: 50, height: 50 }} src={imgSrc}/>;
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
          dataIndex: 'subtotal',
          key: 'subtotal',
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
      <PageHeaderLayout title="销售订单应收">
        <Card bordered={false}>
          <Row>
            <Search
              value={customer}
              placeholder="订单号/用户名/手机号"
              className={globalStyles['input-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'customer')}
              onSearch={this.handlePressKeywords.bind(this)}
            />
            <RangePicker
              value={[orderStartTime ? moment(orderStartTime, 'YYYY-MM-DD') : '', orderEndTime ? moment(orderEndTime, 'YYYY-MM-DD') : '']}
              className={globalStyles['rangePicker-sift']}
              onChange={this.handleChangeDate.bind(this)}
            />
          </Row>
          <Table
            bordered
            columns={orderListColumns}
            rowKey={record => record.orderId}
            dataSource={orderList}
            loading={isTableLoading}
            expandedRowRender={expandedGoodsRender}
            pagination={{
              total,
              current: curPage,
              pageSize,
              showSizeChanger: true,
              onChange: this.handleChangeCurPage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
