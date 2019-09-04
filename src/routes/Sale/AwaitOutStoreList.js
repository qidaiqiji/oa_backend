import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Table, Icon, Tooltip, DatePicker, Popconfirm } from 'antd';
import { Link } from 'dva/router';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitOutStoreList.less';
import globalStyles from '../../assets/style/global.less';

const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
  awaitOutStoreList: state.awaitOutStoreList,
}))
export default class AwaitOutStoreList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
    });
    dispatch({
      type: 'awaitOutStoreList/getConfig',
      payload: {},
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/unmount',
    });
  }
  // 换页回调
  handleChangePage = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        currentPage: page,
      },
    });
  }
  handleChangePageSize=(_,pageSize)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        pageSize,
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
          type: 'awaitOutStoreList/changeConsigneeReducer',
          payload: {
            consignee: value,
          },
        });
        break;
      case 'sumOrderNum':
        dispatch({
          type: 'awaitOutStoreList/changeSumOrderNum',
          payload: {
            sumOrderNum: value,
          },
        });
        break;
      case 'address':
        dispatch({
          type: 'awaitOutStoreList/changeAddress',
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
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        currentPage: 1,
        startDate:dateStrings[0],
        endDate:dateStrings[1],
      },
    });
  }

  // 选择行
  handleSelectRows = (selectedRowIds) => {
    this.props.dispatch({
      type: 'awaitOutStoreList/clickRows',
      payload: {
        selectedRowIds,
      },
    });
  }
  handleClickGenButton = () => {
    this.props.dispatch({
      type: 'awaitOutStoreList/clickGenButton',
    });
  }
  handleClickCancelGenButton = () => {
    this.props.dispatch({
      type: 'awaitOutStoreList/clickCancelGenButton',
    });
  }
  handleClickOkGenButton = () => {
    const { dispatch, awaitOutStoreList } = this.props;
    const { currentPage, sumOrderNum, startDate, endDate, consignee, selectedRowIds, orderList, outStoreRemark } = awaitOutStoreList;

    dispatch({
      type: 'awaitOutStoreList/clickOkGenButton',
      payload: {
        outStoreRemark,
        selectedRowIds,
        orderList,
        searchOptions: {
          currentPage,
          sumOrderNum,
          startDate,
          endDate,
          consignee,
        },
      },
    });
  }
  handleSearchOrderList = () => {
    const { dispatch, awaitOutStoreList } = this.props;
    const { currentPage, sumOrderNum, startDate, endDate, consignee, address } = awaitOutStoreList;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        currentPage: 1,
        sumOrderNum,
        startDate,
        endDate,
        consignee,
        address,
      },
    });
  }
  // 修改备注
  handleChangeRemarkInput = (e) => {
    const { dispatch } = this.props;
    const { value, id } = e.target;
    dispatch({
      type: 'awaitOutStoreList/changeRemarkInput',
      payload: {
        remark: value,
        recId: id,
      },
    });
  }
  handleClickResetButton = () => {
    const { dispatch, awaitOutStoreList } = this.props;
    dispatch({
      type: 'awaitOutStoreList/reset',
    });
  }
  // 点击订单备注弹出修改备注的弹窗
  handleClickOrderRemark(orderRemark, orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/clickOrderRemark',
      payload: {
        orderRemark,
        orderId,
      },
    });
  }
  handleClickCancelRemarkButton = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/clickCancleRemarkButton',
    });
  }
  handleChangeOrderRemarkInput = (e) => {
    const { dispatch } = this.props;
    const { value, id } = e.target;
    dispatch({
      type: 'awaitOutStoreList/changeOrderRemark',
      payload: {
        orderRemark: value,
        orderId: id,
      },
    });
  }
  handleClickOkRemarkButton = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/clickOkRemarkButton',
    });
  }
  handleChangeOutStoreRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/changeOutStoreRemark',
      payload: {
        outStoreRemark: e.target.value,
      },
    });
  }
  handleTriggerDelay(id) {
    const { dispatch } = this.props;
    console.log(id);
    dispatch({
      type: 'awaitOutStoreList/cancelDelay',
      payload: {
        orderId: id,
      },
    });
  }
  // 按销售员筛选
  handleChangeSeller=(id)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        seller: id,
        currentPage: 1,
      }
    })
  }
  // 按合成状态筛选
  handleChangeMergeStatus=(status)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitOutStoreList/getOrderList',
      payload: {
        status: status,
        currentPage: 1,
      }
    })
  }
  render() {
    const {
      awaitOutStoreList: {
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
        pageSize,
        // size,
        isLoadingList,
        orderList,
        // 选择的行 id
        selectedRowIds,

        // 选择修改备注的行id
        orderId,
        orderRemark,

        isShowGenConfirm,
        isGening,

        isShowRemarkConfirm,
        isRemarking,

        outStoreRemark,
        // 销售员筛选项
        sellerMap,
        // 合成状态筛选项
        mergeStatusMap

      },
    } = this.props;

    // table 的列头数据
    const columns = [
      {
        title: '总单号',
        dataIndex: 'sumNo',
        key: 'sumNo',
        width: 200,
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
        width: 200,
        render: (subNo, record) => {
          const path = {
            pathname: `/sale/sale-order/sale-order-list/sale-order-detail/${record.groupId}`,
            query: {
              id: record.id,
              status: 'subNo',
            },
          };
          return (
            <Link to={path}>
              {(+record.isDelayShipping === 1) ? <span className={styles.delayTag} >延迟</span> : ''}
              <a>{subNo}</a>
            </Link>
          );
        },
      },
      {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (status) => {
          switch (status) {
            case 2:
              return '不可合成';
            case 1:
              return '已合成';
            case 0:
              return '待合成';
            default:
              return '错误状态';
          }
        },
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
        width: 380,
      },
      {
        title: '销售员',
        dataIndex: 'seller',
        key: 'seller',
        width: 200,
      },
      {
        title: '订单总金额',
        dataIndex: 'totalFee',
        key: 'totalFee',
        width: 200,
      },
      {
        title: '出库单号',
        dataIndex: 'storeNo',
        width: 200,
        render: storeNo => (storeNo || '无'),
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
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 150,
        // className: styles.col,
        render: (_, record) => {
          const path = {
            pathname: `/sale/sale-order/sale-order-list/sale-order-detail/${record.groupId}`,
            query: {
              id: record.id,
              status: record.sumNo,
            },
          };
          return (
            <div>
              <Link to={path}>
                查看详情
              </Link>
              {(+record.isDelayShipping === 1) ?
                <Popconfirm
                  title="请确认是否取消延迟?"
                  onConfirm={this.handleTriggerDelay.bind(this, record.id)}
                >
                  <span style={{ color: '#008000', cursor: 'pointer' }}>取消延迟</span>
                </Popconfirm> : ''
              }
            </div>
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
            return <img style={{ width: 50, heihgt: 50 }} src={img}/>;
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
      <PageHeaderLayout title="待出库列表">
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
                placeholder="销售员"
                onChange={this.handleChangeSeller}
              >
                {
                  Object.keys(sellerMap).map(id=>{
                    return <Option value={id}>{sellerMap[id]}</Option>
                  })
                }
              </Select>
              <Select
                className={globalStyles['select-sift']}
                placeholder="合成状态"
                onChange={this.handleChangeMergeStatus}
              >
                {
                  Object.keys(mergeStatusMap).map(id=>{
                    return <Option value={id}>{mergeStatusMap[id]}</Option>
                  })
                }

              </Select>
            </Row>
            <Table
              bordered
              title={() => {
                return (
                  <Row>
                    <Button type="primary" disabled={selectedRowIds.length === 0} onClick={this.handleClickGenButton}>
                      生成出库单
                    </Button>
                  </Row>
                );
              }}
              className={styles.table}
              loading={isLoadingList}
              rowKey={record => record.id}
              dataSource={orderList}
              columns={columns}
              rowClassName={(record) => {
                return (record.status === 0) ? '' : styles.disabledRow;
              }}
              rowSelection={{
                selectedRowKeys: selectedRowIds,
                onChange: this.handleSelectRows,
              }}
              // expandedRowKeys={[19810, 19809]}
              expandedRowRender={expendRenderGoods}
              onChange={this.handleTableChange}
              scroll={{ x: 1200 }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: this.handleChangePage,
                onShowSizeChange: this.handleChangePageSize,
                showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
          </div>

          {/* 生成出库单确认弹窗 */}
          <Modal
            title="确认"
            visible={isShowGenConfirm}
            onOk={this.handleClickOkGenButton}
            confirmLoading={isGening}
            onCancel={this.handleClickCancelGenButton}
          >
            <Input.TextArea
              placeholder="此处添加备注信息"
              style={{ width: 400, marginLeft: 37 }}
              value={outStoreRemark || null}
              onChange={this.handleChangeOutStoreRemark.bind(this)}
              autosize
            />
            <p style={{ textAlign: 'center' }}>请确认是否合成出库单</p>
          </Modal>
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
