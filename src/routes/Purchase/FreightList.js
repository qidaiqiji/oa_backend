import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Input, DatePicker, Select, Row, AutoComplete, Tooltip, Icon, Col, Button } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ClearIcon from '../../components/ClearIcon';
import globalStyles from '../../assets/style/global.less';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
import Debounce from 'lodash-decorators/debounce';
@connect(state => ({
  freightList: state.freightList,
}))
export default class FreightList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const pathName = this.props.location.pathname;
    let type = "";
    if (pathName == '/finance/purchase-check/freight-list') {
      type = 1;
    } else {
      type = 2;
    }
    dispatch({
      type: 'freightList/getList',
      payload: {
        type,
      }
    })
    dispatch({
      type: 'freightList/getConfig',
    })

  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightList/unmountReducer',
    })
  }
  handleChangeSiftItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightList/updatePageReducer',
      payload: {
        [type]: e.target.value
      }
    })

  }
  handleSearchSiftItem = (type, e) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'status':
        dispatch({
          type: 'freightList/getList',
          payload: {
            [type]: e,
            checkStatus: e,
            currentPage: 1,
          }
        })
        break;
      default:
        dispatch({
          type: 'freightList/getList',
          payload: {
            [type]: e,
            currentPage: 1,
          }
        })
        break;
    }

  }
  handleChangeDate = (date, dateString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightList/getList',
      payload: {
        createTimeStart: dateString[0],
        createTimeEnd: dateString[1],
        currentPage: 1,
      }
    })
  }
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'freightList/getList',
      payload: {
        currentPage: 1,
        supplierId,
        supplierSearchText: children,
      },
    });
  }
  // 搜索供应商
  @Debounce(200)
  handleChangeSupplier(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightList/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
  handleClear = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightList/getList',
      payload: {
        currentPage: 1,
        [type]: ''
      },
    });
  }

  render() {
    const {
      freightList: {
        isTableLoading,
        total,
        shippingFeeList,
        purchaserMap,
        statusMap,
        supplierSuggest,
        purchaseOrderId,
        shippingFeeId,
        type,
        checkStatusMap,
        actionList,
      },
    } = this.props;
    const columns = [
      {
        title: '审核状态',
        key: 'status',
        dataIndex: 'status',
        render: (status) => {
          return <span>{statusMap[status]}</span>
        }
      },
      {
        title: '应付运费单号',
        key: 'id',
        dataIndex: 'id',
        render: (id) => {
          return <Link to={`/purchase/freight/freight-list/freight-detail/${id}`}>{id}</Link>
        }
      },
      {
        title: '关联采购单号',
        key: 'purchaseOrderIdList',
        dataIndex: 'purchaseOrderIdList',
        render: (purchaseOrderIdList) => {
          return <div>
            {
              purchaseOrderIdList.map(item => {
                return <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${item}`}>{`${item} `}</Link>
              })
            }
          </div>
        }
      },
      {
        title: '供应商',
        key: 'supplierName',
        dataIndex: 'supplierName',
      },
      {
        title: '运费总额',
        key: 'amount',
        dataIndex: 'amount',
      },
      {
        title: '采购员',
        key: 'purchaser',
        dataIndex: 'purchaser',
        render: (purchaser) => {
          return <span>{purchaserMap[purchaser]}</span>
        }
      },
      {
        title: '申请时间',
        key: 'createTime',
        dataIndex: 'createTime',
      },
    ];
    const expandedRowRender = (record) => {
      const expandedColumns = [
        {
          title: '采购单号',
          key: 'purchaseOrderId',
          dataIndex: 'purchaseOrderId',
        },
        {
          title: '供应商',
          key: 'supplierName',
          dataIndex: 'supplierName',
        },
        {
          title: '采购数量',
          key: 'purchaseGoodsNum',
          dataIndex: 'purchaseGoodsNum',
        },
        {
          title: '已入库数量',
          key: 'storeNum',
          dataIndex: 'storeNum',
        },
        {
          title: '待入库数量',
          key: 'waitStoreNum',
          dataIndex: 'waitStoreNum',
        },
        {
          title: '运费总额',
          key: 'amount',
          dataIndex: 'amount',
          render: (amount, record) => {
            return <div>
              <span>{amount}</span>
              <div>
                {
                  record.tag && record.tag.map(item => (
                    item.name == "运费待归属" && <Tooltip key={item} title={<div>
                      <p>存在同一物流单号对应多个采购单，实际运费以入库后进行归属均摊；</p>
                      <p>消失条件：1：如果已全部入库，则此处运费总额为归属运费总额，则不需要打标签</p>
                      <p>2.如果未全部入库，则运费总额为基础运费累积总额，需要打标签</p>
                    </div>}>
                      <span style={{ backgroundColor: item.color }} className={globalStyles.tag} >{item.name}</span>
                    </Tooltip>
                  ))
                }
              </div>
            </div>
          }
        },
        {
          title: <div>均摊运费 <Tooltip title={<div>
            <p>均摊运费=归属运费总额除以已入库数量</p>
            <p>均摊运费总额以实际入库后（仓库回传数据）的数据进行均摊</p>
          </div>}><Icon type="question-circle" /></Tooltip></div>,
          key: 'averageFee',
          dataIndex: 'averageFee',
        },
        {
          title: '采购员',
          key: 'purchaser',
          dataIndex: 'purchaser',
          render: (purchaser) => {
            return <span>{purchaserMap[purchaser]}</span>
          }
        },
        {
          title: '下单时间',
          key: 'createTime',
          dataIndex: 'createTime',
        },
        {
          title: '跟进备注',
          key: 'followRemark',
          dataIndex: 'followRemark',
        },
      ];
      return <Table
        columns={expandedColumns}
        dataSource={record.purchaseOrderList}
        pagination={false}
        rowKey={record => record.id}
      />;
    }
    return (
      <PageHeaderLayout title="运费中心">
        <Card bordered={false}>
          <Row>
            <Col span={22}>
              <Search
                className={globalStyles['input-sift']}
                placeholder="采购单号"
                onChange={this.handleChangeSiftItem.bind(this, 'purchaseOrderId')}
                onSearch={this.handleSearchSiftItem.bind(this, 'purchaseOrderId')}
                value={purchaseOrderId}
                suffix={purchaseOrderId ? <ClearIcon
                  handleClear={this.handleClear.bind(this, "purchaseOrderId")}
                /> : ""}
              />
              <Search
                className={globalStyles['input-sift']}
                placeholder="应付运费单号"
                onChange={this.handleChangeSiftItem.bind(this, 'shippingFeeId')}
                onSearch={this.handleSearchSiftItem.bind(this, 'shippingFeeId')}
                value={shippingFeeId}
                suffix={shippingFeeId ? <ClearIcon
                  handleClear={this.handleClear.bind(this, "shippingFeeId")}
                /> : ""}
              />
              <AutoComplete
                dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                  return (
                    <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                  );
                })}
                onSelect={this.handleSelectSupplier.bind(this)}
                onSearch={this.handleChangeSupplier.bind(this)}
                className={globalStyles['input-sift']}
                allowClear
                dropdownMatchSelectWidth={false}
                placeholder="请输入供应商"
              >
              </AutoComplete>
              <Select
                //   value={orderStatus}
                placeholder="请选择采购员"
                className={globalStyles['select-sift']}
                onChange={this.handleSearchSiftItem.bind(this, 'purchaser')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value={""}>全部</Option>
                {
                  Object.keys(purchaserMap).map((purchaser) => {
                    return (
                      <Option value={purchaser}>{purchaserMap[purchaser]}</Option>
                    );
                  })
                }
              </Select>
              申请时间：
              <RangePicker
                //   value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeDate}
                className={globalStyles['rangePicker-sift']}
              />
              <Select
                placeholder="请选择审核状态"
                //   value={orderStatus}
                className={globalStyles['select-sift']}
                onChange={this.handleSearchSiftItem.bind(this, 'status')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value={""}>全部</Option>
                {
                  Object.keys(type == 1 ? checkStatusMap : statusMap).map((status) => {
                    return (
                      <Option value={status}>{type == 1 ? checkStatusMap[status] : statusMap[status]}</Option>
                    );
                  })
                }
              </Select>
            </Col>
            <Col span={2}>
            {
                actionList.map(item=>(
                    <Button type="primary" href={item.url} target="_blank">{item.name}</Button>
                ))
            }
            </Col>
          </Row>
          <Table
            bordered
            dataSource={shippingFeeList}
            columns={columns}
            loading={isTableLoading}
            rowKey={record => record.id}
            expandedRowRender={expandedRowRender}
            pagination={{
              //   total,
              //   current: curPage,
              //   pageSize,
              //   showSizeChanger: true,
              //   onChange: this.handleChangeSiftItem.bind(this, 'curPage'),
              //   onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
