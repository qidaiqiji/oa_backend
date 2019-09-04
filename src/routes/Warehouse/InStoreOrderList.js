import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Table, Button, Input, Select, Modal, Dropdown, DatePicker, Menu, Icon, Tooltip, Col } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InStoreOrderList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(state => ({
  inStoreOrderList: state.inStoreOrderList,
}))
export default class InStoreOrderList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/unmount',
    });
  }

  // 打开/隐藏推送弹窗, 如果是打开的话将订单 id 存到 inStoreOrderId 中
  handleTriggerOperaPushModal(inStoreOrderId = null) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/triggerOperaPushModal',
      payload: {
        inStoreOrderId,
      },
    });
  }

  // 确认推送订单
  handleOkOperaPushModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/okOperaPushModal',
    });
  }

  // 回车搜索
  handleSearchInStoreSn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/getList',
      payload:{
        curPage:1,
      }
    });
  }
  // 改变搜索日期
  handleChangeInStoreDate(type,dates, dateStrings) {
    const { dispatch } = this.props;
    switch(type) {
      case 'inStoreDate':
        dispatch({
          type: 'inStoreOrderList/getList',
          payload: {
            inStoreStartDate: dateStrings[0],
            inStoreEndDate: dateStrings[1],
            curPage: 1,
          },
        });
      break;
      case 'checkTime':
        dispatch({
          type: 'inStoreOrderList/getList',
          payload: {
            financeCheckTimeStart: dateStrings[0],
            financeCheckTimeEnd: dateStrings[1],
            curPage: 1,
          },
        });
      break;
    }
    
  }
 
  // 改变入库单状态选项
  handleChangeItem(type,value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/getList',
      payload: {
        [type]: value,
        curPage: 1,
      },
    });
  }
  // 改变页码
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/getList',
      payload: {
        curPage,
      },
    });
  }
  // 改变每页数据条数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/getList',
      payload: {
        pageSize,
        curPage: 1,
      },
    });
  }
  // 同步改变某些项
  handleChangeSyncItem(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'inStoreSn':
        dispatch({
          type: 'inStoreOrderList/changeSyncItem',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      case 'curPage':
      case 'pageSize':
      default:
        break;
    }
  }
  // 点击推送的时候选择推送仓库
  handleSelectDepot=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderList/changeSyncItemReducer',
      payload: {
        depot: e,
      },
    })
  }
  render() {
    const {
      inStoreOrderList: {
        inStoreSn,
        inStoreType,
        inStoreStatus,
        inStoreStartDate,
        inStoreEndDate,
        curPage,
        pageSize,
        total,
        inStoreList,
        isLoading,
        inStoreTypeMap,
        inStoreStatusMap,
        isShowOperaPushModal,
        isOkingOperaPushModal,
        depotMap,
        depot,
        actionList,
        storageTypeMap,
        financeCheckTimeStart,
        financeCheckTimeEnd,
      },
    } = this.props;
    const length = Object.keys(depotMap!=undefined&&depotMap).length;
    const expandedTable = (inStoreOrder) => {
      const inStoreOrderGoodsColumns = [
        {
          title: '商品图片',
          dataIndex: 'img',
          key: 'img',
          render: (imgSrc, record) => {
            return <img src={imgSrc} style={{ width: 55, height: 55 }} />;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '条码',
          dataIndex: 'sn',
          key: 'sn',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
        },
        {
          title: '待入库数',
          dataIndex: 'awaitInStoreNum',
          key: 'awaitInStoreNum',
        },
        {
          title: '入库数量',
          dataIndex: 'inStoreNum',
          key: 'inStoreNum',
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
      ];
      return (
        <Table
          bordered
          rowKey={record => record.id}
          columns={inStoreOrderGoodsColumns}
          dataSource={inStoreOrder.goodsList}
          pagination={false}
        />
      );
    };
    const inStoreOrderColumns = [
      {
        title: '入库单号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '入库时间',
        dataIndex: 'inStoreTime',
        key: 'inStoreTime',
      },
      {
        title: '入库单类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '入库单状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '财务审核时间',
        dataIndex: 'financeCheckTime',
        key: 'financeCheckTime',
      },
      {
        title: '库位类型',
        dataIndex: 'storageType',
        key: 'storageType',
        render:(storageType)=>{
          return <span>{storageTypeMap[storageType]}</span>
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
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              overlay={
                <Menu>
                  {record.actionList.canPush &&
                  <Menu.Item>
                    <div onClick={this.handleTriggerOperaPushModal.bind(this, record.id)}>推送</div>
                  </Menu.Item>}
                </Menu>
            }
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="入库单列表">
        <Card bordered={false}>
          <Row
            style={{
              height: 60,
            }}
          >
            <Col span={18}>
              <Search
                value={inStoreSn}
                className={globalStyles['input-sift']}
                placeholder="请输入入库单号"
                onChange={this.handleChangeSyncItem.bind(this, 'inStoreSn')}
                onSearch={this.handleSearchInStoreSn.bind(this)}
              />
              <Select
                value={inStoreType}
                placeholder="入库单类型"
                className={globalStyles['select-sift']}
                onChange={this.handleChangeItem.bind(this,'inStoreType')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value={-1}>全部入库类型</Option>
                {
                  Object.keys(inStoreTypeMap).map((inStoreTypeId) => {
                    return (
                      <Option value={inStoreTypeId} key={inStoreTypeId}>{inStoreTypeMap[inStoreTypeId]}</Option>
                    );
                  })
                }
              </Select>
              <Select
                value={inStoreStatus}
                placeholder="入库单状态"
                className={globalStyles['select-sift']}
                onChange={this.handleChangeItem.bind(this,'inStoreStatus')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value={-1}>全部入库单状态</Option>
                {
                  Object.keys(inStoreStatusMap).map((inStoreStatusId) => {
                    return (
                      <Option value={inStoreStatusId} key={inStoreStatusId}>{inStoreStatusMap[inStoreStatusId]}</Option>
                    );
                  })
                }
              </Select>
              <Select
                placeholder="库位类型"
                className={globalStyles['select-sift']}
                onChange={this.handleChangeItem.bind(this,'storageType')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value={-1}>全部库位类型</Option>
                {
                  Object.keys(storageTypeMap).map((item) => {
                    return (
                      <Option value={item} key={item}>{storageTypeMap[item]}</Option>
                    );
                  })
                }
              </Select>
              入库时间：
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                value={[inStoreStartDate ? moment(inStoreStartDate, 'YYYY-MM-DD') : '', inStoreEndDate ? moment(inStoreEndDate, 'YYYY-MM-DD') : '']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInStoreDate.bind(this,'inStoreDate')}
              />
            </Col>
            
            <Col span={4}>
              {
                actionList.map(item=>(
                  <Button type="primary" href={item.url} target="_blank">{item.name}</Button>
                ))
              }
            </Col>
          </Row>
          <Row style={{marginTop:10}}>
              {/* 财务付款时间：
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                value={[checkTimeStart ? moment(checkTimeStart, 'YYYY-MM-DD') : '', checkTimeEnd ? moment(checkTimeEnd, 'YYYY-MM-DD') : '']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInStoreDate.bind(this,'checkTime')}
              /> */}
              财务审核时间：
              <RangePicker
                className={globalStyles['rangePicker-sift']}
                value={[financeCheckTimeStart ? moment(financeCheckTimeStart, 'YYYY-MM-DD') : '', financeCheckTimeEnd ? moment(financeCheckTimeEnd, 'YYYY-MM-DD') : '']}
                format="YYYY-MM-DD"
                onChange={this.handleChangeInStoreDate.bind(this,'checkTime')}
              />
          </Row>
          <Table
            bordered
            title={() => {
              return (
                <Row>
                  <Link to="/warehouse/in-store-order-list/in-store-order-add">
                    <Button type="primary">新建入库单</Button>
                  </Link>
                </Row>
              );
            }}
            loading={isLoading}
            rowKey={record => record.id}
            columns={inStoreOrderColumns}
            scroll={{
              x: 1000,
            }}
            expandedRowRender={expandedTable}
            pagination={{
              total,
              current: curPage,
              pageSize,
              showSizeChanger: true,
              onChange: this.handleChangeCurPage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
            dataSource={inStoreList}
          />
          <Modal
            title="提示"
            visible={isShowOperaPushModal}
            confirmLoading={isOkingOperaPushModal}
            onOk={this.handleOkOperaPushModal.bind(this)}
            onCancel={this.handleTriggerOperaPushModal.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否推送该订单?</p>
            {
              length>0?(<Row type="flex" justify="center">
              请选择推送仓库：
              <Select
              placeholder="请选择推送仓库"
              className={globalStyles['select-sift']}
              onSelect={this.handleSelectDepot}
              value={depot}
              dropdownMatchSelectWidth={false}
              >
                {
                  Object.keys(depotMap!=undefined&&depotMap).map((depotItem) => {
                    return (
                      <Option value={depotItem} key={depotItem}>{depotMap[depotItem]}</Option>
                    );
                  })
                }
              </Select>
            </Row>):null
            }
            
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
