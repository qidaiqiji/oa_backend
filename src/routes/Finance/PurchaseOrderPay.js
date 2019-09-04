import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Table, Input, Icon, DatePicker, Select, Tooltip, Dropdown, Menu } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseOrderPay.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
  purchaseOrderPay: state.purchaseOrderPay,
}))
export default class purchaseOrderPay extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/unmount',
    });
  }
  // 搜索事件
  handleSearchOrderList(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/getOrderList',
      payload: {
        keywords: value,
        curPage: 1,
      },
    });
  }
  // 日期选择搜索
  handleDateSearch(dates, datesString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/getOrderList',
      payload: {
        startDate: datesString[0],
        endDate: datesString[1],
        curPage: 1,
      },
    });
  }
  // 改变页码
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/getOrderList',
      payload: {
        curPage,
      },
    });
  }
  // 改变每页数据
  handleChangePageSize(curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/getOrderList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  // 选择审核状态
  // handleChangeReviewStatus(value) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'purchaseOrderPay/changeReviewStatus',
  //     payload: {
  //       status: value,
  //       curPage: 1,
  //     },
  //   });
  // }
  // 选择采购单类型
  handleChangePurchaseType(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrderPay/changePurchaseType',
      payload: {
        purchaseType: value,
        curPage: 1,
      },
    });
  }

  render() {
    const {
      purchaseOrderPay: {
        startDate,
        endDate,
        curPage,
        pageSize,
        total,
        isLoading,
        orderInfos,
        reviewStatusMap,
        purchaseTypeMap,
      },
    } = this.props;

    const columns = [
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <span>{reviewStatusMap[status]}</span>
        ),
      },
      {
        title: '应付货款单号',
        dataIndex: 'id',
        key: 'id',
        render: (orderTotalId, record) => {
          return [
            <Link to={`/purchase/purchase-order-management/purchase-apply-for-payment-list/purchase-apply-for-payment-detail/${record.id}`}>
              {orderTotalId}
            </Link>,
            record.isReject ?
              (
                <Tooltip title={record.rejectRemark}>
                  <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                </Tooltip>
              ) :
              null,
              record.isCredit?(<span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: 'red', fontSize: 12 }}>账期</span>):null
          ];
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        key: 'supplier',
      },
      {
        title: '应付总额',
        dataIndex: 'payTotalAmount',
        key: 'payTotalAmount',
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
        render: type => (
          <span>{purchaseTypeMap[type]}</span>
        ),
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
    // const expandGoodsTable = (order) => {
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
      const isShowExpanded = orderInfos.some(item=>item.isCredit===true);
      const columnsActive = isShowExpanded?{
        expandedRowRender:record=>
        (record.orderList.length>0?<Table
            dataSource={record.orderList}
            pagination={false}
            columns={orderPurchaseColumns}
            rowKey={record => record.id}
          />:null)
      }:{}
      // return (
      //   <Table
      //     dataSource={order.orderList}
      //     pagination={false}
      //     columns={orderPurchaseColumns}
      //     rowKey={record => record.id}
      //   />
      // );
    // };

    return (
      <PageHeaderLayout title="采购应付" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row>
                <Search
                  className={globalStyles['input-sift']}
                  style={{ width: 300 }}
                  enterButton="搜索"
                  placeholder="请输入采购单号/供应商"
                  onSearch={this.handleSearchOrderList.bind(this)}
                />
                <RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.handleDateSearch.bind(this)}
                  defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
                  format="YYYY-MM-DD"
                />
                {/* <Select
                  className={globalStyles['select-sift']}
                  // value={reviewStatusMap[reviewStatus]}
                  placeholder="审核状态"
                  onChange={this.handleChangeReviewStatus.bind(this)}
                >
                  <Option value="">全部</Option>
                  {
                    (Object.entries(reviewStatusMap).map((value) => {
                      return <Option key={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select> */}
                <Select
                  className={globalStyles['select-sift']}
                  // value={purchaseTypeMap[purchaseType]}
                  placeholder="采购单类型"
                  onChange={this.handleChangePurchaseType.bind(this)}
                >
                  <Option value="">全部</Option>
                  {
                    (Object.entries(purchaseTypeMap).map((value) => {
                      return <Option key={value[0]}>{value[1]}</Option>;
                    }))
                  }
                </Select>
              </Row>
            </div>

            <Table
              bordered
              {...columnsActive}
              // expandedRowRender={expandGoodsTable}
              dataSource={orderInfos}
              columns={columns}
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
