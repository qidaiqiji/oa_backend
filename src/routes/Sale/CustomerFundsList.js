import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Form, Card, Table, Select, Input, Button } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerFundsList.less';

const Search = Input.Search;
const Option = Select.Option;

@connect(state => ({
  customerFundsList: state.customerFundsList,
  user: state.user,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsList/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsList/unmount',
    });
  }

  @Debounce(200)
  // 搜过客户
  handleSearchCustomer(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsList/searchCustomerList',
      payload: {
        keywords: value,
      },
    });
  }
  // 选择客户
  handleSelectCustomer(userId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsList/changeCustomer',
      payload: {
        userId,
      },
    });
  }


  render() {
    const {
      customerFundsList: {
        balanceCustomerNum,
        balanceTotalAmount,
        creditCustomerNum,
        creditTotalAmount,
        siftCustomers,
        customerInfos,
        customerName,
        isLoading,
        actionList,
      },
    } = this.props;


    const columns = [
      {
        title: '客户名称',
        dataIndex: 'customer',
        key: 'customer',
        render: (customer, record) => {
          return <Link to={`/finance/funds-management/customer-funds-list/customer-funds-detail/${record.id}`}>{customer}</Link>;
        },
      }, {
        title: '账期应收',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
      }, {
        title: '挂账应付',
        dataIndex: 'balanceAmount',
        key: 'balanceAmount',
      }, {
        title: '应收金额',
        dataIndex: 'amount',
        key: 'amount',
      }];

    return (
      <PageHeaderLayout title="账期管理" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <span>
                    <Select
                      showSearch
                      style={{ width: 240 }}
                      placeholder="请输入客户名称进行搜索"
                      optionFilterProp="children"
                      onSelect={this.handleSelectCustomer.bind(this)}
                      onSearch={this.handleSearchCustomer.bind(this)}
                      filterOption={false}
                      value={customerName || []}
                    >
                      {
                        siftCustomers ?
                          siftCustomers.map((customer) => {
                            return <Option key={customer.userId} value={customer.userId}>{customer.userName}</Option>;
                          })
                        :
                          <Option disabled key="no fount">没发现匹配项</Option>
                      }
                    </Select>
                  </span>
                  <Button type="primary" onClick={() => { this.handleSelectCustomer(''); }}>重置</Button>
                </Col>
                <Col md={12} sm={24} style={{ marginBottom: 24 }} align="right">
                  {
                    actionList.map(item=>{
                      return <a href={item.url} target="_blank"><Button type="primary">{item.name}</Button></a>
                    })
                  }
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Card
                    style={{ width: '100%', backgroundColor: '#ffd6af', textAlign: 'center', borderRadius: '10px' }}
                    // hoverable
                  >
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{creditCustomerNum}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>账期客户数</p>
                    </div>
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{creditTotalAmount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>应收总额</p>
                    </div>
                  </Card>
                </Col>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Card
                    style={{ width: '100%', backgroundColor: '#66cccc', borderRadius: '10px' }}
                    // hoverable
                  >
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{balanceCustomerNum}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>挂账客户数</p>
                    </div>
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{balanceTotalAmount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>挂账总额</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              dataSource={customerInfos}
              columns={columns}
              pagination={false}
            />

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
