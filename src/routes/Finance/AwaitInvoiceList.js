import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitInvoiceList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  awaitInvoiceList: state.awaitInvoiceList,
}))
export default class awaitInvoiceList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitInvoiceList/mount',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'awaitInvoiceList/unmount',
    });
  }
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'invStatus':
        if (+e === -1) {
          dispatch({
            type: 'awaitInvoiceList/updateState',
            payload: {
              [type]: e,
              status: [3, 6, 7],
              currentPage: 1,
            },
          });
          dispatch({
            type: 'awaitInvoiceList/getAwaitInvoiceListData',
            payload: {
              status: [3, 6, 7],
              currentPage: 1,
            },
          });
        } else {
          dispatch({
            type: 'awaitInvoiceList/updateState',
            payload: {
              [type]: e,
              status: [e],
              currentPage: 1,
            },
          });
          dispatch({
            type: 'awaitInvoiceList/getAwaitInvoiceListData',
            payload: {
              status: [e],
              currentPage: 1,
            },
          });
        }
        break;
      case 'customerKeywords':
      case 'outInvOrderSn':
        dispatch({
          type: 'awaitInvoiceList/updateState',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
    case 'createDate':
      dispatch({
        type: 'awaitInvoiceList/updateState',
        payload: {
          createDateStart: dataStrings[0],
          createDateEnd: dataStrings[1],
          currentPage: 1,
        },
      });
      dispatch({
        type: 'awaitInvoiceList/getAwaitInvoiceListData',
        payload: {
          createDateStart: dataStrings[0],
          createDateEnd: dataStrings[1],
          currentPage: 1,
        },
      });
      break;
      case 'invDate':
      dispatch({
        type: 'awaitInvoiceList/updateState',
        payload: {
          invDateStart: dataStrings[0],
          invDateEnd: dataStrings[1],
          currentPage: 1,
        },
      });
      dispatch({
        type: 'awaitInvoiceList/getAwaitInvoiceListData',
        payload: {
          invDateStart: dataStrings[0],
          invDateEnd: dataStrings[1],
          currentPage: 1,
        },
      });
      break;
      case 'currentPage':
      case 'isSuitDetail':
      case 'sellerId':
      case 'invType':
        dispatch({
          type: 'awaitInvoiceList/updateState',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'awaitInvoiceList/getAwaitInvoiceListData',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'awaitInvoiceList/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        dispatch({
          type: 'awaitInvoiceList/getAwaitInvoiceListData',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  handleSearch(type, e) {
    const { dispatch } = this.props;
    const { customerKeywords, outInvOrderSn } = this.props.awaitInvoiceList;
    switch (type) {
      case 'customerKeywords':
      case 'outInvOrderSn':
        dispatch({
          type: 'awaitInvoiceList/getAwaitInvoiceListData',
          payload: {
            customerKeywords,
            outInvOrderSn,
            currentPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  render() {
    const {
      // 数据
      configData,
      awaitInvListData: {
        outcomeInvOrderList,
      },
      awaitInvListData,
      // 参数
      invStatus,
      createDateStart,
      createDateEnd,
      sellerId,
      isSuitDetail,
      currentPage,
      pageSize,

      // 控制样式
      isLoading,
      invDateStart,
      invDateEnd

    } = this.props.awaitInvoiceList;

    // 待开票列表
    const awaitInvListColumn = [
      {
        title: '开票状态',
        dataIndex: 'status',
        key: 'status',
        render: (value) => {
          return <div style={{ color: value === '已开票' ? '#666' : 'red' }}>{value}</div>;
        },
      },
      {
        title: '开票单号',
        dataIndex: 'invSn',
        key: 'invSn',
        width: '200px',
        render: (value, record) => {
          return <Link to={`/finance/finance-invoice/await-invoice-list/await-invoice-detail/${record.id}`}>{value}</Link>;
        },
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width:110,
      },
      {
        title: '发票日期',
        key: 'invDate',
        dataIndex: 'invDate',
        width:200,
      },
      {
        title: '发票类型',
        key: 'invType',
        dataIndex: 'invType',
      },
      {
        title: '客户名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '开票公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '待开票总金额',
        dataIndex: 'invAmount',
        key: 'invAmount',
        render: (value) => {
          return <div style={{ color: 'red' }}>{value}</div>;
        },
      },
      {
        title: '是否对应明细',
        dataIndex: 'isSuitDetail',
        key: 'isSuitDetail',
      },
      {
        title: '业务员',
        dataIndex: 'seller',
        key: 'seller',
      },
      {
        title: '销售备注',
        dataIndex: 'sellerRemark',
        key: 'sellerRemark',
        width:200,
        render:(sellerRemark)=>{
          return <Tooltip>
            <p style={{width:200,overflow:"hidden",wordWrap:"no-wrap",margin:0}}>{sellerRemark}</p>
          </Tooltip>
        }
      },
    ];

    return (
      <PageHeaderLayout title="待开票列表">
        <Card bordered={false} >
          <Row gutter={16} style={{ margin: '10px 0' }}>
            <Col span={4} >
              <Select
                placeholder="开票状态"
                onChange={this.handleChangeInputValue.bind(this, 'invStatus')}
                value={(invStatus !== '') ? invStatus : undefined}
                style={{ width: 200 }}
              >
                {configData.outcomeInvOrderStatusFinanceMap ? (
                  Object.keys(configData.outcomeInvOrderStatusFinanceMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {configData.outcomeInvOrderStatusFinanceMap[item]}
                      </Option>
                      )
                  ).concat(<Option key="-1" value="-1">全部</Option>)) : ''
                }
              </Select>
            </Col>
            <Col span={3}>
                <Search
                  placeholder="开票单号"
                  onChange={this.handleChangeInputValue.bind(this, 'outInvOrderSn')}
                  onSearch={this.handleSearch.bind(this, 'outInvOrderSn')}
                />
            </Col>
            <Col span={7} >
              <Search
                placeholder="客户名/手机号/门店名称/收件人/收件人手机号/开票公司名称"
                onChange={this.handleChangeInputValue.bind(this, 'customerKeywords')}
                onSearch={this.handleSearch.bind(this, 'customerKeywords')}
              />
            </Col>
            <Col span={6} >
              <span style={{ verticalAlign: '-webkit-baseline-middle', marginRight: '10px' }}>创建时间</span>
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInputValue.bind(this, 'createDate')}
                value={[createDateStart ? moment(createDateStart, 'YYYY-MM-DD') : null, createDateEnd ? moment(createDateEnd, 'YYYY-MM-DD') : null]}
              />
            </Col>
              <Col span={2} >
                <Select
                  placeholder="业务员"
                  onChange={this.handleChangeInputValue.bind(this, 'sellerId')}
                  value={(sellerId !== '') ? sellerId : undefined}
                  style={{ width: 200 }}
                >
                  {configData.sellerMap ? (
                    Object.keys(configData.sellerMap).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {configData.sellerMap[item]}
                        </Option>
                        )
                    )) : ''
                  }
                </Select>
              </Col>
              
              </Row>
              <Row gutter={16} style={{ margin: '10px 0' }}>
              <Col span={6} >
                <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>是否对应明细</span>
                <Select
                  placeholder="全部"
                  onChange={this.handleChangeInputValue.bind(this, 'isSuitDetail')}
                  value={(isSuitDetail !== '') ? isSuitDetail : undefined}
                  style={{ width: 200 }}
                >
                  {configData.InvSuitDetailMap ? (
                    Object.keys(configData.InvSuitDetailMap).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {configData.InvSuitDetailMap[item]}
                        </Option>
                        )
                    )) : ''
                  }
                </Select>
              </Col>
              <Select
                  placeholder="请选择发票类型"
                  onChange={this.handleChangeInputValue.bind(this, 'invType')}
                  style={{ width: 200 }}
                >
                  {configData.invInfoType ? (
                    Object.keys(configData.invInfoType).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {configData.invInfoType[item]}
                        </Option>
                        )
                    )) : ''
                  }
                </Select>
               发票日期
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInputValue.bind(this, 'invDate')}
                value={[invDateStart ? moment(invDateStart, 'YYYY-MM-DD') : null, invDateEnd ? moment(invDateEnd, 'YYYY-MM-DD') : null]}
              />
            </Row>
              <Row style={{marginBottom:10}}> 
              <Col span={23} align="end">
                {
                    awaitInvListData.actionList ?
                    awaitInvListData.actionList.map((actionInfo) => {
                        switch (+actionInfo.type) {
                          case 2:
                            return (
                              <a
                                href={actionInfo.url}
                                target="_blank"
                                key={actionInfo.name}
                              >
                                <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                              </a>
                            );
                          default:
                            return '';
                        }
                      }) : ''
                  }
              </Col>
            </Row>
          <Table
            bordered
            dataSource={outcomeInvOrderList}
            columns={awaitInvListColumn}
            loading={isLoading}
            rowKey={record => record.id}
            pagination={{
              total: awaitInvListData.total,
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['30', '50', '60', '80', '100', '120', '150', '200', '300'],
              onShowSizeChange: this.handleChangeInputValue.bind(this, 'pageSize'),
              onChange: this.handleChangeInputValue.bind(this, 'currentPage'),
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
