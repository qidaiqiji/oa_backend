import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Input, Select, Button, Modal, Dropdown, Menu, AutoComplete, Table, Icon, Tooltip, Popconfirm, DatePicker } from 'antd';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
// import StandardTable from '../../components/StandardTable';
import { getUrl } from '../../utils/request';
import { stringify } from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseList.less';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
import ClearIcon from '../../components/ClearIcon';
const { Option } = Select;
const { Search } = Input;

@connect(state => ({
  commonPurchaseList: state.commonPurchaseList,
}))
export default class PurchaseList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
    });
    dispatch({
      type: 'commonPurchaseList/getConfig',
    }); 
  }
  
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/unmount',
    });
  }
  handleChangeSyncItem(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/changeSyncItem',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  // 换页回调
  handleChangePage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload: {
        curPage,
      },
    });
  }
  // 切换每页条数回调
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload: {
        pageSize,
        curPage: 1,
      },
    });
  }
  // 切换日期
  handleChangeDate(type,_, dateStrings) {
    const { dispatch } = this.props;
    switch(type) {
      case 'date':
        dispatch({
          type: 'commonPurchaseList/getList',
          payload: {
            startDate: dateStrings[0],
            endDate: dateStrings[1],
            curPage: 1,
          },
        });
      break;
      case 'payTime':
        dispatch({
          type: 'commonPurchaseList/getList',
          payload: {
            payTimeStart: dateStrings[0],
            payTimeEnd: dateStrings[1],
            curPage: 1,
          },
        });
      break;
    }
    dispatch({
      type: 'commonPurchaseList/changeDate',
      payload: {
        startDate: dateStrings[0],
        endDate: dateStrings[1],
        curPage: 1,
      },
    });
  }
  // 筛选订单状态
  handleChangeOrderStatus(type,e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload: {
        curPage: 1,
        [type]:e,
      },
    });
  }
  // 搜索入库单号
  handleSearchStoreNo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload: {
        curPage: 1,
      },
    });
  }
  // 选择行
  handleSelectRows(selectedRowKeys, selectedRows) {
    if (selectedRowKeys.length === 1 || selectedRowKeys.length === 0) {
      this.props.dispatch({
        type: 'commonPurchaseList/clickRows',
        payload: {
          selectedRows: selectedRowKeys,
          supplierName: selectedRowKeys.length === 1 ? selectedRows[0].supplier : '',
        },
      });
    } else {
      this.props.dispatch({
        type: 'commonPurchaseList/clickRows',
        payload: {
          selectedRows: selectedRowKeys,
        },
      });
    }
  }
  // 选择供应商
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload: {
        curPage: 1,
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
      type: 'commonPurchaseList/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }

  // 审核通过相关
  handleTriggerCheckModal(id, e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/triggerCheckModal',
      payload: {
        checkOrderId: id,
      },
    });
  }
  handleOkCheckModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/okCheckModal',
    });
  }

  // 驳回相关
  handleTriggerRejectModal(id, e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/triggerRejectModal',
      payload: {
        rejectOrderId: id,
      },
    });
  }
  // 确定驳回
  handleOkRejectModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/okRejectModal',
    });
  }

  // 删除订单相关
  handleTriggerDeleteModal(id, e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/triggerDeleteModal',
      payload: {
        deleteOrderId: id,
      },
    })
  }
  handleOkDeleteModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/okDeleteModal',
      payload: {
        curPage: 1,
      },
    });
  }

  // 打开关闭每一列的备注修改弹窗
  handleTriggerEditRemarkModal(orderId,e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/triggerEditRemarkModal',
      payload: {
        orderId,
      },
    });
  }
  // 确认修改备注
  handleOkEditRemarkModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/okEditRemarkModal',
    });
  }
  // change 每列的备注
  handleChangeOrderRemark(e) {
    e.persist();
    const { dispatch, commonPurchaseList } = this.props;
    const {  orderId, table } = commonPurchaseList;
    table.map(item=>{
      if(+item.id === +orderId){
        item.isChange=true;
        dispatch({
          type: 'commonPurchaseList/handleChangeOrderRemark',
          payload: {
            orderRemark:item.isChange?e.target.value:item.remark,
          },
        });       
      }
    })   
    
  }

  // show/close 申请货款弹窗
  handleTriggerApplyMoneyModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/triggerApplyMoneyModal',
    });
  }
  // 确认申请货款
  handleOkApplyMoneyModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/okApplyMoneyModal',
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseList/getList',
      payload:{
        [type]:""
      }
    });
  }

  render() {
    const {
      commonPurchaseList: {
        isTableLoading,
        table,
        supplierSuggest,
        total,
        supplierSearchText,
        selectedRows,
        isShowApplyMoneyModal,
        isApplying,
        isShowDeleteModal,
        isDeleting,
        isShowCheckModal,
        isChecking,
        isShowRejectModal,
        isRejecting,
        supplierName,
        // 修改备注
        isShowEditRemarkModal,
        isEditingRemark,
        orderRemark,

        purchaseOrderStatusMap,
        purchaserMap,
        paymentMethod,
        columnRemark,
        pageSize,
        curPage,
        supplierId,
        status,
        startDate,
        endDate,
        purchaseOrderId,
        storeNo,
        purchaser,
        payType,
        shippingStatus,
        brandListMap,
        purchaseOrderStatusListMap,
        purchaseShippingStatus,
        goodsSn,
        payTimeStart,
        payTimeEnd,
        isBack,
        brandId
      },
    } = this.props;
    // table 的列头数据
    const date = new Date();
    const exportUrl = `${getUrl(API_ENV)}/common/export-purchase-goods-list?${
      stringify({ 
        pageSize,
        curPage,
        supplierId,
        status,
        startDate,
        endDate,
        purchaseOrderId,
        storeNo,
        purchaser,
        payType,
        type:1,
        shippingStatus,
        isBack,
        brandId,
        goodsSn,
        payTimeStart,
        payTimeEnd,
      })
    }`;
    const columns = [
      {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        width:100,
        render:(status)=>{
          return <span>{purchaseOrderStatusMap[status]}</span>
        }
      },
      {
        title: '发货状态',
        dataIndex: 'shippingStatus',
        key: 'shippingStatus',
        width:100,
        render:(shippingStatus)=>{
          return <span>{purchaseShippingStatus[shippingStatus]}</span>
        }
      },
      {
        title: '采购单号',
        dataIndex: 'id',
        key: 'id',
        width: 150,
        render: (id, record) => {
          return <div>
            <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${id}`}>{id}</Link>
            <div>
              {
                record.tag.map(item=>(
                  item.name!="运费待归属"&&<Tooltip key={item} title={item.remark}>
                      <span style={{backgroundColor:item.color}} className={globalStyles.tag} >{item.name}</span>
                  </Tooltip>
                ))
              }
            </div>
          </div>
        }
          // [
          //   <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${id}`}>{id}</Link>,
          //   // 显示账期标签
          //   <div>
          //     {
          //       record.isCredit ?(<span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: 'pink', fontSize: 12 }}>账期</span>):null,
          //       record.isReject ?
          //         (
          //           <Tooltip title={record.rejectRemark}>
          //             <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: '#CA27FB', fontSize: 12 }}>驳回</span>
                      
          //           </Tooltip>
          //         ) :
          //         null
          //     }
          //   </div>
           
          // ]
        ,
      },
      {
        title: '预计发货时间',
        dataIndex: 'dropTime',
        key: 'dropTime',
        width: 110,
        render: (dropTime, record) => {         
          if (new Date(record.expectShippingDate) - new Date(date.getTime() - 24*60*60*1000) <= 0 ) {
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
        width: 100,
        render: (paymentTime, record) => {         
          if (new Date(record.expectPayTime) - new Date(date.getTime() - 24*60*60*1000) <=0 ) {
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
        width: 100,
      },
      {
        title: '入库单号',
        dataIndex: 'inStoreOrderNos',
        key: 'inStoreOrderNos',
        width: 150,
      },
      {
        title: '采购应付总额',
        dataIndex: 'money',
        key: 'money',
        width: 110,
        render: money => (
          <Tooltip title={money}>
            <span className={styles.col}>{money}</span>
          </Tooltip>
        ),
      },
      {
        title: '采购员',
        dataIndex: 'purchaser',
        key: 'purchaser',
      }, {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
        width:100,
      }, {
        title: '供应商',
        dataIndex: 'supplier',
        key: 'supplier',
      }, {
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
        width: 80,
        render: (op, record) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${record.id}`}>
                    <Icon type="search" /> 详情
                  </Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Icon type="ellipsis" />
          </Dropdown>
        ),
      },
    ];
    const expandTable = (order) => {
      const goodsColumns = [
        {
          title: '商品图',
          dataIndex: 'goodsThumb',
          key: 'goodsThumb',
          width: 100,
          render: (src, record) => (
            <img src={src} style={{ width: 51, height: 51 }} />
          ),
        },
        {
          title: '商品名',
          dataIndex: 'goodsName',
          key: 'goodsName',
        },
        {
          title: '商品编码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
        },
        {
          title: '采购数量',
          dataIndex: 'number',
          key: 'number',
        },
        {
          title: '零售价/单价/折扣',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          render: (_, record) => {
            return (
              <div>
                <span style={{ color: '#D50016' }}>{record.marketPrice}</span>
                /
                <span style={{ color: '#FF663F' }}>{record.shopPrice}</span>
                /
                <span style={{ color: '#00A5E3' }}>{record.saleDiscount}</span>
              </div>
            );
          },
        },
        {
          title: '采购单价/折扣',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          render: (_, record) => {
            return (
              <div>
                <span style={{ color: '#FF663F' }}>{record.purchasePrice}</span>
                /<span style={{ color: '#00A5E3' }}>{record.purchaseDiscount}</span>
              </div>
            );
          },
        },
        {
          title: '采购含税',
          dataIndex: 'purchaseIsTax',
          key: 'purchaseIsTax',
          render: purchaseIsTax => (
            <span>{purchaseIsTax ? '是' : '否'}</span>
          ),
        },
      ];
      return (
        <Table
          columns={goodsColumns}
          dataSource={order.goodsList}
          rowKey={record => record.id}
          bordered
          pagination={false}
          className={globalStyles.tablestyle}
        />
      );
    };
    return (
      <PageHeaderLayout title="采购订单列表"
      iconType="question-circle"
      tips={
        <div>
            <p>1.库存采购列表主要针对直发商品入库的采购</p>
            <p>2.采购员可在此页面进行建单/提交审核/申请货款/跟踪货物发货状态及审核状态等操作</p>
        </div>
        }
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row>
                <Select
                  // value={purchaseOrderStatusMap[status]}
                  placeholder="请选择审核状态"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeOrderStatus.bind(this,'status')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="0">全部审核状态</Option>
                  {Object.keys(purchaseOrderStatusListMap).map(key => (
                    <Option value={key}>{purchaseOrderStatusListMap[key]}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="请选择发货状态"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeOrderStatus.bind(this,'shippingStatus')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="-1">全部发货状态</Option>
                  {Object.keys(purchaseShippingStatus).map(key => (
                    <Option value={key}>{purchaseShippingStatus[key]}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="请选择采购员"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeOrderStatus.bind(this,'purchaser')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Option value={0}>全部采购员</Option>
                  {Object.keys(purchaserMap).map((id) => {
                    return <Option value={id}><Tooltip title={purchaserMap[id]}>
                        {purchaserMap[id]}
                      </Tooltip></Option>;
                  })}
                </Select>
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入入库单号"
                  value={storeNo}
                  onSearch={this.handleSearchStoreNo.bind(this)}
                  onChange={this.handleChangeSyncItem.bind(this, 'storeNo')}
                  suffix={storeNo?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"storeNo")}
                />:""} 
                />
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入采购单号"
                  onSearch={this.handleSearchStoreNo.bind(this)}
                  onChange={this.handleChangeSyncItem.bind(this, 'purchaseOrderId')}
                  value={purchaseOrderId}
                  suffix={purchaseOrderId?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"purchaseOrderId")}
                  />:""} 
                />
                <AutoComplete
                  dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                    return (
                      <Option value={suggest.id.toString()}>{suggest.name}</Option>
                    );
                  })}
                  onSelect={this.handleSelectSupplier.bind(this)}
                  onSearch={this.handleChangeSupplier.bind(this)}
                  className={globalStyles['input-sift']}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Search
                    placeholder="请输入供应商"
                    value={supplierSearchText}
                  />
                </AutoComplete>
                <Select
                  placeholder="支付类型"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeOrderStatus.bind(this,'payType')}  
                  dropdownMatchSelectWidth={false}
                  allowClear
                >                  
                  {Object.keys(paymentMethod).map((id) => {
                    return <Option value={id}>{paymentMethod[id]}</Option>;
                  })}
                </Select>
                
              </Row>
              <Row>
                采购时间：
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                  onChange={this.handleChangeDate.bind(this,"date")}
                />
                <Select
                placeholder="请选择品牌名"
                style={{width:300,marginRight:10}}
                onChange={this.handleChangeOrderStatus.bind(this,"brandId")}
                showSearch
                dropdownMatchSelectWidth={false}
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                <Select.Option value={""}>全部</Select.Option>
                  {
                    brandListMap.map(item => (
                      <Select.Option value={item.id}>{item['value']}</Select.Option>
                    ))
                  }
                </Select>
                <Input.Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入条码"
                  onSearch={this.handleSearchStoreNo.bind(this)}
                  onChange={this.handleChangeSyncItem.bind(this, 'goodsSn')}
                  value={goodsSn}
                  suffix={goodsSn?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"goodsSn")}
                  />:""} 
                />
                <Select
                  placeholder="是否售后"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeOrderStatus.bind(this,"isBack")}          
                  dropdownMatchSelectWidth={false}
                  allowClear        
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
                  onChange={this.handleChangeDate.bind(this,"payTime")}
                />
              </Row>
            </div>
            <Table
              title={() => {
                return (
                  // [
                    <Row>
                      <Col span={4}>
                        <Link to="/purchase/purchase-order-management/common-purchase-list/common-purchase-add">
                          <Button icon="plus" type="primary">新建</Button>
                        </Link>,
                      </Col>
                      <Col span={4}>
                      {
                        selectedRows.length > 0 && (
                          <Button style={{ marginLeft: 10 }} type="primary" onClick={this.handleTriggerApplyMoneyModal.bind(this)}>申请货款</Button>
                        )
                      }
                      </Col>
                      <Col span={16} align="end">
                        <a style={{ marginRight: 10 }} target="_blank" href={exportUrl}>
                          <Button type="primary">导出</Button>
                        </a>
                      </Col>
                    </Row>
                  // ]
                );
              }}
              expandedRowRender={expandTable}
              bordered
              className={globalStyles.tablestyle}
              loading={isTableLoading}
              rowKey={record => record.id}
              dataSource={table}
              rowClassName={(record) => {
                if(record.isCredit) {
                  return styles.disabledRow;
                }else{
                  if (supplierName === '') {
                    return record.canApplyOutcome ? '' : styles.disabledRow;
                  }
                  return (record.supplier === supplierName && record.canApplyOutcome) ? '' : styles.disabledRow;
                }               
              }}
              columns={columns}
              rowSelection={{
                selectedRowKeys: selectedRows,
                onChange: this.handleSelectRows.bind(this),
              }}
              pagination={{
                current: curPage,
                pageSize,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
          </div>
          {/* 删除的确认弹窗 */}
          <Modal
            title="确认"
            visible={isShowDeleteModal}
            onOk={this.handleOkDeleteModal.bind(this)}
            confirmLoading={isDeleting}
            onCancel={this.handleTriggerDeleteModal.bind(this, null)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否删除</p>
          </Modal>

          {/* 审核通过确认弹窗 */}
          <Modal
            title="确认"
            visible={isShowCheckModal}
            onOk={this.handleOkCheckModal.bind(this)}
            confirmLoading={isChecking}
            onCancel={this.handleTriggerCheckModal.bind(this, null)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否审核通过</p>
          </Modal>

          {/* 驳回确认弹窗 */}
          <Modal
            title="确认"
            visible={isShowRejectModal}
            onOk={this.handleOkRejectModal.bind(this)}
            confirmLoading={isRejecting}
            onCancel={this.handleTriggerRejectModal.bind(this, null)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否驳回</p>
          </Modal>

          {/* 申请货款的确认弹窗 */}
          <Modal
            title="确认"
            visible={isShowApplyMoneyModal}
            onOk={this.handleOkApplyMoneyModal.bind(this)}
            confirmLoading={isApplying}
            onCancel={this.handleTriggerApplyMoneyModal.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否申请货款?</p>
          </Modal>

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
        </Card>
      </PageHeaderLayout>
    );
  }
}
