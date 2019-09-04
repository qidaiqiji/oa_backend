import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Table, Dropdown, Menu, Row, Icon, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PaymentRecord.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { RangePicker } = DatePicker;

@connect(state => ({
  paymentRecord: state.paymentRecord,
}))
export default class Payment extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/unmount',
    });
  }
  // 同步改变的项
  handleChangeSiftItem(type, value) {
    const { dispatch } = this.props;
    switch (type) {
      case 'keywords':
        dispatch({
          type: 'paymentRecord/changeSiftItem',
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
  handleChangeDate(dates, dateStrings) {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/getOrderList',
      payload: {
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      },
    });
  }
  // 关键字输入框按下回车
  handlePressKeywords() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/getOrderList',
      payload:{
        curPage:1,
      }
    });
  }
  // 改变页码
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/getOrderList',
      payload: {
        curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentRecord/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  render() {
    const {
      paymentRecord: {
        keywords,
        startDate,
        endDate,
        curPage,
        pageSize,
        total,
        paymentOrderList,
        isTableLoading,
      },
    } = this.props;
    const orderListColumns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '用户名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '应收金额',
        dataIndex: 'allAmount',
        key: 'allAmount',
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
                      详情
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
          render: (imgSrc) => {
            return <img style={{ width: 50, heihgt: 50 }} src={imgSrc} alt="商品缩略图" />;
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
      <PageHeaderLayout title="账期审核">
        <Card bordered={false}>
          <Row>
            <Search
              value={keywords}
              placeholder="订单号/用户名/手机号"
              className={globalStyles['input-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
              onSearch={this.handlePressKeywords.bind(this)}
            />
            <RangePicker
              value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
              className={globalStyles['rangePicker-sift']}
              onChange={this.handleChangeDate.bind(this)}
            />
          </Row>
          <Table
            bordered
            columns={orderListColumns}
            rowKey={record => record.id}
            dataSource={paymentOrderList}
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
