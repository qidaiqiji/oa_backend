import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Input, Select, Button, Modal, Dropdown, Menu, AutoComplete, Table, Icon, Tooltip, Popconfirm, DatePicker, InputNumber, Checkbox, message } from 'antd';
import { withRouter, Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import styles from './PurchaseInInvFollowList.less';
import ClearIcon from '../../components/ClearIcon';
const { Option } = Select;
const { Search, TextArea } = Input;
@connect(state => ({
  purchaseInInvFollowList: state.purchaseInInvFollowList,
}))
export default class PurchaseInInvFollowList extends React.Component {
  state={
    remarkInput: '',
    visible: false,
    oldVlue: '',
  }
  componentWillMount() {
    const { location, dispatch } = this.props;
    if (location.pathname === '/purchase/invoice-management/purchase-in-inv-follow-list') {
      dispatch({
        type: 'purchaseInInvFollowList/updateConfig',
        payload: {
          pageChange: '1',
        },
      });
    } else if (location.pathname === '/purchase/invoice-management/purchase-in-inv-follow-list-n') {
      dispatch({
        type: 'purchaseInInvFollowList/updateConfig',
        payload: {
          pageChange: '2',
        },
      });
    } else if (location.pathname === '/finance/finance-invoice/finance-purchase-in-inv-list') {
      dispatch({
        type: 'purchaseInInvFollowList/updateConfig',
        payload: {
          pageChange: '3',
        },
      });
    }
  }
  componentDidMount() {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'purchaseInInvFollowList/mount',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseInInvFollowList/unmount',
    });
  }
  getRemark=(e) => {
    this.setState({ remarkInput: e.target.value });
  }
  setRemark=(e) => {
    this.setState({ oldVlue: e.target.value });
  }
  // 换一种方法
  handleChangeSiftItem(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'orderSn':
      case 'goodsKeywords':
        dispatch({
          type: 'purchaseInInvFollowList/changeConfig',
          payload: {
            [type]: e.target.value,
            currentPage:1,
          },
        });
        break;
      case 'supplierId':
      case 'purchaserId':

        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            [type]: e,
            currentPage:1,
          },
        });
        break;
      case 'isSuitDetail':

        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            [type]: e === '-1' ? '' : e,
            currentPage:1,
          },
        });
        break;
      case 'status':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            [type]: e === undefined ? [] : [e],
            currentPage:1,
          },
        });
        break;
      case 'createInvDate':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            createDateStart: dataStrings[0],
            createDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'purchaseDate':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            purchaseDateStart: dataStrings[0],
            purchaseDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'payDate':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            payDateStart: dataStrings[0],
            payDateEnd: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'purchaseInInvFollowList/getList',
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
      type: 'purchaseInInvFollowList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleInputNum=(id, e) => {
    const { dispatch } = this.props;
    if (e.target.value !== '') {
      dispatch({
        type: 'purchaseInInvFollowList/postShippingNo',
        payload: {
          incomeInvOrderId: id,
          shippingNo: e.target.value,
        },
      });
    } else {
      message.warning('物流单号为空不提交');
    }
  }
  // 备注弹窗
  remarkModal=(id, oldVlue) => {
    this.setState(prevstate => ({ visible: !prevstate.visible, remarkId: id, oldVlue }));
    this.setState(prevstate => ({ oldVlue: prevstate.oldVlue }));
  }

  handleOk=() => {
    const { dispatch, purchaseInInvFollowList } = this.props;
    const { pageChange } = purchaseInInvFollowList;
    if (pageChange !== '3') {
      dispatch({
        type: 'purchaseInInvFollowList/remarkOk',
        payload: {
          incomeInvOrderId: this.state.remarkId,
          purchaseRemark: this.state.remarkInput,
        },
      });
    } else {
      dispatch({
        type: 'purchaseInInvFollowList/remarkOk',
        payload: {
          incomeInvOrderId: this.state.remarkId,
          remark: this.state.remarkInput,
        },
      });
    }

    // console.log(this.state.remarkInput, this.state.remarkId);

    this.setState(prevstate => ({ visible: !prevstate.visible }));
  }
  handleCancel=() => {
    this.state.remarkInput = '';
    this.setState(prevstate => ({ visible: !prevstate.visible }));
  }
  // 选择供应商
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'purchaseInInvFollowList/updateConfig',
      payload: {
        supplierId,
        supplierSearchText: children,
      },
    });
    dispatch({
      type: 'purchaseInInvFollowList/getList',
    });
  }
  // 搜索供应商
  @Debounce(100)
  handleChangeSupplier(text = '') {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseInInvFollowList/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseInInvFollowList/getList',
      payload:{
        [type]:"",
        currentPage:1,
      }
    });
  }
  render() {
    const { purchaseInInvFollowList: {

      incomeInvOrderList,
      purchaserMap,
      pageChange,
      isLoading,
      total,
      totalDebtAmount,
      incomeInvOrderStatusMap,
      suppliers,
      totalActionList,
      InvSuitDetailMap,
      orderSn,
      goodsKeywords,
      // status,
      // supplierId,
      // orderSn,
      // goodsKeywords,
      // purchaserId,
      // createDateStart,
      // createDateEnd,
      // purchaseDateStart,
      // purchaseDateEnd,
      // payDateStart,
      // payDateEnd,
      currentPage,
      pageSize,
      // incomeInvOrderSn,
      // onlyDebtOrder,
    },
    } = this.props;
    const columns = [
      {
        title: '跟进状态',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => {
          return (
            record.tag.length > 0 ? record.tag.map((item) => {
              return (
                <Tooltip title={(<span>{item.remark}</span>)}>
                  <span key={item} style={{ background: item.color, color: '#fff', borderRadius: '5px', paddingLeft: '8px', paddingRight: '8px', marginRight: '5px' }}>{item.name}</span>
                  <span>{ status }</span>
                </Tooltip>
              );
            }) : <span style={{ color: 'red' }}>{ status }</span>
          );
        },
      },
      {
        title: '来票单号',
        dataIndex: 'incomeInvOrderSn',
        key: 'incomeInvOrderSn',
        render: (incomeInvOrderSn, record) => {
          return (
            pageChange === '3' ? (<Link to={`/finance/finance-invoice/finance-purchase-in-inv-list/finance-purchase-in-inv-detail/${record.id}`}>{incomeInvOrderSn}</Link>)
              : pageChange === '2' ? <Link to={`/purchase/invoice-management/invoice-management/purchase-in-inv-follow-list-n/purchase-in-inv-follow-detail-n/${record.id}`}>{incomeInvOrderSn}</Link> : (<Link to={`/purchase/invoice-management/purchase-in-inv-follow-list/purchase-in-inv-follow-detail/${record.id}`}>{incomeInvOrderSn}</Link>)
          );
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        render: (supplierName, record) => {
          return (
            pageChange === '3' ? (<Link to={`/finance/finance-invoice/finance-purchase-in-inv-list/finance-purchase-in-inv-detail/${record.id}`}>{supplierName}</Link>)
              : pageChange === '2' ? <Link to={`/purchase/invoice-management/invoice-management/purchase-in-inv-follow-list-n/purchase-in-inv-follow-detail-n/${record.id}`}>{supplierName}</Link> : (<Link to={`/purchase/invoice-management/purchase-in-inv-follow-list/purchase-in-inv-follow-detail/${record.id}`}>{supplierName}</Link>)
          );
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '创建时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '应开票总额',
        dataIndex: 'shouldInvAmount',
        key: 'shouldInvAmount',
      }, {
        title: '实际开票总额',
        dataIndex: 'realInvAmount',
        key: 'realInvAmount',
      }, {
        title: '未开金额',
        dataIndex: 'debtAmount',
        key: 'debtAmount',
        render: (debtAmount) => {
          return (
            <span style={{ color: 'red' }}>{ debtAmount }</span>
          );
        },
      }, {
        title: '物流单号',
        dataIndex: 'shippingNo',
        key: 'shippingNo',
        render: (shippingNo, record) => (
          <Input
            defaultValue={shippingNo}
            onBlur={this.handleInputNum.bind(this, record.id)}
          />
        ),
      },
      {
        title: '采购员',
        dataIndex: 'purchaserName',
        key: 'purchaserName',
      }, {
        title: '是否对应明细',
        dataIndex: 'isSuitDetail',
        key: 'isSuitDetail',
        render: (isSuitDetail) => {
          return (
            <p>{isSuitDetail === 1 ? '是' : '否' } </p>
          );
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
        render: (remark, record) => {
          return (
            remark !== '' ? [
              (
                <Tooltip title={(<span>{remark}</span>)}>
                  <p onClick={this.remarkModal.bind(this, record.id, remark)} className={styles.remark}>{remark} </p>
                </Tooltip>
              ),
            ]
              : <p style={{ width: 150, height: 40 }} onClick={this.remarkModal.bind(this, record.id, remark)} className={styles.remark}>{remark} </p>
          );
        },
      },
      {
        title: '采购备注',
        dataIndex: 'financeRemark',
        key: 'financeRemark',
        width: 150,
        render: (financeRemark, record) => {
          return (
            financeRemark !== '' ? [
              (
                <Tooltip title={(<span>{financeRemark}</span>)}>
                  <p onClick={this.remarkModal.bind(this, record.id, financeRemark)} className={styles.remark}>{financeRemark} </p>
                </Tooltip>
              ),
            ]
              : <p style={{ width: 150, height: 40 }} onClick={this.remarkModal.bind(this, record.id, financeRemark)} className={styles.remark}>{financeRemark} </p>
          );
        },
      },
    ];
    const expandTable = (list) => {
      const { detail } = list;
      const goodsColumns = [
        {
          title: '采购单号',
          dataIndex: 'purchaseOrderSn',
          key: 'purchaseOrderSn',
          render: (purchaseOrderSn, record) => {
            return (
              record.isSalePurchase === 0 ?
                <Link to={`/purchase/invoice-management/common-purchase-list/common-purchase-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
                : <Link to={`/purchase/invoice-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
            );
          },
        },
        {
          title: '采购时间',
          dataIndex: 'purchaseDate',
          key: 'purchaseDate',
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          render: (goodsName, record) => {
            return (
              [record.tag && record.tag.map((item) => {
                return <span key={item} className={globalStyles.tag} style={{background:item.color}}>{item.name}</span>;
              }),
                <span>{ goodsName }</span>,
              ]
            );
          },
        }, {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
        }, {
          title: '采购价',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
        },
        {
          title: '采购数量',
          dataIndex: 'invNum',
          key: 'invNum',
        }, {
          title: '采购合计',
          dataIndex: 'invAmount',
          key: 'invAmount',
          render: (purchaseTotal, record) => {
            return (
              <span style={{ color: 'red' }}>{purchaseTotal} </span>
            );
          },
        }, {
          title: '贷款申请单号',
          dataIndex: 'outcomeApplyId',
          key: 'outcomeApplyId',
        },
        {
          title: '付款日期',
          dataIndex: 'payTime',
          key: 'payTime',
        },
      ];
      return (
        <Table
          columns={goodsColumns}
          rowKey={record => record.id}
          dataSource={detail}
          bordered
          pagination={false}
        />
      );
    };
    const inInvFollowColumn = columns.filter(item => item.dataIndex !== 'isSuitDetail' && item.dataIndex !== 'financeRemark' && item.dataIndex !== 'updateTime');
    const financeInvColumn = columns.filter(item => item.dataIndex !== 'shippingNo' && item.dataIndex !== 'remark' && item.dataIndex !== 'createTime');
    const notOutInvColumn = columns.filter(
      item => item.dataIndex !== 'shippingNo' && item.dataIndex !== 'isSuitDetail' && item.dataIndex !== 'status' && item.dataIndex !== 'financeRemark' && item.dataIndex !== 'updateTime'
    );


    return (
      <PageHeaderLayout title={pageChange === '1' ? '来票跟进表' : pageChange === '2' ? '采购未开票金额列表' : '采购来票单'}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row>
                { pageChange !== '2' ? (
                  // <Col span={4}>
                    <Select
                      placeholder={pageChange === '1' ? '跟进状态' : '单据状态'}
                      style={{width:200,marginRight:10}}
                      onChange={this.handleChangeSiftItem.bind(this, 'status')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                    >
                      { pageChange === '1' ? (Object.keys(incomeInvOrderStatusMap).map((key) => {
                     return <Option key={key} value={key}>{incomeInvOrderStatusMap[key]}</Option>;
                   }))
                  : Object.keys(incomeInvOrderStatusMap).filter(item => item === '4' || item === '6').map((key) => {
                    return <Option key={key} value={key}>{incomeInvOrderStatusMap[key]}</Option>;
                  })
                  }
                    </Select>
                  // </Col>
            ) : null
          }
                {/* <Col span={4}> */}
                  <AutoComplete
                    dataSource={suppliers && suppliers.map((item) => {
                        return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
                      })}
                    onSelect={this.handleSelectSupplier.bind(this)}
                    onSearch={this.handleChangeSupplier.bind(this)}
                    style={{width:250,marginRight:10}}
                    allowClear
                  >
                    <Search
                      placeholder="请输入供应商"
                      // value={supplierSearchText}
                    />
                  </AutoComplete>
                {/* </Col> */}
                {/* <Col span={4}> */}
                  <Input.Search
                    style={{width:250,marginRight:10}}
                    placeholder={pageChange === '2' ? '请输入来票单号' : '请输入来票单号/采购单号'}
                    onSearch={this.handleGetOrderList.bind(this)}
                    onChange={this.handleChangeSiftItem.bind(this, 'orderSn')}
                    value={orderSn} 
                    suffix={orderSn?<ClearIcon 
                        handleClear={this.handleClear.bind(this,"orderSn")}
                    />:""} 
                  />
                {/* </Col> */}
                { pageChange === '2' ? null : (
                  // <Col span={4}>

                    <Input.Search
                    style={{width:250,marginRight:10}}
                      placeholder="请输入商品条码/商品名称"
                      onSearch={this.handleGetOrderList.bind(this)}
                      onChange={this.handleChangeSiftItem.bind(this, 'goodsKeywords')}
                      value={goodsKeywords} 
                      suffix={goodsKeywords?<ClearIcon 
                          handleClear={this.handleClear.bind(this,"goodsKeywords")}
                      />:""}  
                    />

                  // </Col>
              )
            }
                {/* <Col span={4}> */}
                  <Select
                    placeholder="请选择采购员"
                    style={{width:200,marginRight:10}}
                    onChange={this.handleChangeSiftItem.bind(this, 'purchaserId')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    {Object.keys(purchaserMap).map((id) => {
                        return <Option key={id} value={id}>{purchaserMap[id]}</Option>;
                      })}
                  </Select>
                {/* </Col> */}
                {totalActionList.map((actionInfo) => {
                  switch (+actionInfo.type) {
                    case 2:
                      return (
                        <Col span={2} style={{ float: 'right' }}>
                          <a
                            href={actionInfo.url}
                            target="_blank"
                            key={actionInfo.name}
                          >
                            <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                          </a>
                        </Col>
                      );
                    default:
                      return '';
                  }
                }
                    )}

              </Row>
              <Row style={{marginTop:10}}>
                { pageChange !== '1' ? (
                  <Col span={6}>
                    <span>创建时间：</span>
                    <DatePicker.RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'createInvDate')}
                    />
                   </Col>
                  )
                : null}
                {pageChange === '3' ? (
                  <Col span={6}>
                是否对应明细：
                    <Select
                      placeholder="是否对应明细"
                      className={globalStyles['select-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'isSuitDetail')}
                      dropdownMatchSelectWidth={false}
                      allowClear
                    >
                      {Object.keys(InvSuitDetailMap).map((id) => {
                    return <Option key={id} value={id}>{InvSuitDetailMap[id]}</Option>;
                  })}
                    </Select>
                  </Col>
                ) : null}
              </Row>
              {pageChange === '1' ? (
                <Row>
                  <Col span={6}>
                    <span>创建时间：</span>
                    <DatePicker.RangePicker
                      className={globalStyles['rangePicker-sift']}
                      onChange={this.handleChangeSiftItem.bind(this, 'createInvDate')}
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
                </Row>
            ) : null}
              {pageChange === '2' ? (
                <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
              未开总金额：<span style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }} >{totalDebtAmount}</span>
                </Row>
          ) : null}
            </div>
            <Table
              bordered
              loading={isLoading}
              dataSource={incomeInvOrderList}
              expandedRowRender={pageChange === '1' ? expandTable : null}
              columns={pageChange === '1' ? inInvFollowColumn : pageChange === '2' ? notOutInvColumn : financeInvColumn}
              rowKey={record => record.id}
              className={globalStyles.tablestyle}
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
            />
            <Modal
              title="编辑备注"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Input value={this.state.oldVlue} onChange={this.setRemark} onBlur={this.getRemark.bind(this)} />
            </Modal>

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
