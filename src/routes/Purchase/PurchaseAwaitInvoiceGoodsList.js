import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import NP from 'number-precision';
import { Row, Col, Card, Input, Select, Button, Modal, Dropdown, Menu, AutoComplete, Table, Icon, Tooltip, Popconfirm, DatePicker, InputNumber, Checkbox, message } from 'antd';
import { withRouter, Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseList.less';
import globalStyles from '../../assets/style/global.less';
import nowStyle from './SalePaymentList.less';
import uniqBy from 'lodash/uniqBy';
import ClearIcon from '../../components/ClearIcon';
const { Option } = Select;
const { Search, TextArea } = Input;
@connect(state => ({
  purchaseAwaitInvoiceGoodsList: state.purchaseAwaitInvoiceGoodsList,
}))
export default class PurchaseAwaitInvoiceGoodsList extends React.Component {
  state={
    InputNumList: [],
    realInputNumList: [],
    Sum: '',
    checked: false,
    allAmount: 0,
    supplierId: '',
    historyInvMoney: 0,
  }
  componentDidMount() {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/getList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/unmount',
    });
  }

  // 换一种方法
  handleChangeSiftItem(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'purchaseId':
      case 'goodsKeywords':
      case 'remark':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/changeConfig',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'purchaserId':
      case 'payType':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            [type]: e,
            currentPage: 1,
          },
        });
        break;
      case 'predictInvDate':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            predictInvDateStart: dataStrings[0],
            predictInvDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'purchaseDate':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            purchaseDateStart: dataStrings[0],
            purchaseDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'payDate':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            payDateStart: dataStrings[0],
            payDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'purchaseAwaitInvoiceGoodsList/getList',
          payload: {
            [type]: dataStrings,
            currentPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }

  // 换种写法
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  // 修改数据
  handleInputNum=(id, e) => {
    let numberValue = 0;
    if (e === undefined) {
      numberValue = 0;
    } else {
      numberValue = +e;
    }
    this.state.InputNumList.forEach((item) => {
      item.id === id && (item.purchaseNum = numberValue);
      item.id === id && (item.purchaseTotal = NP.round(NP.times(+item.purchasePrice, +item.purchaseNum), 2));
    });
    this.setState(prevstate => ({ InputNumList: prevstate.InputNumList }));
    // 正常总额
    this.state.Sum = this.state.InputNumList.reduce((prev, cur) => {
      return NP.plus(+prev, +cur.purchaseTotal);
    }, 0);
    // 历史金额时总额
    this.state.allAmount = this.state.checked ? +NP.plus(+this.state.historyInvMoney, +this.state.Sum) : +this.state.Sum;
    this.setState(prevstate => ({ realInputNumList: prevstate.realInputNumList }));
  }
  // 提交
  okInvOrder=() => {
    const { dispatch, purchaseAwaitInvoiceGoodsList } = this.props;
    const { remark } = purchaseAwaitInvoiceGoodsList;
    if (!remark) {
      message.warning('请填写备注');
      return;
    }
    if (this.state.realInputNumList.length === 0) {
      this.state.realInputNumList = this.state.InputNumList.map((item) => {
        item.purchaseNum === '' && (item.purchaseNum = 0);
        item.num = +item.purchaseNum;
        const realItem = (({ id, num }) => ({ id, num }))(item);
        return realItem;
      });
    }
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/changeMaskList',
      payload: {
        invGoodsList: this.state.realInputNumList,
        useHistoryAmount: this.state.checked ? 1 : 0,
        remark,
      },
    });
    this.state.checked = false;
    this.state.remarkValue = '';
    this.state.realInputNumList = [];
    this.state.InputNumList = [];
  }
  productInvOrder=() => {
    const { dispatch, purchaseAwaitInvoiceGoodsList } = this.props;
    const { selectedRows, historyInvAmount } = purchaseAwaitInvoiceGoodsList;
    const onlyArr = [];
    selectedRows.forEach(item => onlyArr.push(item.supplierId));
    const a = [...new Set(onlyArr)];
    if (a.length !== 1) {
      message.warning('请选择统一供应商');
      return false;
    }
    this.state.supplierId = a[0];
    historyInvAmount.forEach((item) => {
      if (+item.id === +this.state.supplierId) {
        this.state.historyInvMoney = +item.amount;
      }
    });
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/showMask',
      payload: {
        isShowMask: true,
      },
    });
    this.state.InputNumList = JSON.parse(JSON.stringify(selectedRows));
    this.state.InputNumList.map((item) => {
      item.oldNum = item.purchaseNum;
    });
    this.state.Sum = this.state.InputNumList.reduce((prev, cur) => {
      cur.purchaseTotal = NP.round(NP.times(+cur.purchasePrice, +cur.purchaseNum), 2);
      // return prev + NP.round(NP.times(+cur.purchasePrice, +cur.purchaseNum), 2);
      return NP.plus(+prev, +cur.purchaseTotal);
    }, 0);
    this.state.Sum && (this.state.allAmount = +this.state.Sum);
  }
  cancelInvOrder=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/cancelMask',
      payload: {
        isShowMask: false,
        selectedRows:[],
        orderIds:[],
      },
    });
    this.state.checked = false;
    this.state.remarkValue = '';
    this.state.realInputNumList = [];
    this.state.InputNumList = [];
  }
  // 勾选中sku
  handleCheckAwaitInvGoods=(goodsIds, selectedRowss) => {
    const { dispatch, purchaseAwaitInvoiceGoodsList } = this.props;
    if (goodsIds.length !== selectedRowss.length) {
      [1,2,3]  [{},{}]
      const { selectedRows } = purchaseAwaitInvoiceGoodsList;
      const checkRows = [...selectedRows, ...selectedRowss];
      const uniqSelectedRow = uniqBy(checkRows,'id')
      const endRows = [];
      goodsIds.forEach((items) => {
        uniqSelectedRow.forEach((item) => {
          if (items === item.id) endRows.push(item); 
        });
      });
      dispatch({
        type: 'purchaseAwaitInvoiceGoodsList/changeSupplyGoodsCheckboxIds',
        payload: {
          supplyGoodsCheckboxIds: goodsIds,
          selectedRows: endRows,
        },
      });
    } else {
      dispatch({
        type: 'purchaseAwaitInvoiceGoodsList/changeSupplyGoodsCheckboxIds',
        payload: {
          supplyGoodsCheckboxIds: goodsIds,
          selectedRows: selectedRowss,
        },
      });
    }
  }
  // 历史未交金额
  handleChangeHistoryInvAmount(e) {
    // const { purchaseAwaitInvoiceGoodsList } = this.props;
    // const { historyInvAmount } = purchaseAwaitInvoiceGoodsList;
    this.state.checked = e.target.checked;
    if (this.state.checked) {
      // this.state.Sum = this.state.InputNumList.reduce((prev, cur) => {
      //   cur.purchaseTotal = NP.round(NP.times(+cur.purchasePrice, +cur.purchaseNum), 2);
      //   // return prev + NP.round(NP.times(+cur.purchasePrice, +cur.purchaseNum), 2);
      //   return NP.plus(+prev, +cur.purchaseTotal);
      // }, 0);
      this.state.allAmount = NP.plus(+this.state.historyInvMoney, +this.state.Sum);
      this.setState((prevstate) => {
        return ({ allAmount: prevstate.allAmount });
      });
    } else {
      this.state.allAmount = +this.state.Sum;
      this.setState((prevstate) => {
        return ({ allAmount: prevstate.allAmount });
      });
    }
  }
  handleChangeRemarkValue=(e) => {
    this.setState({
      remarkValue: e.target.value,
    });
  }
  // 选择供应商
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/saveSelectSupplier',
      payload: {
        supplierId,
        supplierSearchText: children,
      },
    });
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/getSupplier',
    });
  }
  // 搜索供应商
@Debounce(200)
  handleChangeSupplier(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAwaitInvoiceGoodsList/getList',
      payload: {
        [type]:""
      },
    });
  }
render() {
  const { purchaseAwaitInvoiceGoodsList: {
    awaitInvoiceGoodsList,
    totalActionList,
    orderIds,
    total,
    isLoading,
    currentPage,
    pageSize,
    purchaserMap,
    selectedRows,
    isShowMask,
    suppliers,
    payTypeMap,
    purchaseId,
    goodsKeywords,
  },
  } = this.props;
  const columns = [
    {
      title: '预计开票时间',
      dataIndex: 'predictInvDate',
      key: 'predictInvDate',
      render: (predictInvDate, record) => {
        return (record.isExpired === 0 ? <span style={{ color: 'red' }}>{predictInvDate}</span> : <span colorisExpired>{predictInvDate}</span>);
      },
    },
    {
      title: '采购时间',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width:100,
    },
    {
      title: '采购单号',
      dataIndex: 'purchaseOrderSn',
      key: 'purchaseOrderSn',
      render: (purchaseOrderSn, record) => {
        return (
         <div>
            {
              record.isSalePurchase === 0 ?
              <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
              : <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
            }
            <p style={{margin:0}}>
                {
                  record.tag.map(item=>(
                    <span style={{backgroundColor:item.color}} className={globalStyles.tag} key={item}>{item.name}</span>
                  ))
                }
            </p>
         </div>
        );
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 200,
      render:(goodsName)=>{
        return <p style={{margin:0}} className={globalStyles.twoLine}><Tooltip title={goodsName}>{goodsName}</Tooltip></p>
      }
      // render: (goodsName, record) => {
        // return (
        //   !isShowMask ? [record.tag && record.tag.map((item) => {
        //     return <span key={item} style={{ background: item.color, color: '#fff', borderRadius: '5px', paddingLeft: '8px', paddingRight: '8px', marginRight: '5px' }}>{item.name}</span>;
        //   }),
        //     <span>{ goodsName }</span>,
        //   ] : <span>{ goodsName }</span>
        // );
      // },
    }, {
      title: '条码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
    }, {
      title: '采购折扣',
      dataIndex: 'purchaseDiscount',
      key: 'purchaseDiscount',

    }, {
      title: '采购价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
    },
    {
      title: '采购数量',
      dataIndex: 'purchaseNum',
      key: 'purchaseNum',
      render: (purchaseNum, record) => {
        return (

          !isShowMask ? [
            record.tag.length > 0
              ? (
                <Tooltip title={(
                  <div>
                    {record.purchaseNumRemark && record.purchaseNumRemark.map(item => (
                      <div key={item} > { item }</div>
                    ))
                }
                  </div>)}
                >
                  <span style={{ color: record.purchaseNumColor }}>{purchaseNum} </span>
                </Tooltip>
              )
              : (<span style={{ color: record.purchaseNumColor }}>{purchaseNum} </span>),
          ] :

              <InputNumber
                min={0}
                max={record.oldNum}
                value={purchaseNum}
                onChange={this.handleInputNum.bind(this, record.id)}
              />
        );
      },
    }, {
      title: '采购合计',
      dataIndex: 'purchaseTotal',
      key: 'purchaseTotal',
      render: (purchaseTotal, record) => {
        return ([
          record.tag.length > 0
            ? (
              <Tooltip title={(
                <div>
                  {record.purchaseTotalRemark && record.purchaseTotalRemark.map(item => (
                    <div key={item}> { item }</div>
                    ))
                }
                </div>)}
              >
                <span style={{ color: record.purchaseTotalColor }}>{purchaseTotal} </span>
              </Tooltip>
            )
            : (<span style={{ color: record.purchaseTotalColor }}>{purchaseTotal} </span>),
        ]);
      },
    }, {
      title: '贷款申请单号',
      dataIndex: 'outcomeApplyId',
      key: 'outcomeApplyId',
    },
    {
      title: '付款日期',
      dataIndex: 'payDate',
      key: 'payDate',
      width:100
    },
    {
      title: '采购员',
      dataIndex: 'purchaserName',
      key: 'purchaserName',
    },
  ];

  const maskColumns = columns.filter(item => item.dataIndex !== 'purchaseDiscount');
  return (
    <PageHeaderLayout title="待开票列表">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Row type="flex">
              <Col>
                <AutoComplete
                  dataSource={suppliers && suppliers.map((item) => {
                    return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
                  })}
                  onSelect={this.handleSelectSupplier.bind(this)}
                  onSearch={this.handleChangeSupplier.bind(this)}
                  // className={globalStyles['input-sift']}
                  style={{width:300,marginRight:10}}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  <Search
                    placeholder="请输入供应商"
                    style={{width:300}}
                  />
                </AutoComplete>
              </Col>
              <Col>
                <Input.Search
                  // className={globalStyles['input-sift']}
                  style={{width:250,marginRight:10}}
                  placeholder="请输入采购单号/货款申请单号"
                  onSearch={this.handleGetOrderList.bind(this)}
                  onChange={this.handleChangeSiftItem.bind(this, 'purchaseId')}
                  value={purchaseId} 
                  suffix={purchaseId?<ClearIcon 
                          handleClear={this.handleClear.bind(this,"purchaseId")}
                  />:""}  
                />
              </Col>
              <Col>
                <Input.Search
                   style={{width:220,marginRight:10}}
                  placeholder="请输入商品条码/商品名称"
                  onSearch={this.handleGetOrderList.bind(this)}
                  onChange={this.handleChangeSiftItem.bind(this, 'goodsKeywords')}
                  value={goodsKeywords} 
                  suffix={goodsKeywords?<ClearIcon 
                          handleClear={this.handleClear.bind(this,"goodsKeywords")}
                  />:""}  
                />
              </Col>
              <Col>
                <Select
                  placeholder="请选择采购员"
                  style={{width:200,marginRight:10}}
                  onChange={this.handleChangeSiftItem.bind(this, 'purchaserId')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  {Object.keys(purchaserMap).map((id) => {
                  return <Option key={id} value={id}>
                      {purchaserMap[id]}
                  </Option>;
                })}
                </Select>
              </Col>
              <Col>  
                <Select
                  placeholder="请选择支付类型"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeSiftItem.bind(this, 'payType')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                >
                  {Object.keys(payTypeMap).map((id) => {
                  return <Option key={id} value={id}>{payTypeMap[id]}</Option>;
                })}
                </Select>
              </Col>
              <Col span={4}>
                {totalActionList.map((actionInfo) => {
                      switch (+actionInfo.type) {
                        case 2:
                          return (
                            <a
                              href={actionInfo.url}
                              target="_blank"
                              key={actionInfo.name}
                            >
                              <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                            </a>
                          );
                        case 3:
                        return (
                          <a
                            href={`${actionInfo.url}?ids=${orderIds}`}
                            target="_blank"
                            key={actionInfo.name}
                          >
                            <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                          </a>
                        );
                      default:
                          return '';
                      }
                    }
                        )}
              </Col>
              
            </Row>
            <Row>
              <Col span={6}>
                <span>预计开票时间：</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.handleChangeSiftItem.bind(this, 'predictInvDate')}
                />
              </Col>
              <Col span={6}>
                <span>采购时间：</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.handleChangeSiftItem.bind(this, 'purchaseDate')}
                />
              </Col>
              <Col span={6}>
                <span>付款时间：</span>
                <DatePicker.RangePicker
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.handleChangeSiftItem.bind(this, 'payDate')}
                />
              </Col>
              {selectedRows.length !== 0 ?
                <Col span={2}>
                  <Button type="primary" onClick={this.productInvOrder}>生成来票跟进单</Button>
                </Col>
                  : null
              }
            </Row>
          </div>
          <Table
            bordered
            loading={isLoading}
            dataSource={awaitInvoiceGoodsList}
            className={globalStyles.tablestyle}
            columns={columns}
            rowKey={record => record.id}
            pagination={{
                current: currentPage,
                pageSize,
                onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
                onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
                showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            rowSelection={{
                selectedRowKeys: orderIds,
                onChange: this.handleCheckAwaitInvGoods,
              }}
          />
          <Modal visible={isShowMask} width={1900} closable={false}footer={null} >
            <Table
              bordered
              style={{ marginTop: 20 }}
              dataSource={this.state.InputNumList}
              rowKey={record => record.id}
              columns={maskColumns}
              pagination={false}
              className={styles.checkWidth}
            />
            <Row style={{ marginTop: 20, position: 'relative' }}>
              <Col span={20} >
                <span style={{ fontSize: 16, color: '#797979', fontWeight: 300, position: 'absolute', top: 0, left: 0 }}>备注*：</span>
                <TextArea
                  value={this.state.remarkValue}
                  onBlur={this.handleChangeSiftItem.bind(this, 'remark')}
                  onChange={this.handleChangeRemarkValue}
                  autosize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入采购备注，此备注仅采购可见"
                  style={{ border: '2px dashed #BCBCBC', width: 500, marginLeft: 50 }}
                />
              </Col>
              <Col span={4}>
                <Row>
                  <Col offset={4}>开票总额：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.Sum}</span></Col>
                </Row>
                <Row>
                  <Col>
                    <Checkbox defaultChecked={false} checked={this.state.checked} onChange={this.handleChangeHistoryInvAmount.bind(this)} >历史未开金额：</Checkbox>
                    <span style={{ color: 'red', fontWeight: 'bold' }}>{+this.state.historyInvMoney}</span>
                  </Col>
                </Row>
                <Row>
                  <Col offset={3}> 应开票总额：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.allAmount}</span></Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col offset={20}>
                <Button
                  style={{ color: '#1890FF', borderColor: '#1890FF', width: '88px', marginLeft: 15 }}
                  onClick={this.cancelInvOrder}
                >取消
                </Button>
                <Button type="primary" style={{ width: '88px', marginLeft: 15 }} onClick={this.okInvOrder}>确定</Button>
              </Col>
            </Row>
          </Modal>
        </div>
      </Card>
    </PageHeaderLayout>
  );
}
}

