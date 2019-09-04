import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Button, Input, Select, Modal, Table, DatePicker, Dropdown, Menu, Icon, Tooltip, Radio, Col } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitPushList.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Group: RadioGroup } = Radio;

@connect(state => ({
  awaitPushList: state.awaitPushList,
}))
export default class AwaitPushList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/unmount',
    });
  }
  // 换页回调
  handleChangePage(currentPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage,
      },
    });
  }
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage: 1,
        pageSize,
      },
    });
  }
  handleChangeSyncItem(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'sumOrderNum':
        dispatch({
          type: 'awaitPushList/changeSyncItem',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      case 'consignee':
        dispatch({
          type: 'awaitPushList/changeSyncItem',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      default:
        break;
    }
  }
  // 筛选订单编号
  handleSearchOrderNumber(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage: 1,
        sumOrderNum: value,
      },
    });
  }

  // 筛选收货人
  handleSearchConsignee(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage: 1,
        consignee: value,
      },
    });
  }
  // 状态筛选
  handleChangeStatus(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage: 1,
        status: value,
      },
    });
  }

  // 选择订单类型
  handleChangeType(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/getList',
      payload: {
        currentPage: 1,
        type: value,
      },
    });
  }

  // 日期选择搜索
  handleChangeDate(type,dates, datesString) {
    const { dispatch } = this.props;
    switch(type) {
      case 'date':
        dispatch({
          type: 'awaitPushList/getList',
          payload: {
            currentPage: 1,
            startDate: datesString[0],
            endDate: datesString[1],
          },
        });
      break;
      case 'checkTime':
        dispatch({
          type: 'awaitPushList/getList',
          payload: {
            financeCheckTimeStart: datesString[0],
            financeCheckTimeEnd: datesString[1],
            currentPage: 1,
          },
        });
      break;
    }
    
  }
  // 确认推送
  handleClickOkPushButton() {
    const { dispatch, awaitPushList } = this.props;
    const { currentPage, consignee, sumOrderNum, status, currentPushOrderId, startDate, endDate, orderType, depot, express, storageType } = awaitPushList;
    dispatch({
      type: 'awaitPushList/clickOkPushButton',
      payload: {
        currentPushOrderId,
        currentPage,
        sumOrderNum,
        consignee,
        status,
        startDate,
        endDate,
        orderType,
        depot,
        express,
        storageType,
      },
    });
  }
  // 取消推送
  handleClickCancelPushButton() {
    this.props.dispatch({
      type: 'awaitPushList/clickCancelPushButton',
    });
  }
  // 推送弹框弹出
  handleClickPushButton(id) {
    this.props.dispatch({
      type: 'awaitPushList/clickPushButton',
      payload: {
        currentPushOrderId: id,
      },
    });
  }

  // 确认销毁
  handleClickOkRemoveButton() {
    const { dispatch, awaitPushList } = this.props;
    const { currentPushOrderId } = awaitPushList;
      dispatch({
        type: 'awaitPushList/clickOkRemoveButton',
        payload: {
          currentPushOrderId,
        },
      });
  }
  // 取消销毁
  handleClickCancelRemoveButton() {
    this.props.dispatch({
      type: 'awaitPushList/clickCancelRemoveButton',
    });
  }
  // 销毁弹框弹出
  handleClickRemoveButton(id,record) {
    this.props.dispatch({
      type: 'awaitPushList/clickRemoveButton',
      payload: {
        currentPushOrderId: id,
        selectedRow:record,
      },
    });
  }
  // 确认审核
  handleClickOkCheckButton() {
    const { dispatch, awaitPushList } = this.props;
    const { currentPage, consignee, sumOrderNum, status, currentPushOrderId, startDate, endDate } = awaitPushList;
    dispatch({
      type: 'awaitPushList/clickOkCheckButton',
      payload: {
        currentPushOrderId,
        currentPage,
        sumOrderNum,
        consignee,
        status,
        startDate,
        endDate,
      },
    });
  }
  // 取消审核
  handleClickCancelCheckButton() {
    this.props.dispatch({
      type: 'awaitPushList/clickCancelCheckButton',
    });
  }
  // 审核弹框弹出
  handleClickCheckButton(id) {
    this.props.dispatch({
      type: 'awaitPushList/clickCheckButton',
      payload: {
        currentPushOrderId: id,
      },
    });
  }
    // 点击推送的时候选择推送仓库
  handleSelectDepot=(type,e)=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'awaitPushList/changeSyncItemReducer',
        payload: {
          [type]: e,
        },
      })
  }
  // 点击推送选择推送类型
  handleChangeOrderType=(e)=>{
    const { dispatch } = this.props;
    let orderType = e.target.value;
    let express = "";
    if(+orderType === 1) {
      express="express_deppon";
    }else{
      express="express_yunda";
    }
    dispatch({
      type: 'awaitPushList/changeSyncItemReducer',
      payload: {
        orderType,
        express,
      },
    })
  }
  // 选择快递方式
  handleSelectExpress=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/changeSyncItemReducer',
      payload: {
        express: e,
      },
    })
  }
  handlePush=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'awaitPushList/pushToDepot',
    })
  }
  render() {
    const {
      awaitPushList: {
        isTableLoading,
        orderList,
        statusMap,
        typeMap,
        canPushMap,
        canRollbackMap,
        canCheckMap,
        currentPage,
        sumOrderNum,
        consignee,
        startDate,
        endDate,
        type,
        status,
        total,
        pageSize,
        // 当前要推送的 id
        currentPushOrderId,
        isPushLoading,
        isShowPushConfirm,
        isShowRemoveConfirm,
        isRemoveLoading,
        isShowCheckConfirm,
        isCheckLoading,
        depot,
        depotMap,
        orderTypeMap,
        orderType,
        expressB2BMap,
        expressB2CMap,
        express,
        actionList,
        storageTypeMap,
        financeCheckTimeStart,
        financeCheckTimeEnd
      },
    } = this.props;
    const length = Object.keys(depotMap!=undefined&&depotMap).length;
    const orderTypeLength = Object.keys(orderTypeMap!=undefined&&orderTypeMap).length;

    let expressMap = {};
    if(orderType&&+orderType === 1) {
      expressMap = expressB2BMap;
    }else if(orderType&&+orderType === 2) {
      expressMap = expressB2CMap;
    }
    // 商品子列表
    const expandedRowRender = (order) => {
      const columns = [
        {
          title: '商品图',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img className={styles.goodsImg} src={img}/>;
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
          title: '实发数量',
          dataIndex: 'sendNum',
          key: 'sendNum',
        },
      ];
      return (
        <Table
          bordered
          rowKey={record => record.id}
          columns={columns}
          dataSource={order.goods}
          pagination={false}
          scroll={{ x: 500 }}
        />
      );
    };
    // -商品子列表


    // orderList 的列头数据
    const columns = [
      {
        title: '出库单号',
        dataIndex: 'storeNo',
        key: 'storeNo',
        width: 160,
      }, {
        title: '包含的子单号',
        dataIndex: 'subNo',
        key: 'subNo',
        width: 150,
        render: (subNos) => {
          return (
            <span>{
            subNos.map((subNo) => {
              const values = Object.keys(subNo);
              return <p key={values[0]}>{subNo[values[0]]}</p>;
            })
          }
            </span>
          );
        },
      }, {
        title: '运费',
        dataIndex: 'fare',
        key: 'fare',
        width: 100,
      }, {
        title: '邮费政策',
        dataIndex: 'shippingName',
        key: 'shippingName',
        width: 100,
      }, {
        title: '物流单号',
        dataIndex: 'shipmentNo',
        key: 'shipmentNo',
        width: 150,
      }, {
        title: '重量/件数',
        dataIndex: 'weightNum',
        key: 'weightNum',
        width: 150,
      }, {
        title: '总金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 150,
      }, {
        title: '联系人/联系电话',
        dataIndex: 'consigneeName',
        width: 190,
        render: (consigneeName, record) => {
          return <span>{`${consigneeName}/${record.consigneeMobile}`}</span>;
        },
      }, {
        title: '收货地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
      }, {
        title: '创建时间',
        dataIndex: 'dateTime',
        key: 'dateTime',
        width: 100,
      },
      {
        title: '财务审核时间',
        dataIndex: 'fianceCheckTime',
        key: 'financeCheckTime',
        width: 100,
      }, {
        title: '状态',
        dataIndex: 'status',
        width: 175,
        render: (op, record) => {
          return <span>{`${statusMap[record.status]}`}</span>;
        },
      }, {
        title: '类型',
        dataIndex: 'type',
        width: 175,
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 130,
        render: (remark) => {
          return <Tooltip placement="top" title={remark}><span className={globalStyles['ellipsis-col']}>{remark}</span></Tooltip>;
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 70,
        render: (op, record) => (
          <Dropdown
            overlay={
              <Menu>
                {
                  (canPushMap.indexOf(record.status) !== -1) && (
                    <Menu.Item>
                      <div onClick={this.handleClickPushButton.bind(this, record.id)}>
                        <Icon type="check-circle" /> 推送
                      </div>
                    </Menu.Item>
                  )
                }
                {
                  // (canRollbackMap.indexOf(record.status) !== -1) && (
                    <Menu.Item>
                      <div onClick={this.handleClickRemoveButton.bind(this, record.id,record)}>
                        <Icon type="delete" /> 销毁
                      </div>
                    </Menu.Item>
                  // )
                }
                {
                  (canCheckMap.indexOf(record.status) !== -1) && (
                    <Menu.Item>
                      <div onClick={this.handleClickCheckButton.bind(this, record.id)}>
                        <Icon type="check" /> 审核
                      </div>
                    </Menu.Item>
                  )
                }
              </Menu>
            }
            placement="bottomRight"
          >
            <Icon type="ellipsis" />
          </Dropdown>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="出库单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <Search
                    placeholder="请输入出库单号"
                    onSearch={this.handleSearchOrderNumber.bind(this)}
                    onChange={this.handleChangeSyncItem.bind(this, 'sumOrderNum')}
                    value={sumOrderNum}
                    className={globalStyles['input-sift']}
                  />
                  <Search
                    placeholder="请输入收货人"
                    onSearch={this.handleSearchConsignee.bind(this)}
                    onChange={this.handleChangeSyncItem.bind(this, 'consignee')}
                    value={consignee}
                    className={globalStyles['input-sift']}
                  />
                  <Select
                    style={{ width: 130, marginRight: 10 }}
                    value={status}
                    onChange={this.handleChangeStatus.bind(this)}
                    placeholder="出库单状态"
                    className={globalStyles['select-sift']}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    {
                      [<Option key="-1">全部出库单状态</Option>].concat(Object.entries(statusMap).map((value) => {
                        return <Option key={value[0]}>{value[1]}</Option>;
                      }))
                    }
                  </Select>
                  <Select
                    style={{ width: 130, marginRight: 10 }}
                    value={type}
                    onChange={this.handleChangeType.bind(this)}
                    placeholder="出库单类型"
                    className={globalStyles['select-sift']}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    {
                      [<Option key="-1">全部</Option>].concat(Object.entries(typeMap).map((value) => {
                        return <Option key={value[0]}>{value[1]}</Option>;
                      }))
                    }
                  </Select>
                  出库时间：
                  <RangePicker
                    onChange={this.handleChangeDate.bind(this,'date')}
                    defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
                    format="YYYY-MM-DD"
                    className={globalStyles['rangePicker-sift']}
                  />
                </Col>
                <Col span={2}>
                  <Button type="primary" onClick={this.handlePush} loading={buttonLoading}>一键推送</Button>
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
                财务审核时间：
                  <RangePicker
                    className={globalStyles['rangePicker-sift']}
                    value={[financeCheckTimeStart ? moment(financeCheckTimeStart, 'YYYY-MM-DD') : '', financeCheckTimeEnd ? moment(financeCheckTimeEnd, 'YYYY-MM-DD') : '']}
                    format="YYYY-MM-DD"
                    onChange={this.handleChangeDate.bind(this,'checkTime')}
                  />
              </Row>
            </div>
            <Table
              bordered
              loading={isTableLoading}
              rowKey={record => record.id}
              dataSource={orderList}
              columns={columns}
              expandedRowRender={expandedRowRender}
              scroll={{ x: 1200 }}
              title={() => {
                return (
                  <Link to="await-push-list/out-store-add" style={{ color: '#fff', position: 'relative', left: 10 }}>
                    <Button type="primary" icon="plus">
                      新增出库单
                    </Button>
                  </Link>
                );
              }}
              pagination={{
                current: currentPage,
                pageSize,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showSizeChanger: false,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
            <Modal
              title="确认"
              visible={isShowPushConfirm}
              onOk={this.handleClickOkPushButton.bind(this)}
              onCancel={this.handleClickCancelPushButton.bind(this)}
              confirmLoading={isPushLoading}
            >
              <p style={{ textAlign: 'center' }}>请确认是否推送</p>
              {
                length>0?<Row>
                请选择推送仓库：
                <Select
                placeholder="请选择推送仓库"
                className={globalStyles['select-sift']}
                onSelect={this.handleSelectDepot.bind(this,'depot')}
                value={depot}
                >
                  {
                    Object.keys(depotMap!=undefined&&depotMap).map((depotItem) => {
                      return (
                        <Option value={depotItem} key={depotItem}>{depotMap[depotItem]}</Option>
                      );
                    })
                  }
                </Select>
              </Row>:null
              }
              <Row>
                请选择库位类型：
                <Select
                placeholder="请选择库位类型："
                className={globalStyles['select-sift']}
                onSelect={this.handleSelectDepot.bind(this,'storageType')}
                >
                  {
                    Object.keys(storageTypeMap).map((item) => {
                      return (
                        <Option value={item} key={item}>{storageTypeMap[item]}</Option>
                      );
                    })
                  }
                </Select>
              </Row>
              {
                orderTypeLength>0?<Row style={{ marginTop: 10 }}>
                请选择出库单类型:
                <RadioGroup
                  style={{ marginLeft: 10 }}
                  value={orderType}
                  onChange={this.handleChangeOrderType.bind(this)}
                >
                {
                  Object.keys(orderTypeMap&&orderTypeMap).map(orderType=>{
                    return <Radio value={orderType}>{orderTypeMap[orderType]}</Radio>
                  })
                }
                </RadioGroup>
              </Row>:null
              }
              {
                <Row style={{marginTop:10}}>
                请选择快递类型：
                <Select
                className={globalStyles['select-sift']}
                onSelect={this.handleSelectExpress}
                value={express}
                >
                  {
                    Object.keys(expressMap).map(express => {
                      return (
                        <Option value={express} key={express}>{expressMap[express]}</Option>
                      );
                    })
                  }
                </Select>
              </Row>
              }
            </Modal>
            <Modal
              title="确认"
              visible={isShowRemoveConfirm}
              onOk={this.handleClickOkRemoveButton.bind(this)}
              onCancel={this.handleClickCancelRemoveButton.bind(this)}
              confirmLoading={isRemoveLoading}
            >
              <p style={{ textAlign: 'center' }}>请确认是否销毁</p>
            </Modal>
            <Modal
              title="确认"
              visible={isShowCheckConfirm}
              onOk={this.handleClickOkCheckButton.bind(this)}
              onCancel={this.handleClickCancelCheckButton.bind(this)}
              confirmLoading={isCheckLoading}
            >
              <p style={{ textAlign: 'center' }}>请确认是否审核</p>
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
