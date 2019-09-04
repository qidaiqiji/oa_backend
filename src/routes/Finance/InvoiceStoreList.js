import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InvoiceStoreList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  invoiceStoreList: state.invoiceStoreList,
}))
export default class invoiceStoreList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { detail, id } = this.props.match.params;
    console.log(detail);
    if (detail === 'detail') {
      dispatch({
        type: 'invoiceStoreList/updateState',
        payload: {
          detail: true,
          goodsSn: id,
          type: '',
        },
      });
      dispatch({
        type: 'invoiceStoreList/mount',
        payload: {
          goodsSn: id,
          type: '',
        },
      });
    } else {
      dispatch({
        type: 'invoiceStoreList/mount',
        payload: {
          type: 1,
        },
      });
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'invoiceStoreList/unmount',
    });
  }
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'goodsKeywords':
      case 'goodsSn':
      case 'invSn':
        dispatch({
          type: 'invoiceStoreList/updateState',
          payload: {
            [type]: e.target.value,
            type: 1,
          },
        });
        break;
      case 'invoiceDate':
        dispatch({
          type: 'invoiceStoreList/updateState',
          payload: {
            invoiceDateStart: dataStrings[0],
            invoiceDateEnd: dataStrings[1],
            type: 1,
          },
        });
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
          payload: {
            invoiceDateStart: dataStrings[0],
            invoiceDateEnd: dataStrings[1],
            type: 1,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'invoiceStoreList/updateState',
          payload: {
            [type]: e,
            type: 1,
          },
        });
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
          payload: {
            [type]: e,
            type: 1,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'invoiceStoreList/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
            type: 1,
          },
        });
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
            type: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  handleSearch(type, e) {
    const { dispatch } = this.props;
    const { invSn, goodsSn, goodsKeywords } = this.props.invoiceStoreList;
    switch (type) {
      case 'invSn':
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
          payload: {
            invSn,
            currentPage: 1,
          },
        });
        break;
      case 'goodsSn':
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
          payload: {
            goodsSn,
            currentPage: 1,
          },
        });
        break;
      case 'goodsKeywords':
        dispatch({
          type: 'invoiceStoreList/getInvoiceStockListData',
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
      invoiceStockData: {
        invoiceStockList,
      },
      invoiceStockData,

      // 参数
      invoiceDateStart,
      invoiceDateEnd,
      currentPage,
      pageSize,

      // 控制样式
      isLoading,
      detail,

    } = this.props.invoiceStoreList;

    // 发票明细总表
    const invoiceStockColumn = [
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        render: (value) => {
          return <Link to={`/finance/finance-invoice/invoice-store-list/detail/${value}`}>{value}</Link>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: '200px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '发票号',
        key: 'invSn',
        dataIndex: 'invSn',
        // render: (value, record) => {
        //   const tag = record.tag.length ?
        //     record.tag.map(item =>
        //       (<Tooltip placement="top" title={item.remark} key={value}><span style={{ color: 'white', backgroundColor: item.color, padding: '1px 3px', marginRight: '3px', cursor: 'pointer' }}>{item.name}</span></Tooltip>)
        //     ) : '';
        //   return <div>{tag}<span>{value}</span></div>;
        // },
      },
      {
        title: '发票日期',
        dataIndex: 'invDate',
        key: 'invDate',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        width: '200px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
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
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        key: 'taxAmount',
      },
      {
        title: '价税合计',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
      },
      {
        title: '可开票价',
        dataIndex: 'outMinPrice',
        key: 'outMinPrice',
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
        title: '即时库存',
        dataIndex: 'immStock',
        key: 'immStock',
      },
      {
        title: '可用库存',
        dataIndex: 'canUseStock',
        key: 'canUseStock',
        render: value => (
          <span style={{ color: 'red' }}>{value}</span>
        ),
      },
      {
        title: '占用库存',
        dataIndex: 'occStock',
        key: 'occStock',
      },
    ];
    const invoiceStockDetailColumn = [
      {
        title: '发票号',
        key: 'invSn',
        dataIndex: 'invSn',
        // render: (value, record) => {
        //   const tag = record.tag.length ?
        //     record.tag.map(item =>
        //       (<Tooltip placement="top" title={item.remark} key={value}><span style={{ color: 'white', backgroundColor: item.color, padding: '1px 3px', marginRight: '3px', cursor: 'pointer' }}>{item.name}</span></Tooltip>)
        //     ) : '';
        //   return <div>{tag}<span>{value}</span></div>;
        // },
      },
      {
        title: '发票日期',
        dataIndex: 'invDate',
        key: 'invDate',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        width: '300px',
        render: (value) => {
          return <Tooltip placement="top" title={value} ><span style={{ display: 'inline-block', maxHeight: '80px', overflow: 'hidden' }} >{value}</span></Tooltip>;
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
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
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        key: 'taxAmount',
      },
      {
        title: '价税合计',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
      },
      {
        title: '可开票价',
        dataIndex: 'outMinPrice',
        key: 'outMinPrice',
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: '80px',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '80px',
      },
      {
        title: '票据来源',
        dataIndex: 'invSource',
        key: 'invSource',
      },
    ];

    return (
      <PageHeaderLayout title={detail ? '发票进出明细' : '发票库存表'}>
        <Card bordered={false} >
          {
            detail ? '' :
            <Row gutter={16} style={{ margin: '20px 0' }}>
              <Col span={3} >
                <Search
                  placeholder="发票商品名称/商品名称"
                  onChange={this.handleChangeInputValue.bind(this, 'goodsKeywords')}
                  onSearch={this.handleSearch.bind(this, 'goodsKeywords')}
                />
              </Col>
              <Col span={3} >
                <Search
                  placeholder="条码"
                  onChange={this.handleChangeInputValue.bind(this, 'goodsSn')}
                  onSearch={this.handleSearch.bind(this, 'goodsSn')}
                />
              </Col>
              <Col span={4} >
                <Search
                  placeholder="发票号"
                  onChange={this.handleChangeInputValue.bind(this, 'invSn')}
                  onSearch={this.handleSearch.bind(this, 'invSn')}
                />
              </Col>
              <Col span={7} >
                <span style={{ verticalAlign: '-webkit-baseline-middle', marginRight: '10px' }}>发票日期</span>
                <RangePicker
                  className={globalStyles['rangePicker-sift']}
                  format="YYYY-MM-DD"
                  onChange={this.handleChangeInputValue.bind(this, 'invoiceDate')}
                  value={[invoiceDateStart ? moment(invoiceDateStart, 'YYYY-MM-DD') : null, invoiceDateEnd ? moment(invoiceDateEnd, 'YYYY-MM-DD') : null]}
                />
              </Col>
              <Col span={3} offset={5}>
                {
                  invoiceStockData.actionList ?
                    invoiceStockData.actionList.map((actionInfo) => {
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
                    }).concat(<Link to="/finance/finance-invoice/invoice-store-list/add-invoice"><Button type="primary" style={{ marginLeft: 10 }}>新增</Button></Link>) : ''
                }
              </Col>
            </Row>
          }
          <Row>
            {
              invoiceStockData.searchResult ?
                invoiceStockData.searchResult.map((searchItem) => {
                  return (
                    <Row key={searchItem.goodsSn} style={{ margin: '10px 0' }}>
                      <Col span={3}>
                        条码：<span style={{ fontWeight: 'bold' }}>{searchItem.goodsSn}</span>
                      </Col>
                      <Col span={7}>
                        商品名称：
                        <Tooltip placement="top" title={searchItem.goodsName} >
                          <span style={{ fontWeight: 'bold', maxHeight: '20px', maxWidth: '390px', display: 'inline-block', overflow: 'hidden' }} >{searchItem.goodsName}</span>
                        </Tooltip>
                      </Col>
                      <Col span={2}>
                        待开库存：<span style={{ fontWeight: 'bold' }} >{searchItem.awaitStock}</span>
                      </Col>
                      <Col span={2}>
                        在途库存：<span style={{ fontWeight: 'bold' }} >{searchItem.receivingStock}</span>
                      </Col>
                      <Col span={2}>
                        即时库存：<span style={{ fontWeight: 'bold' }} >{searchItem.immStock}</span>
                      </Col>
                      <Col span={2}>
                        可用库存：<span style={{ fontWeight: 'bold', color: 'red' }} >{searchItem.canUseStock}</span>
                      </Col>
                      <Col span={2}>
                        占用库存：<span style={{ fontWeight: 'bold' }} >{searchItem.occStock}</span>
                      </Col>
                    </Row>
                  );
                })
              : ''
          }
          </Row>
          {
            detail ?
              <div style={{ display: 'inline-block', position: 'absolute', top: '34px', right: '88px' }}>
                {
                  invoiceStockData.actionList ?
                    invoiceStockData.actionList.map((actionInfo) => {
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
              </div> : ''
          }
          <Table
            bordered
            dataSource={invoiceStockList}
            columns={detail ? invoiceStockDetailColumn : invoiceStockColumn}
            loading={isLoading}
            size={detail ? 'default' : 'small'}
            rowKey={record => record.id}
            pagination={{
              total: invoiceStockData.total,
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
