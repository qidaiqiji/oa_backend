import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, DatePicker, Pagination, Icon, Table, Row, Col, Select, Tooltip, Button, Checkbox, Tabs, Divider } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CreditList.less';
import globalStyles from '../../assets/style/global.less';
import Search from '../../../node_modules/antd/lib/input/Search';


@connect(state => ({
  creditCustomerList: state.creditCustomerList,

}))
export default class CreditList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditCustomerList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditCustomerList/unmount',
    });
  }
  // 事件

  handleChangeSiftItem(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'customerKeywords':
      case 'orderSn':
      case 'customerId':
        console.log(`customerId = ${e.target.value}`);
        dispatch({
          type: 'creditCustomerList/updatePageReducer',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'sellerId':
        console.log(e);
        dispatch({
          type: 'creditCustomerList/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'creditCustomerList/getList',
        });
        break;
      case 'pageSize':
        console.log(`type = ${type}, e = ${e}, dataStrings = ${dataStrings}`);
        dispatch({
          type: 'creditCustomerList/updatePageReducer',
          payload: {
            [type]: dataStrings,
          },
        });
        dispatch({
          type: 'creditCustomerList/getList',
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'creditCustomerList/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'creditCustomerList/getList',
        });
        break;
      default:
        break;
    }
  }

  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditCustomerList/getList',
      payload:{
        currentPage:1,
      }
    });
  }

  render() {
    const {
      creditCustomerList: {
        actionList,
        customerId,
        orderSn,
        seller,
        sellerId,
        overview,
        mobile,
        customerKeywords,
        total,
        customerInfo,
        currentPage,
        pageSize,
        loading,
      },
    } = this.props;
    console.log(currentPage);
    const columns = [{
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
    }, {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (value, record) => {
        return (
          <div>
            {<Link to={`/sale/sale-bill/credit-list/bill-detail/${record.customerId}`}>{value}</Link>}
          </div>
        );
      },
    }, {
      title: '门店名称',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (value, record) => {
        return (
          <div>
            {<Link to={`/sale/sale-bill/credit-list/bill-detail/${record.customerId}`}>{value}</Link>}
          </div>
        );
      },
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '所属业务员',
      dataIndex: 'seller',
      key: 'seller',
    }, {
      title: '到期金额',
      dataIndex: 'expiredAmount',
      key: 'expiredAmount',
      render: (value) => {
        return (
          <span className={styles.expiredAmount}>{value}</span>
        );
      },
    }, {
      title: '账期条件',
      dataIndex: 'creditType',
      key: 'creditType',
    }, {
      title: '待结算金额',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      render: (value) => {
        return (
          <span className={styles.creditAmount}>{value}</span>
        );
      },
    },
    ];
    return (
      <PageHeaderLayout title="销售账期对账总表" className={styles.dasdasdasd}>
        <Card bordered={false}>
          {/* 手机号，客户姓名模糊搜索 */}
          <Row>
            <Search
              value={customerKeywords}
              placeholder="请输入手机号/收货人名/收货人手机号"
              className={styles['select-sift']}
              style={{ width: 300, marginRight: 30 }}
              onChange={this.handleChangeSiftItem.bind(this, 'customerKeywords')}
              onSearch={this.handleGetOrderList.bind(this)}
            />

            <Search
              value={orderSn}
              placeholder="请输入总单号/子单号"
              className={styles['select-sift']}
              style={{ width: 200, marginRight: 30 }}
              onChange={this.handleChangeSiftItem.bind(this, 'orderSn')}
              onSearch={this.handleGetOrderList.bind(this)}
            />

            <Select
              value={seller[sellerId]}
              className={globalStyles['select-sift']}
              placeholder="请选择业务员"
              style={{ marginRight: 30, width: 150 }}
              onChange={this.handleChangeSiftItem.bind(this, 'sellerId')}
            >
              <Option value={0}>选择业务员</Option>
              {
                  Object.keys(seller).map((sellerId) => {
                    return (
                      <Option value={sellerId}>{seller[sellerId]}</Option>
                    );
                  })
                }
            </Select>

            <Search
              value={customerId}
              placeholder="请输入客户ID"
              className={styles['select-sift']}
              style={{ width: 150, marginLeft: 20 }}
              onChange={this.handleChangeSiftItem.bind(this, 'customerId')}
              onSearch={this.handleGetOrderList.bind(this)}
            />
          </Row>
          <Row style={{ marginBottom: 40 }}>
            <Col>
              <span className={styles.user}>账期客户数：<span>{ overview.customerNumber }</span></span>
              <span className={styles.user}>账期应收总额：<span className={styles.red}>{ overview.creditAmount }</span></span>
              <span className={styles.user}>账期到期总额：<span className={styles.green}>{ overview.expiredAmount }</span></span>

              {
                actionList.map((actionInfo) => {
                  switch (actionInfo.type) {
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
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={customerInfo}
                loading={loading}
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
            </Col>
          </Row>

        </Card>
      </PageHeaderLayout>
    );
  }
}
