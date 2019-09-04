import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InvoiceInOutList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  invoiceInOutList: state.invoiceInOutList,
}))
export default class invoiceInOutList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoiceInOutList/mount',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'invoiceInOutList/unmount',
    });
  }
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'invoiceKeywords':
      case 'companyKeywords':
      case 'goodsKeywords':
        dispatch({
          type: 'invoiceInOutList/updateState',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'invoiceDate':
        dispatch({
          type: 'invoiceInOutList/updateState',
          payload: {
            invoiceDateStart: dataStrings[0],
            invoiceDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            invoiceDateStart: dataStrings[0],
            invoiceDateEnd: dataStrings[1],
          },
        });
      break;
      case 'inStorageDate':
        dispatch({
          type: 'invoiceInOutList/updateState',
          payload: {
            inStorageDateStart: dataStrings[0],
            inStorageDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            inStorageDateStart: dataStrings[0],
            inStorageDateEnd: dataStrings[1],
          },
        });
      break;
      case 'currentPage':
      case 'invoiceSourceType':
      case 'isSuitDetail':
        dispatch({
          type: 'invoiceInOutList/updateState',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'invoiceInOutList/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
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
    const { invoiceKeywords, companyKeywords, goodsKeywords } = this.props.invoiceInOutList;
    switch (type) {
      case 'invoiceKeywords':
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            invoiceKeywords,
            currentPage: 1,
          },
        });
        break;
      case 'companyKeywords':
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            companyKeywords,
            currentPage: 1,
          },
        });
        break;
      case 'goodsKeywords':
        dispatch({
          type: 'invoiceInOutList/getInvoiceListData',
          payload: {
            goodsKeywords,
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
      invoiceListData: {
        invoiceList,
      },
      invoiceListData,

      // 参数
      invoiceKeywords,
      companyKeywords,
      goodsKeywords,
      invoiceDateStart,
      invoiceDateEnd,
      invoiceSourceType,
      isSuitDetail,
      currentPage,
      pageSize,
      inStorageDateStart,
      inStorageDateEnd,
      // 控制样式
      isLoading,

    } = this.props.invoiceInOutList;

    // 发票类别
    const invoiceColumn = [
      {
        title: '发票ID',
        key: 'invId',
        dataIndex: 'invId',
        width:60,
      },
      {
        title: '发票号',
        key: 'invSn',
        dataIndex: 'invSn',
        width: '90px',
        render: (value, record) => {
          const tag = record.tag.length ?
            record.tag.map(item =>
              (<Tooltip placement="top" title={item.remark} key={value}><span style={{ backgroundColor: item.color }} className={globalStyles.tag}>{item.name}</span></Tooltip>)
            ) : '';
          return <div>{tag}<span>{value}</span></div>;
        },
      },
      {
        title: '发票日期',
        dataIndex: 'invDate',
        key: 'invDate',
        width:100,
      },
      {
        title: '单号',
        dataIndex: 'invOrderId',
        key: 'invOrderId',
        render: (value, record) => {
          if (value.slice(0, 2) === 'LP' && +record.invFollowOrderId !== -1) {
            return <Link to={`/finance/finance-invoice/finance-purchase-in-inv-list/finance-purchase-in-inv-detail/${record.invFollowOrderId}`}>{value}</Link>;
          } else if (value.slice(0, 2) === 'KP' && +record.invFollowOrderId !== -1) {
            return <Link to={`/finance/finance-invoice/await-invoice-list/await-invoice-detail/${record.invFollowOrderId}`}>{value}</Link>;
          } else if (+record.invFollowOrderId === -1) {
            return value;
          }
        },
      },
      {
        title: '开票公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '150px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: '150px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        width: '150px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '入库时间',
        dataIndex: 'inStorageTime',
        key: 'inStorageTime',
        width: '90px',
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: '60px',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '45px',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        width: '60px',
        render: (value, record) => {
          return <span style={{ color: record.numColor }}>{value}</span>;
        },
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width:70,
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        key: 'taxAmount',
        width:60,
      },
      {
        title: '价税合计',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width:60,
      },
      {
        title: '是否对应明细',
        dataIndex: 'isSuitDetail',
        key: 'isSuitDetail',
        width: '100px',
      },
      {
        title: '票据来源',
        dataIndex: 'invSourceType',
        key: 'invSourceType',
      },
      {
        title: '备注',
        dataIndex: 'financeRemark',
        key: 'financeRemark',
        width: '120px',
      },
    ];

    return (
      <PageHeaderLayout title="发票进出明细总表">
        <Card bordered={false} >
          <Row gutter={16} style={{ margin: '20px 0' }}>
            <Col span={3} >
              <Search
                placeholder="发票号/来票单号/开票单号"
                onChange={this.handleChangeInputValue.bind(this, 'invoiceKeywords')}
                onSearch={this.handleSearch.bind(this, 'invoiceKeywords')}
              />
            </Col>
            <Col span={3} >
              <Search
                placeholder="供应商/门店名称"
                onChange={this.handleChangeInputValue.bind(this, 'companyKeywords')}
                onSearch={this.handleSearch.bind(this, 'companyKeywords')}
              />
            </Col>
            <Col span={4} >
              <Search
                placeholder="发票商品名称/商品名称/条码"
                onChange={this.handleChangeInputValue.bind(this, 'goodsKeywords')}
                onSearch={this.handleSearch.bind(this, 'goodsKeywords')}
              />
            </Col>
            <Col span={6} >
              <span style={{ verticalAlign: '-webkit-baseline-middle', marginRight: '10px' }}>发票日期</span>
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInputValue.bind(this, 'invoiceDate')}
                value={[invoiceDateStart ? moment(invoiceDateStart, 'YYYY-MM-DD') : null, invoiceDateEnd ? moment(invoiceDateEnd, 'YYYY-MM-DD') : null]}
              />
            </Col>
            <Col span={2} >
              <Select
                placeholder="票据来源"
                onChange={this.handleChangeInputValue.bind(this, 'invoiceSourceType')}
                value={(invoiceSourceType !== '') ? invoiceSourceType : undefined}
                style={{ width: 110 }}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                {configData.invSourceTypeMap ? (
                  Object.keys(configData.invSourceTypeMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {configData.invSourceTypeMap[item]}
                      </Option>
                      )
                  )) : ''
                }
              </Select>
            </Col>
            
            <Col span={3} >
              {
                invoiceListData.actionList ?
                  invoiceListData.actionList.map((actionInfo) => {
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
          <Row>
          <Col span={4} >
              <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>是否对应明细</span>
              <Select
                placeholder="全部"
                onChange={this.handleChangeInputValue.bind(this, 'isSuitDetail')}
                value={(isSuitDetail !== '') ? isSuitDetail : undefined}
                style={{ width: 100 }}
                allowClear
                dropdownMatchSelectWidth={false}
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
            入库时间：
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInputValue.bind(this, 'inStorageDate')}
                value={[inStorageDateStart ? moment(inStorageDateStart, 'YYYY-MM-DD') : null, inStorageDateEnd ? moment(inStorageDateEnd, 'YYYY-MM-DD') : null]}
              />
          </Row>
          <Table
            bordered
            dataSource={invoiceList}
            columns={invoiceColumn}
            loading={isLoading}
            size="small"
            rowKey={record => record.id}
            pagination={{
              total: invoiceListData.total,
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
