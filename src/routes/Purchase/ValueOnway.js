import React, { PureComponent } from 'react';
// import { stringify } from 'qs';
// import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Card,
  Select,
  DatePicker,
  Input,
  Table,
  Button,
  Tabs,
  Tooltip,
  Col,
  Row,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ValueOnway.less';
import globalStyles from '../../assets/style/global.less';
// import { divide } from 'number-precision';
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
// const { Option } = Select;

@connect(state => ({
  valueOnway: state.valueOnway,
}))
export default class ValueOnway extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/getList',
    });
    dispatch({
      type: 'valueOnway/getProList',
    });
    dispatch({
      type: 'valueOnway/totalGoodsAmount',
    });
    dispatch({
      type: 'valueOnway/getConfig',
    });

  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/unmount',
    });
  }
  // 存取当前被激活tab的key
  changeTabKey(key) {
    const { dispatch, valueOnway } = this.props;
    dispatch({
      type: 'valueOnway/changeSyncItemReducer',
      payload: {
        activeKey: key,
      },
    })
  }
  // 换页回调activeKey为1，调用getProList,在库货值
  // 切换每页条数回调
  handleChangePageSize(_, pageSize) {
    const { dispatch, valueOnway } = this.props;
    const { activeKey } = valueOnway;
    if (activeKey == 1) {
      dispatch({
        type: 'valueOnway/changeSyncItemReducer',
        payload: {
          pageSize,
          curPage: 1,
        },
      })
      dispatch({
        type: 'valueOnway/getProList',
      });
    } else if (activeKey == 2) {
      dispatch({
        type: 'valueOnway/changeSyncItemReducer',
        payload: {
          pageSize2: pageSize,
          curPage2: 1,
        },
      })

      dispatch({
        type: 'valueOnway/getList',
      });
    }

  }
  // 换页回调activeKey为1，调用getProList,在库货值
  // 换页回调
  handleChangePage(curPage) {
    const { dispatch, valueOnway } = this.props;
    const { activeKey } = valueOnway;
    if (activeKey == 1) {
      dispatch({
        type: 'valueOnway/changeSyncItemReducer',
        payload: {
          curPage: curPage,
        },
      })

      dispatch({
        type: 'valueOnway/getProList',
      });
    } else if (activeKey == 2) {
      dispatch({
        type: 'valueOnway/changeSyncItemReducer',
        payload: {
          curPage2: curPage,
        },
      })

      dispatch({
        type: 'valueOnway/getList',
      });
    }

  }
  handleDateChange(Type, e, dataStrings) {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/searchList',
      payload: {
        startDate: dataStrings[0],
        endDate: dataStrings[1],
        currentPage: 1,
      },
    });
  }
  handleInputTextChanged(Type, e) {
    // var typeVal=Type;
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/changeSyncItemReducer',
      payload: {
        [Type]: e.target.value,
        currentPage: 1,
      },
    });

  }

  handleInputTextSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/getList',
      payload: {
        currentPage: 1,
      },
    });


  }
  handleInputSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/getProList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleSelected(Type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/searchList',
      payload: {
        [Type]: e,
        currentPage: 1,
      },
    });
  }
  /**----升序降序排列------- */
  onTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    if (sorter.order === "ascend") {
      dispatch({
        type: 'valueOnway/getProList',
        payload: {
          sort: 2,
          orderBy: sorter.field,
        }
      });
    } else if (sorter.order === "descend") {
      dispatch({
        type: 'valueOnway/getProList',
        payload: {
          sort: 1,
          orderBy: sorter.field,
        }
      });
    }
  }
  handleSearchItems = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'valueOnway/getProList',
      payload: {
        [type]: e,
        curPage: 1,
      }
    })
  }
  render() {
    const {
      valueOnway: {
        orderList,
        isTableLoading,
        isTableLoadingPro,
        activeKey,
        sellerMap,
        pageSize,
        pageSize2,
        curPage,
        curPage2,
        goodsList,
        goodsData,
        totalAmount,
        total,
        total2,
        startDate,
        receivingStockAmount,
        endDate,
        goodsStatusMap,
        actionList,
        brandListMap,
        onWayActionList,
        // proName,

      },
    } = this.props;
    const expandedRowRender = (order) => {
      const columns2 = [
        {
          title: '主图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          render: (src, record) => (
            <img src={src} style={{ width: 55, height: 55 }} />
          ),
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
        },
        { title: '商品条码', dataIndex: 'goodsSn', key: 'goodsSn', },
        { title: '采购数量', dataIndex: 'number', key: 'number', },
        { title: '未入库数量', dataIndex: 'receivingNum', key: 'receivingNum' },
        {
          title: '零售价/平台售价/折扣',
          key: 'marketPrice',
          render: (marketPrice, record) => {
            return (
              <div className="retailcolor">
                <span className={styles["red"]}>{record.marketPrice}</span>/
                <span className={styles["yellow"]}>{record.shopPrice}</span>/
                <span className={styles["blue"]}>{record.saleDiscount}</span>
              </div>
            );


          }
        },

        {
          title: '采购单价/折扣',
          key: 'purchaseDiscount',
          render: (marketpurchaseDiscountPrice, record) => {
            return (
              <div className='retailcolor'>
                <span className={styles["yellow"]}>{record.purchasePrice}</span>/
                  <span className={styles["blue"]}>{record.purchaseDiscount}</span>
              </div>
            );


          }
        },
        {
          title: '采购含税',
          dataIndex: 'isTax',
          key: 'isTax',
          render: isTax => (
            <span>{isTax ? '是' : '否'}</span>
          ),
        },
      ];

      return (
        <Table
          columns={columns2}
          rowKey={order => order.goodsId}
          dataSource={order.goodsList}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: '采购订单号', dataIndex: 'orderId', key: 'orderId',
        render: (orderId) => {
          return <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${orderId}`}>{orderId}</Link>
        }

      },
      { title: '采购金额', dataIndex: 'purchaseAmount', key: 'purchaseAmount' },
      { title: '未入库总金额', dataIndex: 'receivingAmount', key: 'receivingAmount' },
      { title: '制单人', dataIndex: 'purchaser', key: 'purchaser' },
      { title: '采购时间', dataIndex: 'createTime', key: 'createTime' },
      { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
      {
        title: '备注', dataIndex: 'remark', key: 'remark',
        width: 200,
        render: (remark) => {
          return <Tooltip title={remark} placement="topLeft">
            <p style={{ width: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{remark}</p>
          </Tooltip>
        }
      },
    ];
    const columnss = [
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 200,
        render: (goodsName) => {
          return <p style={{ width: 170, margin: 0 }} className={globalStyles.twoLine}>
            <Tooltip title={goodsName}>
              {goodsName}
            </Tooltip>
          </p>
        }
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        width: 120,
        render: (brandName) => {
          return <p style={{ width: 90, margin: 0 }} className={globalStyles.twoLine}>
            <Tooltip title={brandName}>
              {brandName}
            </Tooltip>
          </p>
        }

      },
      { title: '条码', dataIndex: 'goodsNo', key: 'goodsNo' },
      {
        title: '是否上架', dataIndex: 'isOnSale', key: 'isOnSale',
        render: (isOnSale) => {
          return <span>{goodsStatusMap[isOnSale]}</span>
        }
      },
      { title: '单位', dataIndex: 'unit', key: 'unit' },
      { title: '平台价', dataIndex: 'shopPrice', key: 'shopPrice' },
      { title: '零售价', dataIndex: 'marketPrice', key: 'marketPrice' },
      { title: '供应商含税进价', dataIndex: 'supplierTaxPurchasePrice', key: 'supplierTaxPurchasePrice', width: 90 },
      { title: '即时库存', dataIndex: 'imNum', key: 'imNum' },
      { title: '可用库存', dataIndex: 'canUseNum', key: 'canUseNum' },
      { title: '总占用库存量', dataIndex: 'totalOccupyNum', key: 'totalOccupyNum', width: 90 },
      { title: '订单占用库存量', dataIndex: 'occupyNum', key: 'occupyNum', width: 90 },
      { title: '人工占用库存量', dataIndex: 'manMadeOccupyNum', key: 'manMadeOccupyNum', width: 90 },
      { title: '加权平均单价', dataIndex: 'costAvgPrice', key: 'costAvgPrice', },
      { title: '即时货值', dataIndex: 'immStockAmount', key: 'immStockAmount', sorter: true },
      { title: '可用货值', dataIndex: 'canUseStockAmount', key: 'canUseStockAmount', sorter: true },
      { title: '占用货值', dataIndex: 'occupyStockAmount', key: 'occupyStockAmount', sorter: true },
    ];

    return (
      <PageHeaderLayout title="货值管理">
        <Card bordered={false}>

          <Tabs defaultActiveKey="1" onChange={this.changeTabKey.bind(this)}
            tabBarExtraContent={
              <div>总货值：<span style={{ marginRight: 20, color: "red" }}>￥{totalAmount}</span></div>
            }
          >
            <TabPane tab="在库货值" key="1">
              <Row>
                <Col span={20}>
                  <Input.Search
                    className={globalStyles['input-sift']}
                    placeholder="请输入商品名称/条码"
                    onSearch={this.handleInputSearch.bind(this)}
                    onChange={this.handleInputTextChanged.bind(this, 'keywords')}
                  />
                  <span style={{ display: 'inline-block', marginLeft: 20 }}>商品状态：</span>
                  <Select
                    className={globalStyles['input-sift']}
                    onChange={this.handleSearchItems.bind(this, 'status')}
                    placeholder="请选择"
                    dropdownMatchSelectWidth={false}
                    allowClear
                  >
                    <Option value={"0"} key={"0"}>全部</Option>
                    {
                      Object.keys(goodsStatusMap).map(item => {
                        return <Option
                          key={item}
                          value={item}
                        >
                          {goodsStatusMap[item]}
                        </Option>
                      })
                    }
                  </Select>
                  <Select
                    placeholder="请选择品牌名"
                    style={{ width: 300, marginRight: 10 }}
                    onChange={this.handleSearchItems.bind(this, 'brandId')}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    dropdownMatchSelectWidth={false}
                  >
                    <Select.Option value={""}>全部</Select.Option>
                    {
                      Object.keys(brandListMap).map(key => (
                        <Select.Option value={key}>{brandListMap[key]}</Select.Option>
                      ))
                    }
                  </Select>
                </Col>
                <Col span={4}>
                  <Button type="primary" href={actionList.url} target="_blank">{actionList.name}</Button>
                </Col>
              </Row>
              <div className={styles["amountline"]}>
                <p>在库即时货值：<span>￥{goodsData.immStockTotalAmount}</span></p>
                <p>在库占用货值：<span>￥{goodsData.occStockTotalAmount}</span></p>
                <p>在库可用货值：<span>￥{goodsData.canUseStockTotalAmount}</span></p>
              </div>
              <Table
                bordered
                rowKey={goodsList => goodsList.goodsId}
                dataSource={goodsList} columns={columnss}
                loading={isTableLoadingPro}
                className={globalStyles.tablestyle}
                onChange={this.onTableChange}
                pagination={{
                  current: curPage,
                  pageSize,
                  onChange: this.handleChangePage.bind(this),
                  onShowSizeChange: this.handleChangePageSize.bind(this),
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total,
                  showTotal: total => `共 ${total} 个结果`,
                }}
              />
            </TabPane>
            <TabPane tab="在途货值" key="2">
              <Col span={20}>
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入商品名称/条码"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'goodsKeywords')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入采购单号"
                  onSearch={this.handleInputTextSearch.bind(this)}
                  onChange={this.handleInputTextChanged.bind(this, 'orderId')}
                />

                <Select
                  placeholder="采购员"
                  className={globalStyles['select-sift']}
                  onChange={this.handleSelected.bind(this, 'purchaser')}
                  dropdownMatchSelectWidth={false}
                  allowClear
                >
                  {Object.keys(sellerMap).map(key => (
                    <Select.Option value={key}>{sellerMap[key]}</Select.Option>
                  ))}

                </Select>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                  onChange={this.handleDateChange.bind(this, "data")}
                />
              </Col>
              <Col span={4}>
                {
                  onWayActionList.map(item=>(
                      <Button type="primary" href={item.url}>{item.name}</Button>
                  ))
                }
              </Col>
              <div className={styles["amountline"]}>在途货值：<span >￥{receivingStockAmount}
              </span></div>
              <Table
                bordered
                rowKey={orderList => orderList.orderId}
                expandedRowRender={expandedRowRender}
                dataSource={orderList} columns={columns}
                loading={isTableLoading}
                pagination={{
                  current: curPage2,
                  pageSize: pageSize2,
                  onChange: this.handleChangePage.bind(this),
                  onShowSizeChange: this.handleChangePageSize.bind(this),
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total: total2,
                }}
              />
            </TabPane>
          </Tabs>

        </Card>
      </PageHeaderLayout>

    );
  }
}

