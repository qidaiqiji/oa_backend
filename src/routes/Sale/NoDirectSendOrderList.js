import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Card, Input, Modal, Table, Icon, Tooltip, DatePicker, Button, Select } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './NoDirectSendOrderList.less';
import globalStyles from '../../assets/style/global.less';

const { RangePicker } = DatePicker;

@connect(state => ({
  noDirectSendOrderList: state.noDirectSendOrderList,
}))
export default class noDirectSendOrderList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/getOrderList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/unmount',
    });
  }
  // 换页回调
  handleChangePage = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/getOrderList',
      payload: {
        currentPage: page,
      },
    });
  }
  // change
  handleChange = (e) => {
    const { dispatch } = this.props;
    const { value, id } = e.target;
    switch (id) {
      case 'consignee':
        dispatch({
          type: 'noDirectSendOrderList/changeConsignee',
          payload: {
            consignee: value,
          },
        });
        break;
      case 'sumOrderNum':
        dispatch({
          type: 'noDirectSendOrderList/changeSumOrderNum',
          payload: {
            sumOrderNum: value,
          },
        });
        break;
      case 'address':
        dispatch({
          type: 'noDirectSendOrderList/changeAddress',
          payload: {
            address: value,
          },
        });
        break;
      default:
        break;
    }
  }
  // change 日期
  handleChangeDate = (dates, dateStrings) => {
    const { dispatch } = this.props;
    // const [startDate, endDate] = [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')];
    dispatch({
      type: 'noDirectSendOrderList/getOrderList',
      payload: {
        startDate:dateStrings[0],
        endDate:dateStrings[1],
        currentPage:1,
      },
    });
  }
  handleSearchOrderList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/getOrderList',
      payload:{
        currentPage:1,
      }
    });
  }
  // 修改备注
  handleChangeRemarkInput = (e) => {
    const { dispatch } = this.props;
    const { value, id } = e.target;
    dispatch({
      type: 'noDirectSendOrderList/changeRemarkInput',
      payload: {
        remark: value,
        recId: id,
      },
    });
  }
  handleClickResetButton = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/reset',
    });
  }
  // 点击订单备注弹出修改备注的弹窗
  handleClickOrderRemark(orderRemark, orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/clickOrderRemark',
      payload: {
        orderRemark,
        orderId,
      },
    });
  }
  cancelRejectStatus(orderRemark, orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/clickOrderRemark',
      payload: {
        orderRemark,
        orderId,
      },
    });
  }
  handleClickCancelRemarkButton = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/clickCancleRemarkButton',
    });
  }
  handleChangeOrderRemarkInput = (e) => {
    const { dispatch } = this.props;
    const { value, id } = e.target;
    dispatch({
      type: 'noDirectSendOrderList/changeOrderRemark',
      payload: {
        orderRemark: value,
        orderId: id,
      },
    });
  }
  handleClickOkRemarkButton = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/clickOkRemarkButton',
    });
  }
  handleSearch=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'noDirectSendOrderList/getOrderList',
      payload: {
        isReject: e,
        currentPage: 1,
      },
    });
  }
  render() {
    const {
      noDirectSendOrderList: {
        // ------ 搜索项
        // 总单号
        sumOrderNum,
        // 创建开始日期
        startDate,
        // 创建结束日期
        endDate,
        // 收货人
        consignee,
        // 收货地址
        address,

        // ------ UI 数据
        // 列表数据
        total,
        currentPage,
        // size,
        isLoadingList,
        orderList,

        // 选择修改备注的行id
        orderId,
        orderRemark,

        isShowRemarkConfirm,
        isRemarking,

        outStoreRemark,
      },
    } = this.props;
    // table 的列头数据
    const columns = [
      {
        title: '总单号',
        dataIndex: 'sumNo',
        key: 'sumNo',
        width: 220,
        render: (sumNo, record) => {
          const path = {
            pathname: `/sale/sale-order/sale-order-list/sale-order-detail/${record.groupId}`,
            query: {
              id: record.id,
              status: 'sumNo',
            },
          };
          return (
            <Link to={path}>
              <a>{sumNo}</a>
            </Link>
          );
        },
      },
      {
        title: '子单号',
        dataIndex: 'subNo',
        key: 'subNo',
        width: 220,
        render: (subNo, record) => {
          const path = {
            pathname: `/sale/sale-order/sale-order-list/sale-order-detail/${record.groupId}`,
            query: {
              id: record.id,
              status: 'subNo',
            },
          };
          return (            
            <div>
              <Link to={path}>
                <a>{subNo}</a>                
              </Link>  
              <Tooltip title={record.rejectRemark}>
                {+record.isReject?(<p style={{ color: '#fff', margin: 0, background: 'blue', fontSize: 12, width:50 }}>售中驳回</p>):null}
              </Tooltip>           
            </div>
          )
        },
      },
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
        width: 150,
      },
      {
        title: '收货人信息',
        dataIndex: 'consigneeName',
        width: 220,
        render: (consigneeName, record) => {
          return consigneeName ? <span>{`${consigneeName}/${record.consigneeMobile}`}</span> : '';
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 350,
      },
      {
        title: '邮费政策',
        dataIndex: 'shippingName',
        key: 'shippingName',
        width: 200,
      },
      {
        title: '创建日期',
        dataIndex: 'dateTime',
        key: 'dateTime',
        width: 300,
      },
      {
        title: '订单总金额',
        dataIndex: 'totalFee',
        key: 'totalFee',
        width: 200,
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        width:160,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
        // className: styles.col,
        render: (remark, record) => {
          return (
            <Tooltip
              title={remark}
            >
              <a onClick={this.handleClickOrderRemark.bind(this, remark, record.id)}><span className={globalStyles['ellipsis-col']}><Icon type="edit" />{remark}</span></a>
            </Tooltip>
          );
        },
      },
      {
        title: '',
        dataIndex: 'afterSale',
        key: 'afterSale',
        width: 150,
        render: (_, record) => {
          return (
            record.isReject?(
              <Link to={{
                pathname: '/sale/sale-order/after-sale-order-list/after-sale-order-add',
                query: {
                  orderId: record.groupId,
                  userId: record.userId,
                  orderSn: record.sumNo,
                  },
                }}
              >
              <Button style={{ marginRight: 6 }}>售后</Button>
           </Link>
            ):null
         
          );
        },
      },
    ];
    const expendRenderGoods = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img style={{ width: 50, heihgt: 50 }} src={img} />;
          },
        },
        {
          title: '商品名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '商品编码',
          dataIndex: 'no',
          key: 'no',
        },
        {
          title: '商品数量',
          dataIndex: 'goodsNum',
          key: 'goodsNum',
        },
        {
          title: '待发数量',
          dataIndex: 'awaitNum',
          key: 'awaitNum',
        },
        {
          title: '是否含税',
          key: 'isTax',
          dataIndex: 'isTax',
          render: (isTax) => {
            return <span>{isTax ? '是' : '否'}</span>;
          },
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          render: (remark, record) => {
            return (
              <div>
                <Input
                  id={record.recId}
                  defaultValue={remark}
                  onPressEnter={this.handleChangeRemarkInput}
                />
              </div>
            );
          },
        },
        {
          title: '小计',
          dataIndex: 'subtotal',
          key: 'subtotal',
        },
      ];
      const { goods } = order;
      return (
        <Table
          bordered
          dataSource={goods}
          rowKey={record => record.id}
          columns={goodsColumns}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      );
    };
    return (
      <PageHeaderLayout title="非直发订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Row type="flex" align="middle">
              <Input
                placeholder="请输入收货人/手机号"
                onPressEnter={this.handleSearchOrderList}
                value={consignee}
                id="consignee"
                onChange={this.handleChange}
                className={globalStyles['input-sift']}
              />
              <Input
                placeholder="请输入总单号/子单号"
                onPressEnter={this.handleSearchOrderList}
                value={sumOrderNum}
                id="sumOrderNum"
                onChange={this.handleChange}
                className={globalStyles['input-sift']}
              />
              <Input
                placeholder="请输入收货地址"
                onPressEnter={this.handleSearchOrderList}
                value={address}
                id="address"
                onChange={this.handleChange}
                className={globalStyles['input-sift']}
              />
              <RangePicker
                value={[startDate ? moment(startDate, 'YYYY-MM-DD HH:mm') : '', endDate ? moment(endDate, 'YYYY-MM-DD HH:mm') : '']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeDate}
                className={globalStyles['rangePicker-sift']}
              />
              <Select 
              className={globalStyles['select-sift']}
              onChange={this.handleSearch}
              allowClear
              placeholder="是否为售中驳回"
               >
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="0">否</Select.Option>
              </Select>
            </Row>
            <Table
              bordered
              className={styles.table}
              loading={isLoadingList}
              rowKey={record => record.id}
              dataSource={orderList}
              columns={columns}
              // expandedRowKeys={[19810, 19809]}
              expandedRowRender={expendRenderGoods}
              onChange={this.handleTableChange}
              scroll={{ x: 1200 }}
              pagination={{
                current: currentPage,
                pageSize: 40,
                onChange: this.handleChangePage,
                // onShowSizeChange: this.handleChangePageSize,
                // showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
          </div>

          {/* 修改订单备注 */}
          <Modal
            title="修改订单备注"
            visible={isShowRemarkConfirm}
            onOk={this.handleClickOkRemarkButton}
            confirmLoading={isRemarking}
            onCancel={this.handleClickCancelRemarkButton}
          >
            <Row>
              <span>备注 : </span>
              <Input
                id={orderId}
                defaultValue={orderRemark}
                onChange={this.handleChangeOrderRemarkInput}
              />
            </Row>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
