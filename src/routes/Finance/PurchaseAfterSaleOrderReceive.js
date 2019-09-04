import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Table, AutoComplete, Input, Icon, DatePicker, Select, Tooltip, Dropdown, Menu, Tabs, Checkbox, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseAfterSaleOrderReceive.less';
import globalStyles from '../../assets/style/global.less';
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  purchaseAfterSaleOrderReceive: state.purchaseAfterSaleOrderReceive,
}))
export default class purchaseAfterSaleOrderReceive extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getConfig',
    });
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getOrderList',
    });
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getInvoicedOrderList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/unmount',
    });
  }
  // 输入供应商 keyword, 获取 supplierSuggests
  handleChangeSupplierKeywords(supplierKeywords) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/changeSupplierKeywords',
      payload: {
        supplierKeywords,
      },
    });
  }
  // 选择供应商
  handleSelectSupplier(supplierId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getList',
      payload: {
        supplierId,
        curPage: 1,
        invoicedCurPage:1,
      },
    });
  }
  // 输入采购号 搜索
  handleSearchOrderList(type,e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getOrderListPending',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  // 日期选择搜索
  handleChangeDate(type, dates, datesString) {
    const { dispatch } = this.props;
    switch(type) {
      case 'date':
        dispatch({
          type: 'purchaseAfterSaleOrderReceive/getList',
          payload: {
            startDate: datesString[0],
            endDate: datesString[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'receiveAmountTime':
        dispatch({
          type: 'purchaseAfterSaleOrderReceive/getList',
          payload: {
            receiveAmountTimeStart: datesString[0],
            receiveAmountTimeEnd: datesString[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'invoicedDate':
        dispatch({
          type: 'purchaseAfterSaleOrderReceive/getList',
          payload: {
            invoicedStartDate: datesString[0],
            invoicedEndDate: datesString[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
      case 'invoicedReceiveAmountTime':
        dispatch({
          type: 'purchaseAfterSaleOrderReceive/getList',
          payload: {
            invoicedReceiveAmountTimeStart: datesString[0],
            invoicedReceiveAmountTimeEnd: datesString[1],
            curPage: 1,
            invoicedCurPage:1,
          },
        });
      break;
    }
  }
  // 选择审核类型
  handleChangeSiftItem(type,e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getList',
      payload: {
        curPage: 1,
        [type]: e,
      },
    });
  }
  // 改变页码
  handleChangeCurPage(type,curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getList',
      payload: {
        [type]:curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(typa,curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getList',
      payload: {
        curPage: 1,
        [typa]:pageSize,
      },
    });
  }
  handleChangeTab=(activeKey)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getConfigResolved',
      payload: {
        activeKey
      },
    });
  }
  handleSearchItems=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/getList',
      payload:{
        [type]:e
      }
    });
  }
  handleCheck=(checkId,e)=>{
    const checked = e.target.checked;
    const { dispatch } = this.props;
    if(checked) {
      dispatch({
        type: 'purchaseAfterSaleOrderReceive/getOrderListPending',
          payload: {
            checkId,
            showModal:true,
          },
        });
    }
  }
  handleCloseModal=()=>{
    const { dispatch } = this.props;
    dispatch({
    type: 'purchaseAfterSaleOrderReceive/getOrderListPending',
      payload: {
        showModal:false,
      },
    });
  }
  handleConfirmCheck=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderReceive/confirmCheck',
    });
  }
  render() {
    const {
      purchaseAfterSaleOrderReceive: {
        startDate,
        endDate,
        orderTypeMap,
        orderType,
        curPage,
        pageSize,
        backOrderList,
        total,
        isLoading,
        supplierKeywords,
        supplierSuggests,
        payTypeMap,
        purchaserMap,
        receiveAmountTimeEnd,
        receiveAmountTimeStart,
        invoicedReceiveAmountTimeStart,
        invoicedReceiveAmountTimeEnd,
        invoicedEndDate,
        invoicedStartDate,
        activeKey,
        invoicedBackOrderList,
        showModal,
        invoicedCurPage,
        invoicedPageSize,
        InvoicedTotal,
        backOrderTypeMap,
        reduceInvStockMap
      },
    } = this.props;
    const orderStatusMap = {
      2: "待财务审核",
      5: "已完成"
    }
    const normalColumns = [
      {
        title: '售后单状态',
        key: 'status',
        dataIndex: 'status',
      },
      {
        title: '售后单号',
        key: 'sn',
        dataIndex: 'sn',
        width:80,
        render: (sn, record) => {
          return (
            [
              <Link to={`/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail/${sn}`}>{sn}</Link>,
              record.isReject ?
                (
                  <Tooltip title={record.rejectRemark}>
                    <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                  </Tooltip>
                ) :
                null,
            ]
          );
        },
      },

    ];
    const invoicedColumns = [
      {
        title: '发票库存状态',
        key: 'isReduceInvStock',
        dataIndex: 'isReduceInvStock',
        width:150,
        render:(isReduceInvStock,record)=>{
          return <div>
            {
              !isReduceInvStock?<Checkbox onChange={this.handleCheck.bind(this,record.id)}></Checkbox>:''
            }
            <span className={isReduceInvStock?styles.color:''}>{reduceInvStockMap[isReduceInvStock]}</span>
          </div>
        }
      },
      {
        title: '关联来票号',
        key: 'relateInInvFollowList',
        dataIndex: 'relateInInvFollowList',
        width:150,
        render:(relateInInvFollowList)=>{
          return <div>
            {
              relateInInvFollowList.map(item=>(
                <Link to={`/finance/finance-invoice/invoice-after-sale-list/after-sale-add/${item.id}`} key={item.inInvSn}>{`${item.inInvSn} / `}</Link>
              ))
            }
          </div>
        }
      },

    ];
    const commonColumns = [      
      {
        title: '售后类型',
        key: 'type',
        dataIndex: 'type',
        render:(type)=>{
          return <span>{orderTypeMap[type]}</span>
        }
      },
      {
        title: '售后类别',
        key: 'backOrderType',
        dataIndex: 'backOrderType',
        render:(backOrderType)=>{
          return <span>{backOrderTypeMap[backOrderType]}</span>
        }
      },
      {
        title: '收款方式',
        key: 'payType',
        dataIndex: 'payType',
        width:110,
        render:(payType)=>{
          return <span>{payTypeMap[payType]}</span>
        }
      },
      {
        title: '财务收款时间',
        key: 'receiveAmountTime',
        dataIndex: 'receiveAmountTime',
        width:100,
      },
      {
        title: '关联采购单号',
        key: 'relatedPurchaseOrderSn',
        dataIndex: 'relatedPurchaseOrderSn',
      },
      {
        title: '供应商',
        key: 'supplier',
        dataIndex: 'supplier',
      },
      {
        title: '采购员',
        key: 'purchaser',
        dataIndex: 'purchaser',
        width:130,
        render:(purchaser)=>{
          return <span>{purchaserMap[purchaser]}</span>
        }
      },
      {
        title: '财务收款时间',
        key: '',
        dataIndex: '',
        width:100,
      },
      // {
      //   title: '退款总额',
      //   key: 'refundTotalAmount',
      //   dataIndex: 'refundTotalAmount',
      //   render: (_, record) => (
      //     record.backGoodsTotal.backAmount
      //   ),
      // },
      // {
      //   title: '应收总额',
      //   key: 'receivableAmount',
      //   dataIndex: 'receivableAmount',
      
      // },
      {
        title: '创建时间',
        key: 'time',
        dataIndex: 'time',
        width:100,
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        width: 100,
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              placement="bottomCenter"
              overlay={(
                <Menu>
                  <Menu.Item>
                    <Link to={`/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail/${record.id}`}>
                      <Icon type="bars" />上传付款凭证
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
    const expandGoodsTable = (order) => {
      const orderGoodsColumns = [
        {
          title: '主图',
          key: 'img',
          dataIndex: 'img',
          render: (imgSrc, record) => {
            return <img src={imgSrc} style={{ width: 55, height: 55 }} />;
          },
        },
        {
          title: '商品名称',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '商品条码',
          key: 'sn',
          dataIndex: 'sn',
        },
        {
          title: '单位',
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: '单价',
          key: 'price',
          dataIndex: 'price',
        },
        {
          title: '数量',
          key: 'returnNum',
          dataIndex: 'returnNum',
        },
        {
          title: '小计',
          key: 'subtotal',
          dataIndex: 'subtotal',
        },
      ];
      return (
        <Table
          dataSource={order.backGoodsList}
          pagination={false}
          columns={orderGoodsColumns}
          rowKey={record => record.id}
        />
      );
    };
    const supplierSuggestOptions = supplierSuggests.map(supplierSuggest => (
      <Option value={supplierSuggest.id}>{supplierSuggest.name}</Option>
    ));
    return (
      <PageHeaderLayout title="采购售后应收" className={styles.addPageHeader}>
        <Card bordered={false}>
          <Tabs onChange={this.handleChangeTab} activeKey={activeKey}>
            <TabPane tab="正常售后" key="1">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <Row type="flex" align="middle">
                  <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'orderStatus')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择售后单状态"
                    >
                      <Option value={[2,5]}>全部售后单状态</Option>
                      {
                        Object.keys(orderStatusMap).map((orderStatusId) => {
                          return (
                            <Option value={orderStatusId}>{orderStatusMap[orderStatusId]}</Option>
                          );
                        })
                      }
                    </Select>
                    <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'payType')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择收款方式"
                    >
                      <Option value={-1}>全部</Option>
                      {
                        Object.keys(payTypeMap).map((payTypeId) => {
                          return (
                            <Option value={payTypeId}>{payTypeMap[payTypeId]}</Option>
                          );
                        })
                      }
                    </Select>
                    <Search
                      className={globalStyles['input-sift']}
                      placeholder="请输入采购单号/退单号"
                      onChange={this.handleSearchOrderList.bind(this,'keywords')}
                      onSearch={this.handleSearchItems.bind(this,'keywords')}
                    />
                    <AutoComplete
                      className={globalStyles['input-sift']}
                      placeholder="请输入供应商"
                      value={supplierKeywords}
                      dataSource={supplierSuggestOptions}
                      onSearch={this.handleChangeSupplierKeywords}
                      onSelect={this.handleSelectSupplier.bind(this,'supplierId')}
                    >
                      <Search />
                    </AutoComplete>
                    <Select
                      className={globalStyles['select-sift']}
                      placeholder="全部售后单类型"
                      onChange={this.handleChangeSiftItem.bind(this,'orderType')}
                    >
                      <Option key={-1}>全部售后单类型</Option>
                      {
                        Object.keys(orderTypeMap).map((orderTypeId) => {
                          return <Option key={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>;
                        })
                      }
                    </Select>
                    <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'purchaser')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择采购员"
                    >
                      <Option value={-1}>全部采购员</Option>
                      {
                        Object.keys(purchaserMap).map((purchaserId) => {
                          return (
                            <Option value={purchaserId}>{purchaserMap[purchaserId]}</Option>
                          );
                        })
                      }
                    </Select>
                  </Row>
                  <Row>
                    创建时间：
                    <RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'date')}
                      value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                      format="YYYY-MM-DD"
                    />
                    财务收款时间：
                    <RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'receiveAmountTime')}
                      value={[receiveAmountTimeStart ? moment(receiveAmountTimeStart, 'YYYY-MM-DD') : '', receiveAmountTimeEnd ? moment(receiveAmountTimeEnd, 'YYYY-MM-DD') : '']}
                      format="YYYY-MM-DD"
                    />
                  </Row>
                </div>
                <Table
                  bordered
                  expandedRowRender={expandGoodsTable}
                  dataSource={backOrderList}
                  columns={[...normalColumns,...commonColumns]}
                  className={globalStyles.tablestyle}
                  // loading={isLoading}
                  rowKey={record => record.id}
                  pagination={{
                    total:+total,
                    current: curPage,
                    pageSize,
                    showSizeChanger: true,
                    onChange: this.handleChangeCurPage.bind(this,'curPage'),
                    onShowSizeChange: this.handleChangePageSize.bind(this,'pageSize'),
                    showTotal:total => `共 ${total} 个结果`,
                  }}
                />
              </div>
            </TabPane>
            <TabPane tab="开票后售后" key="2">
            <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <Row type="flex" align="middle">
                    <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'invoicedOrderStatus')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择退单状态"
                    >
                      <Option value={[2,5]}>全部退单状态</Option>
                      {
                        Object.keys(orderStatusMap).map((orderStatusId) => {
                          return (
                            <Option value={orderStatusId}>{orderStatusMap[orderStatusId]}</Option>
                          );
                        })
                      }
                    </Select>
                    <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'invoicedPayType')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择收款方式"
                    >
                      <Option value={-1}>全部收款方式</Option>
                      {
                        Object.keys(payTypeMap).map((payTypeId) => {
                          return (
                            <Option value={payTypeId}>{payTypeMap[payTypeId]}</Option>
                          );
                        })
                      }
                    </Select>
                    <Search
                      className={globalStyles['input-sift']}
                      placeholder="请输入采购单号/退单号"
                      onChange={this.handleSearchOrderList.bind(this,'invoicedKeywords')}
                      onSearch={this.handleSearchItems.bind(this,'invoicedKeywords')}
                    />
                    <AutoComplete
                      className={globalStyles['input-sift']}
                      placeholder="请输入供应商"
                      value={supplierKeywords}
                      dataSource={supplierSuggestOptions}
                      onSearch={this.handleChangeSupplierKeywords.bind(this)}
                      onSelect={this.handleSelectSupplier.bind(this,'invoicedSupplierId')}
                    >
                      <Search />
                    </AutoComplete>
                    <Select
                      className={globalStyles['select-sift']}
                      placeholder="全部售后单类型"
                      onChange={this.handleChangeSiftItem.bind(this,'invoicedOrderType')}
                    >
                      <Option key={-1}>全部售后单类型</Option>
                      {
                        Object.keys(orderTypeMap).map((orderTypeId) => {
                          return <Option key={orderTypeId}>{orderTypeMap[orderTypeId]}</Option>;
                        })
                      }
                    </Select>
                    <Select
                      className={globalStyles['select-sift']}
                      placeholder="请选择发票库存状态"
                      onChange={this.handleChangeSiftItem.bind(this,'invStockStatus')}
                    >
                      <Option key={-1}>全部发票库存状态</Option>
                      {
                        Object.keys(reduceInvStockMap).map((item) => {
                          return <Option key={item}>{reduceInvStockMap[item]}</Option>;
                        })
                      }
                    </Select>
                    <Search
                      className={globalStyles['input-sift']}
                      placeholder="请输入关联来票号"
                      onChange={this.handleSearchOrderList.bind(this,'inInvFollowSn')}
                      onSearch={this.handleSearchItems.bind(this,'inInvFollowSn')}
                    />
                    <Select
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'invoicedPurchaser')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择采购员"
                    >
                      <Option value={-1}>全部采购员</Option>
                      {
                        Object.keys(purchaserMap).map((purchaserId) => {
                          return (
                            <Option value={purchaserId}>{purchaserMap[purchaserId]}</Option>
                          );
                        })
                      }
                    </Select>
                  </Row>
                  <Row>
                    创建时间：
                    <RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'invoicedDate')}
                      value={[invoicedStartDate ? moment(invoicedStartDate, 'YYYY-MM-DD') : '', invoicedEndDate ? moment(invoicedEndDate, 'YYYY-MM-DD') : '']}
                      format="YYYY-MM-DD"
                    />
                    财务收款时间：
                    <RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeDate.bind(this,'invoicedReceiveAmountTime')}
                      value={[invoicedReceiveAmountTimeStart ? moment(invoicedReceiveAmountTimeStart, 'YYYY-MM-DD') : '', invoicedReceiveAmountTimeEnd ? moment(invoicedReceiveAmountTimeEnd, 'YYYY-MM-DD') : '']}
                      format="YYYY-MM-DD"
                    />
                  </Row>
                </div>
                <Table
                  bordered
                  expandedRowRender={expandGoodsTable}
                  dataSource={invoicedBackOrderList}
                  columns={[...normalColumns,...invoicedColumns,...commonColumns]}
                  className={globalStyles.tablestyle}
                  // loading={isLoading}
                  rowKey={record => record.id}
                  pagination={{
                    total:+InvoicedTotal,
                    current: invoicedCurPage,
                    pageSize: invoicedPageSize,
                    showSizeChanger: true,
                    onChange: this.handleChangeCurPage.bind(this,'invoicedCurPage'),
                    onShowSizeChange: this.handleChangePageSize.bind(this,'invoicedPageSize'),
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
        <Modal 
          title="提示"
          visible={showModal}
          onOk={this.handleConfirmCheck}
          onCancel={this.handleCloseModal}
          maskClosable={false}
          >
              该售后单关联的发票库存确认是否已还原？
          </Modal>
      </PageHeaderLayout>
    );
  }
}
