import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Table, Input, Icon, DatePicker, Select, Tooltip, Dropdown, Menu, Button  } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseApplyForPaymentList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  purchaseApplyForPaymentList: state.purchaseApplyForPaymentList,
}))
export default class purchaseApplyForPaymentList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/unmount',
    });
  }
  // 事件
  handleSearchOrderList(value) {
    const { dispatch, purchaseApplyForPaymentList } = this.props;
    const { startDate, endDate } = purchaseApplyForPaymentList;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        keywords: value,
        startDate,
        endDate,
        curPage: 1,
        pageSize: 40,
      },
    });
  }
  // 日期选择搜索
  dateSearchOnChange = (dates, datesString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        startDate: datesString[0],
        endDate: datesString[1],
      },
    });
  }
  handleChangePayTime=(dates, datesString)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        payTimeStart: datesString[0],
        payTimeEnd: datesString[1],
      },
    });
  }
  // 改变页码
  handleChangeCurPage(curPage) {
    const { dispatch, purchaseApplyForPaymentList } = this.props;
    const { keywords, startDate, endDate, pageSize } = purchaseApplyForPaymentList;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        keywords,
        startDate,
        endDate,
        pageSize,
        curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(curPage, pageSize) {
    const { dispatch, purchaseApplyForPaymentList } = this.props;
    const { keywords, startDate, endDate } = purchaseApplyForPaymentList;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        keywords,
        startDate,
        endDate,
        curPage: 1,
        pageSize,
      },
    })
  }
  // 选择审核状态
  handleChangeReviewStatus(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        status: value,
        curPage: 1,
      },
    });
  }
  // 选择采购单类型
  handleChangePurchaseType(type,value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        [type]: value,
        curPage: 1,
      },
    });
  
    
  }
  handleChangeKeyWords=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getConfigReducer',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseApplyForPaymentList/getOrderList',
      payload: {
        [type]: "",
      },
    });
  }
  render() {
    const {
      purchaseApplyForPaymentList: {
        startDate,
        endDate,
        curPage,
        pageSize,
        total,
        isLoading,
        orderInfos,
        statusMap,
        purchaseTypeMap,
        applicationTypeMap,
        payTimeStart,
        payTimeEnd,
        actionList,
        purchaserMap,
        keywords,
        goodsKeywords,
        goodsSn,
        selectStatusMap,
      },
    } = this.props;
    const columns = [
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <span>{statusMap[status]}</span>
        ),
      },
      {
        title: '应付货款单号',
        dataIndex: 'id',
        key: 'id',
        width:100,
        render: (orderTotalId, record) => {
          return [
            <Link to={`/purchase/purchase-order-management/purchase-apply-for-payment-list/purchase-apply-for-payment-detail/${record.id}`}>
              {orderTotalId}
            </Link>,
            <p style={{margin:0,width:100}}>
              {
                record.isReject ?
                (
                  <Tooltip title={record.rejectTag&&record.rejectTag.map(item=>{
                    return `${item.title}: ${item.remark}`;
                  })}>
                    <span style={{ color: '#fff', marginRight: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                  </Tooltip>
                ) :
                null
              }
              {/* {
                record.isCredit?(<span style={{ color: '#fff', marginRight: 5, padding: '2px 5px', backgroundColor: 'red', fontSize: 12 }}>账期</span>):null
              } */}
              {
                record.tag.map(item=>(
                  <span style={{backgroundColor:item.color}} className={globalStyles.tag} key={item}>{item.name}</span>
                ))
              }
            </p>
            ];
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        key: 'supplier',
        width:200,
        render:(supplier)=>{
          return <p style={{margin:0, width:200}} className={globalStyles.twoLine}>{supplier}</p>
        }
      },
      {
        title: '应付总额',
        dataIndex: 'payTotalAmount',
        key: 'payTotalAmount',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '采购单类型',
        dataIndex: 'purchaseType',
        key: 'purchaseType',
        render: (purchaseType,record) => {
          return (
            record.isCredit?purchaseType.map(item=>{
              return <div>{purchaseTypeMap[item]}</div>}
            ):<span>{purchaseTypeMap[purchaseType]}</span>

            // <span>{purchaseTypeMap[purchaseType]}</span>
          )
        },
      },
      {
        title: '支付账户信息',
        dataIndex: 'payInfo',
        key: 'payInfo',
        width:220,
        render:(payInfo)=>{
          return <Tooltip 
              title={payInfo}
              placement="topLeft"
          >
              <p style={{margin: 0, width:220}} className={globalStyles.twoLine}>{payInfo}</p>
          </Tooltip>
        }
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
        key: 'operation',
        dataIndex: 'operation',
        render: (_, record) => (
          <Dropdown
            placement="bottomCenter"
            overlay={(
              <Menu>
                <Menu.Item>
                  <Link to={`/purchase/purchase-order-management/purchase-apply-for-payment-list/purchase-apply-for-payment-detail/${record.id}`}>
                    <Icon type="bars" />详情
                  </Link>
                </Menu.Item>
              </Menu>
            )}
          >
            <Icon type="ellipsis" />
          </Dropdown>
        ),
      },
    ];
    const orderPurchaseColumns = [
          {
            title: '采购单号',
            dataIndex: 'sn',
            key: 'sn',
            width: 150,
            render: (sn, record) => {
              const url = record.isCommon ? `/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${record.id}` : `/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.id}`;
              return (
                <Link to={url}>
                  <a>{sn}</a>
                </Link>
              );
            },
          },
          {
            title: '收件人',
            key: 'consignee',
            dataIndex: 'consignee',
          },
          {
            title: '采购总额',
            key: 'purchaseAmount',
            dataIndex: 'purchaseAmount',
          },
          {
            title: '采购员',
            key: 'purchaser',
            dataIndex: 'purchaser',
          },
          {
            title: '采购单时间',
            key: 'purchaseTime',
            dataIndex: 'purchaseTime',
          },
        ];
    const isShowExpanded = orderInfos.some(item=>+item.isCredit!==1);
    const columnsActive = isShowExpanded?{
      expandedRowRender:record=>
      (record.orderList.length>0?<Table
          dataSource={record.orderList}
          pagination={false}
          columns={orderPurchaseColumns}
          rowKey={record => record.id}
        />:null)
    }:{}
    // const expandGoodsTable = (order) => {
    //   const orderPurchaseColumns = [
    //     {
    //       title: '采购单号',
    //       dataIndex: 'sn',
    //       key: 'sn',
    //       width: 150,
    //       render: (sn, record) => {
    //         const url = record.isCommon ? `/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${record.id}` : `/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.id}`;
    //         return (
    //           <Link to={url}>
    //             <a>{sn}</a>
    //           </Link>
    //         );
    //       },
    //     },
    //     {
    //       title: '收件人',
    //       key: 'consignee',
    //       dataIndex: 'consignee',
    //     },
    //     {
    //       title: '采购总额',
    //       key: 'purchaseAmount',
    //       dataIndex: 'purchaseAmount',
    //     },
    //     {
    //       title: '采购员',
    //       key: 'purchaser',
    //       dataIndex: 'purchaser',
    //     },
    //     {
    //       title: '采购单时间',
    //       key: 'purchaseTime',
    //       dataIndex: 'purchaseTime',
    //     },
    //   ];
    //   return (
    //     <Table
    //       dataSource={order.orderList}
    //       pagination={false}
    //       columns={orderPurchaseColumns}
    //       rowKey={record => record.id}
    //     />
    //   );
    // };

    return (
      <PageHeaderLayout title="货款申请表" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row type="flex">
                <Search
                  className={globalStyles['input-sift']}
                  style={{ width: 300 }}
                  // enterButton="搜索"
                  placeholder="请输入采购单号/供应商"
                  onChange={this.handleChangeKeyWords.bind(this,"keywords")}
                  onSearch={this.handleSearchOrderList.bind(this)}
                  value={keywords}
                  suffix={keywords?<ClearIcon 
                      handleClear={this.handleClear.bind(this,"keywords")}
                  />:""}
                />
                {/* <RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.dateSearchOnChange}
                  defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
                  format="YYYY-MM-DD"
                /> */}
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="审核状态"
                  style={{width:200}}
                  onChange={this.handleChangeReviewStatus.bind(this)}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="">全部审核状态</Option>
                  {
                    (Object.entries(selectStatusMap).map((value) => {
                      return <Option key={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="采购单类型"
                  style={{width:200}}
                  onChange={this.handleChangePurchaseType.bind(this,"purchaseType")}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value={-1}>全部采购单类型</Option>
                  {
                    (Object.entries(purchaseTypeMap).map((value) => {
                      return <Option key={+value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="货款单类型"
                  style={{width:200}}
                  onChange={this.handleChangePurchaseType.bind(this,"purchasePayOrderType")}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="">货款单类型</Option>
                  {
                    (Object.entries(applicationTypeMap).map((value) => {
                      return <Option key={+value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                <Select
                  className={globalStyles['select-sift']}
                  placeholder="采购员"
                  style={{width:250}}
                  onChange={this.handleChangePurchaseType.bind(this,"purchaser")}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="">全部</Option>
                  {
                    (Object.entries(purchaserMap).map((value) => {
                      return <Option key={+value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
                {
                  actionList.map(item=>{
                    return <a href={item.url} target="_blank" style={{display:"inline-block",marginLeft:40}}><Button type="primary">{item.name}</Button></a>
                  })
                }
              </Row>
              <Row style={{marginTop:10}}>
                
                  <Search
                  className={globalStyles['input-sift']}
                  placeholder="商品名称/品牌名称"
                  onChange={this.handleChangeKeyWords.bind(this,"goodsKeywords")}
                  onSearch={this.handleChangePurchaseType.bind(this,"goodsKeywords")}
                  value={goodsKeywords}
                  suffix={goodsKeywords?<ClearIcon 
                      handleClear={this.handleClear.bind(this,"goodsKeywords")}
                  />:""}
                  >

                  </Search>
                  <Search
                  className={globalStyles['input-sift']}
                  placeholder="条码"
                  onChange={this.handleChangeKeyWords.bind(this,"goodsSn")}
                  onSearch={this.handleChangePurchaseType.bind(this,"goodsSn")}
                  value={goodsSn}
                  suffix={goodsSn?<ClearIcon 
                      handleClear={this.handleClear.bind(this,"goodsSn")}
                  />:""}
                  >

                  </Search>
                  付款时间：
                  <RangePicker
                    className={globalStyles['rangePicker-sift']}
                    onChange={this.handleChangePayTime}
                    defaultValue={[payTimeStart?moment(payTimeStart, 'YYYY-MM-DD'):null, payTimeEnd?moment(payTimeEnd, 'YYYY-MM-DD'):""]}
                    format="YYYY-MM-DD"
                  />
                  货款申请时间：
                  <RangePicker
                    className={globalStyles['rangePicker-sift']}
                    onChange={this.dateSearchOnChange}
                    defaultValue={[startDate?moment(startDate, 'YYYY-MM-DD'):null, endDate?moment(endDate, 'YYYY-MM-DD'):""]}
                    format="YYYY-MM-DD"
                  />
                  
              </Row>
            </div>

            <Table
              {...columnsActive}
              bordered
              dataSource={orderInfos}
              columns={columns}
              className={globalStyles.tablestyle}
              loading={isLoading}
              rowKey={record => record.id}
              rowClassName={record => record.orderList && record.orderList.length === 0? styles['noExpand']:null}
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
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
