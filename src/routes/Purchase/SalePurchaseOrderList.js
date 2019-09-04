import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { stringify } from 'qs';
import {
  Row,
  Col,
  Form,
  Card,
  Table,
  AutoComplete,
  Input,
  Icon,
  DatePicker,
  Select,
  Button,
  Dropdown,
  Menu,
  Tooltip,
  Modal,
} from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SalePurchaseOrderList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Search, TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  salePurchaseOrderList: state.salePurchaseOrderList,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getConfig',
    });
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/unmount',
    });
  }
  // 搜索订单号/用户名/手机号/商品名筛选订单
  handleSearchOrderList(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
      payload: {
        keywords: value,
        curPage: 1,
      },
    });
  }
  // 日期选择搜索
  dateSearchOnChange = (type, dates, datesString) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'date':
        dispatch({
          type: 'salePurchaseOrderList/getOrderList',
          payload: {
            startDate: datesString[0],
            endDate: datesString[1],
            curPage: 1,
          },
        });
        break;
      case 'payTime':
        dispatch({
          type: 'salePurchaseOrderList/getOrderList',
          payload: {
            payTimeStart: datesString[0],
            payTimeEnd: datesString[1],
            curPage: 1,
          },
        });
        break;
    }
  }
  // 改变输入框值拉取供应商列表
  @Debounce(200)
  handleSearchSupplyGoods(value) {
    const { dispatch } = this.props;
    // if (!value) {
    //   dispatch({
    //     type: 'salePurchaseOrderList/getOrderList',
    //     payload: {
    //       supplierId: value,
    //       curPage: 1,
    //     },
    //   });
    //   return;
    // }
    dispatch({
      type: 'salePurchaseOrderList/getSiftSupplierList',
      payload: {
        keywords: value,
        // status: -1,
      },
    });
  }
  // 选择供应商进行订单筛选
  handleSelectSupplyGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
      payload: {
        supplierId: value,
        curPage: 1,
      },
    });
  }
  // 勾选商品
  handleCheckSupplyGoods(goodsIds, rows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/changeSupplyGoodsCheckboxIds',
      payload: {
        supplyGoodsCheckboxIds: goodsIds,
        rows,
      },
    });
  }

  // 选择采购员
  handleChangePurchaser(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/changePurchaser',
      payload: {
        purchaserId: value,
        curPage: 1,
      },
    });
  }

  // 选择采购单状态
  handleChangePurchaseOrderType(type, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/changePurchaser',
      payload: {
        [type]: value,
        curPage: 1,
      },
    });
  }

  // 合并付款
  handelMergePayment() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/mergePayment',
    });
  }
  // 切换页码
  handleChangePage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
      payload: {
        curPage,
      },
    });
  }
  // 切换每页数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  // 点击编辑弹出编辑备注的弹窗
  handleTriggerEditRemarkModal(orderId, e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/triggerEditRemarkModal',
      payload: {
        orderId,
      },
    });
  }
  // change 每列的备注
  handleChangeOrderRemark(e) {
    e.persist();
    const { dispatch, salePurchaseOrderList } = this.props;
    const { orderId, orderInfos } = salePurchaseOrderList;
    orderInfos.map(item => {
      if (+item.id === +orderId) {
        item.isChange = true;
        dispatch({
          type: 'salePurchaseOrderList/getConfigReducer',
          payload: {
            orderRemark: item.isChange ? e.target.value : item.remark,
          },
        });
      }
    })
  }
  // 确认修改备注
  handleOkEditRemarkModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/okEditRemarkModal',
    });
  }
  handleClear = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderList',
      payload: {
        [type]: "",
        curPage: 1,
      }
    });
  }
  handleChangeKeywords = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getOrderListReducer',
      payload: {
        keywords: e.target.value,
      }
    });
  }
  handleChangeSyncItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePurchaseOrderList/getConfigReducer',
      payload: {
        [type]: e.target.value,
      }
    });
  }
  render() {
    const {
      salePurchaseOrderList: {
        total,
        curPage,
        pageSize,
        startDate,
        endDate,
        siftSupplierList,
        orderInfos,
        isLoading,
        supplyGoodsCheckboxIds,
        purchaserMap,
        purchaserId,
        purchaseOrderTypeMap,
        payTypeMap,
        status,
        payType,
        orderLoading,
        totalPurchaseAmount,
        sellerMap,
        isShowEditRemarkModal,
        orderRemark,
        isEditingRemark,
        purchaseOrderStatusMap,
        purchaseOrderShippingStatusMap,
        supplierId,
        sellerId,
        shippingStatus,
        keywords,
        purchaseOrderStatusListMap,
        purchaseShippingStatus,
        goodsSn,
        brandListMap,
        payTimeStart,
        payTimeEnd,
        orderInfoSn,
      },
    } = this.props;
    const exportUrl = `${getUrl(API_ENV)}/common/export-purchase-goods-list?${
      stringify({
        keywords,
        supplierId,
        startDate,
        endDate,
        purchaserId,
        status,
        pageSize,
        curPage,
        payType,
        sellerId,
        shippingStatus,
        type: 2,
      })
      }`;
    const renderOption = (item) => {
      return (
        <Option key={item.id} value={item.id.toString()}>
          {item.name}
        </Option>
      );
    };
    const date = new Date();
    const columns = [
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (status) => {
          return <span>{purchaseOrderStatusMap[status]}</span>
        }
      },
      {
        title: '发货状态',
        dataIndex: 'shippingStatus',
        key: 'shippingStatus',
        width: 110,
        render: (shippingStatus) => {
          return <span>{purchaseShippingStatus[shippingStatus]}</span>
        }
      },
      {
        title: '采购单号',
        dataIndex: 'id',
        key: 'id',
        width: 120,
        render: (id, record) => {
          return (
            [

              <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.id}`}>{id}</Link>,
              <p style={{margin:0}}>
                {/* {
                  record.isCredit ?(<span style={{ color: '#fff', marginRight: 4, padding: '2px 5px', backgroundColor: 'pink', fontSize: 12 }}>账期</span>):null
                  
                } */}
                {
                  record.isReject ?
                    (
                      <Tooltip title={record.rejectRemark}>
                        <span style={{ color: '#fff', marginRight: 4, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                      </Tooltip>
                    ) : null
                }
                {
                  record.tag.map(item=>(
                    <span style={{backgroundColor:item.color}} className={globalStyles.tag}  key={item}>{item.name}</span>
                  ))
                }
              </p>
            ]
          );
        },
      },
      {
        title: '销售子单号',
        dataIndex: 'orderInfoSn',
        key: 'orderInfoSn',
        width: 150,
        render: (orderInfoSn) => {
          return <Tooltip 
          overlayStyle={{width:300,wordBreak:'break-all'}}
          title={orderInfoSn}>
            <div style={{width:150}} className={globalStyles.twoLine}>{orderInfoSn}</div>
          </Tooltip>
        }
      },
      {
        title: '预计发货时间',
        dataIndex: 'expectShippingDate',
        key: 'expectShippingDate',
        width: 120,
        render: (expectShippingDate, record) => {
          if (new Date(record.expectShippingDate) - new Date(date.getTime() - 24 * 60 * 60 * 1000) <= 0) {
            return (
              <span style={{ color: 'red' }}>{record.expectShippingDate}</span>
            );
          }
          return (
            <span>{record.expectShippingDate}</span>
          );
        },
      },
      {
        title: '预计付款时间',
        dataIndex: 'paymentTime',
        key: 'paymentTime',
        width: 120,
        render: (paymentTime, record) => {
          if (new Date(record.expectPayTime) - new Date(date.getTime() - 24 * 60 * 60 * 1000) <= 0) {
            return (
              <span style={{ color: 'red' }}>{record.expectPayTime}</span>
            );
          }
          return (
            <span>{record.expectPayTime}</span>
          );
        },
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width:120,
      },
      {
        title: '采购应付总额',
        dataIndex: 'money',
        key: 'money',
        width: 100,
      },
      {
        title: '采购员',
        dataIndex: 'purchaser',
        key: 'purchaser ',
        width: 160,
      },
      {
        title: '销售跟进',
        dataIndex: 'seller',
        key: 'seller ',
        width: 100,
        render: (seller) => {
          return <p style={{ margin: 0, width: 100 }} className={globalStyles.twoLine}>
            {
              seller && seller.map(seller => (
                <span style={{ display: 'inline-block', marginRight: 4 }}>{seller}</span>
              ))
            }
          </p>
        },
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: 120,
      },
      {
        title: '收件人',
        dataIndex: 'customers',
        key: 'customers',
        width: 110,
        render: (customers) => {
          return <p style={{ margin: 0, width: 100 }} className={globalStyles.twoLine}>
            <Tooltip title={customers.map(item=>(
               <span>{`${item}/`}</span>
            ))}>{
              customers.map(item=>(
                <span>{`${item}/`}</span>
              ))
            }</Tooltip>
          </p>
        },
      },
      // {
      //   title: '客户名',
      //   dataIndex: 'customers',
      //   key: 'customers',
      //   width: 150,
      //   render: (customers) => {
      //     return (
      //       <Tooltip
      //         title={
      //           customers.map((customer, index) => {
      //             if (index === (customers.length - 1)) {
      //               return <span key={`index${customer}`}>{customer}</span>;
      //             }
      //             return <span key={`index${customer}`}>{customer}、</span>;
      //           })
      //         }
      //       >
      //         <div className={styles.col}>
      //           {
      //             customers.map((customer, index) => {
      //               if (index === (customers.length - 1)) {
      //                 return <span>{customer}</span>;
      //               }
      //               return <span>{customer}、</span>;
      //             })
      //           }
      //         </div>
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        title: '供应商',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 150,
        render: (supplier) => {
          return <p style={{ margin: 0, width: 130 }} className={globalStyles.twoLine}>
            <Tooltip title={supplier}>{supplier}</Tooltip>
          </p>
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (remark, record) => (
          <Tooltip title={remark}>
            <a onClick={this.handleTriggerEditRemarkModal.bind(this, record.id)}><span className={globalStyles['ellipsis-col']}><Icon type="edit" />{remark}</span></a>
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
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item>
                    <Link
                      to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.id}`}
                    >
                      详情
                    </Link>
                  </Menu.Item>
                </Menu>
              }
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];

    const expendRenderGoods = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          render: (goodsThumb) => {
            return <img style={{ width: 50, heihgt: 50 }} src={goodsThumb} />;
          },
        },
        {
          title: '商品名',
          dataIndex: 'goodsName',
          key: 'goodsName',
        },
        {
          title: '商品条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
        },
        // {
        //   title: '是否含税',
        //   dataIndex: 'isTax',
        //   key: 'isTax',
        //   render: isTax => (
        //     <span>{isTax ? '是' : '否'}</span>
        //   ),
        // },
        {
          title: '采购数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '销售价',
          dataIndex: 'payPrice',
          key: 'payPrice',
        },
        {
          title: '零售价/单价/折扣',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          render: (marketPrice, record) => {
            return (
              <p>
                <span>{marketPrice}</span>
                <span>/</span>
                <span>{record.shopPrice}</span>
                <span>/</span>
                <span>{record.saleDiscount}</span>
              </p>
            );
          },
        },
        {
          title: '采购单价/折扣',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          render: (purchasePrice, record) => {
            return (
              <p>
                <span>{purchasePrice}</span>
                <span>/</span>
                <span>{record.purchaseDiscount}</span>
              </p>
            );
          },
        },
        {
          title: '采购含税',
          dataIndex: 'purchaseIsTax',
          key: 'purchaseIsTax',
          render: (purchaseIsTax) => {
            return purchaseIsTax ? '是' : '否';
          },
        },
        {
          title: '销售含税',
          dataIndex: 'saleIsTax',
          key: 'saleIsTax',
          render: (saleIsTax) => {
            return saleIsTax ? '是' : '否';
          },
        },
      ];
      const { goodsList } = order;
      return (
        <Table
          bordered
          loading={isLoading}
          dataSource={goodsList}
          rowKey={record => record.id}
          columns={goodsColumns}
          pagination={false}
          className={globalStyles.tablestyle}
        />
      );
    };

    return (
      <PageHeaderLayout title="代发采购订单列表" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row>
                <Search
                  className={globalStyles['input-sift']}
                  style={{ width: 300 }}
                  placeholder="客户名/手机号/收货人/收货电话/采购单号"
                  onChange={this.handleChangeKeywords}
                  onSearch={this.handleSearchOrderList.bind(this)}
                  value={keywords}
                  suffix={keywords ? <ClearIcon
                    handleClear={this.handleClear.bind(this, "keywords")}
                  /> : ""}
                />
                <AutoComplete
                  className={globalStyles['select-sift']}
                  style={{ width: 240 }}
                  dataSource={siftSupplierList.map(renderOption)}
                  onSelect={this.handleSelectSupplyGoods.bind(this)}
                  onSearch={this.handleSearchSupplyGoods.bind(this)}
                  placeholder="供应商"
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Input.Search />
                </AutoComplete>
                <RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.dateSearchOnChange.bind(this, 'date')}
                  defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
                  format="YYYY-MM-DD"
                />
                <Select
                  // className={globalStyles['select-sift']}
                  // value={purchaserMap[purchaserId]}
                  style={{width:150,marginRight:10}}
                  placeholder="采购员"
                  onChange={this.handleChangePurchaser.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option key={-1} value={-1}>全部</Option>
                  {
                    (Object.entries(purchaserMap).map((value) => {
                      return <Option key={value[0]}>
                        <Tooltip title={value[1]}>
                          {value[1]}
                        </Tooltip>
                      </Option>;
                    }))
                  }
                </Select>
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="审核状态"
                  onChange={this.handleChangePurchaseOrderType.bind(this, 'status')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option key={"0"} value={"0"}>全部</Option>
                  {
                    (Object.entries(purchaseOrderStatusListMap).map((value) => {
                      return <Option key={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="发货状态"
                  onChange={this.handleChangePurchaseOrderType.bind(this, 'shippingStatus')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option key={-1} value={-1}>全部</Option>
                  {
                    (Object.entries(purchaseShippingStatus).map((value) => {
                      return <Option key={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                </Row>
                <Row>
                  <Select
                    className={globalStyles['select-sift']}
                    placeholder="支付类型"
                    onChange={this.handleChangePurchaseOrderType.bind(this,"payType")}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    <Option key={-1} value={-1}>全部</Option>
                    {
                      (Object.keys(payTypeMap).map((value) => {
                        return <Option key={value}>{payTypeMap[value]}</Option>;
                      }))
                    }
                  </Select>
                  <Select
                    className={globalStyles['select-sift']}
                    placeholder="销售员"
                    onChange={this.handleChangePurchaseOrderType.bind(this,"sellerId")}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    <Option key={-1} value={-1}>全部</Option>
                    {
                      (Object.keys(sellerMap).map((value) => {
                        return <Option key={value}>{sellerMap[value]}</Option>;
                      }))
                    }
                  </Select>
                  <Select
                  placeholder="请选择品牌名"
                  style={{ width: 300, marginRight: 10 }}
                  onChange={this.handleChangePurchaseOrderType.bind(this, "brandId")}
                  showSearch
                  dropdownMatchSelectWidth={false}
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value={""}>全部</Select.Option>
                  {
                    Object.keys(brandListMap).map(key => (
                      <Select.Option value={key}>{brandListMap[key]}</Select.Option>
                    ))
                  }
                </Select>
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入条码"
                  onSearch={this.handleChangePurchaseOrderType.bind(this, 'goodsSn')}
                  onChange={this.handleChangeSyncItem.bind(this, 'goodsSn')}
                  value={goodsSn}
                  suffix={goodsSn ? <ClearIcon
                    handleClear={this.handleClear.bind(this, "goodsSn")}
                  /> : ""}
                />
                <Select
                  placeholder="是否售后"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangePurchaseOrderType.bind(this, "isBack")}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Select.Option key={""} value={""}>
                    全部
                    </Select.Option>
                  <Select.Option key={"1"} value={"1"}>
                    是
                    </Select.Option>
                  <Select.Option key={"0"} value={"0"}>
                    否
                    </Select.Option>
                </Select>
                财务付款时间：
                  <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[payTimeStart ? moment(payTimeStart, 'YYYY-MM-DD') : '', payTimeEnd ? moment(payTimeEnd, 'YYYY-MM-DD') : '']}
                  onChange={this.dateSearchOnChange.bind(this, 'payTime')}
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="销售子单号"
                  onSearch={this.handleChangePurchaseOrderType.bind(this, 'orderInfoSn')}
                  onChange={this.handleChangeSyncItem.bind(this, 'orderInfoSn')}
                  value={orderInfoSn}
                  suffix={orderInfoSn ? <ClearIcon
                    handleClear={this.handleClear.bind(this, "orderInfoSn")}
                  /> : ""}
                />
              </Row>
              <Row
                style={{
                  display: supplyGoodsCheckboxIds.length > 0 ? 'block' : 'none',
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ display: 'inline-block', marginLeft: 5, marginRight: 10 }}>
                  <Icon
                    type="close"
                    style={{
                      fontSize: 16,
                      color: '#C9C9C9',
                      marginRight: '10px',
                    }}
                  />
                  已选择{supplyGoodsCheckboxIds.length}项
                  </span>
                <span style={{ marginRight: 10 }}>总采购额: {Number(totalPurchaseAmount).toFixed(2)}</span>
                <Button type="primary" loading={orderLoading} onClick={this.handelMergePayment.bind(this)}>
                  合并付款
                  </Button>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              expandedRowRender={expendRenderGoods}
              className={globalStyles.tablestyle}
              rowSelection={{
                selectedRowKeys: supplyGoodsCheckboxIds,
                onChange: this.handleCheckSupplyGoods.bind(this),
              }}
              rowClassName={(record) => {
                if (+record.isCredit) {
                  return styles.disabledRow;
                } else {
                  return +record.status !== 3 ? styles.disabledRow : '';
                }

              }}
              dataSource={orderInfos}
              columns={columns}
              pagination={{
                pageSize,
                total,
                current: curPage,
                showSizeChanger: true,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showTotal:total => `共 ${total} 个结果`,
              }}
              title={() => {
                return (
                  <Row>
                    <a style={{ marginRight: 10 }} target="_blank" href={exportUrl}>
                      <Button type="primary">导出</Button>
                    </a>
                  </Row>
                )
              }}
            />
            {/* 编辑备注弹窗 */}
            <Modal
              visible={isShowEditRemarkModal}
              confirmLoading={isEditingRemark}
              title="编辑备注信息"
              onOk={this.handleOkEditRemarkModal.bind(this)}
              onCancel={this.handleTriggerEditRemarkModal.bind(this, null)}
            >
              <TextArea
                style={{ marginTop: 20 }}
                value={orderRemark}
                placeholder="请输入新的备注"
                onChange={this.handleChangeOrderRemark.bind(this)}
                onPressEnter={this.handleOkEditRemarkModal.bind(this)}
              />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
